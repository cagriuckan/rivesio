import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { acceptAgentInvite, rejectAgentInviteByToken } from "@/lib/agent-repo";

const schema = z.object({ token: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const result = await acceptAgentInvite({ id: user.id, email: user.email }, parsed.data.token);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true, project_id: result.projectId });
}

export async function DELETE(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const ok = await rejectAgentInviteByToken({ id: user.id, email: user.email }, parsed.data.token);
  if (!ok) return NextResponse.json({ error: "invalid" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
