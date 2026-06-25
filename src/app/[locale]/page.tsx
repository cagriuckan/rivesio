import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import BreakdownCard from "@/components/dashboard/BreakdownCard";
import RecentFeedbacks from "@/components/dashboard/RecentFeedbacks";
import CategoryCard from "@/components/dashboard/CategoryCard";
import SiteSummaryCard from "@/components/dashboard/SiteSummaryCard";
import TrendChart from "@/components/dashboard/TrendChart";
import { Icon } from "@/components/ui/Icons";
import {
  getStats,
  getStatsWithTrend,
  getDailyTrend,
  getStatusBreakdown,
  getPriorityBreakdown,
  getCategoryBreakdown,
  listFeedbacks,
} from "@/lib/admin-repo";
import { getProjectById, listProjects } from "@/lib/repo";
import { FEEDBACK_STATUSES, PRIORITIES } from "@/lib/types";
import { FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ w?: string; period?: string }>;

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { w, period } = await searchParams;
  const days = period === "7" ? 7 : period === "90" ? 90 : 30;
  const project = w ? await getProjectById(w) : undefined;
  const projectId = project?.id;
  const projects = await listProjects();

  const [stats, trend, dailyTrend, statusBd, priorityBd, categories, recentAll] = await Promise.all([
    getStats(projectId),
    getStatsWithTrend(projectId, days),
    getDailyTrend(projectId, days),
    getStatusBreakdown(projectId),
    getPriorityBreakdown(projectId),
    getCategoryBreakdown(projectId),
    listFeedbacks({ projectId }),
  ]);
  const recent = recentAll.slice(0, 6);

  const t = await getTranslations("dashboard");
  const tStatus = await getTranslations("status");
  const tPriority = await getTranslations("priority");
  const periodLabel = t("periodDays", { days });

  const wq = projectId ? `?w=${projectId}` : "";
  const feedbacksHref = `/feedbacks${wq}`;

  const buildPeriodHref = (d: number) => {
    const p = new URLSearchParams();
    if (projectId) p.set("w", projectId);
    p.set("period", String(d));
    return `/?${p}`;
  };

  if (projects.length === 0) {
    return (
      <Shell>
        <PageContent>
          <PageHeader icon={Icon.dashboard} title={t("title")} subtitle={t("subtitle")} />
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-raised">
              <Icon.code className="h-6 w-6 text-subtle" />
            </div>
            <h3 className="mb-1.5 text-base font-semibold text-strong">{t("emptyTitle")}</h3>
            <p className="mb-5 max-w-xs text-sm text-subtle">
              {t("emptyBody")}
            </p>
            <Link
              href="/projects"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Icon.plus className="h-4 w-4" />
              {t("createWidget")}
            </Link>
          </div>
        </PageContent>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageContent>
        <PageHeader
          icon={Icon.dashboard}
          title={t("title")}
          subtitle={project ? t("subtitleProject", { name: project.name, theme: project.theme_slug }) : t("subtitleAll")}
          actions={
            <div className="flex items-center gap-2">
              {/* Period switcher */}
              <div className="flex items-center gap-0.5 rounded-md border border-line bg-raised p-0.5">
                {[7, 30, 90].map((d) => (
                  <Link
                    key={d}
                    href={buildPeriodHref(d)}
                    className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                      days === d ? "bg-surface text-primary" : "text-subtle hover:text-primary"
                    }`}
                  >
                    {d}g
                  </Link>
                ))}
              </div>
              <Link
                href={feedbacksHref}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-3 text-xs font-medium text-secondary transition-colors hover:border-line-strong hover:text-primary"
              >
                <Icon.feedback className="h-3.5 w-3.5" />
                {t("feedbacksLink")}
              </Link>
            </div>
          }
        />

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label={t("totalAllTime")}
            value={stats.totalFeedbacks}
            icon={Icon.inbox}
            tone="accent"
            href={feedbacksHref}
            change={pctChange(trend.current.total, trend.previous.total)}
            changeLabel={t("previousPeriod", { period: periodLabel, value: trend.previous.total })}
          />
          <StatCard
            label={t("new")}
            value={stats.newFeedbacks}
            icon={Icon.feedback}
            tone="info"
            href={`${feedbacksHref}${wq ? "&" : "?"}status=new`}
            change={pctChange(trend.current.newCount, trend.previous.newCount)}
            changeLabel={t("previousPeriod", { period: periodLabel, value: trend.previous.newCount })}
          />
          <StatCard
            label={t("resolved")}
            value={stats.resolvedFeedbacks}
            icon={Icon.checkCircle}
            tone="success"
            change={pctChange(trend.current.resolved, trend.previous.resolved)}
            changeLabel={t("previousPeriod", { period: periodLabel, value: trend.previous.resolved })}
          />
          <StatCard
            label={t("highPriority")}
            value={trend.current.highPriority}
            icon={Icon.alertTriangle}
            tone="warning"
            change={pctChange(trend.current.highPriority, trend.previous.highPriority)}
            changeLabel={t("previousPeriod", { period: periodLabel, value: trend.previous.highPriority })}
          />
        </div>

        {/* Secondary KPIs */}
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label={t("resolutionRate")}
            value={`%${trend.current.resolutionRate}`}
            icon={Icon.checkCircle}
            tone="success"
            change={pctChange(trend.current.resolutionRate, trend.previous.resolutionRate)}
            changeLabel={t("previous", { value: `%${trend.previous.resolutionRate}` })}
          />
          <StatCard
            label={t("activeSites")}
            value={stats.approvedSites}
            icon={Icon.globe}
            tone="violet"
            href="/sites?status=approved"
            hint={stats.pendingSites > 0 ? <span className="font-medium text-warning-text">{t("pendingApproval", { count: stats.pendingSites })}</span> : undefined}
          />
          <StatCard
            label={t("widgetCount")}
            value={stats.projects}
            icon={Icon.code}
            tone="neutral"
            href="/projects"
          />
          <StatCard
            label={t("totalSites")}
            value={stats.totalSites}
            icon={Icon.globe}
            tone="neutral"
            href="/sites"
            hint={stats.blockedSites > 0 ? <span className="font-medium text-danger-text">{t("blockedCount", { count: stats.blockedSites })}</span> : undefined}
          />
        </div>

        {/* Trend chart */}
        <div className="mt-4">
          <TrendChart data={dailyTrend} label={t("trendLabel", { period: periodLabel })} />
        </div>

        {/* Recent + sites */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentFeedbacks feedbacks={recent} detailHref={feedbacksHref} />
          </div>
          <SiteSummaryCard
            approved={stats.approvedSites}
            pending={stats.pendingSites}
            blocked={stats.blockedSites}
            total={stats.totalSites}
            baseHref="/sites"
          />
        </div>

        {/* Breakdowns */}
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <BreakdownCard
            title={t("statusBreakdown")}
            items={FEEDBACK_STATUSES.map((s) => ({
              label: tStatus(s),
              value: statusBd[s],
              tone: FEEDBACK_TONE[s],
            }))}
          />
          <BreakdownCard
            title={t("priorityBreakdown")}
            items={PRIORITIES.map((p) => ({
              label: tPriority(p),
              value: priorityBd[p],
              tone: PRIORITY_TONE[p],
            }))}
          />
          <CategoryCard categories={categories} />
        </div>
      </PageContent>
    </Shell>
  );
}
