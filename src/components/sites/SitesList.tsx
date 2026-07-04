"use client";

import { useLocale, useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, SITE_TONE } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { SortMenu, type SortOption } from "@/components/ui/SortMenu";
import { formatDate } from "@/lib/labels";
import type { SiteStatus } from "@/lib/types";
import type { SiteWithCounts } from "@/lib/admin-repo";
import type { SiteSort } from "./SitesPanel";

const SITE_STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

export default function SitesList({
  items,
  selectedId,
  statusFilter,
  onStatusFilter,
  statusCounts,
  query,
  onQuery,
  sort,
  onSort,
  sortOptions,
  selected,
  onToggleSelect,
  onSelect,
  onToggleFavorite,
}: {
  items: SiteWithCounts[];
  selectedId: string | null;
  statusFilter: SiteStatus | "all";
  onStatusFilter: (s: SiteStatus | "all") => void;
  statusCounts: Map<SiteStatus | "all", number>;
  query: string;
  onQuery: (q: string) => void;
  sort: SiteSort;
  onSort: (s: SiteSort) => void;
  sortOptions: ReadonlyArray<SortOption<SiteSort>>;
  selected: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}) {
  const t = useTranslations("sites");
  const tc = useTranslations("common");
  const ts = useTranslations("siteStatus");
  const locale = useLocale();

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
            aria-label={t("searchLabel")}
            className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-primary placeholder:text-faint outline-none transition-colors focus:border-accent-line focus:ring-2 focus:ring-accent-soft"
          />
        </div>
        {/* Status filter + sort */}
        <div className="mt-2.5 flex items-center gap-1">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {(["all", ...SITE_STATUSES] as Array<SiteStatus | "all">).map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusFilter(status)}
                  className={cn(
                    "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors",
                    active ? "bg-accent-soft text-accent-text" : "text-subtle hover:bg-raised hover:text-primary",
                  )}
                >
                  {status === "all" ? tc("all") : ts(status)}
                  <span
                    className={cn(
                      "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] tnum",
                      active ? "bg-accent text-white" : "bg-raised text-subtle",
                    )}
                  >
                    {statusCounts.get(status) ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
          <SortMenu label={t("sortLabel")} value={sort} onChange={onSort} options={sortOptions} />
        </div>
      </div>

      {/* Rows */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-raised">
              <Icon.globe className="h-5 w-5 text-subtle" />
            </div>
            <p className="text-sm font-medium text-secondary">{query.trim() ? t("noMatch") : t("empty")}</p>
          </div>
        ) : (
          items.map((site) => {
            const active = site.id === selectedId;
            const isSelected = selected.has(site.id);
            return (
              <div
                key={site.id}
                className={cn(
                  "group relative flex w-full cursor-pointer items-start gap-3 border-b border-line/60 px-3 py-3 transition-colors",
                  active ? "bg-accent-soft/50" : isSelected ? "bg-accent-soft/20" : "hover:bg-raised",
                )}
                onClick={() => onSelect(site.id)}
              >
                {active && <span className="absolute inset-y-0 left-0 w-0.5 bg-accent" />}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(site.id);
                  }}
                  aria-label={isSelected ? t("actionUnselect") : t("actionSelect")}
                  className={cn(
                    "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-opacity",
                    isSelected
                      ? "border-accent bg-accent text-white opacity-100"
                      : "border-line-strong text-transparent opacity-0 group-hover:opacity-100",
                  )}
                >
                  <Icon.check className="h-3 w-3" />
                </button>
                <Avatar name={site.domain} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <span className="truncate text-sm font-semibold text-strong">{site.label || site.domain}</span>
                      {Boolean(site.is_favorite) && <Icon.star className="h-3 w-3 shrink-0 fill-warning text-warning" />}
                    </span>
                    <span className="shrink-0 text-[11px] text-faint tnum">{formatDate(site.last_seen, locale)}</span>
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-subtle">{site.project_name}</span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <span className="text-[11px] text-faint tnum">{site.feedback_count}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(site.id, !site.is_favorite);
                        }}
                        aria-label={site.is_favorite ? t("actionRemoveFavorite") : t("actionAddFavorite")}
                        className={cn(
                          "rounded p-0.5 transition-opacity",
                          site.is_favorite ? "text-warning-text" : "text-faint opacity-0 group-hover:opacity-100 hover:text-primary",
                        )}
                      >
                        <Icon.star className={cn("h-3.5 w-3.5", site.is_favorite ? "fill-current" : null)} />
                      </button>
                    </span>
                  </span>
                  <span className="mt-1 block">
                    <Badge tone={SITE_TONE[site.status]} dot>{ts(site.status)}</Badge>
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
