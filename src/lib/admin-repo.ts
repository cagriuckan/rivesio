import { queryAll, queryOne, execute } from "./db";
import { generateId, generateWidgetKey } from "./ids";
import type {
  AttachmentRow,
  FeedbackRow,
  FeedbackStatus,
  Priority,
  ProjectRow,
  SiteRow,
  SiteStatus,
} from "./types";

// --- Projects ---

export async function createProject(args: {
  slug: string;
  name: string;
  settings: Record<string, unknown>;
}): Promise<ProjectRow> {
  const id = generateId();
  await execute(
    `INSERT INTO projects (id, slug, name, widget_key, settings_json, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      args.slug,
      args.name,
      generateWidgetKey(),
      JSON.stringify(args.settings),
      Date.now(),
    ],
  );
  return (await queryOne<ProjectRow>("SELECT * FROM projects WHERE id = ?", [id]))!;
}

export async function projectSlugExists(slug: string): Promise<boolean> {
  const row = await queryOne<{ id: string }>("SELECT id FROM projects WHERE slug = ? LIMIT 1", [slug]);
  return Boolean(row);
}

export async function updateProject(
  id: string,
  fields: { name?: string; settings?: Record<string, unknown> },
): Promise<void> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (fields.name !== undefined) {
    sets.push("name = ?");
    vals.push(fields.name);
  }
  if (fields.settings !== undefined) {
    sets.push("settings_json = ?");
    vals.push(JSON.stringify(fields.settings));
  }
  if (!sets.length) return;
  vals.push(id);
  await execute(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`, vals);
}

export async function deleteProject(id: string): Promise<void> {
  // FK cascades handle sites/feedbacks/attachments; deleting the project is enough.
  await execute("DELETE FROM projects WHERE id = ?", [id]);
}

export async function rotateWidgetKey(id: string): Promise<string> {
  const key = generateWidgetKey();
  await execute("UPDATE projects SET widget_key = ? WHERE id = ?", [key, id]);
  return key;
}

// --- Sites ---

export interface SiteWithCounts extends SiteRow {
  project_name: string;
  feedback_count: number;
}

export function listSites(filter?: { status?: SiteStatus; projectId?: string }): Promise<SiteWithCounts[]> {
  const where: string[] = [];
  const vals: unknown[] = [];
  if (filter?.status) {
    where.push("s.status = ?");
    vals.push(filter.status);
  }
  if (filter?.projectId) {
    where.push("s.project_id = ?");
    vals.push(filter.projectId);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  return queryAll<SiteWithCounts>(
    `SELECT s.*, p.name AS project_name,
      (SELECT COUNT(*) FROM feedbacks f WHERE f.site_id = s.id) AS feedback_count
     FROM sites s JOIN projects p ON p.id = s.project_id
     ${clause}
     ORDER BY s.last_seen DESC`,
    vals,
  );
}

export async function setSiteStatus(id: string, status: SiteStatus): Promise<void> {
  await execute("UPDATE sites SET status = ? WHERE id = ?", [status, id]);
}

// --- Feedbacks ---

export interface FeedbackWithMeta extends FeedbackRow {
  project_name: string;
  domain: string;
  attachment_count: number;
  first_attachment_id: string | null;
}

export function listFeedbacks(filter: {
  projectId?: string;
  status?: FeedbackStatus;
  priority?: Priority;
}): Promise<FeedbackWithMeta[]> {
  const where: string[] = [];
  const vals: unknown[] = [];
  if (filter.projectId) {
    where.push("f.project_id = ?");
    vals.push(filter.projectId);
  }
  if (filter.status) {
    where.push("f.status = ?");
    vals.push(filter.status);
  }
  if (filter.priority) {
    where.push("f.priority = ?");
    vals.push(filter.priority);
  }
  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  return queryAll<FeedbackWithMeta>(
    `SELECT f.*, p.name AS project_name, s.domain AS domain,
      (SELECT COUNT(*) FROM attachments a WHERE a.feedback_id = f.id) AS attachment_count,
      (SELECT a.id FROM attachments a WHERE a.feedback_id = f.id ORDER BY a.id LIMIT 1) AS first_attachment_id
     FROM feedbacks f
     JOIN projects p ON p.id = f.project_id
     JOIN sites s ON s.id = f.site_id
     ${clause}
     ORDER BY f.created_at DESC
     LIMIT 500`,
    vals,
  );
}

export function getFeedbackWithMeta(id: string): Promise<FeedbackWithMeta | undefined> {
  return queryOne<FeedbackWithMeta>(
    `SELECT f.*, p.name AS project_name, s.domain AS domain,
      (SELECT COUNT(*) FROM attachments a WHERE a.feedback_id = f.id) AS attachment_count,
      (SELECT a.id FROM attachments a WHERE a.feedback_id = f.id ORDER BY a.id LIMIT 1) AS first_attachment_id
     FROM feedbacks f
     JOIN projects p ON p.id = f.project_id
     JOIN sites s ON s.id = f.site_id
     WHERE f.id = ?`,
    [id],
  );
}

export async function updateFeedback(
  id: string,
  fields: { status?: FeedbackStatus; priority?: Priority; admin_note?: string },
): Promise<void> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (fields.status !== undefined) {
    sets.push("status = ?");
    vals.push(fields.status);
  }
  if (fields.priority !== undefined) {
    sets.push("priority = ?");
    vals.push(fields.priority);
  }
  if (fields.admin_note !== undefined) {
    sets.push("admin_note = ?");
    vals.push(fields.admin_note);
  }
  if (!sets.length) return;
  vals.push(id);
  await execute(`UPDATE feedbacks SET ${sets.join(", ")} WHERE id = ?`, vals);
}

export async function bulkUpdateStatus(ids: string[], status: FeedbackStatus): Promise<void> {
  if (!ids.length) return;
  const placeholders = ids.map(() => "?").join(", ");
  await execute(
    `UPDATE feedbacks SET status = ? WHERE id IN (${placeholders})`,
    [status, ...ids],
  );
}

export async function deleteFeedback(id: string): Promise<void> {
  // FK cascade removes attachments rows.
  await execute("DELETE FROM feedbacks WHERE id = ?", [id]);
}

export function getAttachmentById(id: string): Promise<AttachmentRow | undefined> {
  return queryOne<AttachmentRow>("SELECT * FROM attachments WHERE id = ?", [id]);
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

/** Builds a `WHERE` fragment + values to scope a query to one project (or all). */
function projectScope(projectId: string | undefined): { clause: string; vals: unknown[] } {
  return projectId
    ? { clause: "WHERE project_id = ?", vals: [projectId] }
    : { clause: "", vals: [] };
}

export async function getStats(projectId?: string): Promise<Stats> {
  const fb = projectScope(projectId);
  const st = projectScope(projectId);
  const count = async (sql: string, vals: unknown[] = []) =>
    (await queryOne<{ c: number }>(sql, vals))!.c;

  const and = (extra: string) => (fb.clause ? `${fb.clause} AND ${extra}` : `WHERE ${extra}`);
  const stAnd = (extra: string) =>
    st.clause ? `${st.clause} AND ${extra}` : `WHERE ${extra}`;

  const [
    totalFeedbacks,
    newFeedbacks,
    resolvedFeedbacks,
    pendingSites,
    approvedSites,
    blockedSites,
    totalSites,
    projects,
  ] = await Promise.all([
    count(`SELECT COUNT(*) AS c FROM feedbacks ${fb.clause}`, fb.vals),
    count(`SELECT COUNT(*) AS c FROM feedbacks ${and("status = 'new'")}`, fb.vals),
    count(`SELECT COUNT(*) AS c FROM feedbacks ${and("status = 'resolved'")}`, fb.vals),
    count(`SELECT COUNT(*) AS c FROM sites ${stAnd("status = 'pending'")}`, st.vals),
    count(`SELECT COUNT(*) AS c FROM sites ${stAnd("status = 'approved'")}`, st.vals),
    count(`SELECT COUNT(*) AS c FROM sites ${stAnd("status = 'blocked'")}`, st.vals),
    count(`SELECT COUNT(*) AS c FROM sites ${st.clause}`, st.vals),
    count("SELECT COUNT(*) AS c FROM projects"),
  ]);

  return {
    totalFeedbacks,
    newFeedbacks,
    resolvedFeedbacks,
    pendingSites,
    approvedSites,
    blockedSites,
    totalSites,
    projects,
  };
}

/** Counts feedbacks grouped by status, scoped to a project or all. */
export async function getStatusBreakdown(projectId?: string): Promise<Record<FeedbackStatus, number>> {
  const { clause, vals } = projectScope(projectId);
  const rows = await queryAll<{ status: FeedbackStatus; c: number }>(
    `SELECT status, COUNT(*) AS c FROM feedbacks ${clause} GROUP BY status`,
    vals,
  );
  const out: Record<FeedbackStatus, number> = {
    new: 0, planned: 0, in_progress: 0, resolved: 0, wontfix: 0,
  };
  for (const r of rows) out[r.status] = r.c;
  return out;
}

/** Counts feedbacks grouped by priority, scoped to a project or all. */
export async function getPriorityBreakdown(projectId?: string): Promise<Record<Priority, number>> {
  const { clause, vals } = projectScope(projectId);
  const rows = await queryAll<{ priority: Priority; c: number }>(
    `SELECT priority, COUNT(*) AS c FROM feedbacks ${clause} GROUP BY priority`,
    vals,
  );
  const out: Record<Priority, number> = { low: 0, normal: 0, high: 0 };
  for (const r of rows) out[r.priority] = r.c;
  return out;
}

/** Returns the top feedback categories by count, scoped to a project or all. */
export function getCategoryBreakdown(projectId?: string, limit = 6): Promise<{ category: string; count: number }[]> {
  const { clause, vals } = projectScope(projectId);
  return queryAll<{ category: string; count: number }>(
    `SELECT category, COUNT(*) AS count FROM feedbacks ${clause}
     GROUP BY category ORDER BY count DESC LIMIT ?`,
    [...vals, limit],
  );
}

export interface PeriodStats {
  total: number;
  newCount: number;
  resolved: number;
  highPriority: number;
  resolutionRate: number;
}

async function getPeriodStats(projectId: string | undefined, fromTs: number, toTs: number): Promise<PeriodStats> {
  const proj = projectId ? "AND project_id = ?" : "";
  const baseVals = projectId ? [fromTs, toTs, projectId] : [fromTs, toTs];

  const count = async (extra: string) =>
    (await queryOne<{ c: number }>(
      `SELECT COUNT(*) AS c FROM feedbacks WHERE created_at >= ? AND created_at < ? ${proj} ${extra}`,
      baseVals,
    ))!.c;

  const [total, newCount, resolved, highPriority] = await Promise.all([
    count(""),
    count("AND status = 'new'"),
    count("AND status = 'resolved'"),
    count("AND priority = 'high'"),
  ]);

  return {
    total,
    newCount,
    resolved,
    highPriority,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
  };
}

export interface TrendPoint { date: string; count: number; }

export async function getDailyTrend(projectId?: string, days = 30): Promise<TrendPoint[]> {
  const now = Date.now();
  const from = now - days * 86_400_000;
  const proj = projectId ? "AND project_id = ?" : "";
  const vals = projectId ? [from, projectId] : [from];

  const rows = await queryAll<TrendPoint>(
    `SELECT DATE(FROM_UNIXTIME(created_at / 1000)) AS date, COUNT(*) AS count
     FROM feedbacks WHERE created_at >= ? ${proj}
     GROUP BY date ORDER BY date ASC`,
    vals,
  );

  // Fill missing days with 0
  const map = new Map(rows.map((r) => [r.date, r.count]));
  const result: TrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000);
    const key = d.toISOString().slice(0, 10);
    result.push({ date: key, count: map.get(key) ?? 0 });
  }
  return result;
}

export interface StatsWithTrend {
  current: PeriodStats;
  previous: PeriodStats;
}

export async function getStatsWithTrend(projectId?: string, days = 30): Promise<StatsWithTrend> {
  const now = Date.now();
  const periodMs = days * 86_400_000;
  const [current, previous] = await Promise.all([
    getPeriodStats(projectId, now - periodMs, now),
    getPeriodStats(projectId, now - 2 * periodMs, now - periodMs),
  ]);
  return { current, previous };
}
