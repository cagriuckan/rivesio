type TimeTranslator = (
  key: "justNow" | "minutes" | "hours" | "days" | "months",
  values?: { value: number }
) => string;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

export function relativeTime(ts: number, t: TimeTranslator, now = Date.now()): string {
  const diff = Math.max(0, now - ts);

  if (diff < MINUTE) return t("justNow");
  if (diff < HOUR) return t("minutes", { value: Math.floor(diff / MINUTE) });
  if (diff < DAY) return t("hours", { value: Math.floor(diff / HOUR) });
  if (diff < MONTH) return t("days", { value: Math.floor(diff / DAY) });

  return t("months", { value: Math.floor(diff / MONTH) });
}
