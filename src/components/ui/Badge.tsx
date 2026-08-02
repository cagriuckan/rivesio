import { cn } from "./cn";
import type { FeedbackStatus, Priority, SiteStatus } from "@/lib/types";

export type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "violet";

const TONES: Record<Tone, { bg: string; text: string; dot: string }> = {
  neutral: { bg: "bg-raised",         text: "text-muted",         dot: "bg-subtle" },
  accent:  { bg: "bg-accent-soft",    text: "text-accent-text",   dot: "bg-accent" },
  success: { bg: "bg-success-soft",   text: "text-success-text",  dot: "bg-success" },
  warning: { bg: "bg-warning-soft",   text: "text-warning-text",  dot: "bg-warning" },
  danger:  { bg: "bg-danger-soft",    text: "text-danger-text",   dot: "bg-danger" },
  info:    { bg: "bg-info-soft",      text: "text-info-text",     dot: "bg-info" },
  violet:  { bg: "bg-violet-soft",    text: "text-violet-text",   dot: "bg-violet" },
};

export function Badge({
  tone = "neutral",
  dot = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const t = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5",
        "text-xs font-semibold leading-5",
        t.bg, t.text, className
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", t.dot)} />}
      {children}
    </span>
  );
}

/* ── Domain → tone mappings ── */

export const FEEDBACK_TONE: Record<FeedbackStatus, Tone> = {
  open:        "info",
  pending:     "violet",
  in_progress: "warning",
  resolved:    "success",
  closed:      "neutral",
};

export const PRIORITY_TONE: Record<Priority, Tone> = {
  low:    "neutral",
  normal: "accent",
  high:   "danger",
};

export const SITE_TONE: Record<SiteStatus, Tone> = {
  pending:  "warning",
  approved: "success",
  blocked:  "danger",
};
