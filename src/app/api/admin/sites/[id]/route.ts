import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteSite, listFeedbackIdsForSite, updateSite } from "@/lib/admin-repo";
import { deleteAttachmentDir } from "@/lib/storage";

const schema = z.object({
  status: z.enum(["pending", "approved", "blocked"]).optional(),
  is_favorite: z.boolean().optional(),
  label: z.string().trim().max(255).nullable().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await updateSite(id, parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const feedbackIds = await listFeedbackIdsForSite(id);
  await Promise.all(feedbackIds.map((f) => deleteAttachmentDir(f.id)));
  await deleteSite(id);
  return NextResponse.json({ ok: true });
}
