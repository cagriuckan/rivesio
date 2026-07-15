"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { Select, Textarea } from "@/components/ui/Field";
import { Section, Row } from "@/components/ui/DetailSection";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import type { FeedbackDetail } from "./Inbox";
import { senderName } from "./ConversationList";

interface ActiveAgentOption {
  user_id: string;
  name: string;
  email: string;
}

export default function DetailsPanel({
  detail,
  onPatch,
  onDelete,
}: {
  detail: FeedbackDetail;
  onPatch: (fields: Record<string, unknown>) => Promise<void>;
  onDelete: () => void;
}) {
  const t = useTranslations("feedbacks.inbox");
  const tStatus = useTranslations("status");
  const tPriority = useTranslations("priority");
  const locale = useLocale();
  const [note, setNote] = useState(detail.admin_note ?? "");
  const [noteSaving, setNoteSaving] = useState(false);
  // null == not the owner (or not loaded yet) — falls back to read-only assignee text.
  const [activeAgents, setActiveAgents] = useState<ActiveAgentOption[] | null>(null);

  useEffect(() => {
    setNote(detail.admin_note ?? "");
  }, [detail.id, detail.admin_note]);

  useEffect(() => {
    let cancelled = false;
    setActiveAgents(null);
    fetch(`/api/admin/projects/${detail.project_id}/agents`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { items?: { status: string; user_id: string | null; email: string }[] } | null) => {
        if (cancelled || !data) return;
        const active = (data.items ?? [])
          .filter((m) => m.status === "active" && m.user_id)
          .map((m) => ({ user_id: m.user_id as string, name: m.email, email: m.email }));
        setActiveAgents(active);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [detail.project_id]);

  const name = senderName(detail);
  const browser = detail.user_agent
    ? /firefox/i.test(detail.user_agent)
      ? "Firefox"
      : /edg/i.test(detail.user_agent)
        ? "Edge"
        : /chrome/i.test(detail.user_agent)
          ? "Chrome"
          : /safari/i.test(detail.user_agent)
            ? "Safari"
            : detail.user_agent.slice(0, 40)
    : null;

  async function saveNote() {
    setNoteSaving(true);
    try {
      await onPatch({ admin_note: note });
    } finally {
      setNoteSaving(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Contact header */}
      <div className="flex flex-col items-center border-b border-line px-4 py-5 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-xl font-bold text-accent">
          {name.charAt(0).toUpperCase()}
        </span>
        <h3 className="mt-2 max-w-full truncate text-sm font-bold text-strong">{name}</h3>
        {detail.email && <p className="max-w-full truncate text-xs text-subtle">{detail.email}</p>}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Triage */}
        <Section title={t("sectionTriage")}>
          <div className="space-y-2.5">
            <div>
              <div className="mb-1 text-[11px] font-medium text-faint">{t("status")}</div>
              <Select
                value={detail.status}
                onChange={(e) => onPatch({ status: e.target.value })}
              >
                {FEEDBACK_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {tStatus(s)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className="mb-1 text-[11px] font-medium text-faint">{t("priority")}</div>
              <Select
                value={detail.priority}
                onChange={(e) => onPatch({ priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {tPriority(p)}
                  </option>
                ))}
              </Select>
            </div>
            {activeAgents && activeAgents.length > 0 ? (
              <div>
                <div className="mb-1 text-[11px] font-medium text-faint">{t("sectionAssignment")}</div>
                <Select
                  value={detail.assigned_to ?? ""}
                  onChange={(e) => onPatch({ assigned_to: e.target.value || null })}
                >
                  <option value="">{t("unassigned")}</option>
                  {activeAgents.map((a) => (
                    <option key={a.user_id} value={a.user_id}>
                      {a.name}
                    </option>
                  ))}
                </Select>
              </div>
            ) : (
              <Row label={t("sectionAssignment")}>{detail.assignee_name ?? t("unassigned")}</Row>
            )}
            <Row label={t("category")}>{detail.category}</Row>
          </div>
        </Section>

        {/* Contact */}
        <Section title={t("sectionContact")}>
          <Row label={t("email")}>{detail.email ?? t("anonymous")}</Row>
          <Row label={t("firstInteraction")}>
            {new Date(detail.created_at).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" })}
          </Row>
        </Section>

        {/* Context */}
        <Section title={t("sectionContext")}>
          <Row label={t("site")}>{detail.domain}</Row>
          <Row label={t("project")}>{detail.project_name}</Row>
          {detail.page_url && (
            <Row label={t("pageUrl")}>
              <a
                href={detail.page_url}
                target="_blank"
                rel="noreferrer"
                className="break-all text-accent hover:underline"
              >
                {detail.page_url}
              </a>
            </Row>
          )}
          {browser && <Row label={t("browser")}>{browser}</Row>}
          {detail.viewport && <Row label={t("viewport")}>{detail.viewport}</Row>}
        </Section>

        {/* Attachments */}
        {detail.attachments.length > 0 && (
          <Section title={`${t("sectionAttachments")} (${detail.attachments.length})`}>
            <div className="grid grid-cols-3 gap-2">
              {detail.attachments.map((a) => (
                // eslint-disable-next-line @next/next/no-img-element
                <a key={a.id} href={`/api/admin/attachments/${a.id}`} target="_blank" rel="noreferrer">
                  <img
                    src={`/api/admin/attachments/${a.id}`}
                    alt={t("attachmentAlt")}
                    className="aspect-square w-full rounded-lg object-cover ring-1 ring-line transition-opacity hover:opacity-80"
                  />
                </a>
              ))}
            </div>
          </Section>
        )}

        {/* Admin note */}
        <Section title={t("sectionNote")} defaultOpen={Boolean(detail.admin_note)}>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={t("notePlaceholder")}
          />
          {note !== (detail.admin_note ?? "") && (
            <button
              onClick={saveNote}
              disabled={noteSaving}
              className="mt-2 inline-flex h-8 items-center rounded-md bg-accent px-3 text-xs font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
            >
              {noteSaving ? t("saving") : t("saveNote")}
            </button>
          )}
        </Section>

        {/* Danger zone */}
        <div className="px-4 py-4">
          <button
            onClick={onDelete}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-danger/30 px-3 text-xs font-semibold text-danger-text transition-colors hover:bg-danger-soft"
          >
            <Icon.trash className="h-3.5 w-3.5" />
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
