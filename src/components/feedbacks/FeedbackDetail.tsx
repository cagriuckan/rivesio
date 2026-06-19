"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge, FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select, Textarea, Label } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { FEEDBACK_STATUS_LABEL, PRIORITY_LABEL, formatDate } from "@/lib/labels";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import type { FeedbackStatus, Priority } from "@/lib/types";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

interface AttachmentRow { id: string; kind: string; }
interface DetailData extends FeedbackWithMeta { attachments: AttachmentRow[]; }

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-start gap-2 py-2">
      <span className="text-xs text-subtle">{label}</span>
      <span className="text-xs text-primary">{children}</span>
    </div>
  );
}

export default function FeedbackDetail({
  id,
  onClose,
  onDeleted,
}: {
  id: string;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<FeedbackStatus>("new");
  const [priority, setPriority] = useState<Priority>("normal");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setDetail(null);
    setSaved(false);
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
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`, {
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
    if (!confirm("Bu geri bildirim ve ekleri kalıcı olarak silinecek. Emin misin?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`, { method: "DELETE" });
      if (res.ok) { onDeleted(); router.refresh(); }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header bar */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-line bg-base/90 px-4 py-3 backdrop-blur-sm">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Geri dön"
        >
          <Icon.chevronLeft className="h-3.5 w-3.5" />
          Geri
        </button>
        <span className="h-4 w-px bg-line-strong" aria-hidden />
        <span className="text-sm font-semibold text-strong">Detay</span>
      </div>

      {loading && (
        <div className="flex flex-col gap-3 p-5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {detail && (
        <>
          {/* Message block */}
          <div className="border-b border-line px-5 py-5">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone={FEEDBACK_TONE[detail.status]} dot>
                {FEEDBACK_STATUS_LABEL[detail.status]}
              </Badge>
              <Badge tone={PRIORITY_TONE[detail.priority]}>
                {PRIORITY_LABEL[detail.priority]}
              </Badge>
              <time className="ml-auto text-2xs text-faint" dateTime={new Date(detail.created_at).toISOString()}>
                {formatDate(detail.created_at)}
              </time>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">
              {detail.message}
            </p>
          </div>

          {/* Meta */}
          <div className="border-b border-line px-5 py-4">
            <p className="mb-1 text-2xs font-semibold uppercase tracking-wider text-faint">Bilgi</p>
            <div className="divide-y divide-line-soft">
              <MetaRow label="Gönderen">
                <span className="inline-flex items-center gap-1.5">
                  <Avatar name={detail.wp_user || detail.domain} size="xs" />
                  {detail.wp_user || "Anonim"}
                </span>
              </MetaRow>
              <MetaRow label="Kategori">{detail.category}</MetaRow>
              <MetaRow label="Site">{detail.domain}</MetaRow>
              <MetaRow label="Ekran">{detail.viewport || "—"}</MetaRow>
              {detail.page_url && (
                <MetaRow label="Sayfa">
                  <a
                    href={detail.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex max-w-[240px] items-center gap-1 truncate text-accent-text hover:underline"
                  >
                    <Icon.link className="h-3 w-3 shrink-0" />
                    <span className="truncate">{detail.page_url.replace(/^https?:\/\//, "")}</span>
                  </a>
                </MetaRow>
              )}
            </div>
          </div>

          {/* Attachments */}
          {detail.attachments.length > 0 && (
            <div className="border-b border-line px-5 py-4">
              <p className="mb-3 text-2xs font-semibold uppercase tracking-wider text-faint">
                Ekler ({detail.attachments.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {detail.attachments.map((a) => (
                  <a
                    key={a.id}
                    href={`/api/admin/attachments/${a.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overflow-hidden rounded-lg border border-line transition-colors hover:border-accent-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/admin/attachments/${a.id}`}
                      alt={a.kind === "screenshot" ? "Ekran görüntüsü" : "Görsel"}
                      className="h-20 w-32 object-cover"
                    />
                    <div className="bg-raised px-2 py-1 text-2xs text-subtle">
                      {a.kind === "screenshot" ? "Ekran görüntüsü" : "Görsel"}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Editor */}
          <div className="px-5 py-5">
            <p className="mb-4 text-2xs font-semibold uppercase tracking-wider text-faint">Planlama</p>
            <div className="space-y-4">
              <div>
                <Label>Durum</Label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as FeedbackStatus)}>
                  {FEEDBACK_STATUSES.map((s) => (
                    <option key={s} value={s}>{FEEDBACK_STATUS_LABEL[s]}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Öncelik</Label>
                <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{PRIORITY_LABEL[p]}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label>Çözüm notu</Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Çözüm planı, ilgili kişi, sürüm…"
                />
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Button variant="primary" onClick={save} disabled={saving}>
                    {saving ? "Kaydediliyor…" : "Kaydet"}
                  </Button>
                  {saved && (
                    <span className="flex items-center gap-1.5 text-xs text-success-text">
                      <Icon.check className="h-3.5 w-3.5" />
                      Kaydedildi
                    </span>
                  )}
                </div>
                <Button variant="danger" size="sm" onClick={remove} disabled={deleting}>
                  <Icon.trash className="h-3.5 w-3.5" />
                  {deleting ? "Siliniyor…" : "Sil"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
