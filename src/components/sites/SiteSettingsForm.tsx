"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Checkbox, Input } from "@/components/ui/Field";
import {
  OptionCards,
  SettingsFooter,
  SettingsRow,
  SettingsSectionHeader,
  SettingsTabs,
  Toggle,
} from "@/components/settings/SettingsLayout";
import type { SiteStatus } from "@/lib/types";

type Tab = "general" | "limits";

export interface SiteSettingsInitial {
  status: SiteStatus;
  label: string;
  isFavorite: boolean;
  supportStartsAt: number | null;
  dailyLimitSite: number | null;
  dailyLimitVisitor: number | null;
  supportDays: number | null;
  allowConversation: boolean | null;
}

export interface ProjectDefaults {
  dailyLimitSite: number | null;
  dailyLimitVisitor: number | null;
  supportDays: number | null;
  allowConversation: boolean;
}

export default function SiteSettingsForm({
  siteId,
  initial,
  defaults,
}: {
  siteId: string;
  initial: SiteSettingsInitial;
  defaults: ProjectDefaults;
}) {
  const t = useTranslations("sites");
  const tc = useTranslations("common");
  const ts = useTranslations("settings");

  const [tab, setTab] = useState<Tab>("general");
  const [state, setState] = useState<SiteSettingsInitial>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = useMemo(() => JSON.stringify(state) !== JSON.stringify(initial), [state, initial]);

  function patch(p: Partial<SiteSettingsInitial>) {
    setState((prev) => ({ ...prev, ...p }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: state.status,
          is_favorite: state.isFavorite,
          label: state.label.trim() || null,
          support_starts_at: state.supportStartsAt,
          daily_limit_site: state.dailyLimitSite,
          daily_limit_visitor: state.dailyLimitVisitor,
          support_days: state.supportDays,
          allow_conversation: state.allowConversation,
        }),
      });
      if (res.ok) {
        setSaved(true);
        Object.assign(initial, state);
      }
    } finally {
      setSaving(false);
    }
  }

  const inheritLabel = (v: number | null) =>
    v === null ? t("inherit") : `${v}`;
  const dateValue = state.supportStartsAt
    ? new Date(state.supportStartsAt).toISOString().slice(0, 10)
    : "";

  const tabs: { key: Tab; label: string }[] = [
    { key: "general", label: t("tabGeneral") },
    { key: "limits", label: t("tabLimits") },
  ];

  return (
    <div className="max-w-4xl">
      <SettingsTabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === "general" && (
        <div>
          <SettingsSectionHeader title={t("generalSection")} description={t("generalHint")} />
          <SettingsRow label={t("displayName")} description={t("displayNameHint")}>
            <Input
              value={state.label}
              onChange={(e) => patch({ label: e.target.value })}
              placeholder={t("renamePlaceholder")}
              className="max-w-sm"
            />
          </SettingsRow>
          <SettingsRow label={t("colStatus")} description={t("statusHint")}>
            <OptionCards
              value={state.status}
              onChange={(v) => patch({ status: v })}
              options={[
                { value: "approved" as SiteStatus, title: t("approve") },
                { value: "pending" as SiteStatus, title: t("statusPending") },
                { value: "blocked" as SiteStatus, title: t("block") },
              ]}
            />
          </SettingsRow>
          <SettingsRow label={t("favorite")} description={t("favoriteHint")}>
            <Toggle checked={state.isFavorite} onChange={(v) => patch({ isFavorite: v })} />
          </SettingsRow>
        </div>
      )}

      {tab === "limits" && (
        <div>
          <SettingsSectionHeader title={t("overrideTitle")} description={t("overrideHint")} />
          <InheritNumberRow
            label={t("dailyLimitSite")}
            hint={t("overrideInheritHint")}
            inheritLabel={t("inherit")}
            defaultText={t("inheritedValue", { value: defaults.dailyLimitSite === null ? t("unlimited") : defaults.dailyLimitSite })}
            value={state.dailyLimitSite}
            onChange={(v) => patch({ dailyLimitSite: v })}
          />
          <InheritNumberRow
            label={t("dailyLimitVisitor")}
            hint={t("overrideInheritHint")}
            inheritLabel={t("inherit")}
            defaultText={t("inheritedValue", { value: defaults.dailyLimitVisitor === null ? t("unlimited") : defaults.dailyLimitVisitor })}
            value={state.dailyLimitVisitor}
            onChange={(v) => patch({ dailyLimitVisitor: v })}
          />
          <InheritNumberRow
            label={t("supportDays")}
            hint={t("overrideInheritHint")}
            inheritLabel={t("inherit")}
            suffix={t("daysSuffix")}
            defaultText={t("inheritedValue", { value: defaults.supportDays === null ? t("unlimited") : defaults.supportDays })}
            value={state.supportDays}
            onChange={(v) => patch({ supportDays: v })}
          />
          <SettingsRow label={t("supportStart")} description={t("supportStartHint")}>
            <Input
              type="date"
              value={dateValue}
              onChange={(e) => {
                const ms = e.target.value ? Date.parse(`${e.target.value}T00:00:00Z`) : null;
                patch({ supportStartsAt: Number.isFinite(ms) ? (ms as number) : null });
              }}
              className="max-w-[200px]"
            />
          </SettingsRow>
          <SettingsRow label={t("allowConversation")} description={t("allowConversationSiteHint")}>
            <OptionCards
              columns={3}
              value={state.allowConversation === null ? "inherit" : state.allowConversation ? "yes" : "no"}
              onChange={(v) => patch({ allowConversation: v === "inherit" ? null : v === "yes" })}
              options={[
                { value: "inherit", title: t("inherit"), description: t("inheritedValue", { value: defaults.allowConversation ? tc("yes") : tc("no") }) },
                { value: "yes", title: tc("yes") },
                { value: "no", title: tc("no") },
              ]}
            />
          </SettingsRow>
          <p className="sr-only">{inheritLabel(state.dailyLimitSite)}</p>
        </div>
      )}

      <SettingsFooter
        dirty={dirty}
        saving={saving}
        saved={saved}
        onCancel={() => {
          setState(initial);
          setSaved(false);
        }}
        onSave={save}
        cancelLabel={tc("cancel")}
        saveLabel={ts("saveChanges")}
        savingLabel={tc("saving")}
        savedLabel={ts("saved")}
      />
    </div>
  );
}

function InheritNumberRow({
  label,
  hint,
  inheritLabel,
  defaultText,
  suffix,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  inheritLabel: string;
  defaultText: string;
  suffix?: string;
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  const inherit = value === null;
  return (
    <SettingsRow label={label} description={hint} align="start">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={0}
            disabled={inherit}
            value={inherit ? "" : String(value)}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              onChange(Number.isFinite(n) && n >= 0 ? n : 0);
            }}
            className="h-9 w-24 disabled:opacity-40"
          />
          {suffix && !inherit && <span className="text-xs text-subtle">{suffix}</span>}
          <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-secondary">
            <Checkbox checked={inherit} onChange={(e) => onChange(e.target.checked ? null : 0)} />
            {inheritLabel}
          </label>
        </div>
        {inherit && <p className="text-xs text-faint">{defaultText}</p>}
      </div>
    </SettingsRow>
  );
}
