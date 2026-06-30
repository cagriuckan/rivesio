"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { Skeleton } from "@/components/ui/Skeleton";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { Dropdown } from "@/components/ui/Dropdown";
import { useUser } from "@/contexts/UserContext";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import type { CustomFieldValue, FeedbackReplyRow, FeedbackStatus, Priority } from "@/lib/types";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

interface AttachmentRow { id: string; kind: string; }
interface DetailData extends FeedbackWithMeta {
  attachments: AttachmentRow[];
  replies: FeedbackReplyRow[];
}

function ActionDropdown<T extends string>({
  label,
  value,
  options,
  getLabel,
  dotClassName,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  getLabel: (value: T) => string;
  dotClassName: string;
  onChange: (value: T) => void;
}) {
  return (
    <Dropdown
      role="listbox"
      align="right"
      panelClassName="w-48 max-w-[calc(100vw-2rem)]"
      trigger={({ open, triggerProps }) => (
        <button
          {...triggerProps}
          type="button"
          className={cn(
            "inline-flex h-9 items-center gap-2 rounded-lg bg-raised px-2.5 text-left transition-colors outline-none sm:min-w-36 sm:px-3",
            "hover:bg-line focus-visible:ring-2 focus-visible:ring-accent",
            open && "bg-accent-soft ring-1 ring-accent-line",
          )}
        >
          <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClassName)} aria-hidden />
          <span className="hidden text-xs font-medium text-subtle sm:inline">{label}</span>
          <span className="min-w-0 flex-1 truncate text-xs font-semibold text-primary">{getLabel(value)}</span>
          <Icon.chevronDown className={cn("h-3.5 w-3.5 shrink-0 text-subtle transition-transform", open && "rotate-180")} />
        </button>
      )}
    >
      {(close) => (
        <>
          {options.map((option) => {
            const selected = option === value;
            return (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option);
                  close();
                }}
                className={cn(
                  "flex h-9 w-full items-center gap-2 rounded-lg px-2.5 text-left text-xs transition-colors outline-none",
                  selected ? "bg-accent-soft font-semibold text-accent-text" : "text-secondary hover:bg-raised hover:text-primary",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", selected ? dotClassName : "bg-line-strong")} aria-hidden />
                <span className="min-w-0 flex-1 truncate">{getLabel(option)}</span>
                {selected && <Icon.check className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </>
      )}
    </Dropdown>
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
  const t = useTranslations("feedbacks");
  const tc = useTranslations("common");
  const ts = useTranslations("status");
  const tp = useTranslations("priority");
  const router = useRouter();
  const user = useUser();
  const [detail, setDetail] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<FeedbackStatus>("new");
  const [priority, setPriority] = useState<Priority>("normal");
  const [draftReply, setDraftReply] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [updatingMeta, setUpdatingMeta] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setDetail(null);
    setSaved(false);
    setDetailsOpen(false);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`);
      if (res.ok) {
        const data: DetailData = await res.json();
        setDetail(data);
        setStatus(data.status);
        setPriority(data.priority);
        setDraftReply("");
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!previewAttachment) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setPreviewAttachment(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewAttachment]);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, priority, reply: draftReply.trim() || undefined }),
      });
      if (res.ok) {
        setSaved(true);
        setDraftReply("");
        await load();
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function updateMeta(next: { status?: FeedbackStatus; priority?: Priority }) {
    const nextStatus = next.status ?? status;
    const nextPriority = next.priority ?? priority;
    setStatus(nextStatus);
    setPriority(nextPriority);
    setUpdatingMeta(true);
    try {
      const res = await fetch(`/api/admin/feedbacks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, priority: nextPriority }),
      });
      if (res.ok) router.refresh();
    } finally {
      setUpdatingMeta(false);
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
  const replies: FeedbackReplyRow[] = detail
    ? detail.replies.length > 0
      ? detail.replies
      : detail.admin_note?.trim()
        ? [{
            id: "legacy-admin-note",
            feedback_id: detail.id,
            author: "admin",
            message: detail.admin_note,
            created_at: detail.created_at,
          }]
        : []
    : [];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-surface">
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line-soft bg-surface px-3 pb-3 pt-3 sm:min-h-14 sm:gap-3 sm:px-5 sm:pt-0">
        <button
          onClick={onClose}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={t("backToFeedbacks")}
        >
          <Icon.chevronLeft className="h-3.5 w-3.5" />
          <span>{t("backToFeedbacks")}</span>
        </button>

        {loading && <span className="ml-2 text-xs text-subtle">{tc("loading")}</span>}

        {detail && (
          <>
            <div className="order-3 flex min-w-0 basis-full items-center gap-1.5 pl-1 text-sm sm:order-none sm:basis-0 sm:flex-1">
              <span className="truncate font-semibold text-primary">{detail.domain}</span>
              <span className="text-subtle">/</span>
              <span className="truncate font-semibold text-secondary">{detail.category}</span>
              <Icon.chevronDown className="h-3.5 w-3.5 shrink-0 text-subtle" />
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2 rounded-xl border border-line bg-surface p-1 shadow-xs">
              <ActionDropdown
                label={t("fieldStatus")}
                value={status}
                options={FEEDBACK_STATUSES}
                getLabel={(value) => ts(value)}
                dotClassName="bg-info"
                onChange={(value) => updateMeta({ status: value })}
              />
              <ActionDropdown
                label={t("fieldPriority")}
                value={priority}
                options={PRIORITIES}
                getLabel={(value) => tp(value)}
                dotClassName="bg-warning"
                onChange={(value) => updateMeta({ priority: value })}
              />
              <button
                onClick={remove}
                disabled={deleting || updatingMeta}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-danger-soft hover:text-danger-text outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-50"
                aria-label={t("deletePermanently")}
              >
                <Icon.trash className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {loading && (
        <div className="flex flex-col gap-4 p-5">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {detail && (
        <div className="flex min-h-0 flex-1 flex-col bg-surface">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-12 pt-6 sm:px-8">
            <div className="mx-auto mb-6 max-w-[760px]">
              <button
                type="button"
                onClick={() => setDetailsOpen((v) => !v)}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-raised px-3 text-xs font-semibold text-secondary transition-colors hover:bg-line hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-expanded={detailsOpen}
              >
                <Icon.feedback className="h-3.5 w-3.5 text-subtle" />
                {detailsOpen ? t("hideDetails") : t("showDetails")}
                <Icon.chevronDown className={cn("h-3.5 w-3.5 text-subtle transition-transform", detailsOpen && "rotate-180")} />
              </button>

              {detailsOpen && (
                <div className="mt-3 rounded-xl border border-line bg-surface p-4 shadow-xs">
                  <div className="grid gap-3 text-xs sm:grid-cols-2">
                    <div>
                      <div className="text-xs font-medium text-faint">{t("category")}</div>
                      <div className="mt-1 font-semibold text-primary">{detail.category}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-faint">{t("submittedBy")}</div>
                      <div className="mt-1 font-semibold text-primary">{detail.wp_user || t("anonymous")}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-faint">{t("screen")}</div>
                      <div className="mt-1 font-semibold text-primary">{detail.viewport || "-"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-faint">{t("feedbackId")}</div>
                      <div className="mt-1 font-mono font-semibold text-primary">#{detail.id.slice(0, 8)}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-faint">{t("attachments", { count: detail.attachments.length })}</div>
                      <div className="mt-1 font-semibold text-primary">{detail.attachments.length}</div>
                    </div>
                    {detail.page_url && (
                      <div className="min-w-0 sm:col-span-2">
                        <div className="text-xs font-medium text-faint">{t("pageUrl")}</div>
                        <a
                          href={detail.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 flex min-w-0 items-center gap-1.5 font-semibold text-secondary transition-colors hover:text-primary"
                        >
                          <Icon.link className="h-3.5 w-3.5 shrink-0 text-subtle" />
                          <span className="truncate">{detail.page_url}</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mx-auto flex max-w-[760px] flex-col gap-6">
              <div className="flex justify-end">
                <div className="flex max-w-[min(680px,82%)] flex-col items-end gap-3">
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 rounded-xl bg-raised px-4 py-3 shadow-xs">
                      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-primary">{detail.message}</p>
                    </div>
                    <Avatar name={detail.wp_user || detail.domain} size="lg" />
                  </div>

                  {detail.attachments.length > 0 && (
                    <div className="grid max-w-full grid-cols-1 justify-items-end gap-3">
                      {detail.attachments.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPreviewAttachment(a);
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                          className="w-full max-w-48 overflow-hidden rounded-xl bg-raised text-left shadow-xs transition-opacity hover:opacity-90 outline-none focus-visible:ring-2 focus-visible:ring-accent"
                          aria-label={a.kind === "screenshot" ? t("screenshot") : t("image")}
                          data-attachment-preview={a.id}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`/api/admin/attachments/${a.id}`}
                            alt={a.kind === "screenshot" ? t("screenshot") : t("image")}
                            className="aspect-[4/3] w-full object-cover"
                          />
                          <div className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-secondary">
                            <Icon.paperclip className="h-3.5 w-3.5" />
                            {a.kind === "screenshot" ? t("screenshot") : t("image")}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {formFields.length > 0 && (
                    <dl className="grid w-full gap-1.5 rounded-xl bg-raised p-3 shadow-xs">
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
                        <div key={i} className="rounded-xl bg-raised px-3 py-2.5 shadow-xs">
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-surface px-1.5 text-xs font-bold text-subtle tnum">
                              {i + 1}
                            </span>
                            <span className="truncate font-mono text-xs text-subtle">
                              {note.selector || note.tagName || "Element note"}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed text-primary">{note.value}</p>
                          {(note.text || note.rect) && (
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-line pt-2 text-xs text-subtle">
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

                  <div className="flex flex-wrap justify-end gap-3 text-xs text-faint">
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

              {replies.map((reply) => (
                <div key={reply.id} className="flex items-start gap-3">
                  <Avatar name={user} size="lg" />
                  <div className="min-w-0 max-w-[min(680px,82%)] rounded-xl bg-surface px-4 py-3 shadow-xs ring-1 ring-line">
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-primary">{reply.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 bg-surface px-4 pb-7 pt-3 sm:px-8">
            <div className="mx-auto overflow-hidden rounded-3xl border border-line bg-raised shadow-sm transition-colors focus-within:border-accent-line sm:max-w-[760px]">
              <Textarea
                value={draftReply}
                onChange={(e) => {
                  setDraftReply(e.target.value);
                  setSaved(false);
                }}
                rows={3}
                placeholder={t("resolutionPlaceholder")}
                className="min-h-20 resize-none border-0 bg-transparent px-5 pb-1 pt-4 text-base text-primary shadow-none [resize:none] outline-none ring-0 placeholder:text-subtle hover:border-0 focus:border-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0"
                style={{ resize: "none" }}
              />
              <div className="flex flex-wrap items-center gap-2 px-3 pb-3">
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-subtle transition-colors hover:bg-line/60 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={t("replyTools")}
                >
                  <Icon.plus className="h-4.5 w-4.5" />
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-xs text-success-text">
                    <Icon.check className="h-3 w-3" />
                    {tc("saved")}
                  </span>
                )}
                <button
                  type="button"
                  className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-subtle transition-colors hover:bg-line/60 hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label={t("replyVoiceInput")}
                >
                  <Icon.mic className="h-4.5 w-4.5" />
                </button>
                <Button
                  variant="primary"
                  size="icon"
                  onClick={save}
                  disabled={saving}
                  className="h-9 w-9 rounded-xl"
                  aria-label={saving ? tc("saving") : t("sendReply")}
                >
                  <Icon.arrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="mx-auto mt-3 text-center text-xs text-faint sm:max-w-[760px]">
              {t("replyHint")}
            </p>
          </div>
        </div>
      )}

      {previewAttachment && typeof document !== "undefined" && createPortal((
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewAttachment(null)}
        >
          <div
            className="relative flex h-[calc(100vh-24px)] w-[calc(100vw-24px)] flex-col overflow-hidden rounded-2xl bg-surface shadow-pop sm:h-[calc(100vh-48px)] sm:w-[calc(100vw-48px)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewAttachment(null)}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-secondary shadow-sm ring-1 ring-line transition-colors hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={tc("close")}
            >
              <Icon.close className="h-4 w-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/admin/attachments/${previewAttachment.id}`}
              alt={previewAttachment.kind === "screenshot" ? t("screenshot") : t("image")}
              className="min-h-0 flex-1 object-contain"
            />
            <div className="flex items-center gap-2 border-t border-line px-4 py-3 text-sm font-medium text-secondary">
              <Icon.paperclip className="h-4 w-4" />
              {previewAttachment.kind === "screenshot" ? t("screenshot") : t("image")}
            </div>
          </div>
        </div>
      ), document.body)}
    </div>
  );
}
