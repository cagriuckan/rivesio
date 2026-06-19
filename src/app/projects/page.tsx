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
        <div>
          <h1
            className="text-lg font-bold"
            style={{ color: "var(--color-strong)", letterSpacing: "-0.025em" }}
          >
            Widget&apos;lar
          </h1>
          <p className="mt-0.5 text-xs" style={{ color: "var(--color-subtle)" }}>
            {projects.length} widget
          </p>
        </div>
        <CreateProject />
      </div>

      {projects.length === 0 && (
        <div
          className="rounded-xl p-16 text-center"
          style={{ border: "1px dashed var(--color-border)", backgroundColor: "var(--color-surface)" }}
        >
          <div
            className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--color-elevated)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" style={{ color: "var(--color-subtle)" }}>
              <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <p className="mb-5 text-sm" style={{ color: "var(--color-subtle)" }}>
            Henüz widget yok. İlk widget&apos;ı oluştur.
          </p>
          <CreateProject />
        </div>
      )}

      {projects.length > 0 && (
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
                  themeSlug: p.theme_slug,
                  widgetKey: p.widget_key,
                  accentColor: s.accentColor,
                }}
              />
            );
          })}
        </div>
      )}
    </Shell>
  );
}
