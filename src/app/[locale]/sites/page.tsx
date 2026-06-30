import { getTranslations } from "next-intl/server";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import SitesTable from "@/components/sites/SitesTable";
import { Icon } from "@/components/ui/Icons";
import { listSites } from "@/lib/admin-repo";
import { getProjectById } from "@/lib/repo";
import type { SiteStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

export default async function SitesPage({ searchParams }: { searchParams: Promise<{ status?: string; w?: string }> }) {
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "") ? (sp.status as SiteStatus) : undefined;
  const project = sp.w ? await getProjectById(sp.w) : undefined;
  const sites = await listSites({ projectId: project?.id });
  const t = await getTranslations("sites");

  return (
    <Shell>
      <PageContent>
        <PageHeader icon={Icon.globe} title={t("title")} subtitle={t("subtitle", { count: sites.length })} />

        <SitesTable sites={sites} initialStatus={status ?? "all"} />
      </PageContent>
    </Shell>
  );
}
