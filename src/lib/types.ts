export type SiteStatus = "pending" | "approved" | "blocked";
export type FeedbackStatus = "new" | "planned" | "in_progress" | "resolved" | "wontfix";
export type Priority = "low" | "normal" | "high";

export interface ProjectSettings {
  accentColor: string;
  position: "bottom-right" | "bottom-left";
  categories: string[];
}

export interface ProjectRow {
  id: string;
  slug: string;
  name: string;
  theme_slug: string;
  widget_key: string;
  settings_json: string;
  created_at: number;
}

export interface SiteRow {
  id: string;
  project_id: string;
  domain: string;
  license_key: string | null;
  status: SiteStatus;
  meta_json: string;
  first_seen: number;
  last_seen: number;
}

export interface FeedbackRow {
  id: string;
  project_id: string;
  site_id: string;
  category: string;
  message: string;
  page_url: string | null;
  user_agent: string | null;
  viewport: string | null;
  wp_user: string | null;
  status: FeedbackStatus;
  priority: Priority;
  admin_note: string | null;
  created_at: number;
}

export interface AttachmentRow {
  id: string;
  feedback_id: string;
  kind: "screenshot" | "upload";
  file_path: string;
  mime: string;
  size: number;
  created_at: number;
}

export const FEEDBACK_STATUSES: FeedbackStatus[] = [
  "new",
  "planned",
  "in_progress",
  "resolved",
  "wontfix",
];
export const PRIORITIES: Priority[] = ["low", "normal", "high"];
