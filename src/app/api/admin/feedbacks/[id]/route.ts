import { NextResponse } from "next/server";
import { z } from "zod";
import { updateFeedback, getFeedbackWithMeta, deleteFeedback } from "@/lib/admin-repo";
import { listAttachments } from "@/lib/repo";
import { deleteAttachmentDir } from "@/lib/storage";

const schema = z.object({
  status: z.enum(["new", "planned", "in_progress", "resolved", "wontfix"]).optional(),
  priority: z.enum(["low", "normal", "high"]).optional(),
  admin_note: z.string().max(5000).optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const fb = await getFeedbackWithMeta(id);
  if (!fb) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const attachments = await listAttachments(id);
  return NextResponse.json({ ...fb, attachments });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!(await getFeedbackWithMeta(id))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await deleteAttachmentDir(id);
  await deleteFeedback(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await updateFeedback(id, parsed.data);
  return NextResponse.json({ ok: true });
}
