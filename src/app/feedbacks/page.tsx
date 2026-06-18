import Link from "next/link";
import Shell from "@/components/Shell";
import { Badge, feedbackColor, priorityColor } from "@/components/Badge";
import { listFeedbacks } from "@/lib/admin-repo";
import { listProjects } from "@/lib/repo";
import { FEEDBACK_STATUS_LABEL, PRIORITY_LABEL, formatDate } from "@/lib/labels";
import type { FeedbackStatus, Priority } from "@/lib/types";
import { FEEDBACK_STATUSES } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ status?: string; project?: string; priority?: string }>;

export default async function FeedbacksPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const status = (FEEDBACK_STATUSES as string[]).includes(sp.status ?? "")
    ? (sp.status as FeedbackStatus)
    : undefined;
  const priority = ["low", "normal", "high"].includes(sp.priority ?? "")
    ? (sp.priority as Priority)
    : undefined;
  const projectId = sp.project || undefined;

  const projects = listProjects();
  const feedbacks = listFeedbacks({ status, priority, projectId });

  const filterLink = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { status: sp.status, project: sp.project, priority: sp.priority, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `/feedbacks?${qs}` : "/feedbacks";
  };

  return (
    <Shell>
      <h1 className="mb-6 text-xl font-bold text-slate-900">Geri bildirimler</h1>

      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm">
        <Link href={filterLink({ status: undefined })} className={chip(!status)}>
          Tümü
        </Link>
        {FEEDBACK_STATUSES.map((s) => (
          <Link key={s} href={filterLink({ status: s })} className={chip(status === s)}>
            {FEEDBACK_STATUS_LABEL[s]}
          </Link>
        ))}
        {projects.length > 1 && (
          <select
            defaultValue={projectId ?? ""}
            // Plain form-less navigation via querystring.
            className="ml-2 rounded-md border border-slate-300 px-2 py-1 text-sm"
            // Server component: emulate change with links is verbose, so keep it simple.
            disabled
          >
            <option>Tüm widget'lar</option>
          </select>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Tarih</th>
              <th className="px-4 py-2 font-medium">Kategori</th>
              <th className="px-4 py-2 font-medium">Mesaj</th>
              <th className="px-4 py-2 font-medium">Site</th>
              <th className="px-4 py-2 font-medium">Durum</th>
              <th className="px-4 py-2 font-medium">Öncelik</th>
              <th className="px-4 py-2 font-medium">Ek</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Henüz geri bildirim yok.
                </td>
              </tr>
            )}
            {feedbacks.map((f) => (
              <tr key={f.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-2 text-slate-500">
                  {formatDate(f.created_at)}
                </td>
                <td className="px-4 py-2 text-slate-700">{f.category}</td>
                <td className="max-w-xs px-4 py-2">
                  <Link href={`/feedbacks/${f.id}`} className="text-slate-800 hover:text-brand">
                    {f.message.length > 70 ? f.message.slice(0, 70) + "…" : f.message}
                  </Link>
                </td>
                <td className="px-4 py-2 text-slate-500">{f.domain}</td>
                <td className="px-4 py-2">
                  <Badge color={feedbackColor(f.status)}>{FEEDBACK_STATUS_LABEL[f.status]}</Badge>
                </td>
                <td className="px-4 py-2">
                  <Badge color={priorityColor(f.priority)}>{PRIORITY_LABEL[f.priority]}</Badge>
                </td>
                <td className="px-4 py-2 text-slate-500">{f.attachment_count || "—"}</td>
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
