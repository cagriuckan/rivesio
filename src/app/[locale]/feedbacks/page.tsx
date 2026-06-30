import { getTranslations } from "next-intl/server";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import FeedbacksList from "@/components/feedbacks/FeedbacksList";
import { Icon } from "@/components/ui/Icons";
import { listFeedbacks } from "@/lib/admin-repo";
import { getProjectById } from "@/lib/repo";
import { FEEDBACK_STATUSES } from "@/lib/types";
import type { FeedbackStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string; site?: string; w?: string; f?: string }>;

export default async function FeedbacksPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const status = (FEEDBACK_STATUSES as string[]).includes(sp.status ?? "")
    ? (sp.status as FeedbackStatus)
    : undefined;
  const project = sp.w ? await getProjectById(sp.w) : undefined;
  const feedbacks = await listFeedbacks({ projectId: project?.id });
  const t = await getTranslations("feedbacks");
  const detailOpen = Boolean(sp.f && feedbacks.some((f) => f.id === sp.f));

  const list = (
    <FeedbacksList
      feedbacks={feedbacks}
      initialId={sp.f ?? null}
      initialStatus={status ?? "all"}
      initialSite={sp.site ?? "all"}
    />
  );

  return (
    <Shell>
      <PageContent className={detailOpen ? "flex h-full max-w-none flex-col px-0 py-0" : undefined}>
        {!detailOpen && (
          <PageHeader
            icon={Icon.feedback}
            title={t("title")}
            subtitle={t("subtitle", { name: project ? project.name : t("allWidgets"), count: feedbacks.length })}
          />
        )}
        {list}
      </PageContent>
    </Shell>
  );
}
