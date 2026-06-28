"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Badge, FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select, Textarea, Label } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { formatDate } from "@/lib/labels";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import type { CustomFieldValue, FeedbackStatus, Priority } from "@/lib/types";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

interface AttachmentRow { id: string; kind: string; }
interface DetailData extends FeedbackWithMeta { attachments: AttachmentRow[]; }

export default function FeedbackDetail({
  id,
  onClose,
  onDeleted,
}: {
  id: string;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const t = useTranslations("feedbacks");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const tp = useTranslations("priority");
  const locale = useLocale();
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
    if (!confirm(t("confirmDelete"))) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`, { method: "DELETE" });
      if (res.ok) { onDeleted(); router.refresh(); }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="rounded-xl border border-line bg-surface">

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 flex items-center gap-2 rounded-t-xl border-b border-line bg-surface px-5 py-3">
        <button
          onClick={onClose}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line-strong bg-raised px-3 py-2 text-sm font-medium text-primary transition-colors hover:border-accent-line hover:bg-accent-soft outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Icon.chevronLeft className="h-4 w-4" />
          {tc("back")}
        </button>
        <span className="h-4 w-px bg-line-strong" />
        <span className="font-mono text-xs text-faint">#{id.slice(0, 8)}</span>

        {loading && <span className="ml-auto text-xs text-subtle">{tc("loading")}</span>}
        {detail && (
          <div className="ml-auto flex items-center gap-2">
            <Badge tone={FEEDBACK_TONE[detail.status]} dot>
              {ts(detail.status)}
            </Badge>
            <Badge tone={PRIORITY_TONE[detail.priority]}>
              {tp(detail.priority)}
            </Badge>
            <time className="text-xs text-subtle" dateTime={new Date(detail.created_at).toISOString()}>
              {formatDate(detail.created_at, locale)}
            </time>
          </div>
        )}
      </div>

      {/* ── Loading ───────────────────────────────────────────── */}
      {loading && (
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {/* ── Content ───────────────────────────────────────────── */}
      {detail && (
        <div className="grid gap-0 lg:grid-cols-[1fr_280px]">

          {/* Left */}
          <div className="border-r border-line">

            {/* Sender */}
            <div className="flex items-center gap-3 border-b border-line px-5 py-3">
              <Avatar name={detail.wp_user || detail.domain} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-primary">{detail.wp_user || t("anonymous")}</p>
                <p className="text-xs text-subtle">{detail.domain}</p>
              </div>
              {detail.page_url && (
                <a
                  href={detail.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs text-subtle transition-colors hover:border-line-strong hover:text-primary"
                >
                  <Icon.link className="h-3.5 w-3.5" />
                  {detail.page_url.replace(/^https?:\/\//, "").slice(0, 40)}
                </a>
              )}
            </div>

            {/* Message */}
            <div className="px-5 py-5">
              <p className="whitespace-pre-wrap text-base leading-relaxed text-primary">
                {detail.message}
              </p>
            </div>

            {/* Custom form fields */}
            {(() => {
              let custom: CustomFieldValue[] = [];
              try {
                if (detail.custom_fields_json) custom = JSON.parse(detail.custom_fields_json);
              } catch {
                custom = [];
              }
              if (!custom.length) return null;
              return (
                <div className="border-t border-line px-5 py-4">
                  <p className="mb-3 text-xs font-medium text-subtle">{t("customFields")}</p>
                  <dl className="grid gap-2">
                    {custom.map((f, i) => (
                      <div key={i} className="flex gap-2 text-sm">
                        <dt className="min-w-[120px] shrink-0 text-subtle">{f.label}</dt>
                        <dd className="whitespace-pre-wrap text-primary">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })()}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line px-5 py-3 text-xs text-subtle">
              <span><span className="text-faint">{t("category")}</span> · {detail.category}</span>
              <span><span className="text-faint">{t("screen")}</span> · {detail.viewport || "—"}</span>
              <span className="font-mono text-faint" title={detail.id}>#{detail.id.slice(0, 8)}</span>
            </div>

            {/* Attachments */}
            {detail.attachments.length > 0 && (
              <div className="border-t border-line px-5 py-4">
                <p className="mb-3 text-xs font-medium text-subtle">
                  {t("attachments", { count: detail.attachments.length })}
                </p>
                <div className="flex flex-wrap gap-3">
                  {detail.attachments.map((a) => (
                    <a
                      key={a.id}
                      href={`/api/admin/attachments/${a.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="overflow-hidden rounded-lg border border-line transition-colors hover:border-accent-line"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/api/admin/attachments/${a.id}`}
                        alt={a.kind === "screenshot" ? t("screenshot") : t("image")}
                        className="h-24 w-40 object-cover"
                      />
                      <div className="bg-raised px-2 py-1.5 text-xs text-subtle">
                        {a.kind === "screenshot" ? t("screenshot") : t("image")}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — actions */}
          <div className="flex flex-col gap-5 px-5 py-5">
            <div>
              <Label>{t("fieldStatus")}</Label>
              <Select value={status} onChange={(e) => setStatus(e.target.value as FeedbackStatus)}>
                {FEEDBACK_STATUSES.map((s) => (
                  <option key={s} value={s}>{ts(s)}</option>
                ))}
              </Select>
            </div>
            <div>
              <Label>{t("fieldPriority")}</Label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{tp(p)}</option>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <Label>{t("resolutionNote")}</Label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={5}
                placeholder={t("resolutionPlaceholder")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Button variant="primary" onClick={save} disabled={saving}>
                  {saving ? tc("saving") : tc("save")}
                </Button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-xs text-success-text">
                    <Icon.check className="h-3.5 w-3.5" />
                    {tc("saved")}
                  </span>
                )}
              </div>
              <Button variant="danger" size="sm" onClick={remove} disabled={deleting}>
                <Icon.trash className="h-3.5 w-3.5" />
                {deleting ? tc("deleting") : t("deletePermanently")}
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
