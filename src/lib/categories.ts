import type { LocalizedCategory, WidgetLocale } from "./types";

/** Built-in EN labels for the legacy Turkish default category list. */
const LEGACY_CATEGORY_EN: Record<string, string> = {
  Öneri: "Suggestion",
  Hata: "Bug",
  Tasarım: "Design",
  Diğer: "Other",
};

export const DEFAULT_PROJECT_CATEGORIES: LocalizedCategory[] = [
  { value: "Öneri", labels: { tr: "Öneri", en: "Suggestion" } },
  { value: "Hata", labels: { tr: "Hata", en: "Bug" } },
  { value: "Tasarım", labels: { tr: "Tasarım", en: "Design" } },
  { value: "Diğer", labels: { tr: "Diğer", en: "Other" } },
];

/** Normalize stored categories (legacy string[] or LocalizedCategory[]) into the current shape. */
export function normalizeCategories(raw: unknown): LocalizedCategory[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_PROJECT_CATEGORIES.map((c) => ({ ...c, labels: { ...c.labels } }));
  }

  if (typeof raw[0] === "string") {
    return (raw as string[])
      .map((s) => s.trim())
      .filter(Boolean)
      .map((value) => ({
        value,
        labels: { tr: value, en: LEGACY_CATEGORY_EN[value] ?? value },
      }));
  }

  const out: LocalizedCategory[] = [];
  for (const item of raw as Partial<LocalizedCategory>[]) {
    if (!item || typeof item !== "object") continue;
    const tr = (item.labels?.tr ?? "").trim();
    const en = (item.labels?.en ?? "").trim();
    const value = (typeof item.value === "string" ? item.value.trim() : "") || tr || en;
    if (!value || (!tr && !en)) continue;
    out.push({
      value,
      labels: { tr: tr || en, en: en || tr },
    });
  }
  return out.length
    ? out
    : DEFAULT_PROJECT_CATEGORIES.map((c) => ({ ...c, labels: { ...c.labels } }));
}

export function categoryLabel(cat: LocalizedCategory, locale: WidgetLocale): string {
  return cat.labels[locale] || cat.labels.tr || cat.labels.en || cat.value;
}

export function categoryValues(categories: LocalizedCategory[]): string[] {
  return categories.map((c) => c.value);
}

/** Resolve a stored feedback category value to a locale-aware display label. */
export function labelForCategoryValue(
  categories: LocalizedCategory[],
  value: string,
  locale: WidgetLocale,
): string {
  const found = categories.find((c) => c.value === value);
  return found ? categoryLabel(found, locale) : value;
}
