export type SiteStatus = "pending" | "approved" | "blocked";
export type SiteSource = "auto" | "manual";
export type FeedbackStatus = "new" | "planned" | "in_progress" | "resolved" | "wontfix";
export type Priority = "low" | "normal" | "high";
export type ReplyAuthor = "admin" | "user";
export type AgentMembershipStatus = "invited" | "active" | "revoked";
export type FeedbackAssignmentSource = "claimed" | "category_auto" | "manual";

export interface WidgetText {
  fabLabel: string;
  title: string;
  categoryLabel: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  successMessage: string;
  errorMessage: string;
}

export type WidgetLocale = "tr" | "en";

export type FormFieldType = "text" | "textarea" | "select" | "checkbox" | "email";

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // select only
}

export type WidgetPosition = "bottom-right" | "bottom-left";
/** FAB presentation: full label + icon, or icon-only (compact circular). */
export type FabStyle = "label" | "icon";
/** "auto" follows the host page's data-theme; otherwise force dark/light. */
export type WidgetTheme = "auto" | "dark" | "light";

/**
 * Widget category: `value` is the stable id stored on feedbacks / agent routing;
 * `labels` are the visitor-facing texts per widget locale.
 */
export interface LocalizedCategory {
  value: string;
  labels: Record<WidgetLocale, string>;
}

export interface ProjectSettings {
  accentColor: string;
  /** Absolute URL to the uploaded brand logo, shown in the widget's emails. */
  logoUrl?: string;
  /** Internal storage key for the uploaded logo (backs the public serving route). */
  logoPath?: string;
  position: WidgetPosition;
  /** Desktop horizontal inset from the chosen side, in px (0–200). */
  offsetX?: number;
  /** Desktop vertical inset from the bottom, in px (0–200). */
  offsetY?: number;
  /** Mobile horizontal inset from the chosen side, in px (0–200). */
  offsetXMobile?: number;
  /** Mobile vertical inset from the bottom, in px (0–200). */
  offsetYMobile?: number;
  /** Stacking order on the host page. Default stays below cookie/chat overlays. */
  zIndex?: number;
  fabStyle?: FabStyle;
  theme?: WidgetTheme;
  categories: LocalizedCategory[];
  text?: Record<WidgetLocale, WidgetText>;
  fields?: FormField[];
}

export const FORM_FIELD_TYPES: FormFieldType[] = [
  "text",
  "textarea",
  "select",
  "checkbox",
  "email",
];

export interface ProjectRow {
  id: string;
  slug: string;
  name: string;
  widget_key: string;
  settings_json: string;
  /** When false the embed stays hidden and public APIs reject the widget. */
  is_active: boolean;
  // Operational, widget-global defaults. null == unlimited.
  site_limit: number | null;
  auto_approve_sites: boolean;
  allow_conversation: boolean;
  default_daily_limit_site: number | null;
  default_daily_limit_visitor: number | null;
  default_support_days: number | null;
  created_at: number;
  updated_at: number;
}

export interface SiteRow {
  id: string;
  project_id: string;
  domain: string;
  status: SiteStatus;
  source: SiteSource;
  meta_json: string;
  first_seen: number;
  last_seen: number;
  is_favorite: number;
  label: string | null;
  // Per-site overrides. null == inherit the widget default.
  support_starts_at: number | null;
  daily_limit_site: number | null;
  daily_limit_visitor: number | null;
  support_days: number | null;
  allow_conversation: boolean | null;
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
  email: string | null;
  access_token: string;
  visitor_hash: string | null;
  status: FeedbackStatus;
  priority: Priority;
  admin_note: string | null;
  custom_fields_json: string | null;
  created_at: number;
  updated_at: number;
  last_activity_at: number;
  is_favorite: number;
  last_admin_read_at: number | null;
  pinned_at: number | null;
  assigned_to: string | null;
  assigned_at: number | null;
  assignment_source: FeedbackAssignmentSource | null;
}

export interface AgentMembershipRow {
  id: string;
  project_id: string;
  email: string;
  user_id: string | null;
  status: AgentMembershipStatus;
  categories: string[] | null;
  invited_by: string;
  invited_at: number;
  accepted_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface FeedbackReplyRow {
  id: string;
  feedback_id: string;
  author: ReplyAuthor;
  message: string;
  page_url: string | null;
  user_agent: string | null;
  created_at: number;
}

/** A captured value for a custom form field, stored on the feedback. */
export interface CustomFieldValue {
  id?: string;
  label: string;
  value: string;
  kind?: "element_annotation";
  selector?: string;
  tagName?: string;
  text?: string;
  rect?: {
    x: number;
    y: number;
    width: number;
    height: number;
    viewportWidth: number;
    viewportHeight: number;
  };
}

export interface AttachmentRow {
  id: string;
  feedback_id: string;
  reply_id: string | null;
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

export const DEFAULT_WIDGET_TEXT: Record<WidgetLocale, WidgetText> = {
  tr: {
    fabLabel: "Geri bildirim",
    title: "Geri bildirim",
    categoryLabel: "Kategori",
    messageLabel: "Açıklama",
    messagePlaceholder: "Ne eklensin ya da nerede bir sorun var?",
    submitLabel: "Gönder",
    successMessage: "Teşekkürler! Geri bildirimin alındı.",
    errorMessage: "Gönderilemedi. Lütfen tekrar dene.",
  },
  en: {
    fabLabel: "Feedback",
    title: "Feedback",
    categoryLabel: "Category",
    messageLabel: "Description",
    messagePlaceholder: "What should be added, or where is the problem?",
    submitLabel: "Send",
    successMessage: "Thanks! Your feedback was received.",
    errorMessage: "Couldn't send. Please try again.",
  },
};

// ── Notifications ─────────────────────────────────────────────────────
export type NotificationType = "feedback_new" | "reply_user" | "status_change";

export interface NotificationChannelPrefs {
  inApp: boolean;
  email: boolean;
  push: boolean;
}

export interface NotificationPrefs {
  feedbackNew: NotificationChannelPrefs;
  replyUser: NotificationChannelPrefs;
  statusChange: NotificationChannelPrefs;
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  feedbackNew: { inApp: true, email: true, push: true },
  replyUser: { inApp: true, email: true, push: true },
  statusChange: { inApp: true, email: false, push: false },
};

export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string | null;
  icon_url: string | null;
  read_at: number | null;
  created_at: number;
}
