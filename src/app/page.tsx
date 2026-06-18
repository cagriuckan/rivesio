import Link from "next/link";
import Shell from "@/components/Shell";
import { getStats } from "@/lib/admin-repo";
import { listProjects } from "@/lib/repo";
import { formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

function Stat({ label, value, href, accent }: { label: string; value: number; href: string; accent?: string }) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700"
    >
      <div className={`text-3xl font-bold ${accent ?? "text-gray-100"}`}>{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </Link>
  );
}

export default function DashboardPage() {
  const stats = getStats();
  const projects = listProjects();

  return (
    <Shell>
      <h1 className="mb-6 text-xl font-bold text-gray-100">Panel</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Yeni geri bildirim" value={stats.newFeedbacks} href="/feedbacks?status=new" accent="text-indigo-400" />
        <Stat label="Toplam geri bildirim" value={stats.totalFeedbacks} href="/feedbacks" />
        <Stat label="Onay bekleyen site" value={stats.pendingSites} href="/sites?status=pending" accent={stats.pendingSites > 0 ? "text-amber-400" : undefined} />
        <Stat label="Widget / tema" value={stats.projects} href="/projects" />
      </div>

      <h2 className="mb-3 mt-10 text-xs font-semibold uppercase tracking-wide text-gray-600">
        Widget&apos;lar
      </h2>
      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Tema</th>
              <th className="px-4 py-3">Oluşturma</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-600 text-sm">
                  Henüz widget yok.{" "}
                  <Link href="/projects" className="text-indigo-400 hover:underline">Widget'lar</Link> sayfasından oluştur.
                </td>
              </tr>
            )}
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-gray-800">
                <td className="px-4 py-3 font-medium text-gray-200">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{p.theme_slug}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(p.created_at)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href="/projects" className="text-indigo-400 text-xs hover:underline">Yönet →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
