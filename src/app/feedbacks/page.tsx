import Link from "next/link";
import Shell from "@/components/Shell";
import FeedbacksList from "@/components/FeedbacksList";
import { listFeedbacks } from "@/lib/admin-repo";
import { FEEDBACK_STATUS_LABEL } from "@/lib/labels";
import { FEEDBACK_STATUSES } from "@/lib/types";
import type { FeedbackStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string; project?: string }>;

export default async function FeedbacksPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const status = (FEEDBACK_STATUSES as string[]).includes(sp.status ?? "")
    ? (sp.status as FeedbackStatus)
    : undefined;

  const feedbacks = listFeedbacks({ status });

  const filterLink = (s?: string) => (s ? `/feedbacks?status=${s}` : "/feedbacks");

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-100">Geri bildirimler</h1>
        <span className="text-sm text-gray-500">{feedbacks.length} kayıt</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip href={filterLink()} active={!status}>Tümü</FilterChip>
        {FEEDBACK_STATUSES.map((s) => (
          <FilterChip key={s} href={filterLink(s)} active={status === s}>
            {FEEDBACK_STATUS_LABEL[s]}
          </FilterChip>
        ))}
      </div>

      <FeedbacksList feedbacks={feedbacks} />
    </Shell>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        active
          ? "bg-indigo-600 text-white"
          : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
