import Link from "next/link";
import Shell from "@/components/Shell";
import { Badge, siteColor } from "@/components/Badge";
import SiteActions from "@/components/SiteActions";
import { listSites } from "@/lib/admin-repo";
import { SITE_STATUS_LABEL, formatDate } from "@/lib/labels";
import type { SiteStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

export default async function SitesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "")
    ? (sp.status as SiteStatus)
    : undefined;
  const sites = listSites({ status });

  return (
    <Shell>
      <h1 className="mb-6 text-xl font-bold text-slate-900">Siteler</h1>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <Link href="/sites" className={chip(!status)}>
          Tümü
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/sites?status=${s}`} className={chip(status === s)}>
            {SITE_STATUS_LABEL[s]}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Domain</th>
              <th className="px-4 py-2 font-medium">Widget</th>
              <th className="px-4 py-2 font-medium">Lisans</th>
              <th className="px-4 py-2 font-medium">Geri bildirim</th>
              <th className="px-4 py-2 font-medium">Son görülme</th>
              <th className="px-4 py-2 font-medium">Durum</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {sites.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Kayıtlı site yok.
                </td>
              </tr>
            )}
            {sites.map((s) => (
              <tr key={s.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-800">{s.domain}</td>
                <td className="px-4 py-2 text-slate-500">{s.project_name}</td>
                <td className="px-4 py-2 font-mono text-xs text-slate-500">
                  {s.license_key ? s.license_key.slice(0, 10) + "…" : "—"}
                </td>
                <td className="px-4 py-2 text-slate-500">{s.feedback_count}</td>
                <td className="whitespace-nowrap px-4 py-2 text-slate-500">
                  {formatDate(s.last_seen)}
                </td>
                <td className="px-4 py-2">
                  <Badge color={siteColor(s.status)}>{SITE_STATUS_LABEL[s.status]}</Badge>
                </td>
                <td className="px-4 py-2">
                  <SiteActions id={s.id} status={s.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}

function chip(active: boolean): string {
  return active
    ? "rounded-full bg-brand px-3 py-1 font-medium text-white"
    : "rounded-full bg-white px-3 py-1 text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100";
}
