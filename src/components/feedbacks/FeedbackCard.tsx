"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Badge, FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { cn } from "@/components/ui/cn";
import { relativeTime } from "@/lib/time";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

export default function FeedbackCard({
  feedback,
  selected,
  onOpen,
  onToggleSelect,
  onToggleFavorite,
  onDelete,
}: {
  feedback: FeedbackWithMeta;
  selected: boolean;
  compact?: boolean;
  onOpen: () => void;
  onToggleSelect: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  const ts = useTranslations("status");
  const tp = useTranslations("priority");
  const tt = useTranslations("time");
  const tf = useTranslations("feedbacks");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-pressed={selected}
      className={cn(
        "group relative flex h-full min-h-48 w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all outline-none cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-accent hover:-translate-y-0.5 hover:shadow-md",
        selected
          ? "border-accent-line bg-accent-soft shadow-sm"
          : "border-line bg-surface hover:border-line-strong shadow-xs"
      )}
    >
      {/* Top: status + priority + id + category + time */}
      <div className="flex items-center gap-1.5">
        <Badge tone={FEEDBACK_TONE[feedback.status]} dot>
          {ts(feedback.status)}
        </Badge>
        {feedback.priority === "high" && (
          <Badge tone={PRIORITY_TONE[feedback.priority]}>
            {tp(feedback.priority)}
          </Badge>
        )}
        {Boolean(feedback.is_favorite) && <Icon.star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />}
        <span className="rounded-full bg-raised px-2 py-0.5 text-xs text-subtle">{feedback.category}</span>
        <span className="ml-auto flex shrink-0 items-center gap-1.5 text-xs text-faint">
          <span className="font-mono" title={feedback.id}>#{feedback.id.slice(0, 8)}</span>
          <span className="tnum">{relativeTime(feedback.created_at, tt)}</span>
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

      {/* Bottom: sender + category + meta + actions */}
      <div className="flex items-center gap-2 border-t border-line-soft pt-2.5">
        <Avatar name={feedback.wp_user || feedback.domain} size="xs" />
        <span className="min-w-0 truncate text-xs text-subtle">{feedback.domain}</span>
        <div className="ml-auto flex shrink-0 items-center gap-2 text-xs text-faint">
          {feedback.attachment_count > 0 && (
            <span className="flex items-center gap-0.5">
              <Icon.paperclip className="h-3 w-3" />
              {feedback.attachment_count}
            </span>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <ActionMenu
              label={tf("actions")}
              onOpenChange={setMenuOpen}
              groups={[
                [{ key: "select", label: selected ? tf("actionUnselect") : tf("actionSelect"), icon: Icon.check, onSelect: onToggleSelect }],
                [
                  {
                    key: "favorite",
                    label: feedback.is_favorite ? tf("actionRemoveFavorite") : tf("actionAddFavorite"),
                    icon: Icon.star,
                    onSelect: onToggleFavorite,
                  },
                ],
                [{ key: "delete", label: tf("actionDelete"), icon: Icon.trash, onSelect: onDelete, danger: true }],
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
