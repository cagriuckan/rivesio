"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import type { FeedbackWithMeta } from "@/lib/admin-repo";
import type { AttachmentRow, FeedbackReplyRow, FeedbackStatus } from "@/lib/types";
import ConversationList, { type InboxSort, type InboxTab } from "./ConversationList";
import ChatThread from "./ChatThread";
import DetailsPanel from "./DetailsPanel";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

export type FeedbackDetail = FeedbackWithMeta & {
  attachments: AttachmentRow[];
  replies: FeedbackReplyRow[];
};

type MobilePane = "list" | "thread";

export default function Inbox({
  initialItems,
  initialSelectedId,
  projectId,
}: {
  initialItems: FeedbackWithMeta[];
  initialSelectedId: string | null;
  projectId?: string;
}) {
  const t = useTranslations("feedbacks.inbox");
  const [items, setItems] = useState<FeedbackWithMeta[]>(initialItems);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [detail, setDetail] = useState<FeedbackDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [tab, setTab] = useState<InboxTab>("all");
  const [sort, setSort] = useState<InboxSort>("recent");
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [mobilePane, setMobilePane] = useState<MobilePane>(initialSelectedId ? "thread" : "list");
  // Details start open only on wide screens; on smaller ones it's a slide-over.
  // Starts false to match SSR, then syncs to the real viewport after mount.
  const [detailsOpen, setDetailsOpen] = useState(false);
  useEffect(() => {
    setDetailsOpen(window.matchMedia("(min-width: 1280px)").matches);
  }, []);
  const selectedRef = useRef<string | null>(initialSelectedId);
  selectedRef.current = selectedId;

  // Server re-renders (e.g. the widget switcher changing ?w=) deliver a new
  // initialItems prop; sync it into state and drop a selection that no longer
  // belongs to the filtered list.
  useEffect(() => {
    setItems(initialItems);
    setSelectedId((cur) => (cur && initialItems.some((f) => f.id === cur) ? cur : null));
  }, [initialItems]);

  const refetchList = useCallback(async () => {
    const params = new URLSearchParams();
    if (projectId) params.set("w", projectId);
    const res = await fetch(`/api/admin/feedbacks?${params}`).catch(() => null);
    if (!res?.ok) return;
    const data = await res.json();
    setItems(data.items ?? []);
  }, [projectId]);

  const refetchDetail = useCallback(async (id: string) => {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`);
      if (!res.ok) {
        setDetail(null);
        return;
      }
      const data = (await res.json()) as FeedbackDetail;
      if (selectedRef.current === id) {
        setDetail(data);
        // Opening marks it read server-side; mirror locally.
        setItems((prev) => prev.map((f) => (f.id === id ? { ...f, unread: false } : f)));
      }
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedId) refetchDetail(selectedId);
    else setDetail(null);
  }, [selectedId, refetchDetail]);

  useLiveEvents((type, payload) => {
    if (type === "reconnected" || type === "feedback.created" || type === "feedback.updated") {
      refetchList();
      if (type !== "feedback.created" && selectedRef.current) refetchDetail(selectedRef.current);
    } else if (type === "reply.created" || type === "feedback.assigned") {
      refetchList();
      if (payload.feedback_id === selectedRef.current && selectedRef.current) {
        refetchDetail(selectedRef.current);
      }
    }
  });

  function select(id: string | null) {
    setSelectedId(id);
    if (id) setMobilePane("thread");
    // Sync the URL without a server round-trip (a router navigation would
    // re-render the page and reset all inbox state).
    const params = new URLSearchParams(window.location.search);
    if (id) params.set("f", id);
    else params.delete("f");
    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }

  async function togglePin(f: FeedbackWithMeta) {
    const pinned = !f.pinned_at;
    setItems((prev) => prev.map((x) => (x.id === f.id ? { ...x, pinned_at: pinned ? Date.now() : null } : x)));
    await fetch(`/api/admin/feedbacks/${f.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned }),
    }).catch(() => {});
  }

  async function patchDetail(fields: Record<string, unknown>) {
    if (!detail) return;
    const id = detail.id;
    const res = await fetch(`/api/admin/feedbacks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    }).catch(() => null);
    if (res?.ok) {
      await Promise.all([refetchDetail(id), refetchList()]);
    }
  }

  async function deleteFeedback() {
    if (!detail) return;
    if (!confirm(t("confirmDelete"))) return;
    const id = detail.id;
    await fetch(`/api/admin/feedbacks/${id}`, { method: "DELETE" }).catch(() => {});
    setItems((prev) => prev.filter((f) => f.id !== id));
    select(null);
    setMobilePane("list");
  }

  const categoryOptions = Array.from(new Set(items.map((f) => f.category))).sort();

  const q = query.trim().toLowerCase();
  const filtered = items.filter((f) => {
    if (tab === "unread" && !f.unread) return false;
    if (tab === "pinned" && !f.pinned_at) return false;
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    if (categoryFilter !== "all" && f.category !== categoryFilter) return false;
    if (!q) return true;
    return (
      f.message.toLowerCase().includes(q) ||
      (f.email ?? "").toLowerCase().includes(q) ||
      f.domain.toLowerCase().includes(q) ||
      f.last_message.toLowerCase().includes(q)
    );
  });
  const PRIORITY_WEIGHT = { high: 0, normal: 1, low: 2 } as const;
  const sorted = [...filtered].sort((a, b) => {
    if (Boolean(a.pinned_at) !== Boolean(b.pinned_at)) return a.pinned_at ? -1 : 1;
    switch (sort) {
      case "oldest":
        return a.last_activity_at - b.last_activity_at;
      case "customerReplyNew":
      case "customerReplyOld": {
        const av = a.last_message_author === "user" ? a.last_message_at : -Infinity;
        const bv = b.last_message_author === "user" ? b.last_message_at : -Infinity;
        return sort === "customerReplyNew" ? bv - av : av - bv;
      }
      case "unreadFirst":
        if (a.unread !== b.unread) return a.unread ? -1 : 1;
        return b.last_activity_at - a.last_activity_at;
      case "priorityHigh":
        if (PRIORITY_WEIGHT[a.priority] !== PRIORITY_WEIGHT[b.priority]) {
          return PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
        }
        return b.last_activity_at - a.last_activity_at;
      case "recent":
      default:
        return b.last_activity_at - a.last_activity_at;
    }
  });

  const selected = items.find((f) => f.id === selectedId) ?? null;

  return (
    <div className="flex h-full min-h-0 bg-canvas">
      {/* Left: conversation list */}
      <div
        className={cn(
          "w-full shrink-0 border-r border-line bg-base lg:block lg:w-80 xl:w-96",
          mobilePane !== "list" && "hidden",
        )}
      >
        <ConversationList
          items={sorted}
          selectedId={selectedId}
          tab={tab}
          onTab={setTab}
          sort={sort}
          onSort={setSort}
          status={statusFilter}
          onStatus={setStatusFilter}
          category={categoryFilter}
          onCategory={setCategoryFilter}
          categoryOptions={categoryOptions}
          query={query}
          onQuery={setQuery}
          onSelect={select}
          onTogglePin={togglePin}
        />
      </div>

      {/* Middle: chat thread */}
      <div className={cn("min-w-0 flex-1 flex-col lg:flex", mobilePane !== "thread" && "hidden lg:flex")}>
        {selected ? (
          <ChatThread
            feedback={selected}
            detail={detail}
            loading={detailLoading}
            onBack={() => setMobilePane("list")}
            onSend={(message) => patchDetail({ reply: message })}
            onToggleDetails={() => setDetailsOpen((v) => !v)}
            detailsOpen={detailsOpen}
            onRefresh={() => selectedId && refetchDetail(selectedId)}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-raised">
              <Icon.inbox className="h-7 w-7 text-subtle" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-strong">{t("emptyThreadTitle")}</h3>
              <p className="mt-1 text-sm text-subtle">{t("emptyThreadBody")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Right: details panel (inline on xl, slide-over below) */}
      {selected && detail && detailsOpen && (
        <>
          <div className="hidden w-80 shrink-0 border-l border-line bg-base xl:block">
            <DetailsPanel detail={detail} onPatch={patchDetail} onDelete={deleteFeedback} />
          </div>
          <div className="fixed inset-0 z-40 flex justify-end xl:hidden" role="dialog" aria-modal="true">
            <button
              aria-label={t("closeDetails")}
              className="absolute inset-0 bg-black/30"
              onClick={() => setDetailsOpen(false)}
            />
            <div className="relative h-full w-[85%] max-w-sm overflow-hidden bg-base shadow-pop">
              <button
                onClick={() => setDetailsOpen(false)}
                aria-label={t("closeDetails")}
                className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md bg-surface text-subtle ring-1 ring-line hover:text-primary"
              >
                <Icon.close className="h-4 w-4" />
              </button>
              <DetailsPanel detail={detail} onPatch={patchDetail} onDelete={deleteFeedback} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
