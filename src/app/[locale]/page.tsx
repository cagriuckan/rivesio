import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import BreakdownCard from "@/components/dashboard/BreakdownCard";
import RecentFeedbacks from "@/components/dashboard/RecentFeedbacks";
import CategoryCard from "@/components/dashboard/CategoryCard";
import SiteSummaryCard from "@/components/dashboard/SiteSummaryCard";
import TrendChart from "@/components/dashboard/TrendChart";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
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
  const sitesHref = `/sites${wq}`;
  const projectsHref = "/projects";
  const openFeedbacks = Math.max(0, stats.totalFeedbacks - stats.resolvedFeedbacks);

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
              href="/projects?create=1"
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
          subtitle={project ? project.name : t("subtitleAll")}
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
            </div>
          }
        />

        <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,0.9fr)]">
          <TrendChart data={dailyTrend} label={t("trendLabel", { period: periodLabel })} />
          <ActionQueueCard
            title={t("needsAttention")}
            items={[
              {
                label: t("new"),
                value: stats.newFeedbacks,
                href: `${feedbacksHref}${wq ? "&" : "?"}status=new`,
                icon: Icon.feedback,
                tone: "info",
              },
              {
                label: t("highPriority"),
                value: trend.current.highPriority,
                href: feedbacksHref,
                icon: Icon.alertTriangle,
                tone: "warning",
              },
              {
                label: t("pendingSites"),
                value: stats.pendingSites,
                href: `${sitesHref}${wq ? "&" : "?"}status=pending`,
                icon: Icon.globe,
                tone: "warning",
              },
            ]}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label={t("totalAllTime")}
            value={stats.totalFeedbacks}
            meta={t("previousPeriod", { period: periodLabel, value: trend.previous.total })}
            href={feedbacksHref}
            icon={Icon.inbox}
          />
          <MetricCard
            label={t("openFeedback")}
            value={openFeedbacks}
            meta={`${stats.resolvedFeedbacks} ${t("resolved").toLowerCase()}`}
            href={feedbacksHref}
            icon={Icon.feedback}
          />
          <MetricCard
            label={t("resolutionRate")}
            value={`%${trend.current.resolutionRate}`}
            meta={t("previous", { value: `%${trend.previous.resolutionRate}` })}
            href={feedbacksHref}
            icon={Icon.checkCircle}
          />
          <MetricCard
            label={t("coverage")}
            value={`${stats.approvedSites}/${stats.totalSites}`}
            meta={`${stats.projects} ${t("widgetCount").toLowerCase()}`}
            href={projectsHref}
            icon={Icon.code}
          />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <BreakdownCard
            title={t("statusBreakdown")}
            icon={Icon.checkCircle}
            items={FEEDBACK_STATUSES.map((s) => ({
              label: tStatus(s),
              value: statusBd[s],
              tone: FEEDBACK_TONE[s],
            }))}
          />
          <BreakdownCard
            title={t("priorityBreakdown")}
            icon={Icon.alertTriangle}
            items={PRIORITIES.map((p) => ({
              label: tPriority(p),
              value: priorityBd[p],
              tone: PRIORITY_TONE[p],
            }))}
          />
          <CategoryCard categories={categories} />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RecentFeedbacks feedbacks={recent} detailHref={feedbacksHref} />
          </div>
          <SiteSummaryCard
            approved={stats.approvedSites}
            pending={stats.pendingSites}
            blocked={stats.blockedSites}
            total={stats.totalSites}
            baseHref={sitesHref}
          />
        </div>
      </PageContent>
    </Shell>
  );
}

function MetricCard({
  label,
  value,
  meta,
  href,
  icon: IconComp,
}: {
  label: string;
  value: number | string;
  meta: string;
  href: string;
  icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
          <IconComp className="h-[18px] w-[18px]" />
        </span>
        <Icon.chevronRight className="h-4 w-4 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-subtle" />
      </div>
      <p className="text-xs font-medium text-subtle">{label}</p>
      <div className="mt-2 text-3xl font-bold leading-none tracking-tight text-strong tnum">{value}</div>
      <p className="mt-3 text-xs text-subtle">{meta}</p>
    </Link>
  );
}

function ActionQueueCard({
  title,
  items,
}: {
  title: string;
  items: {
    label: string;
    value: number;
    href: string;
    icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
    tone: "info" | "warning";
  }[];
}) {
  const toneClass = {
    info: "bg-info-soft text-info-text",
    warning: "bg-warning-soft text-warning-text",
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle icon={Icon.alertTriangle}>{title}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-3">
        {items.map((item) => {
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-3 transition-colors hover:bg-raised"
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneClass[item.tone]}`}>
                <ItemIcon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-secondary">{item.label}</span>
              <span className="text-lg font-bold text-strong tnum">{item.value}</span>
            </Link>
          );
        })}
      </CardBody>
    </Card>
  );
}
