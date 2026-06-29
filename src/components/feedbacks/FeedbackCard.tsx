"use client";

import { useTranslations } from "next-intl";
import { Badge, FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { relativeTime } from "@/lib/time";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

export default function FeedbackCard({
  feedback,
  selected,
  onClick,
}: {
  feedback: FeedbackWithMeta;
  selected: boolean;
  compact?: boolean;
  onClick: () => void;
}) {
  const ts = useTranslations("status");
  const tp = useTranslations("priority");
  const tt = useTranslations("time");
  const tf = useTranslations("feedbacks");

  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group flex h-full min-h-48 w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-accent-line bg-accent-soft shadow-sm"
          : "border-line bg-surface hover:border-line-strong shadow-xs"
      )}
    >
      {/* Top: status + priority + time */}
      <div className="flex items-center gap-1.5">
        <Badge tone={FEEDBACK_TONE[feedback.status]} dot>
          {ts(feedback.status)}
        </Badge>
        {feedback.priority === "high" && (
          <Badge tone={PRIORITY_TONE[feedback.priority]}>
            {tp(feedback.priority)}
          </Badge>
        )}
        <span className="ml-auto shrink-0 text-2xs text-faint tnum">
          {relativeTime(feedback.created_at, tt)}
        </span>
      </div>

      {/* Message + thumbnail */}
      <div className="flex flex-1 items-start gap-3">
        <p className="min-w-0 flex-1 line-clamp-3 text-sm leading-relaxed text-primary">
          {feedback.message}
        </p>
        {feedback.first_attachment_id && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/admin/attachments/${feedback.first_attachment_id}`}
            alt={tf("attachmentAlt")}
            className="h-14 w-20 shrink-0 rounded-lg border border-line object-cover"
          />
        )}
      </div>

      {/* Bottom: sender + category + meta */}
      <div className="flex items-center gap-2 border-t border-line-soft pt-2.5">
        <Avatar name={feedback.wp_user || feedback.domain} size="xs" />
        <span className="min-w-0 truncate text-xs text-subtle">{feedback.domain}</span>
        <div className="ml-auto flex shrink-0 items-center gap-2 text-2xs text-faint">
          <span className="rounded-full bg-raised px-2 py-0.5 text-subtle">{feedback.category}</span>
          {feedback.attachment_count > 0 && (
            <span className="flex items-center gap-0.5">
              <Icon.paperclip className="h-3 w-3" />
              {feedback.attachment_count}
            </span>
          )}
          <span className="font-mono" title={feedback.id}>#{feedback.id.slice(0, 8)}</span>
        </div>
      </div>
    </button>
  );
}
