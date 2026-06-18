import Shell from "@/components/Shell";
import CreateProject from "@/components/CreateProject";
import ProjectCard from "@/components/ProjectCard";
import { listProjects, parseSettings } from "@/lib/repo";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const projects = listProjects();

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Widget'lar</h1>
        <CreateProject />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
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
                themeSlug: p.theme_slug,
                widgetKey: p.widget_key,
                accentColor: s.accentColor,
              }}
            />
          );
        })}
      </div>
    </Shell>
  );
}
