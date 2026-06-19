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

export default function ProjectsPage() {
  const projects = listProjects();

  // Per-project counts for the card stats.
  const counts = new Map<string, { feedbacks: number; sites: number }>();
  for (const p of projects) {
    counts.set(p.id, {
      feedbacks: listFeedbacks({ projectId: p.id }).length,
      sites: listSites({ projectId: p.id }).length,
    });
  }

  return (
    <Shell>
      <PageHeader
        title="Widget'lar"
        subtitle={`${projects.length} widget`}
        actions={<CreateProject />}
      />
      <PageContent>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-raised">
            <Icon.code className="h-6 w-6 text-subtle" />
          </div>
          <h3 className="mb-1.5 text-base font-semibold text-strong">Henüz widget yok</h3>
          <p className="mb-5 max-w-xs text-sm text-subtle">
            İlk widget&apos;ını oluştur ve gömme kodunu sitene ekle.
          </p>
          <CreateProject />
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
                  themeSlug: p.theme_slug,
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
