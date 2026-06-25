// User-facing label strings now live in the i18n message catalogs
// (messages/en.json, messages/tr.json) under the "status", "priority" and
// "siteStatus" namespaces. Use useTranslations / getTranslations to resolve them.

/** Formats a timestamp for display in the given locale (defaults to en). */
export function formatDate(ts: number, locale = "en"): string {
  return new Date(ts).toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
