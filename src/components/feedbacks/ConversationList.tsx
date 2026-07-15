"use client";

import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { SortMenu } from "@/components/ui/SortMenu";
import type { FeedbackWithMeta } from "@/lib/admin-repo";
import { FEEDBACK_STATUSES, type FeedbackStatus } from "@/lib/types";

const STATUS_BORDER: Record<FeedbackStatus, string> = {
  new: "border-l-info",
  planned: "border-l-violet",
  in_progress: "border-l-warning",
  resolved: "border-l-success",
  wontfix: "border-l-subtle",
};

export type InboxTab = "all" | "unread" | "pinned";
export type InboxSort =
  | "recent"
  | "oldest"
  | "customerReplyNew"
  | "customerReplyOld"
  | "unreadFirst"
  | "priorityHigh";

const AVATAR_HUES = [222, 262, 292, 172, 20, 340, 200, 45];

function avatarStyle(seed: string): { backgroundColor: string; color: string } {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const hue = AVATAR_HUES[h % AVATAR_HUES.length];
  return { backgroundColor: `hsl(${hue} 70% 92%)`, color: `hsl(${hue} 55% 38%)` };
}

export function senderName(f: Pick<FeedbackWithMeta, "email" | "wp_user" | "domain">): string {
  return f.wp_user || f.email || f.domain;
}

export function timeLabel(ts: number, locale: string): string {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString(locale, { day: "numeric", month: "short" });
}

export default function ConversationList({
  items,
  selectedId,
  tab,
  onTab,
  sort,
  onSort,
  status,
  onStatus,
  category,
  onCategory,
  categoryOptions,
  query,
  onQuery,
  onSelect,
  onTogglePin,
}: {
  items: FeedbackWithMeta[];
  selectedId: string | null;
  tab: InboxTab;
  onTab: (t: InboxTab) => void;
  sort: InboxSort;
  onSort: (s: InboxSort) => void;
  status: FeedbackStatus | "all";
  onStatus: (s: FeedbackStatus | "all") => void;
  category: string;
  onCategory: (c: string) => void;
  categoryOptions: string[];
  query: string;
  onQuery: (q: string) => void;
  onSelect: (id: string) => void;
  onTogglePin: (f: FeedbackWithMeta) => void;
}) {
  const t = useTranslations("feedbacks.inbox");
  const tStatus = useTranslations("status");
  const locale = useLocale();
  const unreadCount = items.filter((f) => f.unread).length;

  const tabs: { key: InboxTab; label: string; count?: number }[] = [
    { key: "all", label: t("tabAll") },
    { key: "unread", label: t("tabUnread"), count: unreadCount },
    { key: "pinned", label: t("tabPinned") },
  ];

  const sortOptions: { key: InboxSort; label: string }[] = [
    { key: "recent", label: t("sortRecent") },
    { key: "oldest", label: t("sortOldest") },
    { key: "customerReplyNew", label: t("sortCustomerReplyNew") },
    { key: "customerReplyOld", label: t("sortCustomerReplyOld") },
    { key: "unreadFirst", label: t("sortUnreadFirst") },
    { key: "priorityHigh", label: t("sortPriorityHigh") },
  ];

  const statusOptions: { key: FeedbackStatus | "all"; label: string }[] = [
    { key: "all", label: t("filterStatusAll") },
    ...FEEDBACK_STATUSES.map((s) => ({ key: s, label: tStatus(s) })),
  ];

  const categorySelectOptions: { key: string; label: string }[] = [
    { key: "all", label: t("filterCategoryAll") },
    ...categoryOptions.map((c) => ({ key: c, label: c })),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Search */}
      <div className="shrink-0 border-b border-line p-3">
        <div className="relative">
          <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-primary placeholder:text-faint outline-none transition-colors focus:border-accent-line focus:ring-2 focus:ring-accent-soft"
          />
        </div>
        {/* Tabs */}
        <div className="mt-2.5 flex items-center gap-1">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {tabs.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => onTab(key)}
                className={cn(
                  "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors",
                  tab === key ? "bg-accent-soft text-accent" : "text-subtle hover:bg-raised hover:text-primary",
                )}
              >
                {label}
                {count ? (
                  <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                    {count}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
          <SortMenu options={sortOptions} value={sort} onChange={onSort} label={t("sortLabel")} />
        </div>
        {/* Filters */}
        <div className="mt-2 flex items-center gap-1.5">
          <SortMenu
            options={statusOptions}
            value={status}
            onChange={onStatus}
            label={t("filterStatusLabel")}
            icon={Icon.listFilter}
            showValue
            align="left"
            className="max-w-[9.5rem]"
          />
          <SortMenu
            options={categorySelectOptions}
            value={category}
            onChange={onCategory}
            label={t("filterCategoryLabel")}
            icon={Icon.listFilter}
            showValue
            align="left"
            className="max-w-[9.5rem]"
          />
        </div>
      </div>

      {/* Rows */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-subtle">{t("emptyList")}</div>
        ) : (
          items.map((f) => {
            const name = senderName(f);
            const active = f.id === selectedId;
            return (
              <div
                key={f.id}
                className={cn(
                  "group flex w-full cursor-pointer items-start gap-3 border-b border-l-4 border-line/60 px-3 py-3 transition-colors",
                  STATUS_BORDER[f.status],
                  f.status === "resolved" && "opacity-60",
                  active ? "bg-accent-soft/50" : "hover:bg-raised",
                )}
                onClick={() => onSelect(f.id)}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                  style={avatarStyle(name)}
                >
                  {name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className={cn("truncate text-sm", f.unread ? "font-bold text-strong" : "font-medium text-primary")}>
                        {name}
                      </span>
                      {f.assignee_name && (
                        <span
                          title={t("assignedTo", { name: f.assignee_name })}
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold"
                          style={avatarStyle(f.assignee_name)}
                        >
                          {f.assignee_name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-[11px] text-faint tnum">
                      {timeLabel(f.last_activity_at, locale)}
                    </span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span className={cn("truncate text-xs", f.unread ? "font-medium text-secondary" : "text-subtle")}>
                      {f.last_message_author === "admin" ? `${t("youPrefix")}: ` : ""}
                      {f.last_message}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      {f.unread && <span className="h-2 w-2 rounded-full bg-accent" />}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(f);
                        }}
                        aria-label={f.pinned_at ? t("unpin") : t("pin")}
                        className={cn(
                          "rounded p-0.5 transition-opacity",
                          f.pinned_at ? "text-warning-text" : "text-faint opacity-0 group-hover:opacity-100 hover:text-primary",
                        )}
                      >
                        <Icon.star className={cn("h-3.5 w-3.5", f.pinned_at ? "fill-current" : null)} />
                      </button>
                    </span>
                  </span>
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
