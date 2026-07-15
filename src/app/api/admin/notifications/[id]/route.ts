import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { markNotificationRead } from "@/lib/notify";

export async function PATCH(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { id } = await ctx.params;
  await markNotificationRead(user.id, id);
  return NextResponse.json({ ok: true });
}
