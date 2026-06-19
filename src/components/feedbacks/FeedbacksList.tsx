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
      <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface py-24 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-raised">
          <Icon.inbox className="h-5 w-5 text-subtle" />
        </div>
        <p className="text-sm font-medium text-secondary">Bu filtreye uygun geri bildirim yok.</p>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      {/* Card list */}
      <div
        className="flex flex-col gap-2.5 transition-[flex-basis] duration-300"
        style={{ flex: open ? "0 0 360px" : "1 1 100%", minWidth: 0 }}
      >
        {feedbacks.map((f) => (
          <FeedbackCard
            key={f.id}
            feedback={f}
            selected={selectedId === f.id}
            compact={open}
            onClick={() => setSelectedId((cur) => (cur === f.id ? null : f.id))}
          />
        ))}
      </div>

      {/* Inline detail (no overlay) */}
      {open && selectedId && (
        <div className="ds-fade-in sticky top-0 min-w-0 flex-1 self-start">
          <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-md" style={{ maxHeight: "calc(100vh - 56px)" }}>
            <FeedbackDetail
              key={selectedId}
              id={selectedId}
              onClose={() => setSelectedId(null)}
              onDeleted={() => setSelectedId(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
