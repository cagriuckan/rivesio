import Link from "next/link";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import StatCard from "@/components/dashboard/StatCard";
import BreakdownCard from "@/components/dashboard/BreakdownCard";
import RecentFeedbacks from "@/components/dashboard/RecentFeedbacks";
import CategoryCard from "@/components/dashboard/CategoryCard";
import SiteSummaryCard from "@/components/dashboard/SiteSummaryCard";
import { Icon } from "@/components/ui/Icons";
import {
  getStats,
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

type SearchParams = Promise<{ w?: string }>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const { w } = await searchParams;
  const project = w ? getProjectById(w) : undefined;
  const projectId = project?.id;
  const projects = listProjects();

  const stats = getStats(projectId);
  const statusBd = getStatusBreakdown(projectId);
  const priorityBd = getPriorityBreakdown(projectId);
  const categories = getCategoryBreakdown(projectId);
  const recent = listFeedbacks({ projectId }).slice(0, 6);

  const resolutionRate =
    stats.totalFeedbacks > 0
      ? Math.round((stats.resolvedFeedbacks / stats.totalFeedbacks) * 100)
      : 0;

  const wq = projectId ? `?w=${projectId}` : "";
  const feedbacksHref = `/feedbacks${wq}`;

  // No widgets created yet → onboarding.
  if (projects.length === 0) {
    return (
      <Shell>
        <PageHeader title="Genel Bakış" subtitle="Geri bildirim kontrol paneli" />
        <PageContent>
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
      <PageHeader
        title="Genel Bakış"
        subtitle={project ? `${project.name} · ${project.theme_slug}` : "Tüm widget'lar birleşik"}
        actions={
          <Link
            href={feedbacksHref}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-3 text-xs font-medium text-secondary transition-colors hover:border-line-strong hover:text-primary"
          >
            <Icon.feedback className="h-3.5 w-3.5" />
            Geri bildirimler
          </Link>
        }
      />
      <PageContent>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Toplam"
          value={stats.totalFeedbacks}
          icon={Icon.inbox}
          tone="accent"
          href={feedbacksHref}
        />
        <StatCard
          label="Yeni"
          value={stats.newFeedbacks}
          icon={Icon.feedback}
          tone="info"
          href={`${feedbacksHref}${wq ? "&" : "?"}status=new`}
          hint={stats.newFeedbacks > 0 ? <span className="font-medium text-info-text">bekliyor</span> : undefined}
        />
        <StatCard
          label="Çözüldü"
          value={stats.resolvedFeedbacks}
          icon={Icon.checkCircle}
          tone="success"
          hint={<span className="font-medium text-success-text">%{resolutionRate}</span>}
        />
        <StatCard
          label="Aktif site"
          value={stats.approvedSites}
          icon={Icon.globe}
          tone="violet"
          href="/sites?status=approved"
          hint={stats.pendingSites > 0 ? <span className="font-medium text-warning-text">{stats.pendingSites} bekliyor</span> : undefined}
        />
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
