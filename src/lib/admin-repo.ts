import { and, count, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { attachments, feedbackReplies, feedbacks, projects, sites, user } from "@/db/schema";
import { toAttachmentRow, toFeedbackRow, toProjectRow, toSiteRow } from "@/db/map";
import { generateId, generateWidgetKey } from "./ids";
import { env } from "./env";
import { addReply, listReplies } from "./repo";
import { accessibleProjectIds } from "./agent-repo";
import type {
  AttachmentRow,
  FeedbackReplyRow,
  FeedbackRow,
  FeedbackStatus,
  Priority,
  ProjectRow,
  SiteRow,
  SiteStatus,
} from "./types";

// All admin queries are tenant-scoped: every function takes the session
// user's id and only touches rows reachable through projects.user_id.
const ownedProjectIds = (userId: string) =>
  db.select({ id: projects.id }).from(projects).where(eq(projects.userId, userId));

// --- Projects ---

export async function createProject(userId: string, args: {
  slug: string;
  name: string;
  settings: Record<string, unknown>;
}): Promise<ProjectRow> {
  const id = generateId();
  const now = Date.now();
  await db.insert(projects).values({
    id,
    userId,
    slug: args.slug,
    name: args.name,
    widgetKey: generateWidgetKey(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings: args.settings as any,
    autoApproveSites: env.autoApproveSites,
    allowConversation: true,
    createdAt: now,
    updatedAt: now,
  });
  const [r] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return toProjectRow(r!);
}

export async function projectSlugExists(slug: string): Promise<boolean> {
  const [r] = await db.select({ id: projects.id }).from(projects).where(eq(projects.slug, slug)).limit(1);
  return Boolean(r);
}

export async function listOwnedProjects(userId: string): Promise<ProjectRow[]> {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt));
  return rows.map(toProjectRow);
}

export async function getOwnedProject(userId: string, id: string): Promise<ProjectRow | undefined> {
  const [r] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .limit(1);
  return r ? toProjectRow(r) : undefined;
}

export interface ProjectOperationalFields {
  siteLimit?: number | null;
  autoApproveSites?: boolean;
  allowConversation?: boolean;
  defaultDailyLimitSite?: number | null;
  defaultDailyLimitVisitor?: number | null;
  defaultSupportDays?: number | null;
}

export async function updateProject(
  userId: string,
  id: string,
  fields: {
    name?: string;
    settings?: Record<string, unknown>;
  } & ProjectOperationalFields,
): Promise<void> {
  const set: Record<string, unknown> = { updatedAt: Date.now() };
  if (fields.name !== undefined) set.name = fields.name;
  if (fields.settings !== undefined) set.settings = fields.settings;
  if (fields.siteLimit !== undefined) set.siteLimit = fields.siteLimit;
  if (fields.autoApproveSites !== undefined) set.autoApproveSites = fields.autoApproveSites;
  if (fields.allowConversation !== undefined) set.allowConversation = fields.allowConversation;
  if (fields.defaultDailyLimitSite !== undefined) set.defaultDailyLimitSite = fields.defaultDailyLimitSite;
  if (fields.defaultDailyLimitVisitor !== undefined) set.defaultDailyLimitVisitor = fields.defaultDailyLimitVisitor;
  if (fields.defaultSupportDays !== undefined) set.defaultSupportDays = fields.defaultSupportDays;
  await db.update(projects).set(set).where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

export async function deleteProject(userId: string, id: string): Promise<void> {
  // FK cascades handle sites/feedbacks/attachments.
  await db.delete(projects).where(and(eq(projects.id, id), eq(projects.userId, userId)));
}

export async function rotateWidgetKey(userId: string, id: string): Promise<string> {
  const key = generateWidgetKey();
  await db
    .update(projects)
    .set({ widgetKey: key, updatedAt: Date.now() })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)));
  return key;
}

// --- Sites ---

export interface SiteWithCounts extends SiteRow {
  project_name: string;
  feedback_count: number;
  // Widget-global defaults, for rendering "inherits default" hints in the UI.
  project_default_daily_limit_site: number | null;
  project_default_daily_limit_visitor: number | null;
  project_default_support_days: number | null;
  project_allow_conversation: boolean;
}

export async function listSites(
  userId: string,
  filter?: { status?: SiteStatus; projectId?: string },
): Promise<SiteWithCounts[]> {
  const where = [eq(projects.userId, userId)];
  if (filter?.status) where.push(eq(sites.status, filter.status));
  if (filter?.projectId) where.push(eq(sites.projectId, filter.projectId));

  const rows = await db
    .select({
      site: sites,
      projectName: projects.name,
      feedbackCount: sql<number>`(select count(*) from ${feedbacks} where ${feedbacks.siteId} = ${sites.id})`,
      defaultDailyLimitSite: projects.defaultDailyLimitSite,
      defaultDailyLimitVisitor: projects.defaultDailyLimitVisitor,
      defaultSupportDays: projects.defaultSupportDays,
      allowConversation: projects.allowConversation,
    })
    .from(sites)
    .innerJoin(projects, eq(projects.id, sites.projectId))
    .where(and(...where))
    .orderBy(desc(sites.lastSeen));

  return rows.map((r) => ({
    ...toSiteRow(r.site),
    project_name: r.projectName,
    feedback_count: Number(r.feedbackCount),
    project_default_daily_limit_site: r.defaultDailyLimitSite,
    project_default_daily_limit_visitor: r.defaultDailyLimitVisitor,
    project_default_support_days: r.defaultSupportDays,
    project_allow_conversation: r.allowConversation,
  }));
}

export async function getSite(userId: string, id: string): Promise<SiteRow | undefined> {
  const [r] = await db
    .select({ site: sites })
    .from(sites)
    .innerJoin(projects, eq(projects.id, sites.projectId))
    .where(and(eq(sites.id, id), eq(projects.userId, userId)))
    .limit(1);
  return r ? toSiteRow(r.site) : undefined;
}

export async function createManualSite(args: {
  projectId: string;
  domain: string;
  status: SiteStatus;
}): Promise<SiteRow> {
  const id = generateId();
  const now = Date.now();
  await db.insert(sites).values({
    id,
    projectId: args.projectId,
    domain: args.domain,
    status: args.status,
    source: "manual",
    meta: {},
    supportStartsAt: now,
    firstSeen: now,
    lastSeen: now,
    createdAt: now,
  });
  const [r] = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
  return toSiteRow(r!);
}

export async function setSiteStatus(userId: string, id: string, status: SiteStatus): Promise<void> {
  await db
    .update(sites)
    .set({ status })
    .where(and(eq(sites.id, id), inArray(sites.projectId, ownedProjectIds(userId))));
}

export interface SiteOverrideFields {
  status?: SiteStatus;
  is_favorite?: boolean;
  label?: string | null;
  support_starts_at?: number | null;
  daily_limit_site?: number | null;
  daily_limit_visitor?: number | null;
  support_days?: number | null;
  allow_conversation?: boolean | null;
}

export async function updateSite(userId: string, id: string, fields: SiteOverrideFields): Promise<void> {
  const set: Record<string, unknown> = {};
  if (fields.status !== undefined) set.status = fields.status;
  if (fields.is_favorite !== undefined) set.isFavorite = fields.is_favorite;
  if (fields.label !== undefined) set.label = fields.label;
  if (fields.support_starts_at !== undefined) set.supportStartsAt = fields.support_starts_at;
  if (fields.daily_limit_site !== undefined) set.dailyLimitSite = fields.daily_limit_site;
  if (fields.daily_limit_visitor !== undefined) set.dailyLimitVisitor = fields.daily_limit_visitor;
  if (fields.support_days !== undefined) set.supportDays = fields.support_days;
  if (fields.allow_conversation !== undefined) set.allowConversation = fields.allow_conversation;
  if (!Object.keys(set).length) return;
  await db
    .update(sites)
    .set(set)
    .where(and(eq(sites.id, id), inArray(sites.projectId, ownedProjectIds(userId))));
}

export async function deleteSite(userId: string, id: string): Promise<void> {
  await db
    .delete(sites)
    .where(and(eq(sites.id, id), inArray(sites.projectId, ownedProjectIds(userId))));
}

export async function listFeedbackIdsForSite(userId: string, siteId: string): Promise<{ id: string }[]> {
  return db
    .select({ id: feedbacks.id })
    .from(feedbacks)
    .where(and(eq(feedbacks.siteId, siteId), inArray(feedbacks.projectId, ownedProjectIds(userId))));
}

// --- Feedbacks ---

export interface FeedbackWithMeta extends FeedbackRow {
  project_name: string;
  domain: string;
  attachment_count: number;
  first_attachment_id: string | null;
  reply_count: number;
  last_replier: "admin" | "user" | null;
  last_reply_at: number | null;
  has_new_user_reply: boolean;
  last_message: string;
  last_message_author: "admin" | "user";
  last_message_at: number;
  unread: boolean;
  assignee_name: string | null;
  assignee_email: string | null;
}

function feedbackMetaSelect() {
  return {
    feedback: feedbacks,
    projectName: projects.name,
    domain: sites.domain,
    attachmentCount: sql<number>`(select count(*) from ${attachments} where ${attachments.feedbackId} = ${feedbacks.id})`,
    firstAttachmentId: sql<string | null>`(select id from ${attachments} where ${attachments.feedbackId} = ${feedbacks.id} order by id limit 1)`,
    replyCount: sql<number>`(select count(*) from ${feedbackReplies} where ${feedbackReplies.feedbackId} = ${feedbacks.id})`,
    lastReplier: sql<string | null>`(select author from ${feedbackReplies} where ${feedbackReplies.feedbackId} = ${feedbacks.id} order by created_at desc limit 1)`,
    lastReplyAt: sql<number | null>`(select created_at from ${feedbackReplies} where ${feedbackReplies.feedbackId} = ${feedbacks.id} order by created_at desc limit 1)`,
    hasNewUserReply: sql<number>`(select count(*) from ${feedbackReplies} where ${feedbackReplies.feedbackId} = ${feedbacks.id} and author = 'user' and created_at > coalesce((select created_at from ${feedbackReplies} where ${feedbackReplies.feedbackId} = ${feedbacks.id} and author = 'admin' order by created_at desc limit 1), 0))`,
    lastMessage: sql<string | null>`(select message from ${feedbackReplies} where ${feedbackReplies.feedbackId} = ${feedbacks.id} order by created_at desc limit 1)`,
    // Newest user activity (initial message or latest user reply) — drives the unread flag.
    lastUserActivityAt: sql<number>`coalesce((select max(created_at) from ${feedbackReplies} where ${feedbackReplies.feedbackId} = ${feedbacks.id} and author = 'user'), ${feedbacks.createdAt})`,
    assigneeName: sql<string | null>`(select name from ${user} where id = ${feedbacks.assignedTo})`,
    assigneeEmail: sql<string | null>`(select email from ${user} where id = ${feedbacks.assignedTo})`,
  };
}

function toFeedbackWithMeta(r: {
  feedback: typeof feedbacks.$inferSelect;
  projectName: string;
  domain: string;
  attachmentCount: number;
  firstAttachmentId: string | null;
  replyCount: number;
  lastReplier: string | null;
  lastReplyAt: number | null;
  hasNewUserReply: number;
  lastMessage: string | null;
  lastUserActivityAt: number;
  assigneeName: string | null;
  assigneeEmail: string | null;
}): FeedbackWithMeta {
  const row = toFeedbackRow(r.feedback);
  return {
    ...row,
    project_name: r.projectName,
    domain: r.domain,
    attachment_count: Number(r.attachmentCount),
    first_attachment_id: r.firstAttachmentId,
    reply_count: Number(r.replyCount),
    last_replier: (r.lastReplier as "admin" | "user" | null) ?? null,
    last_reply_at: r.lastReplyAt ?? null,
    has_new_user_reply: Number(r.hasNewUserReply) > 0,
    last_message: r.lastMessage ?? row.message,
    last_message_author: (r.lastReplier as "admin" | "user" | null) ?? "user",
    last_message_at: r.lastReplyAt ?? row.created_at,
    unread: (row.last_admin_read_at ?? 0) < Number(r.lastUserActivityAt),
    assignee_name: r.assigneeName,
    assignee_email: r.assigneeEmail,
  };
}

export async function listFeedbacks(
  userId: string,
  filter: {
    projectId?: string;
    status?: FeedbackStatus;
    priority?: Priority;
    q?: string;
  },
): Promise<FeedbackWithMeta[]> {
  const where = [inArray(feedbacks.projectId, accessibleProjectIds(userId))];
  if (filter.projectId) where.push(eq(feedbacks.projectId, filter.projectId));
  if (filter.status) where.push(eq(feedbacks.status, filter.status));
  if (filter.priority) where.push(eq(feedbacks.priority, filter.priority));
  if (filter.q) {
    const like = `%${filter.q.replace(/[%_]/g, "\\$&")}%`;
    where.push(
      sql`(${feedbacks.message} ilike ${like} or ${feedbacks.email} ilike ${like} or ${sites.domain} ilike ${like})`,
    );
  }

  const rows = await db
    .select(feedbackMetaSelect())
    .from(feedbacks)
    .innerJoin(projects, eq(projects.id, feedbacks.projectId))
    .innerJoin(sites, eq(sites.id, feedbacks.siteId))
    .where(and(...where))
    .orderBy(desc(feedbacks.lastActivityAt))
    .limit(500);

  return rows.map(toFeedbackWithMeta);
}

export async function markFeedbackRead(userId: string, id: string): Promise<void> {
  await db
    .update(feedbacks)
    .set({ lastAdminReadAt: Date.now() })
    .where(and(eq(feedbacks.id, id), inArray(feedbacks.projectId, accessibleProjectIds(userId))));
}

export async function setFeedbackPinned(userId: string, id: string, pinned: boolean): Promise<void> {
  await db
    .update(feedbacks)
    .set({ pinnedAt: pinned ? Date.now() : null })
    .where(and(eq(feedbacks.id, id), inArray(feedbacks.projectId, accessibleProjectIds(userId))));
}

export async function getFeedbackWithMeta(userId: string, id: string): Promise<FeedbackWithMeta | undefined> {
  const [r] = await db
    .select(feedbackMetaSelect())
    .from(feedbacks)
    .innerJoin(projects, eq(projects.id, feedbacks.projectId))
    .innerJoin(sites, eq(sites.id, feedbacks.siteId))
    .where(and(eq(feedbacks.id, id), inArray(feedbacks.projectId, accessibleProjectIds(userId))))
    .limit(1);
  return r ? toFeedbackWithMeta(r) : undefined;
}

// Replies — shared primitives live in repo.ts; these keep the admin-facing names.
export function listFeedbackReplies(feedbackId: string): Promise<FeedbackReplyRow[]> {
  return listReplies(feedbackId);
}

export function addFeedbackReply(feedbackId: string, message: string): Promise<FeedbackReplyRow> {
  return addReply({ feedbackId, author: "admin", message });
}

export async function updateFeedback(
  userId: string,
  id: string,
  fields: { status?: FeedbackStatus; priority?: Priority; admin_note?: string; is_favorite?: boolean },
): Promise<void> {
  const set: Record<string, unknown> = {};
  if (fields.status !== undefined) set.status = fields.status;
  if (fields.priority !== undefined) set.priority = fields.priority;
  if (fields.admin_note !== undefined) set.adminNote = fields.admin_note;
  if (fields.is_favorite !== undefined) set.isFavorite = fields.is_favorite;
  if (!Object.keys(set).length) return;
  set.updatedAt = Date.now();
  await db
    .update(feedbacks)
    .set(set)
    .where(and(eq(feedbacks.id, id), inArray(feedbacks.projectId, accessibleProjectIds(userId))));
}

export async function bulkUpdateStatus(userId: string, ids: string[], status: FeedbackStatus): Promise<void> {
  if (!ids.length) return;
  await db
    .update(feedbacks)
    .set({ status, updatedAt: Date.now() })
    .where(and(inArray(feedbacks.id, ids), inArray(feedbacks.projectId, accessibleProjectIds(userId))));
}

// Agents can't delete tickets — owner-only.
export async function deleteFeedback(userId: string, id: string): Promise<void> {
  await db
    .delete(feedbacks)
    .where(and(eq(feedbacks.id, id), inArray(feedbacks.projectId, ownedProjectIds(userId))));
}

/** Tenant-scoped attachment lookup for the admin panel. */
export async function getOwnedAttachment(userId: string, id: string): Promise<AttachmentRow | undefined> {
  const [r] = await db
    .select({ attachment: attachments })
    .from(attachments)
    .innerJoin(feedbacks, eq(feedbacks.id, attachments.feedbackId))
    .innerJoin(projects, eq(projects.id, feedbacks.projectId))
    .where(and(eq(attachments.id, id), eq(projects.userId, userId)))
    .limit(1);
  return r ? toAttachmentRow(r.attachment) : undefined;
}

/** Unscoped lookup — only for the public token-authenticated conversation API. */
export async function getAttachmentById(id: string): Promise<AttachmentRow | undefined> {
  const [r] = await db.select().from(attachments).where(eq(attachments.id, id)).limit(1);
  return r ? toAttachmentRow(r) : undefined;
}

// --- Dashboard stats ---

export interface Stats {
  newFeedbacks: number;
  totalFeedbacks: number;
  resolvedFeedbacks: number;
  pendingSites: number;
  approvedSites: number;
  blockedSites: number;
  totalSites: number;
  projects: number;
}

async function countFeedbacks(
  userId: string,
  projectId: string | undefined,
  extra?: ReturnType<typeof eq>,
): Promise<number> {
  const where = [inArray(feedbacks.projectId, accessibleProjectIds(userId))];
  if (projectId) where.push(eq(feedbacks.projectId, projectId));
  if (extra) where.push(extra);
  const [r] = await db.select({ c: count() }).from(feedbacks).where(and(...where));
  return r?.c ?? 0;
}

async function countSites(
  userId: string,
  projectId: string | undefined,
  extra?: ReturnType<typeof eq>,
): Promise<number> {
  const where = [inArray(sites.projectId, ownedProjectIds(userId))];
  if (projectId) where.push(eq(sites.projectId, projectId));
  if (extra) where.push(extra);
  const [r] = await db.select({ c: count() }).from(sites).where(and(...where));
  return r?.c ?? 0;
}

export async function getStats(userId: string, projectId?: string): Promise<Stats> {
  const [
    totalFeedbacks,
    newFeedbacks,
    resolvedFeedbacks,
    pendingSites,
    approvedSites,
    blockedSites,
    totalSites,
    projectCount,
  ] = await Promise.all([
    countFeedbacks(userId, projectId),
    countFeedbacks(userId, projectId, eq(feedbacks.status, "new")),
    countFeedbacks(userId, projectId, eq(feedbacks.status, "resolved")),
    countSites(userId, projectId, eq(sites.status, "pending")),
    countSites(userId, projectId, eq(sites.status, "approved")),
    countSites(userId, projectId, eq(sites.status, "blocked")),
    countSites(userId, projectId),
    db
      .select({ c: count() })
      .from(projects)
      .where(eq(projects.userId, userId))
      .then((r) => r[0]?.c ?? 0),
  ]);

  return {
    totalFeedbacks,
    newFeedbacks,
    resolvedFeedbacks,
    pendingSites,
    approvedSites,
    blockedSites,
    totalSites,
    projects: projectCount,
  };
}

function scopedFeedbackWhere(userId: string, projectId?: string) {
  const where = [inArray(feedbacks.projectId, accessibleProjectIds(userId))];
  if (projectId) where.push(eq(feedbacks.projectId, projectId));
  return where;
}

export async function getStatusBreakdown(userId: string, projectId?: string): Promise<Record<FeedbackStatus, number>> {
  const rows = await db
    .select({ status: feedbacks.status, c: count() })
    .from(feedbacks)
    .where(and(...scopedFeedbackWhere(userId, projectId)))
    .groupBy(feedbacks.status);
  const out: Record<FeedbackStatus, number> = { new: 0, planned: 0, in_progress: 0, resolved: 0, wontfix: 0 };
  for (const r of rows) out[r.status] = r.c;
  return out;
}

export async function getPriorityBreakdown(userId: string, projectId?: string): Promise<Record<Priority, number>> {
  const rows = await db
    .select({ priority: feedbacks.priority, c: count() })
    .from(feedbacks)
    .where(and(...scopedFeedbackWhere(userId, projectId)))
    .groupBy(feedbacks.priority);
  const out: Record<Priority, number> = { low: 0, normal: 0, high: 0 };
  for (const r of rows) out[r.priority] = r.c;
  return out;
}

export async function getCategoryBreakdown(
  userId: string,
  projectId?: string,
  limit = 6,
): Promise<{ category: string; count: number }[]> {
  const rows = await db
    .select({ category: feedbacks.category, count: count() })
    .from(feedbacks)
    .where(and(...scopedFeedbackWhere(userId, projectId)))
    .groupBy(feedbacks.category)
    .orderBy(desc(count()))
    .limit(limit);
  return rows.map((r) => ({ category: r.category, count: Number(r.count) }));
}

export interface PeriodStats {
  total: number;
  newCount: number;
  resolved: number;
  highPriority: number;
  resolutionRate: number;
}

async function getPeriodStats(
  userId: string,
  projectId: string | undefined,
  fromTs: number,
  toTs: number,
): Promise<PeriodStats> {
  const base = [
    ...scopedFeedbackWhere(userId, projectId),
    gte(feedbacks.createdAt, fromTs),
    lt(feedbacks.createdAt, toTs),
  ];
  const countWith = async (extra?: ReturnType<typeof eq>) => {
    const where = extra ? [...base, extra] : base;
    const [r] = await db.select({ c: count() }).from(feedbacks).where(and(...where));
    return r?.c ?? 0;
  };
  const [total, newCount, resolved, highPriority] = await Promise.all([
    countWith(),
    countWith(eq(feedbacks.status, "new")),
    countWith(eq(feedbacks.status, "resolved")),
    countWith(eq(feedbacks.priority, "high")),
  ]);
  return {
    total,
    newCount,
    resolved,
    highPriority,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
  };
}

export interface TrendPoint {
  date: string;
  count: number;
}

export async function getDailyTrend(userId: string, projectId?: string, days = 30): Promise<TrendPoint[]> {
  const now = Date.now();
  const from = now - days * 86_400_000;
  const where = [...scopedFeedbackWhere(userId, projectId), gte(feedbacks.createdAt, from)];

  const bucket = sql<string>`to_char(to_timestamp(${feedbacks.createdAt} / 1000), 'YYYY-MM-DD')`;
  const rows = await db
    .select({ date: bucket, count: count() })
    .from(feedbacks)
    .where(and(...where))
    .groupBy(bucket)
    .orderBy(bucket);

  const map = new Map(rows.map((r) => [r.date, Number(r.count)]));
  const result: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = new Date(now - i * 86_400_000).toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }
  return result;
}

export interface StatsWithTrend {
  current: PeriodStats;
  previous: PeriodStats;
}

export async function getStatsWithTrend(userId: string, projectId?: string, days = 30): Promise<StatsWithTrend> {
  const now = Date.now();
  const periodMs = days * 86_400_000;
  const [current, previous] = await Promise.all([
    getPeriodStats(userId, projectId, now - periodMs, now),
    getPeriodStats(userId, projectId, now - 2 * periodMs, now - periodMs),
  ]);
  return { current, previous };
}
