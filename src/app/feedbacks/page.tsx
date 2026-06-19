import Link from "next/link";
import Shell from "@/components/layout/Shell";
import PageHeader from "@/components/layout/PageHeader";
import FeedbacksList from "@/components/feedbacks/FeedbacksList";
import { cn } from "@/components/ui/cn";
import { listFeedbacks } from "@/lib/admin-repo";
import { getProjectById } from "@/lib/repo";
import { FEEDBACK_STATUS_LABEL } from "@/lib/labels";
import { FEEDBACK_STATUSES } from "@/lib/types";
import type { FeedbackStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string; w?: string; f?: string }>;

export default async function FeedbacksPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const status = (FEEDBACK_STATUSES as string[]).includes(sp.status ?? "")
    ? (sp.status as FeedbackStatus)
    : undefined;
  const project = sp.w ? getProjectById(sp.w) : undefined;

  const feedbacks = listFeedbacks({ status, projectId: project?.id });

  const buildHref = (s?: string) => {
    const p = new URLSearchParams();
    if (project) p.set("w", project.id);
    if (s) p.set("status", s);
    const qs = p.toString();
    return qs ? `/feedbacks?${qs}` : "/feedbacks";
  };

  return (
    <Shell>
      <PageHeader
        title="Geri Bildirimler"
        subtitle={project ? `${project.name} · ${feedbacks.length} kayıt` : `${feedbacks.length} kayıt`}
      />

      {/* Status filter — segmented control */}
      <div className="mb-5 inline-flex items-center gap-0.5 rounded-lg border border-line bg-base p-1">
        <FilterTab href={buildHref()} active={!status}>Tümü</FilterTab>
        {FEEDBACK_STATUSES.map((s) => (
          <FilterTab key={s} href={buildHref(s)} active={status === s}>
            {FEEDBACK_STATUS_LABEL[s]}
          </FilterTab>
        ))}
      </div>

      <FeedbacksList feedbacks={feedbacks} initialId={sp.f ?? null} />
    </Shell>
  );
}

function FilterTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
        active
          ? "bg-surface text-primary shadow-xs"
          : "text-subtle hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
}
