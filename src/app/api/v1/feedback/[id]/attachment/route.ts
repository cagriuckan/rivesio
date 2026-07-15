import { corsJson, corsPreflight } from "@/lib/cors";
import { guardSubmission } from "@/lib/guard";
import { addAttachment, countAttachments, getFeedback, listReplies } from "@/lib/repo";
import { saveAttachment } from "@/lib/storage";
import { limits } from "@/lib/env";
import { generateId } from "@/lib/ids";
import { rateLimit, clientIp } from "@/lib/ratelimit";

export const runtime = "nodejs";

export function OPTIONS() {
  return corsPreflight();
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const ip = clientIp(req);
  if (!rateLimit(`attach:${ip}`, 60, 10 * 60_000)) {
    return corsJson({ error: "rate_limited" }, 429);
  }

  const form = await req.formData().catch(() => null);
  if (!form) return corsJson({ error: "invalid_input" }, 400);

  const widgetKey = String(form.get("widget_key") ?? "");
  const domain = String(form.get("domain") ?? "");
  const kind = form.get("kind") === "screenshot" ? "screenshot" : "upload";
  const file = form.get("file");

  // Authorize against the same registration/approval rules as feedback submission.
  const guard = await guardSubmission({ widgetKey, domain, meta: { ip } });
  if (!guard.ok) return corsJson({ error: guard.error }, 403);

  // The feedback must exist and belong to this guarded project.
  const feedback = await getFeedback(id);
  if (!feedback || feedback.project_id !== guard.project.id) {
    return corsJson({ error: "not_found" }, 404);
  }

  if ((await countAttachments(id)) >= limits.maxAttachments) {
    return corsJson({ error: "too_many_attachments" }, 400);
  }

  if (!(file instanceof File)) return corsJson({ error: "no_file" }, 400);
  if (!limits.allowedMimeTypes.includes(file.type)) {
    return corsJson({ error: "unsupported_type" }, 400);
  }
  if (file.size > limits.maxAttachmentBytes) {
    return corsJson({ error: "file_too_large" }, 400);
  }

  // If this attachment belongs to a picked-element note, link it to that reply so it
  // renders next to the note instead of always falling back to the origin message.
  const replyIdRaw = form.get("reply_id");
  let replyId: string | null = null;
  if (typeof replyIdRaw === "string" && replyIdRaw) {
    const replies = await listReplies(id);
    if (replies.some((r) => r.id === replyIdRaw)) replyId = replyIdRaw;
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const fileId = generateId();
  const relPath = await saveAttachment(id, fileId, file.type, buf);
  const row = await addAttachment({
    feedbackId: id,
    kind,
    filePath: relPath,
    mime: file.type,
    size: buf.length,
    replyId,
  });

  return corsJson({ ok: true, attachment_id: row.id });
}
