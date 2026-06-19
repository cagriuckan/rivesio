import Link from "next/link";
import Shell from "@/components/layout/Shell";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import SiteActions from "@/components/SiteActions";
import { Card } from "@/components/ui/Card";
import { Badge, SITE_TONE } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/components/ui/cn";
import { Icon } from "@/components/ui/Icons";
import { listSites } from "@/lib/admin-repo";
import { getProjectById } from "@/lib/repo";
import { SITE_STATUS_LABEL, formatDate } from "@/lib/labels";
import type { SiteStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

export default async function SitesPage({ searchParams }: { searchParams: Promise<{ status?: string; w?: string }> }) {
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "") ? (sp.status as SiteStatus) : undefined;
  const project = sp.w ? getProjectById(sp.w) : undefined;
  const sites = listSites({ status, projectId: project?.id });

  const buildHref = (s?: string) => {
    const p = new URLSearchParams();
    if (project) p.set("w", project.id);
    if (s) p.set("status", s);
    const qs = p.toString();
    return qs ? `/sites?${qs}` : "/sites";
  };

  return (
    <Shell>
      <PageHeader title="Siteler" subtitle={`${sites.length} kayıtlı site`} />
      <PageContent>

      <div className="mb-5 inline-flex items-center gap-0.5 rounded-lg border border-line bg-base p-1">
        <FilterTab href={buildHref()} active={!status}>Tümü</FilterTab>
        {STATUSES.map((s) => (
          <FilterTab key={s} href={buildHref(s)} active={status === s}>
            {SITE_STATUS_LABEL[s]}
          </FilterTab>
        ))}
      </div>

      {sites.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-surface py-24 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-raised">
            <Icon.globe className="h-5 w-5 text-subtle" />
          </div>
          <p className="text-sm font-medium text-secondary">Kayıtlı site yok.</p>
        </div>
      ) : (
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-line">
                {["Domain", "Widget", "Lisans", "Bildirim", "Son görülme", "Durum", ""].map((h, i) => (
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
                  <td className="px-4 py-3">
                    <code className="rounded bg-inset px-1.5 py-0.5 text-2xs text-secondary">
                      {s.license_key ? s.license_key.slice(0, 10) + "…" : "—"}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary tnum">{s.feedback_count}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-subtle">{formatDate(s.last_seen)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={SITE_TONE[s.status]} dot>{SITE_STATUS_LABEL[s.status]}</Badge>
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

function FilterTab({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
        active ? "bg-surface text-primary" : "text-subtle hover:text-primary"
      )}
    >
      {children}
    </Link>
  );
}
