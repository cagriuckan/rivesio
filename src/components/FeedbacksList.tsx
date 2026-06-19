"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge, feedbackVariant, priorityVariant } from "./Badge";
import { FEEDBACK_STATUS_LABEL, PRIORITY_LABEL, formatDate } from "@/lib/labels";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import type { FeedbackStatus, Priority } from "@/lib/types";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

interface AttachmentRow { id: string; kind: string; }
interface DetailData extends FeedbackWithMeta { attachments: AttachmentRow[]; }

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: "100%",
    backgroundColor: "var(--color-elevated)",
    border: `1px solid ${focused ? "var(--color-accent)" : "var(--color-border)"}`,
    borderRadius: "var(--radius-md)",
    padding: "8px 12px",
    fontSize: "13px",
    color: "var(--color-primary)",
    fontFamily: "var(--font-sans)",
    boxShadow: focused ? "0 0 0 3px var(--color-accent-muted)" : "none",
    outline: "none",
    transition: "border-color .15s, box-shadow .15s",
    appearance: "none" as const,
  };
}

function SelectField<T extends string>({
  label, value, onChange, options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium" style={{ color: "var(--color-subtle)" }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyle(focused)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

export default function FeedbacksList({ feedbacks }: { feedbacks: FeedbackWithMeta[] }) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [status, setStatus] = useState<FeedbackStatus>("new");
  const [priority, setPriority] = useState<Priority>("normal");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);

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

  async function remove() {
    if (!selectedId) return;
    if (!confirm("Bu geri bildirim ve ekleri kalıcı olarak silinecek. Emin misin?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/feedbacks/${selectedId}`, { method: "DELETE" });
      if (res.ok) { closePanel(); router.refresh(); }
    } finally {
      setDeleting(false);
    }
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
      if (res.ok) { setSaved(true); router.refresh(); }
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") closePanel(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      <div
        className="overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <table className="ds-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Kategori</th>
              <th>Mesaj</th>
              <th>Site</th>
              <th>Durum</th>
              <th>Öncelik</th>
              <th>Ek</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm" style={{ color: "var(--color-subtle)" }}>
                  Henüz geri bildirim yok.
                </td>
              </tr>
            )}
            {feedbacks.map((f) => {
              const active = selectedId === f.id;
              return (
                <tr
                  key={f.id}
                  onClick={() => selectFeedback(f.id)}
                  className="cursor-pointer"
                  style={active ? { backgroundColor: "var(--color-accent-muted)" } : {}}
                >
                  <td className="whitespace-nowrap text-xs">{formatDate(f.created_at)}</td>
                  <td style={{ color: "var(--color-primary)" }}>{f.category}</td>
                  <td className="max-w-xs">
                    <span className="line-clamp-2" style={{ color: "var(--color-primary)" }}>
                      {f.message.length > 80 ? f.message.slice(0, 80) + "…" : f.message}
                    </span>
                  </td>
                  <td className="text-xs">{f.domain}</td>
                  <td><Badge variant={feedbackVariant(f.status)} dot>{FEEDBACK_STATUS_LABEL[f.status]}</Badge></td>
                  <td><Badge variant={priorityVariant(f.priority)}>{PRIORITY_LABEL[f.priority]}</Badge></td>
                  <td className="text-xs">
                    {f.attachment_count ? (
                      <span className="flex items-center gap-1">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                        </svg>
                        {f.attachment_count}
                      </span>
                    ) : <span style={{ color: "var(--color-muted)" }}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }}
            onClick={closePanel}
          />
          <div
            className="fixed right-0 top-0 bottom-0 z-50 flex w-[500px] flex-col"
            style={{
              backgroundColor: "var(--color-surface)",
              borderLeft: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-panel)",
              maxWidth: "calc(100vw - 48px)",
            }}
          >
            <div
              className="flex shrink-0 items-center justify-between px-5 py-3.5"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--color-strong)" }}>Detay</span>
              <button onClick={closePanel} className="ds-btn-icon" aria-label="Kapat">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {loadingDetail && (
              <div className="flex flex-1 flex-col gap-4 p-5">
                {[56, 120, 40, 56].map((h, i) => (
                  <div key={i} className="ds-shimmer rounded-lg" style={{ height: h }} />
                ))}
              </div>
            )}

            {detail && (
              <div className="flex-1 overflow-y-auto">
                <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <Badge variant={feedbackVariant(detail.status)} dot>{FEEDBACK_STATUS_LABEL[detail.status]}</Badge>
                    <Badge variant={priorityVariant(detail.priority)}>{PRIORITY_LABEL[detail.priority]}</Badge>
                    <span className="ml-auto text-xs" style={{ color: "var(--color-subtle)" }}>{formatDate(detail.created_at)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--color-primary)" }}>
                    {detail.message}
                  </p>
                </div>

                <div
                  className="grid grid-cols-2 gap-x-4 gap-y-3.5 px-5 py-4 text-xs"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  {([
                    ["Kategori", detail.category, null],
                    ["Site", detail.domain, null],
                    ["Kullanıcı", detail.wp_user || "—", null],
                    ["Ekran", detail.viewport || "—", null],
                    ["Sayfa", detail.page_url || "—", detail.page_url],
                  ] as [string, string, string | null][]).map(([label, value, link]) => (
                    <div key={label}>
                      <div className="mb-0.5 font-semibold uppercase tracking-widest" style={{ color: "var(--color-subtle)", fontSize: 10 }}>{label}</div>
                      {link ? (
                        <a href={link} target="_blank" rel="noopener noreferrer"
                          className="block truncate font-medium hover:underline"
                          style={{ color: "var(--color-accent-text)" }}>
                          {value}
                        </a>
                      ) : (
                        <div className="truncate" style={{ color: "var(--color-primary)" }}>{value}</div>
                      )}
                    </div>
                  ))}
                </div>

                {detail.attachments.length > 0 && (
                  <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <div className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-subtle)" }}>
                      Ekler ({detail.attachments.length})
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detail.attachments.map((a) => (
                        <a key={a.id} href={`/api/admin/attachments/${a.id}`} target="_blank" rel="noopener noreferrer"
                          className="block overflow-hidden rounded-lg transition-all"
                          style={{ border: "1px solid var(--color-border)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/api/admin/attachments/${a.id}`} alt={a.kind} className="h-24 w-36 object-cover" />
                          <div className="px-2 py-1 text-xs" style={{ backgroundColor: "var(--color-elevated)", color: "var(--color-subtle)" }}>
                            {a.kind === "screenshot" ? "Ekran" : "Görsel"}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4 px-5 py-4">
                  <div className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--color-subtle)" }}>
                    Planlama
                  </div>

                  <SelectField
                    label="Durum"
                    value={status}
                    onChange={setStatus}
                    options={FEEDBACK_STATUSES.map((s) => ({ value: s, label: FEEDBACK_STATUS_LABEL[s] }))}
                  />

                  <SelectField
                    label="Öncelik"
                    value={priority}
                    onChange={setPriority}
                    options={PRIORITIES.map((p) => ({ value: p, label: PRIORITY_LABEL[p] }))}
                  />

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-medium" style={{ color: "var(--color-subtle)" }}>
                      Çözüm notu
                    </span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onFocus={() => setNoteFocused(true)}
                      onBlur={() => setNoteFocused(false)}
                      rows={4}
                      placeholder="Çözüm planı, ilgili kişi, sürüm…"
                      style={{ ...inputStyle(noteFocused), resize: "none" }}
                    />
                  </label>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button onClick={save} disabled={saving} className="ds-btn-primary">
                        {saving ? "Kaydediliyor…" : "Kaydet"}
                      </button>
                      {saved && (
                        <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--color-ok-text)" }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Kaydedildi
                        </span>
                      )}
                    </div>
                    <button
                      onClick={remove}
                      disabled={deleting}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50"
                      style={{ backgroundColor: "var(--color-danger-muted)", color: "var(--color-danger-text)" }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
                      {deleting ? "Siliniyor…" : "Sil"}
                    </button>
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
