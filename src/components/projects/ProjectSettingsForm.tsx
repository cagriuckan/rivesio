"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/Button";
import { Checkbox, Input, Label, Select } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icons";
import {
  OptionCards,
  SettingsFooter,
  SettingsRow,
  SettingsSectionHeader,
  SettingsTabs,
  Toggle,
} from "@/components/settings/SettingsLayout";
import AgentsPanel from "./AgentsPanel";
import {
  FORM_FIELD_TYPES,
  type FormField,
  type FormFieldType,
  type LocalizedCategory,
  type WidgetLocale,
  type WidgetText,
  type WidgetPosition,
} from "@/lib/types";

interface LimitSettings {
  siteLimit: number | null;
  autoApproveSites: boolean;
  allowConversation: boolean;
  defaultDailyLimitSite: number | null;
  defaultDailyLimitVisitor: number | null;
  defaultSupportDays: number | null;
  isActive: boolean;
}

interface DesignSettings {
  position: WidgetPosition;
  offsetX: number;
  offsetY: number;
  offsetXMobile: number;
  offsetYMobile: number;
  zIndex: number;
  fabStyle: "label" | "icon";
  theme: "auto" | "dark" | "light";
  accentColor: string;
}

interface InitialSettings {
  categories: LocalizedCategory[];
  text: Record<WidgetLocale, WidgetText>;
  fields: FormField[];
  design: DesignSettings;
  limits: LimitSettings;
  logoUrl: string | null;
}

type Tab = "appearance" | "behavior" | "content" | "fields" | "agents";

const ACCENT_SWATCHES = ["#0B1437", "#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"];
const Z_INDEX_PRESETS = [
  { value: 9999, key: "zIndexLow" as const },
  { value: 99999, key: "zIndexNormal" as const },
  { value: 2147483000, key: "zIndexMax" as const },
];
const DEFAULT_OFFSET = 20;
const DEFAULT_OFFSET_MOBILE = 16;
const DEFAULT_Z_INDEX = 99999;

// Keep in sync with logoLimits in src/lib/env.ts.
const MAX_LOGO_BYTES = 512 * 1024;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp"];

const TEXT_KEYS: (keyof WidgetText)[] = [
  "fabLabel",
  "title",
  "categoryLabel",
  "messageLabel",
  "messagePlaceholder",
  "submitLabel",
  "successMessage",
  "errorMessage",
];

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

function emptyCategory(): LocalizedCategory {
  return { value: "", labels: { tr: "", en: "" } };
}

function cleanCategories(list: LocalizedCategory[]): LocalizedCategory[] {
  const out: LocalizedCategory[] = [];
  const seen = new Set<string>();
  for (const c of list) {
    const tr = c.labels.tr.trim();
    const en = c.labels.en.trim();
    if (!tr && !en) continue;
    const value = (c.value.trim() || tr || en).slice(0, 60);
    if (seen.has(value)) continue;
    seen.add(value);
    out.push({
      value,
      labels: {
        tr: (tr || en).slice(0, 60),
        en: (en || tr).slice(0, 60),
      },
    });
  }
  return out;
}

export default function ProjectSettingsForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial: InitialSettings;
}) {
  const t = useTranslations("projectSettings");
  const tc = useTranslations("common");
  const ts = useTranslations("settings");

  const [tab, setTab] = useState<Tab>("appearance");
  const [categories, setCategories] = useState<LocalizedCategory[]>(initial.categories);
  const [text, setText] = useState<Record<WidgetLocale, WidgetText>>(initial.text);
  const [fields, setFields] = useState<FormField[]>(initial.fields);
  const [limits, setLimits] = useState<LimitSettings>(initial.limits);
  const [design, setDesign] = useState<DesignSettings>(initial.design);
  const [logoUrl, setLogoUrl] = useState<string | null>(initial.logoUrl);
  const [logoBusy, setLogoBusy] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [locale, setLocale] = useState<WidgetLocale>("tr");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = useMemo(
    () =>
      JSON.stringify({ categories, text, fields, limits, design }) !==
      JSON.stringify({
        categories: initial.categories,
        text: initial.text,
        fields: initial.fields,
        limits: initial.limits,
        design: initial.design,
      }),
    [categories, text, fields, limits, design, initial],
  );

  function patchLimits(patch: Partial<LimitSettings>) {
    setLimits((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }
  function patchDesign(patch: Partial<DesignSettings>) {
    setDesign((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  }

  async function uploadLogo(file: File) {
    setLogoError(null);
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setLogoError(t("logoErrorType"));
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setLogoError(t("logoErrorSize"));
      return;
    }
    setLogoBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`/api/admin/projects/${projectId}/logo`, { method: "POST", body });
      const data = (await res.json().catch(() => null)) as { logoUrl?: string } | null;
      if (res.ok && data?.logoUrl) setLogoUrl(data.logoUrl);
      else setLogoError(t("logoErrorUpload"));
    } catch {
      setLogoError(t("logoErrorUpload"));
    } finally {
      setLogoBusy(false);
    }
  }

  async function removeLogo() {
    setLogoBusy(true);
    setLogoError(null);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/logo`, { method: "DELETE" });
      if (res.ok) setLogoUrl(null);
      else setLogoError(t("logoErrorUpload"));
    } catch {
      setLogoError(t("logoErrorUpload"));
    } finally {
      setLogoBusy(false);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function setTextField(key: keyof WidgetText, value: string) {
    setText((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }));
    setSaved(false);
  }

  function updateCategoryLabel(i: number, value: string) {
    setCategories((prev) =>
      prev.map((c, idx) =>
        idx === i ? { ...c, labels: { ...c.labels, [locale]: value } } : c,
      ),
    );
    setSaved(false);
  }
  function removeCategory(i: number) {
    setCategories((prev) => prev.filter((_, idx) => idx !== i));
    setSaved(false);
  }
  function addCategory() {
    setCategories((prev) => [...prev, emptyCategory()]);
    setSaved(false);
  }

  function addField() {
    setFields((prev) => [...prev, { id: newId(), type: "text", label: "", required: false }]);
  }
  function updateField(id: string, patch: Partial<FormField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    setSaved(false);
  }
  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
  }
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setFields((prev) => {
      const from = prev.findIndex((f) => f.id === active.id);
      const to = prev.findIndex((f) => f.id === over.id);
      return arrayMove(prev, from, to);
    });
  }

  function reset() {
    setCategories(initial.categories);
    setText(initial.text);
    setFields(initial.fields);
    setLimits(initial.limits);
    setDesign(initial.design);
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const cleanCats = cleanCategories(categories);
      const cleanFields = fields
        .filter((f) => f.label.trim())
        .map((f) => ({
          ...f,
          label: f.label.trim(),
          placeholder: f.placeholder?.trim() || undefined,
          options:
            f.type === "select" ? (f.options ?? []).map((o) => o.trim()).filter(Boolean) : undefined,
        }));
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: cleanCats,
          text,
          fields: cleanFields,
          position: design.position,
          offsetX: design.offsetX,
          offsetY: design.offsetY,
          offsetXMobile: design.offsetXMobile,
          offsetYMobile: design.offsetYMobile,
          zIndex: design.zIndex,
          fabStyle: design.fabStyle,
          theme: design.theme,
          accentColor: design.accentColor,
          siteLimit: limits.siteLimit,
          autoApproveSites: limits.autoApproveSites,
          allowConversation: limits.allowConversation,
          defaultDailyLimitSite: limits.defaultDailyLimitSite,
          defaultDailyLimitVisitor: limits.defaultDailyLimitVisitor,
          defaultSupportDays: limits.defaultSupportDays,
          isActive: limits.isActive,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setCategories(cleanCats);
        Object.assign(initial, {
          categories: cleanCats,
          text,
          fields: cleanFields,
          limits,
          design,
        });
      }
    } finally {
      setSaving(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "appearance", label: t("tabAppearance") },
    { key: "behavior", label: t("tabBehavior") },
    { key: "content", label: t("tabContent") },
    { key: "fields", label: t("tabFields") },
    { key: "agents", label: t("tabAgents") },
  ];

  return (
    <div className="max-w-4xl">
      <SettingsTabs tabs={tabs} value={tab} onChange={setTab} />

      {tab === "appearance" && (
        <div>
          <SettingsSectionHeader title={t("designSection")} description={t("designHint")} />
          <SettingsRow label={t("position")} description={t("positionHint")}>
            <OptionCards
              columns={2}
              value={design.position}
              onChange={(v) => patchDesign({ position: v })}
              options={[
                { value: "bottom-left", title: t("positionBottomLeft"), preview: <FabPreview side="left" accent={design.accentColor} /> },
                { value: "bottom-right", title: t("positionBottomRight"), preview: <FabPreview side="right" accent={design.accentColor} /> },
              ]}
            />
          </SettingsRow>
          <SettingsRow label={t("offsetDesktop")} description={t("offsetDesktopHint")}>
            <OffsetInputs
              offsetX={design.offsetX}
              offsetY={design.offsetY}
              sideLabel={t("offsetSide")}
              bottomLabel={t("offsetBottom")}
              onChangeX={(n) => patchDesign({ offsetX: n })}
              onChangeY={(n) => patchDesign({ offsetY: n })}
              fallback={DEFAULT_OFFSET}
            />
          </SettingsRow>
          <SettingsRow label={t("offsetMobile")} description={t("offsetMobileHint")}>
            <OffsetInputs
              offsetX={design.offsetXMobile}
              offsetY={design.offsetYMobile}
              sideLabel={t("offsetSide")}
              bottomLabel={t("offsetBottom")}
              onChangeX={(n) => patchDesign({ offsetXMobile: n })}
              onChangeY={(n) => patchDesign({ offsetYMobile: n })}
              fallback={DEFAULT_OFFSET_MOBILE}
            />
          </SettingsRow>
          <SettingsRow label={t("zIndex")} description={t("zIndexHint")}>
            <div className="flex flex-col gap-2">
              <OptionCards
                value={String(
                  Z_INDEX_PRESETS.some((p) => p.value === design.zIndex)
                    ? design.zIndex
                    : "custom",
                )}
                onChange={(v) => {
                  if (v === "custom") return;
                  patchDesign({ zIndex: Number(v) });
                }}
                options={[
                  ...Z_INDEX_PRESETS.map((p) => ({
                    value: String(p.value),
                    title: t(p.key),
                  })),
                  ...(Z_INDEX_PRESETS.some((p) => p.value === design.zIndex)
                    ? []
                    : [{ value: "custom", title: t("zIndexCustom") }]),
                ]}
              />
              <label className="flex items-center gap-1.5 text-xs font-medium text-secondary">
                <span className="text-subtle">{t("zIndexCustom")}</span>
                <Input
                  type="number"
                  min={1}
                  max={2147483647}
                  value={String(design.zIndex)}
                  onChange={(e) => {
                    const n = parseInt(e.target.value, 10);
                    patchDesign({
                      zIndex: Number.isFinite(n) ? Math.min(2147483647, Math.max(1, n)) : DEFAULT_Z_INDEX,
                    });
                  }}
                  className="h-9 w-32"
                />
              </label>
            </div>
          </SettingsRow>
          <SettingsRow label={t("fabStyle")} description={t("fabStyleHint")}>
            <OptionCards
              columns={2}
              value={design.fabStyle}
              onChange={(v) => patchDesign({ fabStyle: v })}
              options={[
                { value: "label", title: t("fabStyleLabel") },
                { value: "icon", title: t("fabStyleIcon") },
              ]}
            />
          </SettingsRow>
          <SettingsRow label={t("theme")} description={t("themeHint")}>
            <OptionCards
              value={design.theme}
              onChange={(v) => patchDesign({ theme: v })}
              options={[
                { value: "auto", title: t("themeAuto") },
                { value: "light", title: t("themeLight") },
                { value: "dark", title: t("themeDark") },
              ]}
            />
          </SettingsRow>
          <SettingsRow label={t("accentColor")} description={t("accentColorHint")}>
            <div className="flex flex-wrap items-center gap-2">
              {ACCENT_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-label={c}
                  onClick={() => patchDesign({ accentColor: c })}
                  className="h-7 w-7 rounded-full outline-none transition-transform hover:scale-110"
                  style={{
                    background: c,
                    boxShadow:
                      design.accentColor.toLowerCase() === c.toLowerCase()
                        ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${c}`
                        : "none",
                  }}
                />
              ))}
              <input
                type="color"
                value={design.accentColor}
                onChange={(e) => patchDesign({ accentColor: e.target.value })}
                className="h-7 w-9 cursor-pointer rounded border border-line bg-transparent p-0.5"
                aria-label={t("accentColorCustom")}
              />
            </div>
          </SettingsRow>
          <SettingsRow label={t("logo")} description={t("logoHint")}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-raised">
                  {logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={logoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Icon.image className="h-5 w-5 text-faint" />
                  )}
                </span>
                <label
                  className={
                    "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-xs font-semibold text-secondary shadow-xs transition-colors hover:border-line-strong hover:bg-raised hover:text-primary " +
                    (logoBusy ? "pointer-events-none opacity-50" : "")
                  }
                >
                  <Icon.upload className="h-3.5 w-3.5" />
                  {logoUrl ? t("logoReplace") : t("logoUpload")}
                  <input
                    type="file"
                    accept={ALLOWED_LOGO_TYPES.join(",")}
                    className="hidden"
                    disabled={logoBusy}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void uploadLogo(f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {logoUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-lg"
                    disabled={logoBusy}
                    onClick={() => void removeLogo()}
                  >
                    {tc("delete")}
                  </Button>
                )}
              </div>
              {logoError ? (
                <p className="text-xs text-danger-text">{logoError}</p>
              ) : (
                <p className="text-xs text-subtle">{t("logoConstraints")}</p>
              )}
            </div>
          </SettingsRow>
        </div>
      )}

      {tab === "behavior" && (
        <div>
          <SettingsSectionHeader title={t("limitsSection")} description={t("limitsHint")} />
          <SettingsRow label={t("isActive")} description={t("isActiveHint")}>
            <Toggle checked={limits.isActive} onChange={(v) => patchLimits({ isActive: v })} />
          </SettingsRow>
          <SettingsRow label={t("autoApprove")} description={t("autoApproveHint")}>
            <Toggle checked={limits.autoApproveSites} onChange={(v) => patchLimits({ autoApproveSites: v })} />
          </SettingsRow>
          <SettingsRow label={t("allowConversation")} description={t("allowConversationHint")}>
            <Toggle checked={limits.allowConversation} onChange={(v) => patchLimits({ allowConversation: v })} />
          </SettingsRow>
          <LimitRow label={t("siteLimit")} hint={t("siteLimitHint")} unlimitedLabel={t("unlimited")} value={limits.siteLimit} onChange={(v) => patchLimits({ siteLimit: v })} />
          <LimitRow label={t("dailyLimitSite")} hint={t("dailyLimitSiteHint")} unlimitedLabel={t("unlimited")} value={limits.defaultDailyLimitSite} onChange={(v) => patchLimits({ defaultDailyLimitSite: v })} />
          <LimitRow label={t("dailyLimitVisitor")} hint={t("dailyLimitVisitorHint")} unlimitedLabel={t("unlimited")} value={limits.defaultDailyLimitVisitor} onChange={(v) => patchLimits({ defaultDailyLimitVisitor: v })} />
          <LimitRow label={t("supportDays")} hint={t("supportDaysHint")} unlimitedLabel={t("unlimited")} suffix={t("daysSuffix")} value={limits.defaultSupportDays} onChange={(v) => patchLimits({ defaultSupportDays: v })} />
        </div>
      )}

      {tab === "content" && (
        <div>
          <SettingsSectionHeader
            title={t("textSection")}
            description={t("textHint")}
            link={undefined}
          />
          <div className="flex items-center justify-end pb-4">
            <div className="flex rounded-lg border border-line bg-raised p-0.5">
              {(["tr", "en"] as WidgetLocale[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  className={
                    "rounded px-3 py-1 text-xs font-semibold transition-colors " +
                    (locale === l ? "bg-accent text-white" : "text-subtle hover:text-primary")
                  }
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 border-t border-line pt-5 sm:grid-cols-2">
            {TEXT_KEYS.map((key) => (
              <div key={key}>
                <Label>{t(`text_${key}`)}</Label>
                <Input value={text[locale][key]} onChange={(e) => setTextField(key, e.target.value)} />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <SettingsSectionHeader title={t("categoriesSection")} description={t("categoriesHint")} />
            <div className="flex flex-col gap-2 border-t border-line pt-5">
              {categories.map((c, i) => (
                <div key={c.value || `new-${i}`} className="flex items-center gap-2">
                  <Input
                    value={c.labels[locale]}
                    onChange={(e) => updateCategoryLabel(i, e.target.value)}
                    className="max-w-sm"
                    placeholder={t("categoryLabelPlaceholder", { locale: locale.toUpperCase() })}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeCategory(i)} aria-label={tc("delete")}>
                    <Icon.trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" className="mt-1 w-fit rounded-lg" onClick={addCategory}>
                <Icon.plus className="h-3.5 w-3.5" />
                {t("addCategory")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {tab === "fields" && (
        <div>
          <SettingsSectionHeader title={t("fieldsSection")} description={t("fieldsHint")} />
          <div className="border-t border-line pt-5">
            {fields.length === 0 ? (
              <p className="rounded-xl border border-dashed border-line py-8 text-center text-sm text-subtle">
                {t("noFields")}
              </p>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                  <div className="flex flex-col gap-3">
                    {fields.map((f) => (
                      <SortableFieldRow key={f.id} field={f} onChange={(patch) => updateField(f.id, patch)} onRemove={() => removeField(f.id)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
            <Button type="button" variant="outline" size="sm" className="mt-3 rounded-lg" onClick={addField}>
              <Icon.plus className="h-3.5 w-3.5" />
              {t("addField")}
            </Button>
          </div>
        </div>
      )}

      {tab === "agents" && (
        <AgentsPanel
          projectId={projectId}
          categories={categories.filter((c) => Boolean(c.value.trim()))}
        />
      )}

      <SettingsFooter
        dirty={dirty}
        saving={saving}
        saved={saved}
        onCancel={reset}
        onSave={save}
        cancelLabel={tc("cancel")}
        saveLabel={ts("saveChanges")}
        savingLabel={tc("saving")}
        savedLabel={ts("saved")}
      />
    </div>
  );
}

function FabPreview({ side, accent }: { side: "left" | "right"; accent: string }) {
  return (
    <div className="relative h-full w-full bg-raised">
      <div className="absolute inset-2 rounded bg-surface ring-1 ring-line" />
      <div
        className="absolute bottom-2.5 h-5 w-5 rounded-full shadow"
        style={{ background: accent, [side === "left" ? "left" : "right"]: "10px" }}
      />
    </div>
  );
}

function OffsetInputs({
  offsetX,
  offsetY,
  sideLabel,
  bottomLabel,
  onChangeX,
  onChangeY,
  fallback,
}: {
  offsetX: number;
  offsetY: number;
  sideLabel: string;
  bottomLabel: string;
  onChangeX: (n: number) => void;
  onChangeY: (n: number) => void;
  fallback: number;
}) {
  function parse(raw: string): number {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? Math.min(200, Math.max(0, n)) : fallback;
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-1.5 text-xs font-medium text-secondary">
        <span className="w-10 text-subtle">{sideLabel}</span>
        <Input
          type="number"
          min={0}
          max={200}
          value={String(offsetX)}
          onChange={(e) => onChangeX(parse(e.target.value))}
          className="h-9 w-20"
        />
        <span className="text-faint">px</span>
      </label>
      <label className="flex items-center gap-1.5 text-xs font-medium text-secondary">
        <span className="w-10 text-subtle">{bottomLabel}</span>
        <Input
          type="number"
          min={0}
          max={200}
          value={String(offsetY)}
          onChange={(e) => onChangeY(parse(e.target.value))}
          className="h-9 w-20"
        />
        <span className="text-faint">px</span>
      </label>
    </div>
  );
}

function LimitRow({
  label,
  hint,
  unlimitedLabel,
  value,
  onChange,
  suffix,
}: {
  label: string;
  hint: string;
  unlimitedLabel: string;
  value: number | null;
  onChange: (v: number | null) => void;
  suffix?: string;
}) {
  const unlimited = value === null;
  return (
    <SettingsRow label={label} description={hint}>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          disabled={unlimited}
          value={unlimited ? "" : String(value)}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10);
            onChange(Number.isFinite(n) && n >= 0 ? n : 0);
          }}
          className="h-9 w-24 disabled:opacity-40"
        />
        {suffix && !unlimited && <span className="text-xs text-subtle">{suffix}</span>}
        <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-secondary">
          <Checkbox checked={unlimited} onChange={(e) => onChange(e.target.checked ? null : 0)} />
          {unlimitedLabel}
        </label>
      </div>
    </SettingsRow>
  );
}

function SortableFieldRow({
  field,
  onChange,
  onRemove,
}: {
  field: FormField;
  onChange: (patch: Partial<FormField>) => void;
  onRemove: () => void;
}) {
  const t = useTranslations("projectSettings");
  const tc = useTranslations("common");
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl border border-line bg-surface p-3 shadow-xs">
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-2 cursor-grab text-faint hover:text-subtle active:cursor-grabbing"
          aria-label={t("dragHandle")}
          {...attributes}
          {...listeners}
        >
          <Icon.menu className="h-4 w-4" />
        </button>

        <div className="grid flex-1 gap-3 sm:grid-cols-2">
          <div>
            <Label>{t("fieldType")}</Label>
            <Select value={field.type} onChange={(e) => onChange({ type: e.target.value as FormFieldType })}>
              {FORM_FIELD_TYPES.map((ft) => (
                <option key={ft} value={ft}>
                  {t(`fieldType_${ft}`)}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>{t("fieldLabel")}</Label>
            <Input value={field.label} onChange={(e) => onChange({ label: e.target.value })} />
          </div>

          {field.type !== "checkbox" && (
            <div>
              <Label>{t("fieldPlaceholder")}</Label>
              <Input value={field.placeholder ?? ""} onChange={(e) => onChange({ placeholder: e.target.value })} />
            </div>
          )}

          {field.type === "select" && (
            <div>
              <Label>{t("fieldOptions")}</Label>
              <Input
                value={(field.options ?? []).join(", ")}
                onChange={(e) => onChange({ options: e.target.value.split(",").map((o) => o.trimStart()) })}
                placeholder={t("fieldOptionsPlaceholder")}
              />
            </div>
          )}
        </div>

        <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label={tc("delete")}>
          <Icon.trash className="h-4 w-4" />
        </Button>
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-medium text-secondary">
        <Checkbox checked={field.required} onChange={(e) => onChange({ required: e.target.checked })} />
        {t("fieldRequired")}
      </label>
    </div>
  );
}
