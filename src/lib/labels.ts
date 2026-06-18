import type { FeedbackStatus, Priority, SiteStatus } from "./types";

export const FEEDBACK_STATUS_LABEL: Record<FeedbackStatus, string> = {
  new: "Yeni",
  planned: "Planlandı",
  in_progress: "Üzerinde",
  resolved: "Çözüldü",
  wontfix: "Yapılmayacak",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: "Düşük",
  normal: "Normal",
  high: "Yüksek",
};

export const SITE_STATUS_LABEL: Record<SiteStatus, string> = {
  pending: "Onay bekliyor",
  approved: "Onaylı",
  blocked: "Engelli",
};

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
