"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icons";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Dropdown } from "@/components/ui/Dropdown";
import { SortMenu, type SortOption } from "@/components/ui/SortMenu";
import { FEEDBACK_STATUSES } from "@/lib/types";
import type { FeedbackStatus, Priority } from "@/lib/types";
import FeedbackCard from "./FeedbackCard";
import FeedbackDetail from "./FeedbackDetail";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

const PAGE_SIZE = 12;

type FeedbackSort = "newest" | "oldest" | "priorityDesc" | "priorityAsc";

const PRIORITY_RANK: Record<Priority, number> = { low: 0, normal: 1, high: 2 };
const FEEDBACK_SORTERS: Record<FeedbackSort, (a: FeedbackWithMeta, b: FeedbackWithMeta) => number> = {
  newest: (a, b) => b.created_at - a.created_at,
  oldest: (a, b) => a.created_at - b.created_at,
  priorityDesc: (a, b) => PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority] || b.created_at - a.created_at,
  priorityAsc: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || b.created_at - a.created_at,
};

function SelectionMark({ checked, mixed }: { checked: boolean; mixed?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
        checked
          ? "border-accent bg-accent text-white"
          : mixed
            ? "border-accent bg-accent-soft text-accent-text"
            : "border-line bg-surface text-transparent",
      )}
      aria-hidden
    >
      {mixed ? (
        <span className="h-0.5 w-2 rounded-full bg-current" />
      ) : (
        <Icon.check className="h-3 w-3" />
      )}
    </span>
  );
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
  fullWidth,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}) {
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.value === value) ?? options[0];
  const searchable = options.length > 10;
  const visibleOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchingOptions = normalizedQuery
      ? options.filter((option) => option.label.toLowerCase().includes(normalizedQuery))
      : options;
    return searchable && !normalizedQuery ? matchingOptions.slice(0, 10) : matchingOptions;
  }, [options, query, searchable]);

  return (
    <Dropdown
      role="listbox"
      align="right"
      className={cn(fullWidth && "w-full")}
      panelClassName={cn(fullWidth ? "w-full" : "w-64")}
      trigger={({ open, triggerProps }) => (
        <button
          {...triggerProps}
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-transparent px-3 text-left text-xs font-semibold text-secondary transition-colors outline-none",
            "hover:border-line-strong hover:bg-raised/60 hover:text-primary focus-visible:ring-2 focus-visible:ring-accent",
            open && "border-accent-line bg-transparent text-accent-text",
            fullWidth ? "w-full" : "min-w-40",
          )}
        >
          <span className="min-w-0 flex-1 truncate text-primary">{selected?.label}</span>
          <Icon.chevronDown className={cn("h-3.5 w-3.5 shrink-0 text-subtle transition-transform", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) => (
        <>
          {searchable && (
            <div className="p-1">
              <div className="relative">
                <Icon.search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={label}
                  className="h-8 w-full rounded-lg border border-line bg-surface pl-8 pr-2 text-xs text-primary outline-none placeholder:text-faint focus:border-accent focus:ring-2 focus:ring-accent-soft"
                />
              </div>
            </div>
          )}
          <div className="max-h-80 overflow-y-auto">
          {visibleOptions.map((option) => {
            const active = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(option.value);
                  close();
                  setQuery("");
                }}
                className={cn(
                  "flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs transition-colors outline-none",
                  active ? "bg-accent-soft font-semibold text-accent-text" : "text-secondary hover:bg-raised hover:text-primary",
                )}
              >
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {active && <Icon.check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
          {visibleOptions.length === 0 && (
            <div className="px-3 py-6 text-center text-xs text-subtle">{label}</div>
          )}
          </div>
        </>
      )}
    </Dropdown>
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

export default function FeedbacksList({
  feedbacks,
  initialId,
  initialStatus = "all",
  initialSite = "all",
}: {
  feedbacks: FeedbackWithMeta[];
  initialId: string | null;
  initialStatus?: FeedbackStatus | "all";
  initialSite?: string;
}) {
  const t = useTranslations("feedbacks");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const router = useRouter();
  const pathname = usePathname();

  const [selectedId, setSelectedId] = useState<string | null>(
    initialId && feedbacks.some((f) => f.id === initialId) ? initialId : null
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">(initialStatus);
  const [sort, setSort] = useState<FeedbackSort>("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [siteFilter, setSiteFilter] = useState(initialSite);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState(false);
  const [page, setPage] = useState(1);

  const statusCounts = useMemo(() => {
    const counts = new Map<FeedbackStatus | "all", number>([["all", feedbacks.length]]);
    for (const status of FEEDBACK_STATUSES) counts.set(status, 0);
    for (const feedback of feedbacks) counts.set(feedback.status, (counts.get(feedback.status) ?? 0) + 1);
    return counts;
  }, [feedbacks]);

  const categories = useMemo(() => {
    return Array.from(new Set(feedbacks.map((f) => f.category).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [feedbacks]);

  const sites = useMemo(() => {
    const byId = new Map<string, string>();
    for (const feedback of feedbacks) byId.set(feedback.site_id, feedback.domain);
    return Array.from(byId, ([id, domain]) => ({ id, domain })).sort((a, b) => a.domain.localeCompare(b.domain));
  }, [feedbacks]);

  const siteOptions = useMemo(() => [
    { value: "all", label: t("allSites") },
    ...sites.map((site) => ({ value: site.id, label: site.domain })),
  ], [sites, t]);

  const categoryOptions = useMemo(() => [
    { value: "all", label: t("allCategories") },
    ...categories.map((category) => ({ value: category, label: category })),
  ], [categories, t]);

  function openFeedback(id: string) {
    setSelectedId(id);
    const params = new URLSearchParams(window.location.search);
    params.set("f", id);
    router.replace(`${pathname}?${params}`, { scroll: false });
  }

  function closeFeedback() {
    setSelectedId(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("f");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeFeedback();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const open = selectedId !== null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, "");
    return feedbacks.filter((f) => {
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
      if (siteFilter !== "all" && f.site_id !== siteFilter) return false;
      if (!q) return true;
      return [
        f.id,
        f.message,
        f.domain,
        f.category,
        f.project_name,
        f.page_url,
        f.wp_user,
        f.viewport,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [categoryFilter, feedbacks, query, siteFilter, statusFilter]);
  const sorted = useMemo(() => [...filtered].sort(FEEDBACK_SORTERS[sort]), [filtered, sort]);
  const hasActiveFilters = Boolean(query.trim()) || statusFilter !== "all" || categoryFilter !== "all" || siteFilter !== "all";
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = sorted.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE;
  const pageEnd = Math.min(pageStart + PAGE_SIZE, sorted.length);
  const paginated = sorted.slice(pageStart, pageEnd);

  const sortOptions: ReadonlyArray<SortOption<FeedbackSort>> = [
    { key: "newest", label: t("sortNewest") },
    { key: "oldest", label: t("sortOldest") },
    { key: "priorityDesc", label: t("sortPriorityDesc") },
    { key: "priorityAsc", label: t("sortPriorityAsc") },
  ];

  useEffect(() => {
    setPage(1);
  }, [categoryFilter, feedbacks.length, query, siteFilter, statusFilter, sort]);

  function setStatus(next: FeedbackStatus | "all") {
    setStatusFilter(next);
    setSelectedIds(new Set());
    const params = new URLSearchParams(window.location.search);
    if (next === "all") params.delete("status");
    else params.set("status", next);
    params.delete("f");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function clearFilters() {
    setQuery("");
    setCategoryFilter("all");
    setSiteFilter("all");
    setStatusFilter("all");
    setSelectedIds(new Set());
    const params = new URLSearchParams(window.location.search);
    params.delete("status");
    params.delete("site");
    params.delete("f");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const selectedFeedbacks = feedbacks.filter((f) => selectedIds.has(f.id));
  const allSelected = paginated.length > 0 && paginated.every((f) => selectedIds.has(f.id));
  const filteredSelectedCount = paginated.filter((f) => selectedIds.has(f.id)).length;
  const someFilteredSelected = filteredSelectedCount > 0;
  const availableBulkStatuses = FEEDBACK_STATUSES.filter(
    (status) => selectedFeedbacks.length > 0 && !selectedFeedbacks.every((f) => f.status === status),
  );

  function toggleAll() {
    setSelectedIds((prev) => {
      if (paginated.every((f) => prev.has(f.id))) {
        const next = new Set(prev);
        for (const f of paginated) next.delete(f.id);
        return next;
      }
      const next = new Set(prev);
      for (const f of paginated) next.add(f.id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  async function applyStatus(status: FeedbackStatus) {
    const ids = [...selectedIds];
    if (!ids.length) return;
    setApplying(true);
    try {
      const res = await fetch("/api/admin/feedbacks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status }),
      });
      if (res.ok) {
        clearSelection();
        router.refresh();
      }
    } finally {
      setApplying(false);
    }
  }

  async function toggleFavorite(id: string, next: boolean) {
    await fetch(`/api/admin/feedbacks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_favorite: next }),
    });
    router.refresh();
  }

  async function deleteOne(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/admin/feedbacks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      router.refresh();
    }
  }

  if (open && selectedId) {
    return (
      <div className="ds-fade-in h-full min-h-0" role="region" aria-label={t("detailRegion")}>
        <FeedbackDetail
          key={selectedId}
          id={selectedId}
          onClose={closeFeedback}
          onDeleted={closeFeedback}
        />
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 space-y-2.5">
        <div className="flex flex-col items-start gap-3 xl:flex-row xl:items-center">
          <div className="relative min-w-0 flex-1">
            <Icon.search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-9 rounded-lg border-line bg-transparent pl-9 pr-3 text-sm shadow-none"
              aria-label={t("searchLabel")}
            />
          </div>

          <div className="flex w-full items-center gap-2 xl:w-auto xl:shrink-0">
            <Dropdown
              role="menu"
              align="right"
              panelClassName="w-56"
              trigger={({ open, triggerProps }) => (
                <button
                  {...triggerProps}
                  aria-label={t("statusFilter")}
                  className={cn(
                    "relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-transparent text-secondary transition-colors outline-none",
                    "hover:border-line-strong hover:bg-raised/60 hover:text-primary focus-visible:ring-2 focus-visible:ring-accent",
                    (open || statusFilter !== "all") && "border-accent-line bg-accent-soft text-accent-text",
                  )}
                >
                  <Icon.checkCircle className="h-4 w-4" />
                  {statusFilter !== "all" && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-base bg-accent" />
                  )}
                </button>
              )}
            >
              {(close) =>
                (["all", ...FEEDBACK_STATUSES] as Array<FeedbackStatus | "all">).map((status) => {
                  const active = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      role="menuitemradio"
                      aria-checked={active}
                      onClick={() => {
                        setStatus(status);
                        close();
                      }}
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
                })
              }
            </Dropdown>
            <SortMenu
              label={t("sortLabel")}
              value={sort}
              onChange={setSort}
              options={sortOptions}
            />
            <FilterPopover
              label={t("filters")}
              active={categoryFilter !== "all" || siteFilter !== "all"}
              count={[categoryFilter !== "all", siteFilter !== "all"].filter(Boolean).length}
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-faint">{t("siteFilter")}</span>
                <FilterDropdown
                  label={t("siteFilter")}
                  value={siteFilter}
                  options={siteOptions}
                  onChange={(next) => {
                    setSiteFilter(next);
                    setSelectedIds(new Set());
                    const params = new URLSearchParams(window.location.search);
                    if (next === "all") params.delete("site");
                    else params.set("site", next);
                    params.delete("f");
                    const qs = params.toString();
                    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
                  }}
                  fullWidth
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-faint">{t("categoryFilter")}</span>
                <FilterDropdown
                  label={t("categoryFilter")}
                  value={categoryFilter}
                  options={categoryOptions}
                  onChange={(next) => {
                    setCategoryFilter(next);
                    setSelectedIds(new Set());
                  }}
                  fullWidth
                />
              </div>
            </FilterPopover>

            {(query || categoryFilter !== "all" || siteFilter !== "all" || statusFilter !== "all") && (
              <button
                type="button"
                onClick={clearFilters}
                aria-label={t("clearFilters")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-transparent text-subtle transition-colors hover:border-line-strong hover:bg-raised/60 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Icon.close className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-raised">
            <Icon.inbox className="h-4 w-4 text-subtle" />
          </div>
          <p className="text-sm text-secondary">
            {query ? t("noMatch", { query }) : t("noneForFilter")}
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3"
          role="list"
          aria-label={t("listLabel")}
        >
          {paginated.map((f) => (
            <div key={f.id} role="listitem" className="group/item relative">
              <FeedbackCard
                feedback={f}
                selected={selectedIds.has(f.id)}
                onOpen={() => openFeedback(f.id)}
                onToggleSelect={() => toggle(f.id)}
                onToggleFavorite={() => toggleFavorite(f.id, !f.is_favorite)}
                onDelete={() => deleteOne(f.id)}
              />
            </div>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-4">
          <span className="text-xs font-medium text-subtle">
            {hasActiveFilters
              ? t("filteredPaginationSummary", {
                  start: pageStart + 1,
                  end: pageEnd,
                  filtered: filtered.length,
                  total: feedbacks.length,
                })
              : t("paginationSummary", { start: pageStart + 1, end: pageEnd, total: filtered.length })}
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

      {selectedIds.size > 0 && (
        <div className="sticky bottom-4 mt-4 flex flex-wrap items-center gap-4 rounded-xl border-2 border-accent-line bg-surface/95 px-4 py-3 shadow-pop backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-accent-line bg-accent-soft text-accent-text">
              <Icon.check className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold text-primary">{t("bulkActions")}</span>
                <span className="rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-text tnum">
                  {t("selectedCount", { count: selectedIds.size })}
                </span>
              </div>
              <div className="text-xs text-subtle">
                {t("selectedStatusHint")}
              </div>
            </div>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {selectedIds.size === 1 && (
              <Button
                size="sm"
                variant="outline"
                disabled={applying}
                onClick={() => openFeedback([...selectedIds][0])}
                className="rounded-lg"
              >
                {t("openSelected")}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={applying || paginated.length === 0}
              onClick={toggleAll}
              className="rounded-lg"
            >
              <SelectionMark checked={allSelected} mixed={!allSelected && someFilteredSelected} />
              {allSelected ? t("selectedVisible") : t("selectVisible")}
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
                variant={status === "wontfix" ? "danger" : "secondary"}
                disabled={applying}
                onClick={() => applyStatus(status)}
                className="rounded-lg"
              >
                {ts(status)}
              </Button>
            ))}
          </div>
          <button
            onClick={clearSelection}
            disabled={applying}
            className="rounded-md px-2 py-1.5 text-xs text-subtle transition-colors hover:bg-surface hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50"
          >
            {t("clearSelection")}
          </button>
        </div>
      )}
    </>
  );
}
