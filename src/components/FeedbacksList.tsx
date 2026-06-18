"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge, feedbackColor, priorityColor } from "./Badge";
import { FEEDBACK_STATUS_LABEL, PRIORITY_LABEL, formatDate } from "@/lib/labels";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import type { FeedbackStatus, Priority } from "@/lib/types";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

interface AttachmentRow {
  id: string;
  kind: string;
}

interface DetailData extends FeedbackWithMeta {
  attachments: AttachmentRow[];
}

export default function FeedbacksList({ feedbacks }: { feedbacks: FeedbackWithMeta[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Editor state
  const [status, setStatus] = useState<FeedbackStatus>("new");
  const [priority, setPriority] = useState<Priority>("normal");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setDetail(null);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`);
      if (res.ok) {
        const data: DetailData = await res.json();
        setDetail(data);
        setStatus(data.status);
        setPriority(data.priority);
        setNote(data.admin_note || "");
      }
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  function selectFeedback(id: string) {
    setSelectedId(id);
    setSaved(false);
    fetchDetail(id);
  }

  function closePanel() {
    setSelectedId(null);
    setDetail(null);
  }

  async function save() {
    if (!selectedId) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/feedbacks/${selectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority, admin_note: note }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  // Close panel on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const statusBadgeColors: Record<FeedbackStatus, string> = {
    new: "bg-blue-500/15 text-blue-300",
    planned: "bg-violet-500/15 text-violet-300",
    in_progress: "bg-amber-500/15 text-amber-300",
    resolved: "bg-emerald-500/15 text-emerald-300",
    wontfix: "bg-gray-500/15 text-gray-400",
  };
  const priorityBadgeColors: Record<Priority, string> = {
    low: "bg-gray-500/15 text-gray-400",
    normal: "bg-sky-500/15 text-sky-300",
    high: "bg-rose-500/15 text-rose-300",
  };

  return (
    <div className="relative">
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Mesaj</th>
              <th className="px-4 py-3">Site</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Öncelik</th>
              <th className="px-4 py-3">Ek</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                  Henüz geri bildirim yok.
                </td>
              </tr>
            )}
            {feedbacks.map((f) => (
              <tr
                key={f.id}
                onClick={() => selectFeedback(f.id)}
                className={[
                  "cursor-pointer border-t border-gray-800 transition-colors",
                  selectedId === f.id
                    ? "bg-indigo-500/10"
                    : "hover:bg-gray-800/60",
                ].join(" ")}
              >
                <td className="whitespace-nowrap px-4 py-3 text-gray-500 text-xs">
                  {formatDate(f.created_at)}
                </td>
                <td className="px-4 py-3 text-gray-300">{f.category}</td>
                <td className="max-w-xs px-4 py-3">
                  <span className="text-gray-200 line-clamp-2">
                    {f.message.length > 80 ? f.message.slice(0, 80) + "…" : f.message}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{f.domain}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeColors[f.status]}`}>
                    {FEEDBACK_STATUS_LABEL[f.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${priorityBadgeColors[f.priority]}`}>
                    {PRIORITY_LABEL[f.priority]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {f.attachment_count ? (
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                      </svg>
                      {f.attachment_count}
                    </span>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Side panel */}
      {selectedId && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={closePanel}
          />
          {/* Panel */}
          <div className="fixed right-0 top-0 bottom-0 z-50 flex w-[520px] flex-col border-l border-gray-800 bg-gray-900 shadow-2xl">
            {/* Panel header */}
            <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
              <span className="text-sm font-semibold text-gray-200">Detay</span>
              <button
                onClick={closePanel}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-800 hover:text-gray-200 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {loadingDetail && (
              <div className="flex flex-1 items-center justify-center text-gray-600 text-sm">
                Yükleniyor…
              </div>
            )}

            {detail && (
              <div className="flex-1 overflow-y-auto">
                {/* Message */}
                <div className="border-b border-gray-800 px-5 py-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadgeColors[detail.status]}`}>
                      {FEEDBACK_STATUS_LABEL[detail.status]}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${priorityBadgeColors[detail.priority]}`}>
                      {PRIORITY_LABEL[detail.priority]}
                    </span>
                    <span className="ml-auto text-xs text-gray-500">{formatDate(detail.created_at)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                    {detail.message}
                  </p>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-gray-800 px-5 py-4 text-xs">
                  {[
                    ["Kategori", detail.category],
                    ["Site", detail.domain],
                    ["Kullanıcı", detail.wp_user || "—"],
                    ["Ekran", detail.viewport || "—"],
                    ["Sayfa", detail.page_url || "—", detail.page_url || undefined],
                  ].map(([label, value, link]) => (
                    <div key={label as string}>
                      <div className="mb-0.5 text-gray-600">{label as string}</div>
                      {link ? (
                        <a href={link as string} target="_blank" rel="noopener noreferrer"
                          className="truncate text-indigo-400 hover:underline block">{value as string}</a>
                      ) : (
                        <div className="truncate text-gray-300">{value as string}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Attachments */}
                {detail.attachments.length > 0 && (
                  <div className="border-b border-gray-800 px-5 py-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Ekler ({detail.attachments.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detail.attachments.map((a) => (
                        <a
                          key={a.id}
                          href={`/api/admin/attachments/${a.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block overflow-hidden rounded-lg border border-gray-700 hover:border-indigo-500 transition-colors"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/admin/attachments/${a.id}`}
                            alt={a.kind}
                            className="h-24 w-36 object-cover"
                          />
                          <div className="bg-gray-800 px-2 py-1 text-xs text-gray-500">
                            {a.kind === "screenshot" ? "Ekran" : "Görsel"}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Editor */}
                <div className="px-5 py-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">Planlama</div>

                  <label className="mb-1 block text-xs text-gray-500">Durum</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as FeedbackStatus)}
                    className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                  >
                    {FEEDBACK_STATUSES.map((s) => (
                      <option key={s} value={s}>{FEEDBACK_STATUS_LABEL[s]}</option>
                    ))}
                  </select>

                  <label className="mb-1 block text-xs text-gray-500">Öncelik</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
                    ))}
                  </select>

                  <label className="mb-1 block text-xs text-gray-500">Çözüm notu</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={4}
                    placeholder="Çözüm planı, ilgili kişi, sürüm…"
                    className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:border-indigo-500 focus:outline-none resize-none"
                  />

                  <div className="flex items-center gap-3">
                    <button
                      onClick={save}
                      disabled={saving}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                    >
                      {saving ? "Kaydediliyor…" : "Kaydet"}
                    </button>
                    {saved && (
                      <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Kaydedildi
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
