"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icons";
import { Checkbox, Input, Select } from "@/components/ui/Field";
import { FEEDBACK_STATUSES } from "@/lib/types";
import type { FeedbackStatus } from "@/lib/types";
import FeedbackCard from "./FeedbackCard";
import FeedbackDetail from "./FeedbackDetail";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

export default function FeedbacksList({
  feedbacks,
  initialId,
  filterBar,
}: {
  feedbacks: FeedbackWithMeta[];
  initialId: string | null;
  filterBar?: React.ReactNode;
}) {
  const t = useTranslations("feedbacks");
  const ts = useTranslations("status");
  const router = useRouter();
  const pathname = usePathname();

  const [selectedId, setSelectedId] = useState<string | null>(
    initialId && feedbacks.some((f) => f.id === initialId) ? initialId : null
  );
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [applying, setApplying] = useState(false);

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

  const filtered = query.trim()
    ? feedbacks.filter((f) => f.id.startsWith(query.trim().replace(/^#/, "")))
    : feedbacks;

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allSelected = filtered.length > 0 && filtered.every((f) => selectedIds.has(f.id));

  function toggleAll() {
    setSelectedIds((prev) => {
      if (filtered.every((f) => prev.has(f.id))) {
        const next = new Set(prev);
        for (const f of filtered) next.delete(f.id);
        return next;
      }
      const next = new Set(prev);
      for (const f of filtered) next.add(f.id);
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

  if (open && selectedId) {
    return (
      <div className="ds-fade-in" role="region" aria-label={t("detailRegion")}>
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
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {filtered.length > 0 && (
          <label className="flex cursor-pointer items-center gap-2 text-xs text-subtle">
            <Checkbox
              checked={allSelected}
              onChange={toggleAll}
              aria-label={t("selectAll")}
            />
            {t("selectAll")}
          </label>
        )}
        {filterBar}
        <div className="relative ml-auto">
          <Icon.search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-8 w-48 rounded-md pl-8 pr-3 text-xs shadow-none"
            aria-label={t("searchLabel")}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised">
            <Icon.inbox className="h-5 w-5 text-subtle" />
          </div>
          <p className="text-sm text-secondary">
            {query ? t("noMatch", { query }) : t("noneForFilter")}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3" role="list" aria-label={t("listLabel")}>
          {filtered.map((f) => (
            <div key={f.id} role="listitem" className="flex items-start gap-3">
              <Checkbox
                checked={selectedIds.has(f.id)}
                onChange={() => toggle(f.id)}
                className="mt-5"
                aria-label={t("selectItem")}
              />
              <div className="min-w-0 flex-1">
                <FeedbackCard
                  feedback={f}
                  selected={false}
                  compact={false}
                  onClick={() => openFeedback(f.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedIds.size > 0 && (
        <div className="sticky bottom-4 mt-4 flex items-center gap-3 rounded-xl border border-line-strong bg-raised px-4 py-3 shadow-lg">
          <span className="text-sm font-medium text-primary">
            {t("selectedCount", { count: selectedIds.size })}
          </span>
          <div className="ml-auto">
            <Select
              defaultValue=""
              disabled={applying}
              onChange={(e) => {
                if (e.target.value) applyStatus(e.target.value as FeedbackStatus);
                e.target.value = "";
              }}
              className="h-9 rounded-md text-sm shadow-none"
              aria-label={t("changeStatus")}
            >
              <option value="" disabled>
                {applying ? t("applying") : t("changeStatus")}
              </option>
              {FEEDBACK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {ts(s)}
                </option>
              ))}
            </Select>
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
