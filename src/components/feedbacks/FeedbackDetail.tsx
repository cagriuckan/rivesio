"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Badge, FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select, Textarea } from "@/components/ui/Field";
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
  const [reply, setReply] = useState("");
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
        setReply(data.admin_note || "");
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
        body: JSON.stringify({ status, priority, admin_note: reply }),
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

  let custom: CustomFieldValue[] = [];
  if (detail?.custom_fields_json) {
    try { custom = JSON.parse(detail.custom_fields_json); } catch { custom = []; }
  }
  const elementNotes = custom.filter((f) => f.kind === "element_annotation");
  const formFields = custom.filter((f) => f.kind !== "element_annotation");

  return (
    <div className="flex min-h-[calc(100vh-11rem)] flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex shrink-0 items-center gap-2 border-b border-line bg-surface px-4 py-3">
        <button
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={tc("back")}
        >
          <Icon.chevronLeft className="h-3.5 w-3.5" />
        </button>

        {loading && <span className="ml-2 text-xs text-subtle">{tc("loading")}</span>}

        {detail && (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 pl-1 text-sm">
              <span className="truncate font-medium text-subtle">{detail.domain}</span>
              <span className="text-faint">/</span>
              <span className="truncate font-semibold text-primary">{detail.category}</span>
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2 max-sm:hidden">
              <Badge tone={FEEDBACK_TONE[detail.status]} dot>{ts(detail.status)}</Badge>
              <Badge tone={PRIORITY_TONE[detail.priority]}>{tp(detail.priority)}</Badge>
              <time className="hidden text-xs text-faint sm:block" dateTime={new Date(detail.created_at).toISOString()}>
                {formatDate(detail.created_at, locale)}
              </time>
            </div>
            <button
              onClick={remove}
              disabled={deleting}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-danger-soft hover:text-danger-text outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-50"
              aria-label={t("deletePermanently")}
            >
              <Icon.trash className="h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {loading && (
        <div className="flex flex-col gap-4 p-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {detail && (
        <div className="flex min-h-0 flex-1 flex-col bg-panel">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-8">
              <div className="flex justify-end">
                <div className="flex max-w-[min(680px,88%)] flex-col items-end gap-3">
                  <div className="flex items-end gap-2.5">
                    <div className="rounded-2xl rounded-br-md bg-raised px-4 py-3 shadow-xs ring-1 ring-line">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">{detail.message}</p>
                    </div>
                    <Avatar name={detail.wp_user || detail.domain} size="sm" />
                  </div>

                  {detail.attachments.length > 0 && (
                    <div className="grid max-w-full grid-cols-1 gap-2 sm:grid-cols-2">
                      {detail.attachments.map((a) => (
                        <a
                          key={a.id}
                          href={`/api/admin/attachments/${a.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xs transition-colors hover:border-accent-line"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/admin/attachments/${a.id}`}
                            alt={a.kind === "screenshot" ? t("screenshot") : t("image")}
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-subtle">
                            <Icon.paperclip className="h-3.5 w-3.5" />
                            {a.kind === "screenshot" ? t("screenshot") : t("image")}
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  {formFields.length > 0 && (
                    <dl className="grid w-full gap-1.5 rounded-2xl border border-line bg-surface p-3 shadow-xs">
                      {formFields.map((f, i) => (
                        <div key={i} className="grid gap-1 text-xs sm:grid-cols-[120px_1fr]">
                          <dt className="text-subtle">{f.label}</dt>
                          <dd className="whitespace-pre-wrap font-medium text-primary">{f.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {elementNotes.length > 0 && (
                    <div className="grid w-full gap-2">
                      {elementNotes.map((note, i) => (
                        <div key={i} className="rounded-2xl border border-accent-line bg-accent-soft/50 px-3 py-2.5 shadow-xs">
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-2xs font-bold text-white tnum">
                              {i + 1}
                            </span>
                            <span className="truncate font-mono text-2xs text-subtle">
                              {note.selector || note.tagName || (locale === "en" ? "Element note" : "Öğe notu")}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">{note.value}</p>
                          {(note.text || note.rect) && (
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-accent-line pt-2 text-2xs text-subtle">
                              {note.text && <span className="max-w-full truncate">"{note.text}"</span>}
                              {note.rect && (
                                <span className="tnum">
                                  {note.rect.width}x{note.rect.height} @ {note.rect.x},{note.rect.y}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-end gap-3 text-2xs text-faint">
                    <span>{detail.wp_user || t("anonymous")}</span>
                    {detail.viewport && <span>{detail.viewport}</span>}
                    <span className="font-mono">#{detail.id.slice(0, 8)}</span>
                    {detail.page_url && (
                      <a
                        href={detail.page_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-w-0 items-center gap-1 transition-colors hover:text-subtle"
                      >
                        <Icon.link className="h-3 w-3 shrink-0" />
                        <span className="truncate">{detail.page_url.replace(/^https?:\/\//, "").slice(0, 56)}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {reply.trim() && (
                <div className="flex items-end gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface shadow-xs ring-1 ring-line">
                    <Icon.feedback className="h-4 w-4 text-subtle" />
                  </div>
                  <div className="max-w-[min(680px,88%)] rounded-2xl rounded-bl-md bg-surface px-4 py-3 shadow-xs ring-1 ring-line">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">{reply}</p>
                    {saved && (
                      <div className="mt-2 flex items-center gap-1.5 text-2xs text-success-text">
                        <Icon.check className="h-3 w-3" />
                        {tc("saved")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 border-t border-line bg-panel px-4 py-4 sm:px-8">
            <div className="mx-auto rounded-2xl border border-line bg-surface p-2 shadow-md sm:max-w-3xl">
              <Textarea
                value={reply}
                onChange={(e) => {
                  setReply(e.target.value);
                  setSaved(false);
                }}
                rows={3}
                placeholder={t("resolutionPlaceholder")}
                className="min-h-20 resize-none border-0 bg-transparent shadow-none focus:ring-0"
              />
              <div className="flex flex-wrap items-center gap-2 px-1 pb-1">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FeedbackStatus)}
                  className="h-8 rounded-md bg-raised text-xs shadow-none"
                  aria-label={t("fieldStatus")}
                >
                  {FEEDBACK_STATUSES.map((s) => (
                    <option key={s} value={s}>{ts(s)}</option>
                  ))}
                </Select>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="h-8 rounded-md bg-raised text-xs shadow-none"
                  aria-label={t("fieldPriority")}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>{tp(p)}</option>
                  ))}
                </Select>
                <p className="text-2xs text-faint max-sm:hidden">{t("replyHint")}</p>
                <Button variant="primary" onClick={save} disabled={saving} className="ml-auto">
                  <Icon.check className="h-3.5 w-3.5" />
                  {saving ? tc("saving") : t("sendReply")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
