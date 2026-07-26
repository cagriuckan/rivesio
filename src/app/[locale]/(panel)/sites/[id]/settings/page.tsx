import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import SiteSettingsForm from "@/components/sites/SiteSettingsForm";
import { getSite, getOwnedProject } from "@/lib/admin-repo";
import { getSessionUser } from "@/lib/auth";

export default async function SiteSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!user) redirect("/login");
  const site = await getSite(user.id, id);
  if (!site) notFound();
  const project = await getOwnedProject(user.id, site.project_id);
  if (!project) notFound();

  const t = await getTranslations("sites");

  return (
    <PageContent>
      <PageHeader
        icon={Icon.globe}
        title={site.label || site.domain}
        subtitle={project.name}
        actions={
          <Link
            href="/sites"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-accent px-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-hover"
          >
            <Icon.chevronLeft className="h-3.5 w-3.5" />
            {t("backToSites")}
          </Link>
        }
      />
      <SiteSettingsForm
        siteId={site.id}
        initial={{
          status: site.status,
          label: site.label ?? "",
          isFavorite: Boolean(site.is_favorite),
          supportStartsAt: site.support_starts_at,
          dailyLimitSite: site.daily_limit_site,
          dailyLimitVisitor: site.daily_limit_visitor,
          supportDays: site.support_days,
          allowConversation: site.allow_conversation,
        }}
        defaults={{
          dailyLimitSite: project.default_daily_limit_site,
          dailyLimitVisitor: project.default_daily_limit_visitor,
          supportDays: project.default_support_days,
          allowConversation: project.allow_conversation,
        }}
      />
    </PageContent>
  );
}
