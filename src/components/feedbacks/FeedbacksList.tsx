"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icons";
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
  const [selectedId, setSelectedId] = useState<string | null>(
    initialId && feedbacks.some((f) => f.id === initialId) ? initialId : null
  );
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = selectedId !== null;

  const filtered = query.trim()
    ? feedbacks.filter((f) => f.id.startsWith(query.trim().replace(/^#/, "")))
    : feedbacks;

  if (open && selectedId) {
    return (
      <div className="ds-fade-in" role="region" aria-label="Geri bildirim detayı">
        <FeedbackDetail
          key={selectedId}
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onDeleted={() => setSelectedId(null)}
        />
      </div>
    );
  }

  return (
    <>
      {/* Toolbar: filter tabs + search */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {filterBar}
        <div className="relative ml-auto">
          <Icon.search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ID ile ara…"
            className="h-8 w-48 rounded-md border border-line bg-surface pl-8 pr-3 text-xs text-primary placeholder:text-faint outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            aria-label="ID ile ara"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised">
            <Icon.inbox className="h-5 w-5 text-subtle" />
          </div>
          <p className="text-sm text-secondary">
            {query ? `"${query}" ile eşleşen geri bildirim yok.` : "Bu filtreye uygun geri bildirim yok."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3" role="list" aria-label="Geri bildirimler">
          {filtered.map((f) => (
            <div key={f.id} role="listitem">
              <FeedbackCard
                feedback={f}
                selected={false}
                compact={false}
                onClick={() => setSelectedId(f.id)}
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
