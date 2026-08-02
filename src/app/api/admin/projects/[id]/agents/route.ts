import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { getOwnedProject } from "@/lib/admin-repo";
import { inviteAgent, listAgentMemberships } from "@/lib/agent-repo";

const inviteSchema = z.object({
  email: z.string().email().max(200),
  categories: z.array(z.string().min(1).max(60)).max(30).nullable().optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  if (!(await getOwnedProject(user.id, id))) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const memberships = await listAgentMemberships(user.id, id);
  return NextResponse.json({ items: memberships });
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  if (!(await getOwnedProject(user.id, id))) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const membership = await inviteAgent(user.id, id, parsed.data.email, parsed.data.categories ?? null);
  if (!membership) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ item: membership.membership, email: membership.email });
}
