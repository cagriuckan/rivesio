import { getDb } from "./db";
import { generateId } from "./ids";
import type {
  AttachmentRow,
  FeedbackRow,
  ProjectRow,
  ProjectSettings,
  SiteRow,
  SiteStatus,
} from "./types";

const FALLBACK_SETTINGS: ProjectSettings = {
  accentColor: "#4f46e5",
  position: "bottom-right",
  categories: ["Öneri", "Hata", "Tasarım", "Diğer"],
};

export function parseSettings(project: ProjectRow): ProjectSettings {
  try {
    return { ...FALLBACK_SETTINGS, ...JSON.parse(project.settings_json) };
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export function getProjectByWidgetKey(widgetKey: string): ProjectRow | undefined {
  return getDb()
    .prepare("SELECT * FROM projects WHERE widget_key = ?")
    .get(widgetKey) as ProjectRow | undefined;
}

export function getProjectById(id: string): ProjectRow | undefined {
  return getDb().prepare("SELECT * FROM projects WHERE id = ?").get(id) as
    | ProjectRow
    | undefined;
}

export function listProjects(): ProjectRow[] {
  return getDb()
    .prepare("SELECT * FROM projects ORDER BY created_at DESC")
    .all() as ProjectRow[];
}

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

export function findSite(projectId: string, domain: string): SiteRow | undefined {
  return getDb()
    .prepare("SELECT * FROM sites WHERE project_id = ? AND domain = ?")
    .get(projectId, domain) as SiteRow | undefined;
}

export function upsertSite(args: {
  projectId: string;
  domain: string;
  meta: Record<string, unknown>;
  defaultStatus: SiteStatus;
}): SiteRow {
  const db = getDb();
  const now = Date.now();
  const existing = findSite(args.projectId, args.domain);

  if (existing) {
    // Preserve admin decision (approved/blocked); only refresh metadata + last seen.
    db.prepare(
      "UPDATE sites SET meta_json = ?, last_seen = ? WHERE id = ?"
    ).run(JSON.stringify(args.meta), now, existing.id);
    return findSite(args.projectId, args.domain)!;
  }

  const id = generateId();
  db.prepare(
    `INSERT INTO sites (id, project_id, domain, status, meta_json, first_seen, last_seen)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    args.projectId,
    args.domain,
    args.defaultStatus,
    JSON.stringify(args.meta),
    now,
    now
  );
  return findSite(args.projectId, args.domain)!;
}

export function createFeedback(args: {
  projectId: string;
  siteId: string;
  category: string;
  message: string;
  pageUrl: string | null;
  userAgent: string | null;
  viewport: string | null;
  wpUser: string | null;
}): string {
  const id = generateId();
  getDb()
    .prepare(
      `INSERT INTO feedbacks
        (id, project_id, site_id, category, message, page_url, user_agent, viewport, wp_user, status, priority, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'normal', ?)`
    )
    .run(
      id,
      args.projectId,
      args.siteId,
      args.category,
      args.message,
      args.pageUrl,
      args.userAgent,
      args.viewport,
      args.wpUser,
      Date.now()
    );
  return id;
}

export function getFeedback(id: string): FeedbackRow | undefined {
  return getDb().prepare("SELECT * FROM feedbacks WHERE id = ?").get(id) as
    | FeedbackRow
    | undefined;
}

export function countAttachments(feedbackId: string): number {
  const row = getDb()
    .prepare("SELECT COUNT(*) AS c FROM attachments WHERE feedback_id = ?")
    .get(feedbackId) as { c: number };
  return row.c;
}

export function addAttachment(args: {
  feedbackId: string;
  kind: "screenshot" | "upload";
  filePath: string;
  mime: string;
  size: number;
}): AttachmentRow {
  const id = generateId();
  getDb()
    .prepare(
      `INSERT INTO attachments (id, feedback_id, kind, file_path, mime, size, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(id, args.feedbackId, args.kind, args.filePath, args.mime, args.size, Date.now());
  return getDb().prepare("SELECT * FROM attachments WHERE id = ?").get(id) as AttachmentRow;
}

export function listAttachments(feedbackId: string): AttachmentRow[] {
  return getDb()
    .prepare("SELECT * FROM attachments WHERE feedback_id = ? ORDER BY created_at ASC")
    .all(feedbackId) as AttachmentRow[];
}
