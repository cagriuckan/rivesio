"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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
import { Input, Select, Label } from "@/components/ui/Field";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import {
  FORM_FIELD_TYPES,
  type FormField,
  type FormFieldType,
  type WidgetLocale,
  type WidgetText,
} from "@/lib/types";

interface InitialSettings {
  categories: string[];
  text: Record<WidgetLocale, WidgetText>;
  fields: FormField[];
}

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

export default function ProjectSettingsForm({
  projectId,
  initial,
}: {
  projectId: string;
  initial: InitialSettings;
}) {
  const t = useTranslations("projectSettings");
  const tc = useTranslations("common");
  const router = useRouter();

  const [categories, setCategories] = useState<string[]>(initial.categories);
  const [text, setText] = useState<Record<WidgetLocale, WidgetText>>(initial.text);
  const [fields, setFields] = useState<FormField[]>(initial.fields);
  const [locale, setLocale] = useState<WidgetLocale>("tr");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function setTextField(key: keyof WidgetText, value: string) {
    setText((prev) => ({ ...prev, [locale]: { ...prev[locale], [key]: value } }));
  }

  // ── Categories ───────────────────────────────────────────────
  function updateCategory(i: number, value: string) {
    setCategories((prev) => prev.map((c, idx) => (idx === i ? value : c)));
  }
  function removeCategory(i: number) {
    setCategories((prev) => prev.filter((_, idx) => idx !== i));
  }
  function addCategory() {
    setCategories((prev) => [...prev, ""]);
  }

  // ── Fields ───────────────────────────────────────────────────
  function addField() {
    setFields((prev) => [
      ...prev,
      { id: newId(), type: "text", label: "", required: false },
    ]);
  }
  function updateField(id: string, patch: Partial<FormField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
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

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const cleanCategories = categories.map((c) => c.trim()).filter(Boolean);
      const cleanFields = fields
        .filter((f) => f.label.trim())
        .map((f) => ({
          ...f,
          label: f.label.trim(),
          placeholder: f.placeholder?.trim() || undefined,
          options:
            f.type === "select"
              ? (f.options ?? []).map((o) => o.trim()).filter(Boolean)
              : undefined,
        }));
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: cleanCategories, text, fields: cleanFields }),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Widget text ─────────────────────────────────── */}
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-strong">{t("textSection")}</h3>
          <div className="flex rounded-md border border-line p-0.5">
            {(["tr", "en"] as WidgetLocale[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocale(l)}
                className={
                  "rounded px-3 py-1 text-xs font-medium transition-colors " +
                  (locale === l ? "bg-accent text-white" : "text-subtle hover:text-primary")
                }
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT_KEYS.map((key) => (
            <div key={key}>
              <Label>{t(`text_${key}`)}</Label>
              <Input
                value={text[locale][key]}
                onChange={(e) => setTextField(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* ── Categories ──────────────────────────────────── */}
      <Card className="p-5">
        <h3 className="mb-1 text-sm font-semibold text-strong">{t("categoriesSection")}</h3>
        <p className="mb-4 text-xs text-subtle">{t("categoriesHint")}</p>
        <div className="flex flex-col gap-2">
          {categories.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={c} onChange={(e) => updateCategory(i, e.target.value)} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCategory(i)}
                aria-label={tc("delete")}
              >
                <Icon.trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addCategory}>
          <Icon.plus className="h-3.5 w-3.5" />
          {t("addCategory")}
        </Button>
      </Card>

      {/* ── Form builder ────────────────────────────────── */}
      <Card className="p-5">
        <h3 className="mb-1 text-sm font-semibold text-strong">{t("fieldsSection")}</h3>
        <p className="mb-4 text-xs text-subtle">{t("fieldsHint")}</p>

        {fields.length === 0 ? (
          <p className="rounded-md border border-dashed border-line py-6 text-center text-xs text-subtle">
            {t("noFields")}
          </p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-3">
                {fields.map((f) => (
                  <SortableFieldRow
                    key={f.id}
                    field={f}
                    onChange={(patch) => updateField(f.id, patch)}
                    onRemove={() => removeField(f.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        <Button type="button" variant="outline" size="sm" className="mt-3" onClick={addField}>
          <Icon.plus className="h-3.5 w-3.5" />
          {t("addField")}
        </Button>
      </Card>

      {/* ── Save ────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
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
    </div>
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-line bg-inset p-3"
    >
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
            <Select
              value={field.type}
              onChange={(e) => onChange({ type: e.target.value as FormFieldType })}
            >
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
              <Input
                value={field.placeholder ?? ""}
                onChange={(e) => onChange({ placeholder: e.target.value })}
              />
            </div>
          )}

          {field.type === "select" && (
            <div>
              <Label>{t("fieldOptions")}</Label>
              <Input
                value={(field.options ?? []).join(", ")}
                onChange={(e) =>
                  onChange({ options: e.target.value.split(",").map((o) => o.trimStart()) })
                }
                placeholder={t("fieldOptionsPlaceholder")}
              />
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          aria-label={tc("delete")}
        >
          <Icon.trash className="h-4 w-4" />
        </Button>
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-subtle">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(e) => onChange({ required: e.target.checked })}
          className="h-4 w-4 cursor-pointer accent-accent"
        />
        {t("fieldRequired")}
      </label>
    </div>
  );
}
