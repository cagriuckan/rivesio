export type SiteStatus = "pending" | "approved" | "blocked";
export type FeedbackStatus = "new" | "planned" | "in_progress" | "resolved" | "wontfix";
export type Priority = "low" | "normal" | "high";

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

export interface ProjectSettings {
  accentColor: string;
  position: "bottom-right" | "bottom-left";
  categories: string[];
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
  custom_fields_json: string | null;
  created_at: number;
}

/** A captured value for a custom form field, stored on the feedback. */
export interface CustomFieldValue {
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
