import { notFound } from "next/navigation";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import ProjectSettingsForm from "@/components/projects/ProjectSettingsForm";
import { getProjectById, parseSettings } from "@/lib/repo";
import { DEFAULT_WIDGET_TEXT } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const settings = parseSettings(project);

  return (
    <Shell>
      <PageContent>
        <div className="mb-4">
          <Link
            href="/projects"
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line bg-surface px-3 text-xs font-semibold text-secondary shadow-xs transition-colors hover:border-line-strong hover:bg-raised hover:text-primary"
          >
            <Icon.chevronLeft className="h-3.5 w-3.5" />
            Back to Widgets
          </Link>
        </div>
        <PageHeader icon={Icon.code} title={project.name} subtitle={project.slug} />

        <ProjectSettingsForm
          projectId={project.id}
          initial={{
            categories: settings.categories,
            text: settings.text ?? DEFAULT_WIDGET_TEXT,
            fields: settings.fields ?? [],
          }}
        />
      </PageContent>
    </Shell>
  );
}
