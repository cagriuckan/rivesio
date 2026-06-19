import Link from "next/link";
import Shell from "@/components/Shell";
import { getStats } from "@/lib/admin-repo";
import { listProjects } from "@/lib/repo";
import { formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  href,
  accent,
  icon,
}: {
  label: string;
  value: number;
  href: string;
  accent?: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl p-5 transition-all"
      style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span style={{ color: "var(--color-subtle)" }}>{icon}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: "var(--color-subtle)" }}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
      <div
        className="text-3xl font-bold"
        style={{ color: accent ?? "var(--color-strong)", letterSpacing: "-0.03em" }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs font-medium" style={{ color: "var(--color-subtle)" }}>{label}</div>
    </Link>
  );
}

export default function DashboardPage() {
  const stats = getStats();
  const projects = listProjects();

  return (
    <Shell>
      <div className="mb-8">
        <h1
          className="text-lg font-bold"
          style={{ color: "var(--color-strong)", letterSpacing: "-0.025em" }}
        >
          Panel
        </h1>
        <p className="mt-0.5 text-xs" style={{ color: "var(--color-subtle)" }}>
          Geri bildirim özeti
        </p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Yeni geri bildirim"
          value={stats.newFeedbacks}
          href="/feedbacks?status=new"
          accent="var(--color-accent-text)"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>}
        />
        <StatCard
          label="Toplam geri bildirim"
          value={stats.totalFeedbacks}
          href="/feedbacks"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
        />
        <StatCard
          label="Onay bekleyen site"
          value={stats.pendingSites}
          href="/sites?status=pending"
          accent={stats.pendingSites > 0 ? "var(--color-warn-text)" : undefined}
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>}
        />
        <StatCard
          label="Widget / tema"
          value={stats.projects}
          href="/projects"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-4 w-4"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>}
        />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--color-subtle)" }}
        >
          Widget&apos;lar
        </h2>
        <Link href="/projects" className="text-xs font-medium" style={{ color: "var(--color-accent-text)" }}>
          Tümünü gör →
        </Link>
      </div>

      <div
        className="overflow-hidden rounded-xl"
        style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <table className="ds-table">
          <thead>
            <tr>
              <th>Ad</th>
              <th>Tema</th>
              <th>Oluşturma</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 text-center text-sm" style={{ color: "var(--color-subtle)" }}>
                  Henüz widget yok.{" "}
                  <Link href="/projects" className="font-medium" style={{ color: "var(--color-accent-text)" }}>
                    Widget&apos;lar
                  </Link>{" "}
                  sayfasından oluştur.
                </td>
              </tr>
            )}
            {projects.map((p) => (
              <tr key={p.id}>
                <td className="font-medium" style={{ color: "var(--color-primary)" }}>{p.name}</td>
                <td>
                  <code
                    className="rounded px-1.5 py-0.5 text-xs"
                    style={{ backgroundColor: "var(--color-elevated)", color: "var(--color-tertiary)", fontFamily: "var(--font-mono)" }}
                  >
                    {p.theme_slug}
                  </code>
                </td>
                <td>{formatDate(p.created_at)}</td>
                <td className="text-right">
                  <Link href="/projects" className="text-xs font-medium" style={{ color: "var(--color-accent-text)" }}>
                    Yönet →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
