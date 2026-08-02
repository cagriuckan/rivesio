import webpush from "web-push";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db/client";
import { notifications, pushSubscriptions, user } from "@/db/schema";
import { toNotificationRow } from "@/db/map";
import { generateId } from "./ids";
import { env, pushEnabled } from "./env";
import { publish } from "./events";
import { sendNotificationEmail } from "./email";
import {
  DEFAULT_NOTIFICATION_PREFS,
  type NotificationPrefs,
  type NotificationRow,
  type NotificationType,
} from "./types";

if (pushEnabled) {
  webpush.setVapidDetails(env.vapid.subject, env.vapid.publicKey, env.vapid.privateKey);
}

const PREF_KEY: Record<NotificationType, keyof NotificationPrefs> = {
  feedback_new: "feedbackNew",
  reply_user: "replyUser",
  status_change: "statusChange",
  agent_invite: "agentInvite",
  assignment: "assignment",
};

export interface NotifyInput {
  type: NotificationType;
  title: string;
  body: string;
  /** Panel-relative link (locale-less), e.g. /feedbacks?f=123 */
  link?: string;
  /** Related widget branding, applied to the notification email. */
  accentColor?: string;
  brandName?: string;
  logoUrl?: string;
  /** Override preference channels for this send (e.g. skip email when a dedicated template already went out). */
  channels?: Partial<import("./types").NotificationChannelPrefs>;
}

/**
 * Fans a notification out to a user across the channels enabled in their
 * preferences: in-app row (+ SSE), web push, and email. Errors are logged,
 * never thrown — call it fire-and-forget from route handlers.
 */
export async function notify(userId: string, input: NotifyInput): Promise<void> {
  try {
    const [u] = await db
      .select({ email: user.email, prefs: user.notificationPrefs })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);
    if (!u) return;

    const prefs = { ...DEFAULT_NOTIFICATION_PREFS, ...(u.prefs ?? {}) };
    const channels = { ...prefs[PREF_KEY[input.type]], ...input.channels };

    if (channels.inApp) {
      const row = {
        id: generateId(),
        userId,
        type: input.type,
        title: input.title,
        body: input.body,
        link: input.link ?? null,
        iconUrl: input.logoUrl ?? null,
        readAt: null,
        createdAt: Date.now(),
      };
      await db.insert(notifications).values(row);
      publish({
        type: "notification.created",
        userId,
        payload: toNotificationRow({ ...row }) as unknown as Record<string, unknown>,
      });
    }

    const tasks: Promise<unknown>[] = [];
    if (channels.push && pushEnabled) tasks.push(sendPush(userId, input));
    if (channels.email && u.email) {
      tasks.push(
        sendNotificationEmail(u.email, input.title, input.body, input.link ?? null, {
          accent: input.accentColor,
          name: input.brandName,
          logo: input.logoUrl,
        }).catch((err) => console.error("[notify] email failed", err)),
      );
    }
    await Promise.allSettled(tasks);
  } catch (err) {
    console.error("[notify] fan-out failed", err);
  }
}

async function sendPush(userId: string, input: NotifyInput): Promise<void> {
  const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
  const payload = JSON.stringify({ title: input.title, body: input.body, link: input.link ?? "/" });
  await Promise.allSettled(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
      } catch (err) {
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          // Subscription expired or unsubscribed — clean it up.
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        } else {
          console.error("[notify] push failed", err);
        }
      }
    }),
  );
}

// --- Notification center queries ---

export async function listNotifications(
  userId: string,
  limit = 30,
): Promise<{ items: NotificationRow[]; unread: number }> {
  const [rows, [unread]] = await Promise.all([
    db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit),
    db
      .select({ c: count() })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), isNull(notifications.readAt))),
  ]);
  return { items: rows.map(toNotificationRow), unread: unread?.c ?? 0 };
}

export async function markNotificationRead(userId: string, id: string): Promise<void> {
  await db
    .update(notifications)
    .set({ readAt: Date.now() })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  await db
    .update(notifications)
    .set({ readAt: Date.now() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));
}
