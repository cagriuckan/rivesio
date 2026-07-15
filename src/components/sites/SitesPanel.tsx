"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import type { SortOption } from "@/components/ui/SortMenu";
import type { SiteStatus } from "@/lib/types";
import type { SiteWithCounts } from "@/lib/admin-repo";
import SitesList from "./SitesList";
import SiteDetailsPanel from "./SiteDetailsPanel";

const SITE_STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

export type SiteSort = "recent" | "oldest" | "domainAsc" | "domainDesc" | "feedbackDesc" | "feedbackAsc";

const siteName = (s: SiteWithCounts) => (s.label || s.domain).toLowerCase();
const SITE_SORTERS: Record<SiteSort, (a: SiteWithCounts, b: SiteWithCounts) => number> = {
  recent: (a, b) => b.last_seen - a.last_seen,
  oldest: (a, b) => a.last_seen - b.last_seen,
  domainAsc: (a, b) => siteName(a).localeCompare(siteName(b)),
  domainDesc: (a, b) => siteName(b).localeCompare(siteName(a)),
  feedbackDesc: (a, b) => b.feedback_count - a.feedback_count || b.last_seen - a.last_seen,
  feedbackAsc: (a, b) => a.feedback_count - b.feedback_count || b.last_seen - a.last_seen,
};

function StatCard({
  label,
  value,
  meta,
  bars,
  barTone = "bg-line-strong",
  lastBarTone = "bg-success",
}: {
  label: string;
  value: number | string;
  meta: string;
  bars: number[];
  barTone?: string;
  lastBarTone?: string;
}) {
  const max = Math.max(1, ...bars);
  return (
    <div className="flex items-end justify-between gap-4 rounded-2xl border border-line bg-surface p-5">
      <div className="min-w-0">
        <p className="font-mono text-[11px] font-medium uppercase tracking-widest text-subtle">{label}</p>
        <p className="mt-3 text-4xl font-extrabold leading-none tracking-tight text-strong tnum">{value}</p>
        <p className="mt-2.5 truncate text-xs text-subtle">{meta}</p>
      </div>
      <div className="flex h-16 shrink-0 items-end gap-1" aria-hidden>
        {bars.map((v, i) => (
          <span
            key={i}
            className={cn("w-1.5 rounded-full", i === bars.length - 1 ? lastBarTone : barTone)}
            style={{ height: `${Math.max(12, Math.round((v / max) * 100))}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function QuickAddBanner({ projects }: { projects: { id: string; name: string }[] }) {
  const t = useTranslations("sites");
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add() {
    if (!projectId || !domain.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, domain: domain.trim() }),
      });
      if (res.ok) {
        setDomain("");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d?.error === "site_exists" ? t("addExists") : t("addError"));
      }
    } finally {
      setBusy(false);
    }
  }

  if (projects.length === 0) return null;

  return (
    <div className="rounded-2xl border border-line bg-raised/60 p-4 sm:p-5">
      <p className="flex items-center gap-2 text-sm font-medium text-secondary">
        <Icon.sparkles className="h-4 w-4 text-accent" />
        {t("quickAddTitle")}
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          placeholder={t("quickAddPlaceholder")}
          aria-label={t("addSite")}
          className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-surface px-4 text-sm text-primary placeholder:text-faint outline-none transition-colors focus:border-accent-line focus:ring-2 focus:ring-accent-soft"
        />
        {projects.length > 1 && (
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            aria-label={t("colWidget")}
            className="h-10 rounded-xl border border-line bg-surface px-3 text-sm text-primary outline-none"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
        <Button type="button" variant="primary" onClick={add} disabled={busy || !domain.trim()} className="h-10 rounded-xl">
          <Icon.plus className="h-4 w-4" />
          {t("addSite")}
        </Button>
      </div>
      {error && <p className="mt-2 text-xs text-danger-text">{error}</p>}
    </div>
  );
}

type MobilePane = "list" | "detail";

export default function SitesPanel({
  sites,
  projects = [],
  initialStatus = "all",
  initialSelectedId,
}: {
  sites: SiteWithCounts[];
  projects?: { id: string; name: string }[];
  initialStatus?: SiteStatus | "all";
  initialSelectedId?: string | null;
}) {
  const t = useTranslations("sites");
  const ts = useTranslations("siteStatus");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<SiteStatus | "all">(initialStatus);
  const [sort, setSort] = useState<SiteSort>("recent");
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId ?? null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSelectedId((cur) => (cur && sites.some((s) => s.id === cur) ? cur : null));
  }, [sites]);

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
  const sortedSites = useMemo(() => [...filteredSites].sort(SITE_SORTERS[sort]), [filteredSites, sort]);

  const totalFeedback = sites.reduce((sum, s) => sum + s.feedback_count, 0);
  const feedbackBars = useMemo(
    () => [...sites].sort((a, b) => a.feedback_count - b.feedback_count).slice(-7).map((s) => s.feedback_count),
    [sites],
  );
  const activityBars = useMemo(
    () => [...sites].sort((a, b) => a.last_seen - b.last_seen).slice(-7).map((s) => s.feedback_count + 1),
    [sites],
  );

  const sortOptions: ReadonlyArray<SortOption<SiteSort>> = [
    { key: "recent", label: t("sortRecent") },
    { key: "oldest", label: t("sortOldest") },
    { key: "domainAsc", label: t("sortDomainAsc") },
    { key: "domainDesc", label: t("sortDomainDesc") },
    { key: "feedbackDesc", label: t("sortFeedbackDesc") },
    { key: "feedbackAsc", label: t("sortFeedbackAsc") },
  ];

  const selectedIds = Array.from(selected);
  const selectedSites = sites.filter((site) => selected.has(site.id));
  const availableBulkStatuses = SITE_STATUSES.filter(
    (status) => selectedSites.length > 0 && !selectedSites.every((site) => site.status === status),
  );
  const selectedSite = sites.find((s) => s.id === selectedId) ?? null;

  function selectStatus(next: SiteStatus | "all") {
    setStatusFilter(next);
    const params = new URLSearchParams(window.location.search);
    if (next === "all") params.delete("status");
    else params.set("status", next);
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }

  function select(id: string) {
    setSelectedId(id);
    const params = new URLSearchParams(window.location.search);
    params.set("s", id);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }

  function closeDetails() {
    setSelectedId(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("s");
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }

  function toggleSelect(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
      if (selectedId === id) closeDetails();
      router.refresh();
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  }

  async function deleteSelectedSites() {
    if (selectedIds.length === 0 || !confirm(t("confirmDeleteSite"))) return;
    setBusyIds((current) => new Set([...current, ...selectedIds]));
    try {
      const results = await Promise.all(
        selectedIds.map((id) => fetch(`/api/admin/sites/${id}`, { method: "DELETE" })),
      );
      const deletedIds = selectedIds.filter((_, index) => results[index]?.ok);
      setSelected((current) => {
        const next = new Set(current);
        deletedIds.forEach((id) => next.delete(id));
        return next;
      });
      if (selectedId && deletedIds.includes(selectedId)) closeDetails();
      router.refresh();
    } finally {
      setBusyIds((current) => {
        const next = new Set(current);
        selectedIds.forEach((id) => next.delete(id));
        return next;
      });
    }
  }

  return (
    <div className="relative h-full min-h-0 overflow-y-aut">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        {/* Stat cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label={t("statsMonitored")}
            value={sites.length}
            meta={t("statsMonitoredMeta", { count: statusCounts.get("approved") ?? 0 })}
            bars={activityBars.length > 0 ? activityBars : [1]}
            lastBarTone="bg-accent"
          />
          <StatCard
            label={t("statsFeedback")}
            value={totalFeedback}
            meta={t("statsFeedbackMeta")}
            bars={feedbackBars.length > 0 ? feedbackBars : [1]}
            lastBarTone="bg-success"
          />
          <StatCard
            label={t("statsPending")}
            value={statusCounts.get("pending") ?? 0}
            meta={t("statsPendingMeta")}
            bars={activityBars.length > 0 ? [...activityBars].reverse() : [1]}
            lastBarTone="bg-warning"
          />
        </div>

        {/* Quick add */}
        <QuickAddBanner projects={projects} />

        {/* Table */}
        <SitesList
          items={sortedSites}
          selectedId={selectedId}
          statusFilter={statusFilter}
          onStatusFilter={selectStatus}
          statusCounts={statusCounts}
          query={query}
          onQuery={setQuery}
          sort={sort}
          onSort={setSort}
          sortOptions={sortOptions}
          selected={selected}
          onToggleSelect={toggleSelect}
          onSelect={select}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Details drawer */}
      {selectedSite && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]" onClick={closeDetails} />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-base shadow-pop"
          >
            <div className="flex h-11 shrink-0 items-center justify-between border-b border-line px-3">
              <span className="text-xs font-semibold text-subtle">{t("title")}</span>
              <button
                onClick={closeDetails}
                aria-label={t("closeDetails")}
                className="rounded-md p-1.5 text-subtle transition-colors hover:bg-raised hover:text-primary"
              >
                <Icon.close className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <SiteDetailsPanel
                site={selectedSite}
                onChangeStatus={(status) => updateSites([selectedSite.id], status)}
                onToggleFavorite={() => toggleFavorite(selectedSite.id, !selectedSite.is_favorite)}
                onDelete={() => deleteSite(selectedSite.id)}
              />
            </div>
          </div>
        </>
      )}

      {selectedIds.length > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-2xl flex-wrap items-center gap-2 rounded-xl border border-line bg-surface/95 px-3 py-2 shadow-pop backdrop-blur">
          <div className="flex min-w-0 items-center gap-2 pr-1">
            <span className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
              <Icon.check className="h-3.5 w-3.5" />
            </span>
            <span className="rounded-full border border-line bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent-text tnum">
              {t("selectedCount", { count: selectedIds.length })}
            </span>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            <Dropdown
              role="menu"
              align="right"
              panelClassName="w-48"
              trigger={({ open, triggerProps }) => (
                <button
                  {...triggerProps}
                  type="button"
                  disabled={busyIds.size > 0}
                  aria-label={t("changeStatus")}
                  className={cn(
                    "inline-flex h-7 items-center gap-2 rounded-lg bg-raised px-3 text-xs font-semibold text-secondary ring-1 ring-line transition-colors outline-none",
                    "hover:bg-line hover:text-primary focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-45",
                    open && "bg-accent-soft text-accent-text ring-accent-line",
                  )}
                >
                  <Icon.checkCircle className="h-3.5 w-3.5 text-subtle" />
                  {t("colStatus")}
                  <Icon.chevronDown className={cn("h-3.5 w-3.5 text-subtle transition-transform", open && "rotate-180")} />
                </button>
              )}
            >
              {(close) => (
                <>
                  {availableBulkStatuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        updateSites(selectedIds, status);
                        close();
                      }}
                      className={cn(
                        "flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-xs transition-colors outline-none",
                        status === "blocked"
                          ? "text-danger-text hover:bg-danger-soft"
                          : "text-secondary hover:bg-raised hover:text-primary",
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-line-strong" aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{ts(status)}</span>
                    </button>
                  ))}
                </>
              )}
            </Dropdown>
            <span className="hidden h-6 w-px bg-line-strong sm:block" aria-hidden />
            <Button size="sm" variant="danger" disabled={busyIds.size > 0} onClick={deleteSelectedSites} className="rounded-lg">
              <Icon.trash className="h-3.5 w-3.5" />
              {t("actionDelete")}
            </Button>
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
    </div>
  );
}
