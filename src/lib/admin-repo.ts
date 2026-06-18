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

export function getAttachmentById(id: string): AttachmentRow | undefined {
  return getDb().prepare("SELECT * FROM attachments WHERE id = ?").get(id) as
    | AttachmentRow
    | undefined;
}

// --- Dashboard stats ---

export interface Stats {
  newFeedbacks: number;
  totalFeedbacks: number;
  pendingSites: number;
  projects: number;
}

export function getStats(): Stats {
  const db = getDb();
  const q = (sql: string) => (db.prepare(sql).get() as { c: number }).c;
  return {
    newFeedbacks: q("SELECT COUNT(*) AS c FROM feedbacks WHERE status = 'new'"),
    totalFeedbacks: q("SELECT COUNT(*) AS c FROM feedbacks"),
    pendingSites: q("SELECT COUNT(*) AS c FROM sites WHERE status = 'pending'"),
    projects: q("SELECT COUNT(*) AS c FROM projects"),
  };
}
