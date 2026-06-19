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

/* ── Shared input style ─────────────────────────────────────────────────── */

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    width: "100%",
    backgroundColor: "var(--color-surface)",
    border: `1px solid ${focused ? "var(--color-accent)" : "var(--color-border)"}`,
    borderRadius: "var(--radius-md)",
    padding: "7px 11px",
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
      <span className="mb-1 block text-xs font-semibold" style={{ color: "var(--color-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </span>
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

/* ── Feedback card ──────────────────────────────────────────────────────── */

function FeedbackCard({
  feedback,
  selected,
  onClick,
}: {
  feedback: FeedbackWithMeta;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-all"
      style={{
        backgroundColor: selected ? "var(--color-accent-muted)" : "var(--color-surface)",
        border: `1px solid ${selected ? "var(--color-accent-border)" : "var(--color-border)"}`,
        borderRadius: "var(--radius-lg)",
        padding: "14px 16px",
        cursor: "pointer",
        outline: "none",
        display: "block",
        boxShadow: selected ? `0 0 0 1px var(--color-accent-border)` : "var(--shadow-card)",
      }}
    >
      {/* Top row: category badge + date */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <Badge variant={feedbackVariant(feedback.status)} dot>
          {FEEDBACK_STATUS_LABEL[feedback.status]}
        </Badge>
        <span className="shrink-0 text-xs" style={{ color: "var(--color-subtle)" }}>
          {formatDate(feedback.created_at)}
        </span>
      </div>

      {/* Message */}
      <p
        className="mb-3 line-clamp-2 text-sm font-medium leading-snug"
        style={{ color: "var(--color-primary)" }}
      >
        {feedback.message}
      </p>

      {/* Bottom row: domain + category + priority + attachments */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className="rounded px-1.5 py-0.5 text-xs font-medium"
          style={{ backgroundColor: "var(--color-elevated)", color: "var(--color-secondary)" }}
        >
          {feedback.category}
        </span>
        <Badge variant={priorityVariant(feedback.priority)}>
          {PRIORITY_LABEL[feedback.priority]}
        </Badge>
        {feedback.attachment_count > 0 && (
          <span
            className="ml-auto flex items-center gap-1 text-xs"
            style={{ color: "var(--color-subtle)" }}
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
            {feedback.attachment_count}
          </span>
        )}
        <span
          className={`ml-auto text-xs ${feedback.attachment_count > 0 ? "" : "ml-auto"}`}
          style={{ color: "var(--color-subtle)" }}
        >
          {feedback.domain}
        </span>
      </div>
    </button>
  );
}

/* ── Detail section label ───────────────────────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="mb-2 text-xs font-semibold"
      style={{ color: "var(--color-subtle)", textTransform: "uppercase", letterSpacing: "0.06em" }}
    >
      {children}
    </div>
  );
}

/* ── Meta row ───────────────────────────────────────────────────────────── */

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <span className="shrink-0 text-xs font-medium" style={{ color: "var(--color-subtle)", width: 80 }}>{label}</span>
      <span className="text-right text-xs" style={{ color: "var(--color-primary)" }}>{children}</span>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

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
    if (selectedId === id) { setSelectedId(null); setDetail(null); return; }
    setSelectedId(id);
    setSaved(false);
    fetchDetail(id);
  }

  function closeDetail() {
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
      if (res.ok) { setSaved(true); router.refresh(); }
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selectedId) return;
    if (!confirm("Bu geri bildirim ve ekleri kalıcı olarak silinecek. Emin misin?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/feedbacks/${selectedId}`, { method: "DELETE" });
      if (res.ok) { closeDetail(); router.refresh(); }
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDetail();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const panelOpen = selectedId !== null;

  return (
    <div className="flex gap-4 items-start">

      {/* ── Card list ──────────────────────────────────────────────────── */}
      <div
        className="flex flex-col gap-2 transition-all"
        style={{ flex: panelOpen ? "0 0 340px" : "1 1 auto", minWidth: 0 }}
      >
        {feedbacks.length === 0 && (
          <div
            className="flex flex-col items-center justify-center rounded-xl py-20 text-center"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            <div
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--color-elevated)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" style={{ color: "var(--color-subtle)" }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--color-secondary)" }}>
              Henüz geri bildirim yok.
            </p>
          </div>
        )}

        {feedbacks.map((f) => (
          <FeedbackCard
            key={f.id}
            feedback={f}
            selected={selectedId === f.id}
            onClick={() => selectFeedback(f.id)}
          />
        ))}
      </div>

      {/* ── Detail pane (inline, no overlay) ───────────────────────────── */}
      {panelOpen && (
        <div
          className="flex-1 min-w-0 rounded-xl overflow-hidden"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            boxShadow: "var(--shadow-panel)",
            position: "sticky",
            top: 24,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <span className="text-sm font-semibold" style={{ color: "var(--color-strong)", letterSpacing: "-0.01em" }}>
              Detay
            </span>
            <button onClick={closeDetail} className="ds-btn-icon" aria-label="Kapat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Loading skeleton */}
          {loadingDetail && (
            <div className="flex flex-col gap-3 p-5">
              {[60, 120, 44, 44, 80].map((h, i) => (
                <div key={i} className="ds-shimmer" style={{ height: h, borderRadius: "var(--radius-md)" }} />
              ))}
            </div>
          )}

          {detail && (
            <div
              className="overflow-y-auto"
              style={{ maxHeight: "calc(100vh - 160px)" }}
            >
              {/* Message */}
              <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge variant={feedbackVariant(detail.status)} dot>
                    {FEEDBACK_STATUS_LABEL[detail.status]}
                  </Badge>
                  <Badge variant={priorityVariant(detail.priority)}>
                    {PRIORITY_LABEL[detail.priority]}
                  </Badge>
                  <span className="ml-auto text-xs" style={{ color: "var(--color-subtle)" }}>
                    {formatDate(detail.created_at)}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--color-primary)" }}>
                  {detail.message}
                </p>
              </div>

              {/* Meta */}
              <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--color-border)" }}>
                <SectionLabel>Bilgi</SectionLabel>
                <MetaRow label="Kategori">{detail.category}</MetaRow>
                <MetaRow label="Site">{detail.domain}</MetaRow>
                <MetaRow label="Kullanıcı">{detail.wp_user || "—"}</MetaRow>
                <MetaRow label="Ekran">{detail.viewport || "—"}</MetaRow>
                {detail.page_url && (
                  <MetaRow label="Sayfa">
                    <a
                      href={detail.page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="max-w-[180px] block truncate hover:underline"
                      style={{ color: "var(--color-accent-text)" }}
                    >
                      {detail.page_url}
                    </a>
                  </MetaRow>
                )}
              </div>

              {/* Attachments */}
              {detail.attachments.length > 0 && (
                <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <SectionLabel>Ekler ({detail.attachments.length})</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {detail.attachments.map((a) => (
                      <a
                        key={a.id}
                        href={`/api/admin/attachments/${a.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block overflow-hidden rounded-lg transition-all"
                        style={{ border: "1px solid var(--color-border)" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/admin/attachments/${a.id}`}
                          alt={a.kind}
                          className="block h-20 w-32 object-cover"
                        />
                        <div
                          className="px-2 py-1 text-xs"
                          style={{ backgroundColor: "var(--color-elevated)", color: "var(--color-subtle)" }}
                        >
                          {a.kind === "screenshot" ? "Ekran" : "Görsel"}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Editor */}
              <div className="space-y-4 px-5 py-4">
                <SectionLabel>Planlama</SectionLabel>

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
                  <span
                    className="mb-1 block text-xs font-semibold"
                    style={{ color: "var(--color-subtle)", textTransform: "uppercase", letterSpacing: "0.05em" }}
                  >
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

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2.5">
                    <button onClick={save} disabled={saving} className="ds-btn-primary">
                      {saving ? "Kaydediliyor…" : "Kaydet"}
                    </button>
                    {saved && (
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "var(--color-ok-text)" }}
                      >
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
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50"
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
      )}
    </div>
  );
}
