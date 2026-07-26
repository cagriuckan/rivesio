import { notFound } from "next/navigation";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import ProjectSettingsForm from "@/components/projects/ProjectSettingsForm";
import { parseSettings } from "@/lib/repo";
import { getOwnedProject } from "@/lib/admin-repo";
import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DEFAULT_WIDGET_TEXT } from "@/lib/types";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

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
    <Shell>
      <PageContent>
        <PageHeader
          icon={Icon.code}
          title={project.name}
          subtitle={project.slug}
          actions={
            <Link
              href="/projects" className="
              h-9 px-3.5 text-sm inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap rounded-full transition-all duration-150 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[.97] disabled:pointer-events-none disabled:opacity-45 select-none
            bg-accent text-white hover:bg-accent-hover shadow-sm">
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
            },
          }}
        />
      </PageContent>
    </Shell>
  );
}
