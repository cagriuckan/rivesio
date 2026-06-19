import { getDb } from "./db";
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

export function createProject(args: {
  slug: string;
  name: string;
  themeSlug: string;
  settings: Record<string, unknown>;
}): ProjectRow {
  const id = generateId();
  getDb()
    .prepare(
      `INSERT INTO projects (id, slug, name, theme_slug, widget_key, settings_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      id,
      args.slug,
      args.name,
      args.themeSlug,
      generateWidgetKey(),
      JSON.stringify(args.settings),
      Date.now()
    );
  return getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as ProjectRow;
}

export function updateProject(
  id: string,
  fields: { name?: string; themeSlug?: string; settings?: Record<string, unknown> }
): void {
  const sets: string[] = [];
  const vals: unknown[] = [];
  if (fields.name !== undefined) {
    sets.push("name = ?");
    vals.push(fields.name);
  }
  if (fields.themeSlug !== undefined) {
    sets.push("theme_slug = ?");
    vals.push(fields.themeSlug);
  }
  if (fields.settings !== undefined) {
    sets.push("settings_json = ?");
    vals.push(JSON.stringify(fields.settings));
  }
  if (!sets.length) return;
  vals.push(id);
  getDb()
    .prepare(`UPDATE projects SET ${sets.join(", ")} WHERE id = ?`)
    .run(...vals);
}

export function deleteProject(id: string): void {
  const db = getDb();
  // Cascade: attachments → feedbacks → sites → project
  const feedbackIds = db
    .prepare("SELECT id FROM feedbacks WHERE project_id = ?")
    .all(id) as { id: string }[];
  for (const { id: fid } of feedbackIds) {
    db.prepare("DELETE FROM attachments WHERE feedback_id = ?").run(fid);
  }
  db.prepare("DELETE FROM feedbacks WHERE project_id = ?").run(id);
  db.prepare("DELETE FROM sites WHERE project_id = ?").run(id);
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
}

export function rotateWidgetKey(id: string): string {
  const key = generateWidgetKey();
  getDb().prepare("UPDATE projects SET widget_key = ? WHERE id = ?").run(key, id);
  return key;
}

// --- Sites ---

export interface SiteWithCounts extends SiteRow {
  project_name: string;
  feedback_count: number;
}

export function listSites(filter?: { status?: SiteStatus; projectId?: string }): SiteWithCounts[] {
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
  return getDb()
    .prepare(
      `SELECT s.*, p.name AS project_name,
        (SELECT COUNT(*) FROM feedbacks f WHERE f.site_id = s.id) AS feedback_count
       FROM sites s JOIN projects p ON p.id = s.project_id
       ${clause}
       ORDER BY s.last_seen DESC`
    )
    .all(...vals) as SiteWithCounts[];
}

export function setSiteStatus(id: string, status: SiteStatus): void {
  getDb().prepare("UPDATE sites SET status = ? WHERE id = ?").run(status, id);
}

// --- Feedbacks ---

export interface FeedbackWithMeta extends FeedbackRow {
  project_name: string;
  domain: string;
  attachment_count: number;
}

export function listFeedbacks(filter: {
  projectId?: string;
  status?: FeedbackStatus;
  priority?: Priority;
}): FeedbackWithMeta[] {
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
  return getDb()
    .prepare(
      `SELECT f.*, p.name AS project_name, s.domain AS domain,
        (SELECT COUNT(*) FROM attachments a WHERE a.feedback_id = f.id) AS attachment_count
       FROM feedbacks f
       JOIN projects p ON p.id = f.project_id
       JOIN sites s ON s.id = f.site_id
       ${clause}
       ORDER BY f.created_at DESC
       LIMIT 500`
    )
    .all(...vals) as FeedbackWithMeta[];
}

export function getFeedbackWithMeta(id: string): FeedbackWithMeta | undefined {
  return getDb()
    .prepare(
      `SELECT f.*, p.name AS project_name, s.domain AS domain,
        (SELECT COUNT(*) FROM attachments a WHERE a.feedback_id = f.id) AS attachment_count
       FROM feedbacks f
       JOIN projects p ON p.id = f.project_id
       JOIN sites s ON s.id = f.site_id
       WHERE f.id = ?`
    )
    .get(id) as FeedbackWithMeta | undefined;
}

export function updateFeedback(
  id: string,
  fields: { status?: FeedbackStatus; priority?: Priority; admin_note?: string }
): void {
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
  getDb()
    .prepare(`UPDATE feedbacks SET ${sets.join(", ")} WHERE id = ?`)
    .run(...vals);
}

export function deleteFeedback(id: string): void {
  const db = getDb();
  db.prepare("DELETE FROM attachments WHERE feedback_id = ?").run(id);
  db.prepare("DELETE FROM feedbacks WHERE id = ?").run(id);
}

export function getAttachmentById(id: string): AttachmentRow | undefined {
  return getDb().prepare("SELECT * FROM attachments WHERE id = ?").get(id) as
    | AttachmentRow
    | undefined;
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
function projectScope(projectId: string | undefined, alias = ""): { clause: string; vals: unknown[] } {
  const col = alias ? `${alias}.project_id` : "project_id";
  return projectId
    ? { clause: `WHERE ${col} = ?`, vals: [projectId] }
    : { clause: "", vals: [] };
}

export function getStats(projectId?: string): Stats {
  const db = getDb();
  const fb = projectScope(projectId);
  const st = projectScope(projectId);
  const count = (sql: string, vals: unknown[] = []) =>
    (db.prepare(sql).get(...vals) as { c: number }).c;

  const and = (extra: string) => (fb.clause ? `${fb.clause} AND ${extra}` : `WHERE ${extra}`);

  return {
    totalFeedbacks: count(`SELECT COUNT(*) AS c FROM feedbacks ${fb.clause}`, fb.vals),
    newFeedbacks: count(`SELECT COUNT(*) AS c FROM feedbacks ${and("status = 'new'")}`, fb.vals),
    resolvedFeedbacks: count(`SELECT COUNT(*) AS c FROM feedbacks ${and("status = 'resolved'")}`, fb.vals),
    pendingSites: count(`SELECT COUNT(*) AS c FROM sites ${st.clause ? `${st.clause} AND status = 'pending'` : "WHERE status = 'pending'"}`, st.vals),
    approvedSites: count(`SELECT COUNT(*) AS c FROM sites ${st.clause ? `${st.clause} AND status = 'approved'` : "WHERE status = 'approved'"}`, st.vals),
    blockedSites: count(`SELECT COUNT(*) AS c FROM sites ${st.clause ? `${st.clause} AND status = 'blocked'` : "WHERE status = 'blocked'"}`, st.vals),
    totalSites: count(`SELECT COUNT(*) AS c FROM sites ${st.clause}`, st.vals),
    projects: count("SELECT COUNT(*) AS c FROM projects"),
  };
}

/** Counts feedbacks grouped by status, scoped to a project or all. */
export function getStatusBreakdown(projectId?: string): Record<FeedbackStatus, number> {
  const { clause, vals } = projectScope(projectId);
  const rows = getDb()
    .prepare(`SELECT status, COUNT(*) AS c FROM feedbacks ${clause} GROUP BY status`)
    .all(...vals) as { status: FeedbackStatus; c: number }[];
  const out: Record<FeedbackStatus, number> = {
    new: 0, planned: 0, in_progress: 0, resolved: 0, wontfix: 0,
  };
  for (const r of rows) out[r.status] = r.c;
  return out;
}

/** Counts feedbacks grouped by priority, scoped to a project or all. */
export function getPriorityBreakdown(projectId?: string): Record<Priority, number> {
  const { clause, vals } = projectScope(projectId);
  const rows = getDb()
    .prepare(`SELECT priority, COUNT(*) AS c FROM feedbacks ${clause} GROUP BY priority`)
    .all(...vals) as { priority: Priority; c: number }[];
  const out: Record<Priority, number> = { low: 0, normal: 0, high: 0 };
  for (const r of rows) out[r.priority] = r.c;
  return out;
}

/** Returns the top feedback categories by count, scoped to a project or all. */
export function getCategoryBreakdown(projectId?: string, limit = 6): { category: string; count: number }[] {
  const { clause, vals } = projectScope(projectId);
  return getDb()
    .prepare(
      `SELECT category, COUNT(*) AS count FROM feedbacks ${clause}
       GROUP BY category ORDER BY count DESC LIMIT ?`
    )
    .all(...vals, limit) as { category: string; count: number }[];
}

export interface PeriodStats {
  total: number;
  newCount: number;
  resolved: number;
  highPriority: number;
  resolutionRate: number;
}

function getPeriodStats(projectId: string | undefined, fromTs: number, toTs: number): PeriodStats {
  const db = getDb();
  const proj = projectId ? "AND project_id = ?" : "";
  const baseVals = projectId ? [fromTs, toTs, projectId] : [fromTs, toTs];

  const count = (extra: string) =>
    (db.prepare(`SELECT COUNT(*) AS c FROM feedbacks WHERE created_at >= ? AND created_at < ? ${proj} ${extra}`)
      .get(...baseVals) as { c: number }).c;

  const total = count("");
  const newCount = count("AND status = 'new'");
  const resolved = count("AND status = 'resolved'");
  const highPriority = count("AND priority = 'high'");

  return {
    total,
    newCount,
    resolved,
    highPriority,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
  };
}

export interface TrendPoint { date: string; count: number; }

export function getDailyTrend(projectId?: string, days = 30): TrendPoint[] {
  const db = getDb();
  const now = Date.now();
  const from = now - days * 86_400_000;
  const proj = projectId ? "AND project_id = ?" : "";
  const vals = projectId ? [from, projectId] : [from];

  const rows = db
    .prepare(
      `SELECT date(created_at / 1000, 'unixepoch') AS date, COUNT(*) AS count
       FROM feedbacks WHERE created_at >= ? ${proj}
       GROUP BY date ORDER BY date ASC`
    )
    .all(...vals) as TrendPoint[];

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

export function getStatsWithTrend(projectId?: string, days = 30): StatsWithTrend {
  const now = Date.now();
  const periodMs = days * 86_400_000;
  return {
    current: getPeriodStats(projectId, now - periodMs, now),
    previous: getPeriodStats(projectId, now - 2 * periodMs, now - periodMs),
  };
}
