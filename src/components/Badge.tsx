import type { FeedbackStatus, Priority, SiteStatus } from "@/lib/types";

type BadgeVariant = "info" | "violet" | "warn" | "ok" | "muted" | "danger" | "accent";

const FEEDBACK_VARIANTS: Record<FeedbackStatus, BadgeVariant> = {
  new:         "info",
  planned:     "violet",
  in_progress: "warn",
  resolved:    "ok",
  wontfix:     "muted",
};

const PRIORITY_VARIANTS: Record<Priority, BadgeVariant> = {
  low:    "muted",
  normal: "accent",
  high:   "danger",
};

const SITE_VARIANTS: Record<SiteStatus, BadgeVariant> = {
  pending:  "warn",
  approved: "ok",
  blocked:  "danger",
};

const VARIANT_STYLES: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  info:   { bg: "var(--color-info-muted)",   text: "var(--color-info-text)",   dot: "var(--color-info)" },
  violet: { bg: "var(--color-violet-muted)", text: "var(--color-violet-text)", dot: "var(--color-violet)" },
  warn:   { bg: "var(--color-warn-muted)",   text: "var(--color-warn-text)",   dot: "var(--color-warn)" },
  ok:     { bg: "var(--color-ok-muted)",     text: "var(--color-ok-text)",     dot: "var(--color-ok)" },
  muted:  { bg: "var(--color-elevated)",     text: "var(--color-subtle)",      dot: "var(--color-subtle)" },
  danger: { bg: "var(--color-danger-muted)", text: "var(--color-danger-text)", dot: "var(--color-danger)" },
  accent: { bg: "var(--color-accent-muted)", text: "var(--color-accent-text)", dot: "var(--color-accent)" },
};

export function Badge({
  variant = "muted",
  dot = false,
  children,
}: {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
}) {
  const s = VARIANT_STYLES[variant];
  return (
    <span
      className="ds-badge"
      style={{ backgroundColor: s.bg, color: s.text }}
    >
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: s.dot }}
        />
      )}
      {children}
    </span>
  );
}

export const feedbackVariant = (s: FeedbackStatus): BadgeVariant => FEEDBACK_VARIANTS[s];
export const priorityVariant = (p: Priority): BadgeVariant => PRIORITY_VARIANTS[p];
export const siteVariant = (s: SiteStatus): BadgeVariant => SITE_VARIANTS[s];

/* Legacy helpers kept for any remaining callers */
export const feedbackColor = (_s: FeedbackStatus) => "";
export const priorityColor = (_p: Priority) => "";
export const siteColor = (_s: SiteStatus) => "";
