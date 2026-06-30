import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import SiteActions from "@/components/SiteActions";
import { Card } from "@/components/ui/Card";
import { Badge, SITE_TONE } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { Tabs } from "@/components/ui/Tabs";
import { listSites } from "@/lib/admin-repo";
import { getProjectById } from "@/lib/repo";
import { formatDate } from "@/lib/labels";
import type { SiteStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

export default async function SitesPage({ searchParams }: { searchParams: Promise<{ status?: string; w?: string }> }) {
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "") ? (sp.status as SiteStatus) : undefined;
  const project = sp.w ? await getProjectById(sp.w) : undefined;
  const sites = await listSites({ status, projectId: project?.id });
  const t = await getTranslations("sites");
  const tc = await getTranslations("common");
  const ts = await getTranslations("siteStatus");

  const buildHref = (s?: string) => {
    const p = new URLSearchParams();
    if (project) p.set("w", project.id);
    if (s) p.set("status", s);
    const qs = p.toString();
    return qs ? `/sites?${qs}` : "/sites";
  };

  return (
    <Shell>
      <PageContent>
        <PageHeader icon={Icon.globe} title={t("title")} subtitle={t("subtitle", { count: sites.length })} />

        <Tabs
          className="mb-5"
          linkComponent={Link}
          items={[
            { href: buildHref(), label: tc("all"), active: !status },
            ...STATUSES.map((s) => ({
              href: buildHref(s),
              label: ts(s),
              active: status === s,
            })),
          ]}
        />

        {sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface py-24 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-raised">
              <Icon.globe className="h-5 w-5 text-subtle" />
            </div>
            <p className="text-sm font-medium text-secondary">{t("empty")}</p>
          </div>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-line">
                  {[t("colDomain"), t("colWidget"), t("colFeedback"), t("colLastSeen"), t("colStatus"), ""].map((h, i) => (
                    <th key={i} className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-subtle">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sites.map((s) => (
                  <tr key={s.id} className="border-b border-line-soft transition-colors last:border-0 hover:bg-raised">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.domain} size="sm" />
                        <span className="text-sm font-medium text-primary">{s.domain}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-subtle">{s.project_name}</td>
                    <td className="px-4 py-3 text-sm text-secondary tnum">{s.feedback_count}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-subtle">{formatDate(s.last_seen)}</td>
                    <td className="px-4 py-3">
                      <Badge tone={SITE_TONE[s.status]} dot>{ts(s.status)}</Badge>
                    </td>
                    <td className="px-4 py-3"><SiteActions id={s.id} status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </PageContent>
    </Shell>
  );
}
