import type { FeedbackStatus, Priority, SiteStatus } from "@/lib/types";

const FEEDBACK_COLORS: Record<FeedbackStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  planned: "bg-violet-100 text-violet-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
  wontfix: "bg-slate-200 text-slate-600",
};

const PRIORITY_COLORS: Record<Priority, string> = {
  low: "bg-slate-100 text-slate-600",
  normal: "bg-sky-100 text-sky-700",
  high: "bg-red-100 text-red-700",
};

const SITE_COLORS: Record<SiteStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  blocked: "bg-red-100 text-red-700",
};

export function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>
      {children}
    </span>
  );
}

export const feedbackColor = (s: FeedbackStatus) => FEEDBACK_COLORS[s];
export const priorityColor = (p: Priority) => PRIORITY_COLORS[p];
export const siteColor = (s: SiteStatus) => SITE_COLORS[s];
