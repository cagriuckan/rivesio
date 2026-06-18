import Link from "next/link";
import Shell from "@/components/Shell";
import { getStats } from "@/lib/admin-repo";
import { listProjects } from "@/lib/repo";
import { formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-sm"
    >
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{label}</div>
    </Link>
  );
}

export default function DashboardPage() {
  const stats = getStats();
  const projects = listProjects();

  return (
    <Shell>
      <h1 className="mb-6 text-xl font-bold text-slate-900">Panel</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Yeni geri bildirim" value={stats.newFeedbacks} href="/feedbacks?status=new" />
        <Stat label="Toplam geri bildirim" value={stats.totalFeedbacks} href="/feedbacks" />
        <Stat label="Onay bekleyen site" value={stats.pendingSites} href="/sites?status=pending" />
        <Stat label="Widget / tema" value={stats.projects} href="/projects" />
      </div>

      <h2 className="mb-3 mt-10 text-sm font-semibold uppercase tracking-wide text-slate-500">
        Widget'lar
      </h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Ad</th>
              <th className="px-4 py-2 font-medium">Tema</th>
              <th className="px-4 py-2 font-medium">Oluşturma</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-slate-800">{p.name}</td>
                <td className="px-4 py-2 text-slate-500">{p.theme_slug}</td>
                <td className="px-4 py-2 text-slate-500">{formatDate(p.created_at)}</td>
                <td className="px-4 py-2 text-right">
                  <Link href="/projects" className="text-brand hover:underline">
                    Yönet
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
