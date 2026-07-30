import { notFound, redirect } from "next/navigation";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import ProjectSettingsForm from "@/components/projects/ProjectSettingsForm";
import { parseSettings } from "@/lib/repo";
import { getOwnedProject } from "@/lib/admin-repo";
import { getSessionUser } from "@/lib/auth";
import { DEFAULT_WIDGET_TEXT } from "@/lib/types";
import { getTranslations } from "next-intl/server";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const project = await getOwnedProject(user.id, id);
  if (!project) notFound();

  const settings = parseSettings(project);

  const t = await getTranslations("projects");

  return (
    <PageContent>
      <PageHeader
        icon={Icon.code}
        title={project.name}
        subtitle={project.slug}
        actions={
          <Link
            href="/projects"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-accent px-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            <Icon.chevronLeft className="h-3.5 w-3.5" />
            {t("backToProjects")}
          </Link>
        }
      />

      <ProjectSettingsForm
        projectId={project.id}
        initial={{
          categories: settings.categories,
          text: settings.text ?? DEFAULT_WIDGET_TEXT,
          fields: settings.fields ?? [],
          design: {
            position: settings.position,
            offsetX: settings.offsetX ?? 20,
            offsetY: settings.offsetY ?? 20,
            offsetXMobile: settings.offsetXMobile ?? 16,
            offsetYMobile: settings.offsetYMobile ?? 16,
            zIndex: settings.zIndex ?? 99999,
            fabStyle: settings.fabStyle ?? "label",
            theme: settings.theme ?? "auto",
            accentColor: settings.accentColor,
          },
          logoUrl: settings.logoUrl ?? null,
          limits: {
            siteLimit: project.site_limit,
            autoApproveSites: project.auto_approve_sites,
            allowConversation: project.allow_conversation,
            defaultDailyLimitSite: project.default_daily_limit_site,
            defaultDailyLimitVisitor: project.default_daily_limit_visitor,
            defaultSupportDays: project.default_support_days,
            isActive: project.is_active,
          },
        }}
      />
    </PageContent>
  );
}
