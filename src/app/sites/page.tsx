import Link from "next/link";
import Shell from "@/components/Shell";
import SiteActions from "@/components/SiteActions";
import { listSites } from "@/lib/admin-repo";
import { SITE_STATUS_LABEL, formatDate } from "@/lib/labels";
import { Badge, siteVariant } from "@/components/Badge";
import type { SiteStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: SiteStatus[] = ["pending", "approved", "blocked"];

export default async function SitesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const sp = await searchParams;
  const status = (STATUSES as string[]).includes(sp.status ?? "") ? (sp.status as SiteStatus) : undefined;
  const sites = listSites({ status });

  return (
    <Shell>
      <div className="mb-6">
        <h1 className="text-lg font-bold" style={{ color: "var(--color-strong)", letterSpacing: "-0.025em" }}>
          Siteler
        </h1>
        <p className="mt-0.5 text-xs" style={{ color: "var(--color-subtle)" }}>{sites.length} site</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-1.5">
        <FilterChip href="/sites" active={!status}>Tümü</FilterChip>
        {STATUSES.map((s) => (
          <FilterChip key={s} href={`/sites?status=${s}`} active={status === s}>
            {SITE_STATUS_LABEL[s]}
          </FilterChip>
        ))}
      </div>

      <div
        className="overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <table className="ds-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Widget</th>
              <th>Lisans</th>
              <th>Bildirim</th>
              <th>Son görülme</th>
              <th>Durum</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sites.length === 0 && (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm" style={{ color: "var(--color-subtle)" }}>
                  Kayıtlı site yok.
                </td>
              </tr>
            )}
            {sites.map((s) => (
              <tr key={s.id}>
                <td className="font-medium" style={{ color: "var(--color-primary)" }}>{s.domain}</td>
                <td className="text-xs">{s.project_name}</td>
                <td>
                  <code
                    className="rounded px-1.5 py-0.5 text-xs"
                    style={{ backgroundColor: "var(--color-elevated)", color: "var(--color-tertiary)", fontFamily: "var(--font-mono)" }}
                  >
                    {s.license_key ? s.license_key.slice(0, 10) + "…" : "—"}
                  </code>
                </td>
                <td className="text-xs">{s.feedback_count}</td>
                <td className="whitespace-nowrap text-xs">{formatDate(s.last_seen)}</td>
                <td><Badge variant={siteVariant(s.status)} dot>{SITE_STATUS_LABEL[s.status]}</Badge></td>
                <td><SiteActions id={s.id} status={s.status} /></td>
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
      className="rounded-full px-3 py-1.5 text-xs font-semibold transition-all"
      style={
        active
          ? { backgroundColor: "var(--color-accent)", color: "#fff" }
          : { backgroundColor: "var(--color-elevated)", color: "var(--color-secondary)", border: "1px solid var(--color-border)" }
      }
    >
      {children}
    </Link>
  );
}
