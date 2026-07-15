import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { listNotifications, markAllNotificationsRead } from "@/lib/notify";

export async function GET() {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  const { items, unread } = await listNotifications(user.id);
  return NextResponse.json({ ok: true, items, unread });
}

/** Marks every unread notification as read. */
export async function PATCH() {
  const user = await requireAdminSession();
  if (user instanceof NextResponse) return user;
  await markAllNotificationsRead(user.id);
  return NextResponse.json({ ok: true });
}
