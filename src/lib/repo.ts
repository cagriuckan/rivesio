import { and, count, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  attachments,
  feedbackReplies,
  feedbacks,
  projects,
  sites,
  user,
} from "@/db/schema";
import {
  toAttachmentRow,
  toFeedbackRow,
  toProjectRow,
  toReplyRow,
  toSiteRow,
} from "@/db/map";
import { generateConversationToken, generateId } from "./ids";
import {
  DEFAULT_WIDGET_TEXT,
  type AttachmentRow,
  type CustomFieldValue,
  type FeedbackReplyRow,
  type FeedbackRow,
  type ProjectRow,
  type ProjectSettings,
  type ReplyAuthor,
  type SiteRow,
  type SiteStatus,
} from "./types";

export const DEFAULT_PROJECT_CATEGORIES = ["Öneri", "Hata", "Tasarım", "Diğer"];

const FALLBACK_SETTINGS: ProjectSettings = {
  accentColor: "#0B1437",
  position: "bottom-right",
  fabStyle: "label",
  theme: "auto",
  categories: DEFAULT_PROJECT_CATEGORIES,
  text: DEFAULT_WIDGET_TEXT,
  fields: [],
};

export function parseSettings(project: ProjectRow): ProjectSettings {
  try {
    const stored = JSON.parse(project.settings_json) as Partial<ProjectSettings>;
    return {
      ...FALLBACK_SETTINGS,
      ...stored,
      // Deep-merge text so partially-customized projects keep defaults per key.
      text: {
        tr: { ...DEFAULT_WIDGET_TEXT.tr, ...stored.text?.tr },
        en: { ...DEFAULT_WIDGET_TEXT.en, ...stored.text?.en },
      },
      fields: stored.fields ?? [],
    };
  } catch {
    return FALLBACK_SETTINGS;
  }
}

// ── Projects ─────────────────────────────────────────────────────────

export async function getProjectByWidgetKey(widgetKey: string): Promise<ProjectRow | undefined> {
  const [r] = await db.select().from(projects).where(eq(projects.widgetKey, widgetKey)).limit(1);
  return r ? toProjectRow(r) : undefined;
}

export async function getProjectById(id: string): Promise<ProjectRow | undefined> {
  const [r] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return r ? toProjectRow(r) : undefined;
}

export async function listProjects(): Promise<ProjectRow[]> {
  const rows = await db.select().from(projects).orderBy(desc(projects.createdAt));
  return rows.map(toProjectRow);
}

export interface ProjectOwner {
  id: string;
  name: string;
  email: string;
  notification_prefs: import("./types").NotificationPrefs | null;
}

/** Resolves the account that owns a project (used for notification fan-out). */
export async function getProjectOwner(projectId: string): Promise<ProjectOwner | undefined> {
  const [r] = await db
    .select({ id: user.id, name: user.name, email: user.email, prefs: user.notificationPrefs })
    .from(projects)
    .innerJoin(user, eq(user.id, projects.userId))
    .where(eq(projects.id, projectId))
    .limit(1);
  return r ? { id: r.id, name: r.name, email: r.email, notification_prefs: r.prefs ?? null } : undefined;
}

// ── Sites ────────────────────────────────────────────────────────────

/** Normalize a domain to host only (no scheme, no path, no www). */
export function normalizeDomain(input: string): string {
  let value = input.trim().toLowerCase();
  try {
    if (!/^https?:\/\//.test(value)) value = "http://" + value;
    const url = new URL(value);
    return url.host.replace(/^www\./, "");
  } catch {
    return input.trim().toLowerCase().replace(/^www\./, "");
  }
}

export async function findSite(projectId: string, domain: string): Promise<SiteRow | undefined> {
  const [r] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.projectId, projectId), eq(sites.domain, domain)))
    .limit(1);
  return r ? toSiteRow(r) : undefined;
}

export async function getSiteById(id: string): Promise<SiteRow | undefined> {
  const [r] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
  return r ? toSiteRow(r) : undefined;
}

export async function countSitesForProject(projectId: string): Promise<number> {
  const [r] = await db.select({ c: count() }).from(sites).where(eq(sites.projectId, projectId));
  return r?.c ?? 0;
}

export async function upsertSite(args: {
  projectId: string;
  domain: string;
  meta: Record<string, unknown>;
  defaultStatus: SiteStatus;
}): Promise<SiteRow> {
  const now = Date.now();
  const existing = await findSite(args.projectId, args.domain);

  if (existing) {
    // Preserve admin decision (approved/blocked); only refresh metadata + last seen.
    await db
      .update(sites)
      .set({ meta: args.meta, lastSeen: now })
      .where(eq(sites.id, existing.id));
    return (await findSite(args.projectId, args.domain))!;
  }

  await db.insert(sites).values({
    id: generateId(),
    projectId: args.projectId,
    domain: args.domain,
    status: args.defaultStatus,
    source: "auto",
    meta: args.meta,
    supportStartsAt: now,
    firstSeen: now,
    lastSeen: now,
    createdAt: now,
  });
  return (await findSite(args.projectId, args.domain))!;
}

// ── Feedbacks (conversations) ────────────────────────────────────────

export async function createFeedback(args: {
  projectId: string;
  siteId: string;
  category: string;
  message: string;
  pageUrl: string | null;
  userAgent: string | null;
  viewport: string | null;
  wpUser: string | null;
  email: string | null;
  visitorHash: string | null;
  customFields?: CustomFieldValue[];
}): Promise<{ id: string; token: string }> {
  const id = generateId();
  const token = generateConversationToken();
  const now = Date.now();
  await db.insert(feedbacks).values({
    id,
    projectId: args.projectId,
    siteId: args.siteId,
    category: args.category,
    message: args.message,
    pageUrl: args.pageUrl,
    userAgent: args.userAgent,
    viewport: args.viewport,
    wpUser: args.wpUser,
    email: args.email,
    accessToken: token,
    visitorHash: args.visitorHash,
    status: "new",
    priority: "normal",
    customFields: args.customFields?.length ? args.customFields : null,
    createdAt: now,
    updatedAt: now,
    lastActivityAt: now,
  });
  return { id, token };
}

export async function getFeedback(id: string): Promise<FeedbackRow | undefined> {
  const [r] = await db.select().from(feedbacks).where(eq(feedbacks.id, id)).limit(1);
  return r ? toFeedbackRow(r) : undefined;
}

export async function getFeedbackByToken(token: string): Promise<FeedbackRow | undefined> {
  const [r] = await db.select().from(feedbacks).where(eq(feedbacks.accessToken, token)).limit(1);
  return r ? toFeedbackRow(r) : undefined;
}

export interface ConversationSummary {
  token: string;
  category: string;
  created_at: number;
  last_activity_at: number;
  last_message: string;
  last_admin_reply_at: number | null;
}

/** All conversations tied to an email across a project (for widget OTP history). */
export async function listConversationsByEmail(
  projectId: string,
  email: string,
): Promise<ConversationSummary[]> {
  const rows = await db
    .select({
      feedback: feedbacks,
      lastMessage: sql<string | null>`(select r.message from ${feedbackReplies} r where r.feedback_id = ${feedbacks}.id order by r.created_at desc limit 1)`,
      lastAdminReplyAt: sql<number | null>`(select max(r.created_at) from ${feedbackReplies} r where r.feedback_id = ${feedbacks}.id and r.author = 'admin')`,
    })
    .from(feedbacks)
    .where(and(eq(feedbacks.projectId, projectId), eq(feedbacks.email, email)))
    .orderBy(desc(feedbacks.lastActivityAt))
    .limit(100);
  return rows.map((r) => ({
    token: r.feedback.accessToken,
    category: r.feedback.category,
    created_at: r.feedback.createdAt,
    last_activity_at: r.feedback.lastActivityAt,
    last_message: r.lastMessage ?? r.feedback.message,
    last_admin_reply_at: r.lastAdminReplyAt !== null ? Number(r.lastAdminReplyAt) : null,
  }));
}

/** Activity summary for a set of access tokens (widget unread check on load). */
export async function getConversationStatuses(
  projectId: string,
  tokens: string[],
): Promise<Record<string, { last_activity_at: number; last_admin_reply_at: number | null }>> {
  if (!tokens.length) return {};
  const rows = await db
    .select({
      token: feedbacks.accessToken,
      lastActivityAt: feedbacks.lastActivityAt,
      lastAdminReplyAt: sql<number | null>`(select max(r.created_at) from ${feedbackReplies} r where r.feedback_id = ${feedbacks}.id and r.author = 'admin')`,
    })
    .from(feedbacks)
    .where(and(eq(feedbacks.projectId, projectId), inArray(feedbacks.accessToken, tokens)));
  const out: Record<string, { last_activity_at: number; last_admin_reply_at: number | null }> = {};
  for (const r of rows) {
    out[r.token] = {
      last_activity_at: r.lastActivityAt,
      last_admin_reply_at: r.lastAdminReplyAt !== null ? Number(r.lastAdminReplyAt) : null,
    };
  }
  return out;
}

export async function countSiteSubmissionsSince(siteId: string, sinceTs: number): Promise<number> {
  const [r] = await db
    .select({ c: count() })
    .from(feedbacks)
    .where(and(eq(feedbacks.siteId, siteId), gte(feedbacks.createdAt, sinceTs)));
  return r?.c ?? 0;
}

export async function countVisitorSubmissionsSince(
  siteId: string,
  visitorHash: string,
  sinceTs: number,
): Promise<number> {
  const [r] = await db
    .select({ c: count() })
    .from(feedbacks)
    .where(
      and(
        eq(feedbacks.siteId, siteId),
        eq(feedbacks.visitorHash, visitorHash),
        gte(feedbacks.createdAt, sinceTs),
      ),
    );
  return r?.c ?? 0;
}

// ── Replies (shared by widget + admin) ───────────────────────────────

export async function listReplies(feedbackId: string): Promise<FeedbackReplyRow[]> {
  const rows = await db
    .select()
    .from(feedbackReplies)
    .where(eq(feedbackReplies.feedbackId, feedbackId))
    .orderBy(feedbackReplies.createdAt);
  return rows.map(toReplyRow);
}

export async function addReply(args: {
  feedbackId: string;
  author: ReplyAuthor;
  message: string;
  pageUrl?: string | null;
  userAgent?: string | null;
}): Promise<FeedbackReplyRow> {
  const id = generateId();
  const now = Date.now();
  await db.insert(feedbackReplies).values({
    id,
    feedbackId: args.feedbackId,
    author: args.author,
    message: args.message,
    pageUrl: args.pageUrl ?? null,
    userAgent: args.userAgent ?? null,
    createdAt: now,
  });
  await db
    .update(feedbacks)
    .set({ lastActivityAt: now, updatedAt: now })
    .where(eq(feedbacks.id, args.feedbackId));
  const [r] = await db.select().from(feedbackReplies).where(eq(feedbackReplies.id, id)).limit(1);
  return toReplyRow(r!);
}

// ── Attachments ──────────────────────────────────────────────────────

export async function countAttachments(feedbackId: string): Promise<number> {
  const [r] = await db
    .select({ c: count() })
    .from(attachments)
    .where(eq(attachments.feedbackId, feedbackId));
  return r?.c ?? 0;
}

export async function addAttachment(args: {
  feedbackId: string;
  replyId?: string | null;
  kind: "screenshot" | "upload";
  filePath: string;
  mime: string;
  size: number;
}): Promise<AttachmentRow> {
  const id = generateId();
  await db.insert(attachments).values({
    id,
    feedbackId: args.feedbackId,
    replyId: args.replyId ?? null,
    kind: args.kind,
    filePath: args.filePath,
    mime: args.mime,
    size: args.size,
    createdAt: Date.now(),
  });
  const [r] = await db.select().from(attachments).where(eq(attachments.id, id)).limit(1);
  return toAttachmentRow(r!);
}

export async function listAttachments(feedbackId: string): Promise<AttachmentRow[]> {
  const rows = await db
    .select()
    .from(attachments)
    .where(eq(attachments.feedbackId, feedbackId))
    .orderBy(attachments.createdAt);
  return rows.map(toAttachmentRow);
}
