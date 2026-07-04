import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { getOwnedProject } from "@/lib/admin-repo";
import { deleteAgentMembership, resendAgentInvite, revokeAgentMembership, updateAgentCategories } from "@/lib/agent-repo";

const patchSchema = z.object({
  categories: z.array(z.string().min(1).max(60)).max(30).nullable().optional(),
  revoke: z.boolean().optional(),
  resend: z.boolean().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string; membershipId: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id, membershipId } = await ctx.params;
  if (!(await getOwnedProject(user.id, id))) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  const { categories, revoke, resend } = parsed.data;

  if (revoke) {
    const ok = await revokeAgentMembership(user.id, id, membershipId);
    if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (resend) {
    const ok = await resendAgentInvite(user.id, id, membershipId);
    if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (categories !== undefined) {
    const ok = await updateAgentCategories(user.id, id, membershipId, categories);
    if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string; membershipId: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id, membershipId } = await ctx.params;
  if (!(await getOwnedProject(user.id, id))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const ok = await deleteAgentMembership(user.id, id, membershipId);
  if (!ok) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
