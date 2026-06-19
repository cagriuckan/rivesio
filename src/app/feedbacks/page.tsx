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
        subtitle={`${project ? project.name : "Tüm widget'lar"} · ${feedbacks.length} kayıt`}
      />
      <div className="flex min-h-[calc(100%-3rem)] flex-col">
        {/* Status filter */}
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-2.5">
          <div className="flex items-center gap-1 rounded-md border border-line bg-raised p-0.5">
            <FilterTab href={buildHref()} active={!status}>Tümü</FilterTab>
            {FEEDBACK_STATUSES.map((s) => (
              <FilterTab key={s} href={buildHref(s)} active={status === s}>
                {FEEDBACK_STATUS_LABEL[s]}
              </FilterTab>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <FeedbacksList feedbacks={feedbacks} initialId={sp.f ?? null} />
        </div>
      </div>
    </Shell>
  );
}

function FilterTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "bg-surface text-primary" : "text-subtle hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
}
