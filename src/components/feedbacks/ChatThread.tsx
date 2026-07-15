"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { Badge, FEEDBACK_TONE } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import type { FeedbackWithMeta } from "@/lib/admin-repo";
import type { FeedbackDetail } from "./Inbox";
import { senderName } from "./ConversationList";
import { ChatThreadSkeleton } from "./InboxSkeleton";

// The feedback API prefixes element-picker notes with a localized marker line
// (e.g. "1️⃣ numaralı seçili alan" / "📍 Selected element"). Detect that line so
// the thread can render the same numbered badge that is drawn on the screenshot
// instead of the raw text.
const ANNOTATION_PREFIX =
  /^(?:(\d+)️?⃣ (?:numaralı seçili alan|Selected element)|📍 (?:Seçili alan|Selected element))\n?/;

function parseAnnotation(message: string): { index?: number; body: string } | null {
  const m = message.match(ANNOTATION_PREFIX);
  if (!m) return null;
  return { index: m[1] ? Number(m[1]) : undefined, body: message.slice(m[0].length) };
}

interface ThreadMessage {
  id: string;
  author: "admin" | "user";
  message: string;
  created_at: number;
  attachmentIds?: string[];
}

export default function ChatThread({
  feedback,
  detail,
  loading,
  onBack,
  onSend,
  onToggleDetails,
  detailsOpen,
  onRefresh,
}: {
  feedback: FeedbackWithMeta;
  detail: FeedbackDetail | null;
  loading: boolean;
  onBack: () => void;
  onSend: (message: string) => Promise<void>;
  onToggleDetails: () => void;
  detailsOpen: boolean;
  onRefresh: () => void;
}) {
  const t = useTranslations("feedbacks.inbox");
  const tStatus = useTranslations("status");
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const name = senderName(feedback);

  const messages: ThreadMessage[] = detail
    ? [
        {
          id: detail.id,
          author: "user" as const,
          message: detail.message,
          created_at: detail.created_at,
          attachmentIds: detail.attachments.filter((a) => !a.reply_id).map((a) => a.id),
        },
        ...detail.replies.map((r) => ({
          id: r.id,
          author: r.author,
          message: r.message,
          created_at: r.created_at,
          attachmentIds: detail.attachments.filter((a) => a.reply_id === r.id).map((a) => a.id),
        })),
      ]
    : [];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [detail?.replies.length, detail?.id]);

  let lastDay = "";

  return (
    <div className="flex h-full min-h-0 flex-col bg-canvas">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-base px-4">
        <button
          onClick={onBack}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle hover:bg-raised hover:text-primary lg:hidden"
          aria-label={t("backToList")}
        >
          <Icon.chevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-bold text-strong">{name}</h2>
            <Badge tone={FEEDBACK_TONE[feedback.status]}>{tStatus(feedback.status)}</Badge>
          </div>
          <p className="truncate text-xs text-subtle">
            {feedback.domain} · {feedback.category}
          </p>
        </div>
        <button
          onClick={onToggleDetails}
          aria-pressed={detailsOpen}
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
            detailsOpen ? "bg-accent-soft text-accent" : "text-subtle hover:bg-raised hover:text-primary",
          )}
          aria-label={t("toggleDetails")}
        >
          <Icon.layers className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {loading && !detail ? (
          <ChatThreadSkeleton />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-1">
            {messages.map((m) => {
              const day = new Date(m.created_at).toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              const showDay = day !== lastDay;
              lastDay = day;
              const isAdmin = m.author === "admin";
              return (
                <div key={m.id}>
                  {showDay && (
                    <div className="my-3 flex items-center gap-3">
                      <span className="h-px flex-1 bg-line" />
                      <span className="rounded-full border border-line bg-surface px-3 py-0.5 text-[11px] font-medium text-subtle">
                        {day}
                      </span>
                      <span className="h-px flex-1 bg-line" />
                    </div>
                  )}
                  <div className={cn("flex", isAdmin ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[78%]", isAdmin ? "items-end" : "items-start")}>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs whitespace-pre-wrap break-words",
                          isAdmin
                            ? "rounded-br-md bg-accent-soft text-strong"
                            : "rounded-bl-md bg-surface text-primary ring-1 ring-line",
                        )}
                      >
                        {(() => {
                          const ann = !isAdmin ? parseAnnotation(m.message) : null;
                          if (!ann) return m.message;
                          return (
                            <>
                              <span className="mb-1.5 flex items-center gap-2">
                                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-white tnum">
                                  {ann.index ?? "•"}
                                </span>
                                <span className="text-xs font-semibold text-subtle">{t("selectedElement")}</span>
                              </span>
                              {ann.body}
                            </>
                          );
                        })()}
                        {m.attachmentIds && m.attachmentIds.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-2">
                            {m.attachmentIds.map((id) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <a key={id} href={`/api/admin/attachments/${id}`} target="_blank" rel="noreferrer">
                                <img
                                  src={`/api/admin/attachments/${id}`}
                                  alt={t("attachmentAlt")}
                                  className="h-24 w-24 rounded-lg object-cover ring-1 ring-line"
                                />
                              </a>
                            ))}
                          </span>
                        )}
                      </div>
                      <div className={cn("mt-1 text-[11px] text-faint tnum", isAdmin ? "text-right" : "text-left")}>
                        {new Date(m.created_at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer */}
      <Composer feedbackId={feedback.id} onSend={onSend} onUploaded={onRefresh} />
    </div>
  );
}

function Composer({
  feedbackId,
  onSend,
  onUploaded,
}: {
  feedbackId: string;
  onSend: (message: string) => Promise<void>;
  onUploaded: () => void;
}) {
  const t = useTranslations("feedbacks.inbox");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Reset the draft when switching conversations.
  useEffect(() => {
    setText("");
  }, [feedbackId]);

  async function send() {
    const message = text.trim();
    if (!message || sending) return;
    setSending(true);
    try {
      await onSend(message);
      setText("");
      textRef.current?.focus();
    } finally {
      setSending(false);
    }
  }

  async function upload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await fetch(`/api/admin/feedbacks/${feedbackId}/attachment`, { method: "POST", body: form });
      onUploaded();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="shrink-0 border-t border-line bg-base p-3">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-line bg-surface p-2 shadow-xs focus-within:border-accent-line focus-within:ring-2 focus-within:ring-accent-soft">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          aria-label={t("attach")}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-subtle transition-colors hover:bg-raised hover:text-primary disabled:opacity-50"
        >
          {uploading ? <Spinner /> : <Icon.paperclip className="h-4.5 w-4.5" />}
        </button>
        <textarea
          ref={textRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              send();
            }
          }}
          rows={Math.min(6, Math.max(1, text.split("\n").length))}
          placeholder={t("composerPlaceholder")}
          className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-2 text-sm text-primary placeholder:text-faint outline-none focus-visible:outline-none"
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="inline-flex h-9 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {sending ? <Spinner /> : <Icon.arrowRight className="h-4 w-4" />}
          <span className="hidden sm:inline">{t("send")}</span>
        </button>
      </div>
      <p className="mx-auto mt-1.5 max-w-3xl px-1 text-[11px] text-faint">{t("composerHint")}</p>
    </div>
  );
}
