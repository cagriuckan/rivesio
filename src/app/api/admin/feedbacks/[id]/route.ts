import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import {
  addFeedbackReply,
  deleteFeedback,
  getFeedbackWithMeta,
  getOwnedProject,
  listFeedbackReplies,
  markFeedbackRead,
  setFeedbackPinned,
  updateFeedback,
} from "@/lib/admin-repo";
import { claimFeedbackIfUnassigned, getAccessibleProject, listProjectWatcherIds, reassignFeedback } from "@/lib/agent-repo";
import { listAttachments, parseSettings } from "@/lib/repo";
import { sendReplyNotification } from "@/lib/email";
import type { ConversationMessage } from "@/lib/email";
import { deleteAttachmentDir } from "@/lib/storage";
import { publish } from "@/lib/events";

const schema = z.object({
  status: z.enum(["new", "planned", "in_progress", "resolved", "wontfix"]).optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
  admin_note: z.string().max(5000).optional(),
  reply: z.string().trim().max(5000).optional(),
  is_favorite: z.boolean().optional(),
  pinned: z.boolean().optional(),
  assigned_to: z.string().max(200).nullable().optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  let fb = await getFeedbackWithMeta(user.id, id);
  if (!fb) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // First person (owner or agent) to open an unassigned ticket claims it.
  const claimed = await claimFeedbackIfUnassigned(user.id, id);
  if (claimed) {
    fb = (await getFeedbackWithMeta(user.id, id)) ?? fb;
    for (const watcherId of await listProjectWatcherIds(fb.project_id)) {
      publish({ type: "feedback.assigned", userId: watcherId, payload: { feedback_id: id, assigned_to: user.id } });
    }
  }

  const [attachments, replies] = await Promise.all([
    listAttachments(id),
    listFeedbackReplies(id),
  ]);
  // Opening a conversation marks it read (chat semantics).
  await markFeedbackRead(user.id, id);
  return NextResponse.json({ ...fb, attachments, replies });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  const fb = await getFeedbackWithMeta(user.id, id);
  if (!fb) return NextResponse.json({ error: "not_found" }, { status: 404 });
  // Agents can view/reply/triage but not delete — only the project owner can.
  if (!(await getOwnedProject(user.id, fb.project_id))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  await deleteAttachmentDir(id);
  await deleteFeedback(user.id, id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const fb = await getFeedbackWithMeta(user.id, id);
  if (!fb) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { reply, pinned, assigned_to, ...fields } = parsed.data;
  await updateFeedback(user.id, id, fields);
  if (pinned !== undefined) await setFeedbackPinned(user.id, id, pinned);
  if (fields.status !== undefined || fields.priority !== undefined) {
    publish({
      type: "feedback.updated",
      userId: user.id,
      payload: { feedback_id: id, status: fields.status ?? fb.status, priority: fields.priority ?? fb.priority },
    });
  }
  if (assigned_to !== undefined) {
    const ok = await reassignFeedback(user.id, id, assigned_to);
    if (!ok) return NextResponse.json({ error: "invalid_assignee" }, { status: 400 });
    for (const watcherId of await listProjectWatcherIds(fb.project_id)) {
      publish({ type: "feedback.assigned", userId: watcherId, payload: { feedback_id: id, assigned_to } });
    }
  }
  if (reply) {
    // Fetch existing replies BEFORE adding the new one, so history is accurate for the email.
    const existingReplies = await listFeedbackReplies(id);
    const created = await addFeedbackReply(id, reply);
    publish({
      type: "reply.created",
      userId: user.id,
      payload: {
        feedback_id: id,
        author: "admin",
        message: created.message.slice(0, 200),
        reply_id: created.id,
        created_at: created.created_at,
      },
    });
    // Notify the end user by email when the conversation feature is on for their site.
    if (fb.email) {
      const project = await getAccessibleProject(user.id, fb.project_id);
      if (project?.allow_conversation) {
        const history: ConversationMessage[] = existingReplies.map((r) => ({
          author: r.author as "admin" | "user",
          message: r.message,
          created_at: r.created_at,
        }));
        const settings = parseSettings(project);
        await sendReplyNotification(fb.email, fb.access_token, reply, history, {
          accent: settings.accentColor,
          name: project.name,
          logo: settings.logoUrl,
        });
      }
    }
  }
  return NextResponse.json({ ok: true });
}
