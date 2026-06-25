import Link from "next/link";
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
import { FEEDBACK_STATUS_LABEL, PRIORITY_LABEL } from "@/lib/labels";
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

  const wq = projectId ? `?w=${projectId}` : "";
  const feedbacksHref = `/feedbacks${wq}`;

  const periodLabel = days === 7 ? "7 gün" : days === 90 ? "90 gün" : "30 gün";
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
          <PageHeader icon={Icon.dashboard} title="Genel Bakış" subtitle="Geri bildirim kontrol paneli" />
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface py-20 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-raised">
              <Icon.code className="h-6 w-6 text-subtle" />
            </div>
            <h3 className="mb-1.5 text-base font-semibold text-strong">İlk widget&apos;ını oluştur</h3>
            <p className="mb-5 max-w-xs text-sm text-subtle">
              Bir widget oluşturduğunda burada geri bildirim istatistiklerini göreceksin.
            </p>
            <Link
              href="/projects"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Icon.plus className="h-4 w-4" />
              Widget oluştur
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
          title="Genel Bakış"
          subtitle={project ? `${project.name} · ${project.theme_slug}` : "Tüm widget'lar birleşik"}
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
                Geri bildirimler
              </Link>
            </div>
          }
        />

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Toplam (tüm zamanlar)"
            value={stats.totalFeedbacks}
            icon={Icon.inbox}
            tone="accent"
            href={feedbacksHref}
            change={pctChange(trend.current.total, trend.previous.total)}
            changeLabel={`Önceki ${periodLabel}: ${trend.previous.total}`}
          />
          <StatCard
            label="Yeni"
            value={stats.newFeedbacks}
            icon={Icon.feedback}
            tone="info"
            href={`${feedbacksHref}${wq ? "&" : "?"}status=new`}
            change={pctChange(trend.current.newCount, trend.previous.newCount)}
            changeLabel={`Önceki ${periodLabel}: ${trend.previous.newCount}`}
          />
          <StatCard
            label="Çözüldü"
            value={stats.resolvedFeedbacks}
            icon={Icon.checkCircle}
            tone="success"
            change={pctChange(trend.current.resolved, trend.previous.resolved)}
            changeLabel={`Önceki ${periodLabel}: ${trend.previous.resolved}`}
          />
          <StatCard
            label="Yüksek öncelik"
            value={trend.current.highPriority}
            icon={Icon.alertTriangle}
            tone="warning"
            change={pctChange(trend.current.highPriority, trend.previous.highPriority)}
            changeLabel={`Önceki ${periodLabel}: ${trend.previous.highPriority}`}
          />
        </div>

        {/* Secondary KPIs */}
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Çözüm oranı"
            value={`%${trend.current.resolutionRate}`}
            icon={Icon.checkCircle}
            tone="success"
            change={pctChange(trend.current.resolutionRate, trend.previous.resolutionRate)}
            changeLabel={`Önceki: %${trend.previous.resolutionRate}`}
          />
          <StatCard
            label="Aktif site"
            value={stats.approvedSites}
            icon={Icon.globe}
            tone="violet"
            href="/sites?status=approved"
            hint={stats.pendingSites > 0 ? <span className="font-medium text-warning-text">{stats.pendingSites} onay bekliyor</span> : undefined}
          />
          <StatCard
            label="Widget sayısı"
            value={stats.projects}
            icon={Icon.code}
            tone="neutral"
            href="/projects"
          />
          <StatCard
            label="Toplam site"
            value={stats.totalSites}
            icon={Icon.globe}
            tone="neutral"
            href="/sites"
            hint={stats.blockedSites > 0 ? <span className="font-medium text-danger-text">{stats.blockedSites} engelli</span> : undefined}
          />
        </div>

        {/* Trend chart */}
        <div className="mt-4">
          <TrendChart data={dailyTrend} label={`Son ${periodLabel} — günlük geri bildirimler`} />
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
            title="Durum dağılımı"
            items={FEEDBACK_STATUSES.map((s) => ({
              label: FEEDBACK_STATUS_LABEL[s],
              value: statusBd[s],
              tone: FEEDBACK_TONE[s],
            }))}
          />
          <BreakdownCard
            title="Öncelik dağılımı"
            items={PRIORITIES.map((p) => ({
              label: PRIORITY_LABEL[p],
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
