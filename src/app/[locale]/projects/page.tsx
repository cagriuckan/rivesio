import { getTranslations } from "next-intl/server";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import CreateProject from "@/components/CreateProject";
import ProjectCard from "@/components/ProjectCard";
import { Icon } from "@/components/ui/Icons";
import { listProjects, parseSettings } from "@/lib/repo";
import { listFeedbacks, listSites } from "@/lib/admin-repo";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ create?: string }> }) {
  const sp = await searchParams;
  const t = await getTranslations("projects");
  const projects = await listProjects();
  const shouldOpenCreate = sp.create === "1";

  // Per-project counts for the card stats.
  const counts = new Map<string, { feedbacks: number; sites: number }>();
  await Promise.all(
    projects.map(async (p) => {
      const [feedbacks, sites] = await Promise.all([
        listFeedbacks({ projectId: p.id }),
        listSites({ projectId: p.id }),
      ]);
      counts.set(p.id, { feedbacks: feedbacks.length, sites: sites.length });
    }),
  );

  return (
    <Shell>
      <PageContent>
      <PageHeader
        icon={Icon.code}
        title={t("title")}
        subtitle={t("subtitle", { count: projects.length })}
        actions={<CreateProject initialOpen={shouldOpenCreate && projects.length > 0} />}
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
            const c = counts.get(p.id)!;
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
                }}
                stats={c}
              />
            );
          })}
        </div>
      )}
      </PageContent>
    </Shell>
  );
}
