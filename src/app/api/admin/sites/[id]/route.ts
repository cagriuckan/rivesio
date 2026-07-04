import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { deleteSite, listFeedbackIdsForSite, updateSite } from "@/lib/admin-repo";
import { deleteAttachmentDir } from "@/lib/storage";

const nullableCount = z.number().int().min(0).max(1_000_000).nullable();

const schema = z.object({
  status: z.enum(["pending", "approved", "blocked"]).optional(),
  is_favorite: z.boolean().optional(),
  label: z.string().trim().max(255).nullable().optional(),
  // Per-site overrides. null == inherit the widget default.
  support_starts_at: z.number().int().min(0).nullable().optional(),
  daily_limit_site: nullableCount.optional(),
  daily_limit_visitor: nullableCount.optional(),
  support_days: nullableCount.optional(),
  allow_conversation: z.boolean().nullable().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await updateSite(user.id, id, parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  const feedbackIds = await listFeedbackIdsForSite(user.id, id);
  await Promise.all(feedbackIds.map((f) => deleteAttachmentDir(f.id)));
  await deleteSite(user.id, id);
  return NextResponse.json({ ok: true });
}
