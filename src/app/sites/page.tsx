import Link from "next/link";
import Shell from "@/components/Shell";
import SiteActions from "@/components/SiteActions";
import { listSites } from "@/lib/admin-repo";
import { SITE_STATUS_LABEL, formatDate } from "@/lib/labels";
import type { SiteStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

const statusColors: Record<SiteStatus, string> = {
  pending: "bg-amber-500/15 text-amber-300",
  approved: "bg-emerald-500/15 text-emerald-300",
  blocked: "bg-red-500/15 text-red-400",
};

export default async function SitesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "") ? (sp.status as SiteStatus) : undefined;
  const sites = listSites({ status });

  return (
    <Shell>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-100">Siteler</h1>
        <span className="text-sm text-gray-500">{sites.length} site</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip href="/sites" active={!status}>Tümü</FilterChip>
        {STATUSES.map((s) => (
          <FilterChip key={s} href={`/sites?status=${s}`} active={status === s}>
            {SITE_STATUS_LABEL[s]}
          </FilterChip>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Widget</th>
              <th className="px-4 py-3">Lisans</th>
              <th className="px-4 py-3">Bildirim</th>
              <th className="px-4 py-3">Son görülme</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sites.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-600 text-sm">
                  Kayıtlı site yok.
                </td>
              </tr>
            )}
            {sites.map((s) => (
              <tr key={s.id} className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-200">{s.domain}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{s.project_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {s.license_key ? s.license_key.slice(0, 10) + "…" : "—"}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{s.feedback_count}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500 text-xs">{formatDate(s.last_seen)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[s.status]}`}>
                    {SITE_STATUS_LABEL[s.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
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

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        active ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
