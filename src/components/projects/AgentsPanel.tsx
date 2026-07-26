"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Label } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icons";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { SettingsSectionHeader } from "@/components/settings/SettingsLayout";
import type { AgentMembershipRow, AgentMembershipStatus, LocalizedCategory } from "@/lib/types";
import { categoryLabel, labelForCategoryValue } from "@/lib/categories";

const STATUS_TONE: Record<AgentMembershipStatus, Tone> = {
  invited: "warning",
  active: "success",
  revoked: "neutral",
};

export default function AgentsPanel({
  projectId,
  categories,
}: {
  projectId: string;
  categories: LocalizedCategory[];
}) {
  const t = useTranslations("agents");
  const tc = useTranslations("common");
  const locale = (useLocale() === "en" ? "en" : "tr") as "tr" | "en";
  const [items, setItems] = useState<AgentMembershipRow[] | null>(null);
  const [email, setEmail] = useState("");
  const [allCategories, setAllCategories] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());

  async function load() {
    const res = await fetch(`/api/admin/projects/${projectId}/agents`);
    if (res.ok) {
      const data = await res.json();
      setItems(data.items ?? []);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  function toggleCategory(c: string) {
    setSelectedCategories((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }

  async function invite() {
    const trimmed = email.trim();
    if (!trimmed) return;
    setInviting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, categories: allCategories ? null : selectedCategories }),
      });
      if (res.ok) {
        setEmail("");
        setAllCategories(true);
        setSelectedCategories([]);
        await load();
      } else {
        setError(t("inviteError"));
      }
    } catch {
      setError(tc("connectionError"));
    } finally {
      setInviting(false);
    }
  }

  async function withBusy(id: string, fn: () => Promise<void>) {
    setBusyIds((prev) => new Set(prev).add(id));
    try {
      await fn();
      await load();
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  const patch = (id: string, body: Record<string, unknown>) =>
    withBusy(id, async () => {
      await fetch(`/api/admin/projects/${projectId}/agents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    });

  const remove = (id: string) =>
    withBusy(id, async () => {
      if (!confirm(t("confirmRemove"))) return;
      await fetch(`/api/admin/projects/${projectId}/agents/${id}`, { method: "DELETE" });
    });

  return (
    <div>
      <SettingsSectionHeader title={t("sectionTitle")} description={t("sectionDescription")} />

      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-accent-line/40 bg-accent-soft/40 px-3.5 py-3 text-sm text-accent-text">
        <Icon.sparkles className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{t("premiumBlurb")}</p>
      </div>

      {/* Invite form */}
      <div className="rounded-xl border border-line bg-surface p-4">
        <Label>{t("inviteEmailLabel")}</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("inviteEmailPlaceholder")}
            className="sm:max-w-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") invite();
            }}
          />
          <Button type="button" variant="primary" onClick={invite} disabled={inviting || !email.trim()} className="rounded-lg sm:shrink-0">
            <Icon.users className="h-4 w-4" />
            {inviting ? t("inviteSending") : t("inviteButton")}
          </Button>
        </div>

        <div className="mt-3">
          <Label>{t("inviteCategoriesLabel")}</Label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-secondary">
            <Checkbox checked={allCategories} onChange={(e) => setAllCategories(e.target.checked)} />
            {t("inviteAllCategories")}
          </label>
          {!allCategories && (
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <label
                  key={c.value || categoryLabel(c, locale)}
                  className="flex cursor-pointer items-center gap-1.5 rounded-full border border-line bg-raised px-2.5 py-1 text-xs font-medium text-secondary"
                >
                  <Checkbox
                    checked={selectedCategories.includes(c.value)}
                    onChange={() => toggleCategory(c.value)}
                    disabled={!c.value}
                  />
                  {categoryLabel(c, locale)}
                </label>
              ))}
            </div>
          )}
        </div>
        {error && <p className="mt-2 text-xs text-danger-text">{error}</p>}
      </div>

      {/* Membership list */}
      <div className="mt-6 border-t border-line pt-5">
        {items === null ? (
          <p className="py-6 text-center text-sm text-subtle">{tc("loading")}</p>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-line py-8 text-center text-sm text-subtle">{t("empty")}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((m) => {
              const busy = busyIds.has(m.id);
              return (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3"
                >
                  <Avatar name={m.email} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-strong">{m.email}</span>
                      <Badge tone={STATUS_TONE[m.status]} dot>{t(`status_${m.status}`)}</Badge>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-subtle">
                      {m.categories?.length
                        ? m.categories.map((v) => labelForCategoryValue(categories, v, locale)).join(", ")
                        : t("inviteAllCategories")}
                    </div>
                  </div>
                  <ActionMenu
                    label={t("actions")}
                    disabled={busy}
                    groups={[
                      m.status !== "revoked"
                        ? [{ key: "resend", label: t("actionResend"), icon: Icon.refresh, onSelect: () => patch(m.id, { resend: true }) }]
                        : [],
                      m.status === "revoked"
                        ? [{ key: "remove", label: t("actionRemove"), icon: Icon.trash, onSelect: () => remove(m.id), danger: true }]
                        : [{ key: "revoke", label: t("actionRevoke"), icon: Icon.close, onSelect: () => patch(m.id, { revoke: true }), danger: true }],
                    ].filter((g) => g.length > 0)}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
