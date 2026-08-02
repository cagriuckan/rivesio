import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import {
  acceptPendingInvite,
  listPendingInvitesForUser,
  rejectPendingInvite,
} from "@/lib/agent-repo";

export async function GET() {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const items = await listPendingInvitesForUser({ id: user.id, email: user.email });
  return NextResponse.json({ ok: true, items });
}

const actionSchema = z.object({
  membership_id: z.string().min(1).max(200),
  action: z.enum(["accept", "reject"]),
});

export async function POST(req: Request) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const body = await req.json().catch(() => null);
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  if (parsed.data.action === "accept") {
    const result = await acceptPendingInvite({ id: user.id, email: user.email }, parsed.data.membership_id);
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
    return NextResponse.json({ ok: true, project_id: result.projectId });
  }

  const ok = await rejectPendingInvite({ id: user.id, email: user.email }, parsed.data.membership_id);
  if (!ok) return NextResponse.json({ error: "invalid" }, { status: 400 });
  return NextResponse.json({ ok: true });
}
