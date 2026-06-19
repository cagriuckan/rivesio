"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icons";
import FeedbackCard from "./FeedbackCard";
import FeedbackDetail from "./FeedbackDetail";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

export default function FeedbacksList({
  feedbacks,
  initialId,
}: {
  feedbacks: FeedbackWithMeta[];
  initialId: string | null;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialId && feedbacks.some((f) => f.id === initialId) ? initialId : null
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = selectedId !== null;

  if (feedbacks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-raised">
          <Icon.inbox className="h-5 w-5 text-subtle" />
        </div>
        <p className="text-sm text-secondary">Bu filtreye uygun geri bildirim yok.</p>
      </div>
    );
  }

  /* ── Detail view ─────────────────────────────────────────────── */
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

  /* ── Card grid ───────────────────────────────────────────────── */
  return (
    <div
      className="flex flex-col gap-3 px-5 py-5"
      role="list"
      aria-label="Geri bildirimler"
    >
      {feedbacks.map((f) => (
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
  );
}
