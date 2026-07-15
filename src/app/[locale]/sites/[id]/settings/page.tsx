import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import { Icon } from "@/components/ui/Icons";
import { Link } from "@/i18n/navigation";
import SiteSettingsForm from "@/components/sites/SiteSettingsForm";
import { getSite, getOwnedProject } from "@/lib/admin-repo";
import { getSessionUser } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { router as authRouter, router } from "better-auth/api";

export const dynamic = "force-dynamic";

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
    <Shell>
      <PageContent>
        <PageHeader
          icon={Icon.globe}
          title={site.label || site.domain}
          subtitle={project.name}
          actions={
            <Link href="/sites" className="
              h-9 px-3.5 text-sm inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap rounded-full transition-all duration-150 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:scale-[.97] disabled:pointer-events-none disabled:opacity-45 select-none
            bg-accent text-white hover:bg-accent-hover shadow-sm">
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
    </Shell>
  );
}
