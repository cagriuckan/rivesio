import { queryAll, queryOne, execute } from "./db";
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

export function getProjectByWidgetKey(widgetKey: string): Promise<ProjectRow | undefined> {
  return queryOne<ProjectRow>("SELECT * FROM projects WHERE widget_key = ?", [widgetKey]);
}

export function getProjectById(id: string): Promise<ProjectRow | undefined> {
  return queryOne<ProjectRow>("SELECT * FROM projects WHERE id = ?", [id]);
}

export function listProjects(): Promise<ProjectRow[]> {
  return queryAll<ProjectRow>("SELECT * FROM projects ORDER BY created_at DESC");
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

export function findSite(projectId: string, domain: string): Promise<SiteRow | undefined> {
  return queryOne<SiteRow>(
    "SELECT * FROM sites WHERE project_id = ? AND domain = ?",
    [projectId, domain],
  );
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
    await execute("UPDATE sites SET meta_json = ?, last_seen = ? WHERE id = ?", [
      JSON.stringify(args.meta),
      now,
      existing.id,
    ]);
    return (await findSite(args.projectId, args.domain))!;
  }

  const id = generateId();
  await execute(
    `INSERT INTO sites (id, project_id, domain, status, meta_json, first_seen, last_seen)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, args.projectId, args.domain, args.defaultStatus, JSON.stringify(args.meta), now, now],
  );
  return (await findSite(args.projectId, args.domain))!;
}

export async function createFeedback(args: {
  projectId: string;
  siteId: string;
  category: string;
  message: string;
  pageUrl: string | null;
  userAgent: string | null;
  viewport: string | null;
  wpUser: string | null;
}): Promise<string> {
  const id = generateId();
  await execute(
    `INSERT INTO feedbacks
      (id, project_id, site_id, category, message, page_url, user_agent, viewport, wp_user, status, priority, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', 'normal', ?)`,
    [
      id,
      args.projectId,
      args.siteId,
      args.category,
      args.message,
      args.pageUrl,
      args.userAgent,
      args.viewport,
      args.wpUser,
      Date.now(),
    ],
  );
  return id;
}

export function getFeedback(id: string): Promise<FeedbackRow | undefined> {
  return queryOne<FeedbackRow>("SELECT * FROM feedbacks WHERE id = ?", [id]);
}

export async function countAttachments(feedbackId: string): Promise<number> {
  const row = await queryOne<{ c: number }>(
    "SELECT COUNT(*) AS c FROM attachments WHERE feedback_id = ?",
    [feedbackId],
  );
  return row?.c ?? 0;
}

export async function addAttachment(args: {
  feedbackId: string;
  kind: "screenshot" | "upload";
  filePath: string;
  mime: string;
  size: number;
}): Promise<AttachmentRow> {
  const id = generateId();
  await execute(
    `INSERT INTO attachments (id, feedback_id, kind, file_path, mime, size, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, args.feedbackId, args.kind, args.filePath, args.mime, args.size, Date.now()],
  );
  return (await queryOne<AttachmentRow>("SELECT * FROM attachments WHERE id = ?", [id]))!;
}

export function listAttachments(feedbackId: string): Promise<AttachmentRow[]> {
  return queryAll<AttachmentRow>(
    "SELECT * FROM attachments WHERE feedback_id = ? ORDER BY created_at ASC",
    [feedbackId],
  );
}
