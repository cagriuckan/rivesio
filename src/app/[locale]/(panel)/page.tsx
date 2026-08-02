import { getLocale, getTranslations } from "next-intl/server";
import LandingPage from "@/components/landing/LandingPage";
import { Link } from "@/i18n/navigation";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BreakdownCard from "@/components/dashboard/BreakdownCard";
import CategoryCard from "@/components/dashboard/CategoryCard";
import SiteSummaryCard from "@/components/dashboard/SiteSummaryCard";
import TrendChart from "@/components/dashboard/TrendChart";
import QuickOverview from "@/components/dashboard/QuickOverview";
import InboxPreview from "@/components/dashboard/InboxPreview";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import JsonLd from "@/components/seo/JsonLd";
import {
  getStats,
  getStatsWithTrend,
  getDailyTrend,
  getStatusBreakdown,
  getPriorityBreakdown,
  getCategoryBreakdown,
  getOwnedProject,
  listFeedbacks,
  listOwnedProjects,
  countUnreadFeedbacks,
} from "@/lib/admin-repo";
import { getSessionUser } from "@/lib/auth";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import { FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";
import { buildOrganizationWebsiteJsonLd } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type SearchParams = Promise<{ w?: string; period?: string }>;

function pctDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { w, period } = await searchParams;
  const user = await getSessionUser();
  if (!user) {
    const locale = (await getLocale()) as Locale;
    const t = await getTranslations("metadata");
    const jsonLd = buildOrganizationWebsiteJsonLd(locale, t("description"));
    return (
      <>
        <JsonLd data={jsonLd} />
        <LandingPage />
      </>
    );
  }
  const days = period === "7" ? 7 : period === "90" ? 90 : 30;
  const project = w ? await getOwnedProject(user.id, w) : undefined;
  const projectId = project?.id;
  const projects = await listOwnedProjects(user.id);

  const [stats, trend, dailyTrend, statusBd, priorityBd, categories, recentFeedbacks, unread] =
    await Promise.all([
      projectId ? getStats(user.id, projectId) : getStats(user.id),
      getStatsWithTrend(user.id, projectId, days),
      getDailyTrend(user.id, projectId, days),
      getStatusBreakdown(user.id, projectId),
      getPriorityBreakdown(user.id, projectId),
      getCategoryBreakdown(user.id, projectId, 20),
      listFeedbacks(user.id, { projectId, limit: 8 }),
      countUnreadFeedbacks(user.id, projectId),
    ]);

  const t = await getTranslations("dashboard");
  const tStatus = await getTranslations("status");
  const tPriority = await getTranslations("priority");
  const periodLabel = t("periodDays", { days });

  const wq = projectId ? `?w=${projectId}` : "";
  const feedbacksHref = `/feedbacks${wq}`;
  const sitesHref = `/sites${wq}`;
  const projectsHref = "/projects";

  const openFeedbacks = Math.max(0, stats.totalFeedbacks - stats.resolvedFeedbacks - stats.closedFeedbacks);
  const recent = recentFeedbacks;

  const hour = new Date().getHours();
  const greetKey = hour < 6 ? "night" : hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const firstName = (user.name || user.email).split(/[@ ]/)[0];

  if (projects.length === 0) {
    return (
      <PageContent>
        <PageHeader icon={Icon.dashboard} title={t("title")} subtitle={t("subtitle")} />
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-raised">
            <Icon.code className="h-6 w-6 text-subtle" />
          </div>
          <h3 className="mb-1.5 text-base font-semibold text-strong">{t("emptyTitle")}</h3>
          <p className="mb-5 max-w-xs text-sm text-subtle">{t("emptyBody")}</p>
          <Link
            href="/projects?create=1"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            <Icon.plus className="h-4 w-4" />
            {t("createWidget")}
          </Link>
        </div>
      </PageContent>
    );
  }

  return (
    <PageContent>
        <DashboardHeader
          title={t(`greeting_${greetKey}`, { name: firstName })}
          subtitle={project ? project.name : t("snapshot", { open: openFeedbacks, unread })}
          image={user.image}
          days={days}
          projectId={projectId}
        />

        {/* Quick overview */}
        <QuickOverview
          title={t("quickOverview")}
          subtitle={t("quickOverviewSubtitle")}
          stats={[
            {
              label: t("openFeedback"),
              value: openFeedbacks,
              meta: `${stats.totalFeedbacks} ${t("totalAllTime").toLowerCase()}`,
              href: feedbacksHref,
              icon: Icon.inbox,
              tone: "accent",
              delta: { value: pctDelta(trend.current.total, trend.previous.total) },
            },
            {
              label: t("unread"),
              value: unread,
              meta: t("needsReply"),
              href: feedbacksHref,
              icon: Icon.bell,
              tone: "info",
            },
            {
              label: t("highPriority"),
              value: trend.current.highPriority,
              meta: t("periodLabelMeta", { period: periodLabel }),
              href: feedbacksHref,
              icon: Icon.alertTriangle,
              tone: "warning",
            },
            {
              label: t("resolutionRate"),
              value: `%${trend.current.resolutionRate}`,
              meta: t("previous", { value: `%${trend.previous.resolutionRate}` }),
              href: feedbacksHref,
              icon: Icon.checkCircle,
              tone: "success",
              delta: { value: trend.current.resolutionRate - trend.previous.resolutionRate },
            },
          ]}
        />

        {/* Trend + needs attention */}
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.9fr)]">
          <TrendChart data={dailyTrend} label={t("trendLabel", { period: periodLabel })} />
          <Card className="h-full">
            <CardHeader>
              <CardTitle icon={Icon.alertTriangle}>{t("needsAttention")}</CardTitle>
            </CardHeader>
            <CardBody className="space-y-2.5">
              <AttentionRow label={t("new")} value={stats.newFeedbacks} href={`${feedbacksHref}${wq ? "&" : "?"}status=open`} icon={Icon.feedback} tone="info" />
              <AttentionRow label={t("unread")} value={unread} href={feedbacksHref} icon={Icon.bell} tone="info" />
              <AttentionRow label={t("pendingSites")} value={stats.pendingSites} href={`${sitesHref}${wq ? "&" : "?"}status=pending`} icon={Icon.globe} tone="warning" />
            </CardBody>
          </Card>
        </div>

        {/* Inbox preview + breakdowns */}
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <InboxPreview feedbacks={recent} baseHref={feedbacksHref} />
          </div>
          <div className="flex flex-col gap-4">
            <BreakdownCard
              title={t("statusBreakdown")}
              icon={Icon.checkCircle}
              items={FEEDBACK_STATUSES.map((s) => ({ label: tStatus(s), value: statusBd[s], tone: FEEDBACK_TONE[s] }))}
            />
            <BreakdownCard
              title={t("priorityBreakdown")}
              icon={Icon.alertTriangle}
              items={PRIORITIES.map((p) => ({ label: tPriority(p), value: priorityBd[p], tone: PRIORITY_TONE[p] }))}
            />
          </div>
        </div>

        {/* Category + sites */}
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CategoryCard categories={categories} baseHref={feedbacksHref} />
          </div>
          <SiteSummaryCard
            approved={stats.approvedSites}
            pending={stats.pendingSites}
            blocked={stats.blockedSites}
            total={stats.totalSites}
            baseHref={sitesHref}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Link href={projectsHref} className="text-xs font-medium text-subtle hover:text-primary">
            {t("coverage")}: {stats.approvedSites}/{stats.totalSites} · {stats.projects} {t("widgetCount").toLowerCase()}
          </Link>
        </div>
    </PageContent>
  );
}

function AttentionRow({
  label,
  value,
  href,
  icon: IconComp,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  tone: "info" | "warning";
}) {
  const toneClass = { info: "bg-info-soft text-info-text", warning: "bg-warning-soft text-warning-text" };
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-3 transition-colors hover:bg-raised"
    >
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClass[tone]}`}>
        <IconComp className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 text-sm font-medium text-secondary">{label}</span>
      <span className="text-lg font-bold text-strong tnum">{value}</span>
    </Link>
  );
}
