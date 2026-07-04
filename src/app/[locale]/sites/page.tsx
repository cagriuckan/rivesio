import { getTranslations } from "next-intl/server";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import SitesPanel from "@/components/sites/SitesPanel";
import AddSiteButton from "@/components/sites/AddSiteButton";
import { Icon } from "@/components/ui/Icons";
import { getOwnedProject, listOwnedProjects, listSites } from "@/lib/admin-repo";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { SiteStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

export default async function SitesPage({ searchParams }: { searchParams: Promise<{ status?: string; w?: string; s?: string }> }) {
  const sp = await searchParams;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const status = (STATUSES as string[]).includes(sp.status ?? "") ? (sp.status as SiteStatus) : undefined;
  const project = sp.w ? await getOwnedProject(user.id, sp.w) : undefined;
  const [sites, projects] = await Promise.all([
    listSites(user.id, { projectId: project?.id }),
    listOwnedProjects(user.id),
  ]);
  const t = await getTranslations("sites");
  const initialSelectedId = sp.s && sites.some((s) => s.id === sp.s) ? sp.s : null;

  return (
    <Shell>
      <PageContent className="flex h-full max-w-none flex-col !p-0">
        <div className="shrink-0 px-5 pt-5">
          <PageHeader
            icon={Icon.globe}
            title={t("title")}
            subtitle={t("subtitle", { count: sites.length })}
            actions={<AddSiteButton projects={projects.map((p) => ({ id: p.id, name: p.name }))} />}
          />
        </div>

        <div className="min-h-0 flex-1 border-t border-line">
          <SitesPanel sites={sites} initialStatus={status ?? "all"} initialSelectedId={initialSelectedId} />
        </div>
      </PageContent>
    </Shell>
  );
}
