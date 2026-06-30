"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, SITE_TONE } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icons";
import { Card } from "@/components/ui/Card";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Dropdown } from "@/components/ui/Dropdown";
import { SortMenu, type SortOption } from "@/components/ui/SortMenu";
import { cn } from "@/components/ui/cn";
import { formatDate } from "@/lib/labels";
import type { SiteStatus } from "@/lib/types";
import type { SiteWithCounts } from "@/lib/admin-repo";

const SITE_STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];
const PAGE_SIZE = 10;

type SiteSort = "recent" | "oldest" | "domainAsc" | "domainDesc" | "feedbackDesc" | "feedbackAsc";

const siteName = (s: SiteWithCounts) => (s.label || s.domain).toLowerCase();
const SITE_SORTERS: Record<SiteSort, (a: SiteWithCounts, b: SiteWithCounts) => number> = {
  recent: (a, b) => b.last_seen - a.last_seen,
  oldest: (a, b) => a.last_seen - b.last_seen,
  domainAsc: (a, b) => siteName(a).localeCompare(siteName(b)),
  domainDesc: (a, b) => siteName(b).localeCompare(siteName(a)),
  feedbackDesc: (a, b) => b.feedback_count - a.feedback_count || b.last_seen - a.last_seen,
  feedbackAsc: (a, b) => a.feedback_count - b.feedback_count || b.last_seen - a.last_seen,
};

function SelectionMark({ selected, mixed }: { selected: boolean; mixed?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
        selected
          ? "border-accent bg-accent text-white shadow-sm"
          : mixed
            ? "border-accent bg-accent-soft text-accent-text"
            : "border-line-strong bg-surface text-transparent group-hover:border-accent-line",
      )}
      aria-hidden
    >
      {mixed ? <span className="h-0.5 w-2 rounded-full bg-current" /> : <Icon.check className="h-3.5 w-3.5" />}
    </span>
  );
}

function FilterPopover({
  active,
  count,
  label,
  children,
}: {
  active: boolean;
  count: number;
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={label}
        className={cn(
          "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-transparent text-secondary transition-colors outline-none",
          "hover:border-line-strong hover:bg-raised/60 hover:text-primary focus-visible:ring-2 focus-visible:ring-accent",
          (open || active) && "border-accent-line bg-accent-soft text-accent-text",
        )}
      >
        <Icon.listFilter className="h-4 w-4" />
        {active && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute right-0 top-11 z-30 w-72 space-y-3 rounded-xl border border-line bg-surface p-3 shadow-pop"
        >
          {children}
        </div>
      )}
    </div>
  );
}

function SiteActionMenu({
  id,
  status,
  isSelected,
  isFavorite,
  disabled,
  onChangeStatus,
  onToggleSelect,
  onToggleFavorite,
  onRename,
  onDelete,
}: {
  id: string;
  status: SiteStatus;
  isSelected: boolean;
  isFavorite: boolean;
  disabled: boolean;
  onChangeStatus: (id: string, status: SiteStatus) => void;
  onToggleSelect: () => void;
  onToggleFavorite: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("sites");

  const statusOptions: Array<{ label: string; status: SiteStatus }> =
    status === "approved"
      ? [{ label: t("block"), status: "blocked" }]
      : status === "blocked"
        ? [
            { label: t("approve"), status: "approved" },
            { label: t("unblock"), status: "pending" },
          ]
        : [
            { label: t("approve"), status: "approved" },
            { label: t("block"), status: "blocked" },
          ];

  return (
    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
      <ActionMenu
        label={t("actions")}
        disabled={disabled}
        groups={[
          statusOptions.map((option) => ({
            key: option.status,
            label: option.label,
            icon: Icon.checkCircle,
            onSelect: () => onChangeStatus(id, option.status),
          })),
          [
            { key: "select", label: isSelected ? t("actionUnselect") : t("actionSelect"), icon: Icon.check, onSelect: onToggleSelect },
            {
              key: "favorite",
              label: isFavorite ? t("actionRemoveFavorite") : t("actionAddFavorite"),
              icon: Icon.star,
              onSelect: onToggleFavorite,
            },
            { key: "rename", label: t("actionRename"), icon: Icon.edit, onSelect: onRename },
          ],
          [{ key: "delete", label: t("actionDelete"), icon: Icon.trash, onSelect: onDelete, danger: true }],
        ]}
      />
    </div>
  );
}

export default function SitesTable({ sites, initialStatus = "all" }: { sites: SiteWithCounts[]; initialStatus?: SiteStatus | "all" }) {
  const t = useTranslations("sites");
  const tc = useTranslations("common");
  const ts = useTranslations("siteStatus");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SiteStatus | "all">(initialStatus);
  const [sort, setSort] = useState<SiteSort>("recent");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [renamingSite, setRenamingSite] = useState<{ id: string; value: string } | null>(null);

  const statusCounts = useMemo(() => {
    const counts = new Map<SiteStatus | "all", number>([["all", sites.length]]);
    for (const status of SITE_STATUSES) counts.set(status, 0);
    for (const site of sites) counts.set(site.status, (counts.get(site.status) ?? 0) + 1);
    return counts;
  }, [sites]);

  const filteredSites = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sites.filter((site) =>
      (statusFilter === "all" || site.status === statusFilter) &&
      (!q || [site.domain, site.label, site.project_name, site.status, site.id]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))),
    );
  }, [query, sites, statusFilter]);
  const sortedSites = useMemo(
    () => [...filteredSites].sort(SITE_SORTERS[sort]),
    [filteredSites, sort],
  );
  const hasActiveFilters = Boolean(query.trim()) || statusFilter !== "all";
  const totalPages = Math.max(1, Math.ceil(sortedSites.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = sortedSites.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, sortedSites.length);
  const paginatedSites = sortedSites.slice(pageStart, pageEnd);

  const sortOptions: ReadonlyArray<SortOption<SiteSort>> = [
    { key: "recent", label: t("sortRecent") },
    { key: "oldest", label: t("sortOldest") },
    { key: "domainAsc", label: t("sortDomainAsc") },
    { key: "domainDesc", label: t("sortDomainDesc") },
    { key: "feedbackDesc", label: t("sortFeedbackDesc") },
    { key: "feedbackAsc", label: t("sortFeedbackAsc") },
  ];

  useEffect(() => {
    setPage(1);
  }, [query, sites.length, statusFilter, sort]);

  const selectedIds = Array.from(selected);
  const allFilteredSelected = paginatedSites.length > 0 && paginatedSites.every((site) => selected.has(site.id));
  const filteredSelectedCount = paginatedSites.filter((site) => selected.has(site.id)).length;
  const someFilteredSelected = filteredSelectedCount > 0;
  const selectedSites = sites.filter((site) => selected.has(site.id));
  const availableBulkStatuses = SITE_STATUSES.filter(
    (status) => selectedSites.length > 0 && !selectedSites.every((site) => site.status === status),
  );

  function setStatus(next: SiteStatus | "all") {
    setStatusFilter(next);
    setSelected(new Set());
    const params = new URLSearchParams(window.location.search);
    if (next === "all") params.delete("status");
    else params.set("status", next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllFiltered() {
    setSelected((current) => {
      const next = new Set(current);
      if (allFilteredSelected) paginatedSites.forEach((site) => next.delete(site.id));
      else paginatedSites.forEach((site) => next.add(site.id));
      return next;
    });
  }

  function clearSelection() {
    setSelected(new Set());
  }

  async function updateSites(ids: string[], status: SiteStatus) {
    if (ids.length === 0) return;
    setBusyIds((current) => new Set([...current, ...ids]));
    try {
      await Promise.all(ids.map((id) =>
        fetch(`/api/admin/sites/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }),
      ));
      setSelected((current) => {
        const next = new Set(current);
        ids.forEach((id) => next.delete(id));
        return next;
      });
      router.refresh();
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  }

  async function toggleFavorite(id: string, next: boolean) {
    setBusyIds((current) => new Set(current).add(id));
    try {
      await fetch(`/api/admin/sites/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: next }),
      });
      router.refresh();
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  async function renameSite(id: string, label: string) {
    setBusyIds((current) => new Set(current).add(id));
    try {
      await fetch(`/api/admin/sites/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: label.trim() || null }),
      });
      router.refresh();
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  async function deleteSite(id: string) {
    if (!confirm(t("confirmDeleteSite"))) return;
    setBusyIds((current) => new Set(current).add(id));
    try {
      await fetch(`/api/admin/sites/${id}`, { method: "DELETE" });
      setSelected((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      router.refresh();
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 space-y-2.5">
        <div className="flex flex-col items-start gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              className="h-9 rounded-lg border-line bg-transparent pl-9 pr-3 text-sm shadow-none"
            />
          </div>
          <div className="flex w-full items-center gap-2 xl:w-auto xl:shrink-0">
            <SortMenu
              label={t("sortLabel")}
              value={sort}
              onChange={setSort}
              options={sortOptions}
            />
            <FilterPopover
              label={t("filters")}
              active={statusFilter !== "all"}
              count={statusFilter !== "all" ? 1 : 0}
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-faint">{t("colStatus")}</span>
                <div className="space-y-1">
                  {(["all", ...SITE_STATUSES] as Array<SiteStatus | "all">).map((status) => {
                    const active = statusFilter === status;
                    return (
                      <button
                        key={status}
                        type="button"
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => setStatus(status)}
                        className={cn(
                          "flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs transition-colors outline-none",
                          active ? "bg-accent-soft font-semibold text-accent-text" : "text-secondary hover:bg-raised hover:text-primary",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">{status === "all" ? tc("all") : ts(status)}</span>
                        <span className={cn("rounded-full border px-1.5 py-0.5 text-xs tnum", active ? "border-accent-line text-accent-text" : "border-line text-subtle")}>
                          {statusCounts.get(status) ?? 0}
                        </span>
                        {active && <Icon.check className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </FilterPopover>
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("clearFilters")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-transparent text-subtle transition-colors hover:border-line-strong hover:bg-raised/60 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Icon.close className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {filteredSites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface py-24 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-raised">
            <Icon.search className="h-4 w-4 text-subtle" />
          </div>
          <p className="text-sm font-medium text-secondary">{query.trim() ? t("noMatch") : t("empty")}</p>
        </div>
      ) : (
        <Card className="overflow-visible">
          <div className="overflow-visible">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  {[t("colDomain"), t("colWidget"), t("colFeedback"), t("colLastSeen"), t("colStatus"), ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-subtle">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedSites.map((site) => {
                  const isSelected = selected.has(site.id);
                  const busy = busyIds.has(site.id);
                  return (
                    <tr
                      key={site.id}
                      onClick={() => toggle(site.id)}
                      className={cn(
                        "cursor-pointer border-b border-line-soft transition-colors last:border-0 hover:bg-raised",
                        isSelected && "bg-accent-soft/45",
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={site.domain} size="sm" />
                          <span className="text-sm font-medium text-primary">{site.label || site.domain}</span>
                          {Boolean(site.is_favorite) && <Icon.star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-subtle">{site.project_name}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/feedbacks?site=${site.id}`);
                          }}
                          className="rounded-md px-2 py-1 text-sm font-semibold text-secondary transition-colors hover:bg-accent-soft hover:text-accent-text outline-none focus-visible:ring-2 focus-visible:ring-accent tnum"
                          aria-label={t("viewSiteFeedbacks")}
                        >
                          {site.feedback_count}
                        </button>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-subtle">{formatDate(site.last_seen, locale)}</td>
                      <td className="px-4 py-3">
                        <Badge tone={SITE_TONE[site.status]} dot>{ts(site.status)}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div onClick={(e) => e.stopPropagation()}>
                          <SiteActionMenu
                            id={site.id}
                            status={site.status}
                            isSelected={isSelected}
                            isFavorite={Boolean(site.is_favorite)}
                            disabled={busy}
                            onChangeStatus={(id, next) => updateSites([id], next)}
                            onToggleSelect={() => toggle(site.id)}
                            onToggleFavorite={() => toggleFavorite(site.id, !site.is_favorite)}
                            onRename={() => setRenamingSite({ id: site.id, value: site.label || site.domain })}
                            onDelete={() => deleteSite(site.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {filteredSites.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
          <span className="text-xs font-medium text-subtle">
            {hasActiveFilters
              ? t("filteredPaginationSummary", {
                  start: pageStart + 1,
                  end: pageEnd,
                  filtered: filteredSites.length,
                  total: sites.length,
                })
              : t("paginationSummary", { start: pageStart + 1, end: pageEnd, total: filteredSites.length })}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-lg"
            >
              <Icon.chevronLeft className="h-3.5 w-3.5" />
              {t("previousPage")}
            </Button>
            <span className="rounded-lg border border-line px-2.5 py-1.5 text-xs font-semibold text-secondary">
              {t("pageIndicator", { page: currentPage, pages: totalPages })}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="rounded-lg"
            >
              {t("nextPage")}
              <Icon.chevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="sticky bottom-4 mt-4 flex flex-wrap items-center gap-4 rounded-xl border-2 border-accent-line bg-surface/95 px-4 py-3 shadow-pop backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent-text">
              <Icon.check className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-primary">{t("bulkActions")}</span>
                <span className="rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-text tnum">
                  {t("selectedCount", { count: selectedIds.length })}
                </span>
              </div>
              <div className="text-xs text-subtle">
                {t("selectedStatusHint")}
              </div>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={busyIds.size > 0 || paginatedSites.length === 0}
              onClick={toggleAllFiltered}
              className="rounded-lg"
            >
              <SelectionMark selected={allFilteredSelected} mixed={!allFilteredSelected && someFilteredSelected} />
              {allFilteredSelected ? t("selectedVisible") : t("selectVisible")}
              {someFilteredSelected && (
                <span className="rounded-full border border-line px-1.5 py-0.5 text-xs text-subtle tnum">
                  {filteredSelectedCount}
                </span>
              )}
            </Button>
            <span className="hidden h-6 w-px bg-line-strong sm:block" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider text-faint">
              {t("changeStatus")}
            </span>
            {availableBulkStatuses.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={status === "blocked" ? "danger" : "secondary"}
                disabled={busyIds.size > 0}
                onClick={() => updateSites(selectedIds, status)}
                className="rounded-lg"
              >
                {ts(status)}
              </Button>
            ))}
          </div>
          <button
            onClick={clearSelection}
            disabled={busyIds.size > 0}
            className="rounded-md px-2 py-1.5 text-xs text-subtle transition-colors hover:bg-surface hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
          >
            {t("clearSelection")}
          </button>
        </div>
      )}

      {renamingSite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setRenamingSite(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-line bg-surface p-4 shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-3 text-sm font-semibold text-primary">{t("renameTitle")}</h3>
            <Input
              autoFocus
              value={renamingSite.value}
              onChange={(e) => setRenamingSite({ ...renamingSite, value: e.target.value })}
              placeholder={t("renamePlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  renameSite(renamingSite.id, renamingSite.value);
                  setRenamingSite(null);
                }
              }}
              className="h-9 rounded-lg text-sm"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRenamingSite(null)} className="rounded-lg">
                {tc("cancel")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  renameSite(renamingSite.id, renamingSite.value);
                  setRenamingSite(null);
                }}
                className="rounded-lg"
              >
                {tc("save")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
