import { getTranslations } from "next-intl/server";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import CreateProject from "@/components/CreateProject";
import ProjectCard from "@/components/ProjectCard";
import { Icon } from "@/components/ui/Icons";
import { parseSettings } from "@/lib/repo";
import {
  countFeedbacksByOwnedProjects,
  countSitesByOwnedProjects,
  listOwnedProjects,
} from "@/lib/admin-repo";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ create?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("projects");
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const projects = await listOwnedProjects(user.id);
  const shouldOpenCreate = sp.create === "1";

  const [feedbackCounts, siteCounts] = await Promise.all([
    countFeedbacksByOwnedProjects(user.id),
    countSitesByOwnedProjects(user.id),
  ]);

  return (
    <PageContent>
      <PageHeader
        icon={Icon.code}
        title={t("title")}
        subtitle={t("subtitle", { count: projects.length })}
        actions={<CreateProject initialOpen={shouldOpenCreate && projects.length > 0} triggerSize="md" />}
      />

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-raised">
            <Icon.code className="h-6 w-6 text-subtle" />
          </div>
          <h3 className="mb-1.5 text-base font-semibold text-strong">{t("emptyTitle")}</h3>
          <p className="mb-5 max-w-xs text-sm text-subtle">{t("emptyBody")}</p>
          <CreateProject initialOpen={shouldOpenCreate} />
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((p) => {
            const s = parseSettings(p);
            return (
              <ProjectCard
                key={p.id}
                baseUrl={env.publicBaseUrl}
                project={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  widgetKey: p.widget_key,
                  accentColor: s.accentColor,
                  logoUrl: s.logoUrl ?? null,
                }}
                stats={{
                  feedbacks: feedbackCounts.get(p.id) ?? 0,
                  sites: siteCounts.get(p.id) ?? 0,
                }}
              />
            );
          })}
        </div>
      )}
    </PageContent>
  );
}
