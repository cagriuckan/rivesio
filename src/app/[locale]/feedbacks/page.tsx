import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import FeedbacksList from "@/components/feedbacks/FeedbacksList";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { listFeedbacks } from "@/lib/admin-repo";
import { getProjectById } from "@/lib/repo";
import { FEEDBACK_STATUSES } from "@/lib/types";
import type { FeedbackStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string; w?: string; f?: string }>;

export default async function FeedbacksPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const status = (FEEDBACK_STATUSES as string[]).includes(sp.status ?? "")
    ? (sp.status as FeedbackStatus)
    : undefined;
  const project = sp.w ? await getProjectById(sp.w) : undefined;
  const feedbacks = await listFeedbacks({ status, projectId: project?.id });
  const t = await getTranslations("feedbacks");
  const tc = await getTranslations("common");
  const ts = await getTranslations("status");

  const buildHref = (s?: string) => {
    const p = new URLSearchParams();
    if (project) p.set("w", project.id);
    if (s) p.set("status", s);
    const qs = p.toString();
    return qs ? `/feedbacks?${qs}` : "/feedbacks";
  };

  return (
    <Shell>
      <PageContent>
        <PageHeader
          icon={Icon.feedback}
          title={t("title")}
          subtitle={t("subtitle", { name: project ? project.name : t("allWidgets"), count: feedbacks.length })}
        />
        <FeedbacksList
          feedbacks={feedbacks}
          initialId={sp.f ?? null}
          filterBar={
            <div className="flex items-center gap-1 rounded-md border border-line bg-raised p-0.5 w-fit">
              <FilterTab href={buildHref()} active={!status}>{tc("all")}</FilterTab>
              {FEEDBACK_STATUSES.map((s) => (
                <FilterTab key={s} href={buildHref(s)} active={status === s}>
                  {ts(s)}
                </FilterTab>
              ))}
            </div>
          }
        />
      </PageContent>
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
