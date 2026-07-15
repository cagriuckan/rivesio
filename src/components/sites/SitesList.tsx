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

function FeedbackRing({ count, max }: { count: number; max: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const ratio = max > 0 ? Math.min(count / max, 1) : 0;
  return (
    <span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center">
      <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
        <circle cx="18" cy="18" r={r} fill="none" strokeWidth="2.5" className="stroke-line" />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={`${c * ratio} ${c}`}
          className="stroke-accent"
        />
      </svg>
      <span className="absolute text-[11px] font-bold text-strong tnum">{count > 999 ? "1k+" : count}</span>
    </span>
  );
}

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
  const maxFeedback = Math.max(1, ...items.map((s) => s.feedback_count));

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight text-strong">{t("tableTitle")}</h2>
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1 overflow-x-auto">
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

      <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="border-b border-line px-4 py-3">
          <div className="relative max-w-sm">
            <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className="h-9 w-full rounded-lg border border-line bg-base pl-9 pr-3 text-sm text-primary placeholder:text-faint outline-none transition-colors focus:border-accent-line focus:ring-2 focus:ring-accent-soft"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left">
            <thead>
              <tr className="border-b border-line">
                <th className="w-10 px-4 py-3" />
                <th className="px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-widest text-subtle">{t("colDomain")}</th>
                <th className="px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-widest text-subtle">{t("colFeedback")}</th>
                <th className="hidden px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-widest text-subtle md:table-cell">{t("colWidget")}</th>
                <th className="hidden px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-widest text-subtle sm:table-cell">{t("colLastSeen")}</th>
                <th className="px-2 py-3 font-mono text-[11px] font-medium uppercase tracking-widest text-subtle">{t("colStatus")}</th>
                <th className="w-12 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-raised">
                        <Icon.globe className="h-5 w-5 text-subtle" />
                      </div>
                      <p className="text-sm font-medium text-secondary">{query.trim() ? t("noMatch") : t("empty")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((site) => {
                  const active = site.id === selectedId;
                  const isSelected = selected.has(site.id);
                  return (
                    <tr
                      key={site.id}
                      onClick={() => onSelect(site.id)}
                      className={cn(
                        "group cursor-pointer border-b border-line/60 transition-colors last:border-b-0",
                        active ? "bg-accent-soft/50" : isSelected ? "bg-accent-soft/20" : "hover:bg-raised/60",
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSelect(site.id);
                          }}
                          aria-label={isSelected ? t("actionUnselect") : t("actionSelect")}
                          className={cn(
                            "flex h-4 w-4 items-center justify-center rounded border transition-opacity",
                            isSelected
                              ? "border-accent bg-accent text-white opacity-100"
                              : "border-line-strong text-transparent opacity-0 group-hover:opacity-100",
                          )}
                        >
                          <Icon.check className="h-3 w-3" />
                        </button>
                      </td>
                      <td className="px-2 py-3.5">
                        <span className="flex min-w-0 items-center gap-3">
                          <Avatar name={site.domain} size="sm" />
                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5">
                              <span className="truncate text-sm font-semibold text-strong">{site.label || site.domain}</span>
                              {Boolean(site.is_favorite) && <Icon.star className="h-3 w-3 shrink-0 fill-warning text-warning" />}
                            </span>
                            <span className="block truncate text-xs text-subtle">
                              {site.label ? site.domain : site.project_name}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="px-2 py-3.5">
                        <span className="flex items-center gap-3">
                          <FeedbackRing count={site.feedback_count} max={maxFeedback} />
                          <span className="hidden h-1 w-24 overflow-hidden rounded-full bg-line lg:block">
                            <span
                              className="block h-full rounded-full bg-accent"
                              style={{ width: `${Math.round((site.feedback_count / maxFeedback) * 100)}%` }}
                            />
                          </span>
                        </span>
                      </td>
                      <td className="hidden px-2 py-3.5 md:table-cell">
                        <span className="truncate text-sm text-secondary">{site.project_name}</span>
                      </td>
                      <td className="hidden px-2 py-3.5 sm:table-cell">
                        <span className="text-sm text-subtle tnum">{formatDate(site.last_seen, locale)}</span>
                      </td>
                      <td className="px-2 py-3.5">
                        <Badge tone={SITE_TONE[site.status]} dot>{ts(site.status)}</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(site.id, !site.is_favorite);
                            }}
                            aria-label={site.is_favorite ? t("actionRemoveFavorite") : t("actionAddFavorite")}
                            className={cn(
                              "rounded p-1 transition-opacity",
                              site.is_favorite ? "text-warning-text" : "text-faint opacity-0 group-hover:opacity-100 hover:text-primary",
                            )}
                          >
                            <Icon.star className={cn("h-3.5 w-3.5", site.is_favorite ? "fill-current" : null)} />
                          </button>
                          <Icon.chevronRight className="h-4 w-4 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
