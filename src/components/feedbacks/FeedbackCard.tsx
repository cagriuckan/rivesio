"use client";

import { Badge, FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { FEEDBACK_STATUS_LABEL, PRIORITY_LABEL } from "@/lib/labels";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

function relativeTime(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m}dk`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}sa`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}g`;
  return `${Math.floor(d / 30)}ay`;
}

export default function FeedbackCard({
  feedback,
  selected,
  compact,
  onClick,
}: {
  feedback: FeedbackWithMeta;
  selected: boolean;
  compact: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full rounded-xl border p-4 text-left transition-all outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent",
        selected
          ? "border-accent-line bg-accent-soft"
          : "border-line bg-surface shadow-sm hover:border-line-strong"
      )}
    >
      <div className="mb-2.5 flex items-center gap-2">
        <Badge tone={FEEDBACK_TONE[feedback.status]} dot>
          {FEEDBACK_STATUS_LABEL[feedback.status]}
        </Badge>
        {feedback.priority === "high" && (
          <Badge tone={PRIORITY_TONE[feedback.priority]}>{PRIORITY_LABEL[feedback.priority]}</Badge>
        )}
        <span className="ml-auto shrink-0 text-2xs text-faint tnum">{relativeTime(feedback.created_at)}</span>
      </div>

      <p className={cn("text-sm font-medium leading-snug text-primary", compact ? "line-clamp-2" : "line-clamp-2")}>
        {feedback.message}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <Avatar name={feedback.wp_user || feedback.domain} size="xs" />
        <span className="truncate text-xs text-subtle">{feedback.domain}</span>
        <span className="ml-auto flex shrink-0 items-center gap-2.5 text-2xs text-faint">
          <span className="rounded bg-raised px-1.5 py-0.5 font-medium text-subtle">{feedback.category}</span>
          {feedback.attachment_count > 0 && (
            <span className="flex items-center gap-1">
              <Icon.paperclip className="h-3 w-3" />
              {feedback.attachment_count}
            </span>
          )}
        </span>
      </div>
    </button>
  );
}
