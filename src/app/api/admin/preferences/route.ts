import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { requireAdminSession } from "@/lib/auth";
import { db } from "@/db/client";
import { user } from "@/db/schema";
import { DEFAULT_NOTIFICATION_PREFS } from "@/lib/types";

const channelSchema = z.object({ inApp: z.boolean(), email: z.boolean(), push: z.boolean() });
const prefsSchema = z.object({
  feedbackNew: channelSchema,
  replyUser: channelSchema,
  statusChange: channelSchema,
});

export async function GET() {
  const session = await requireAdminSession();
  if (session instanceof NextResponse) return session;
  const [u] = await db
    .select({ prefs: user.notificationPrefs })
    .from(user)
    .where(eq(user.id, session.id))
    .limit(1);
  return NextResponse.json({
    ok: true,
    prefs: { ...DEFAULT_NOTIFICATION_PREFS, ...(u?.prefs ?? {}) },
    vapidPublicKey:
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() ||
      process.env.VAPID_PUBLIC_KEY?.trim() ||
      "",
  });
}

export async function PATCH(req: Request) {
  const session = await requireAdminSession();
  if (session instanceof NextResponse) return session;
  const body = await req.json().catch(() => null);
  const parsed = prefsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  await db.update(user).set({ notificationPrefs: parsed.data }).where(eq(user.id, session.id));
  return NextResponse.json({ ok: true });
}
