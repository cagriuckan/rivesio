import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/Shell";
import FeedbackEditor from "@/components/FeedbackEditor";
import { getFeedbackWithMeta } from "@/lib/admin-repo";
import { listAttachments } from "@/lib/repo";
import { formatDate } from "@/lib/labels";

export const dynamic = "force-dynamic";

export default async function FeedbackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fb = getFeedbackWithMeta(id);
  if (!fb) notFound();

  const attachments = listAttachments(id);

  return (
    <Shell>
      <Link href="/feedbacks" className="mb-4 inline-block text-sm text-slate-500 hover:text-slate-800">
        ← Geri bildirimler
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{fb.category}</span>
              <span>·</span>
              <span>{fb.project_name}</span>
              <span>·</span>
              <span>{formatDate(fb.created_at)}</span>
            </div>

            <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
              {fb.message}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
              <Meta label="Site" value={fb.domain} />
              <Meta label="Kullanıcı" value={fb.wp_user || "—"} />
              <Meta label="Sayfa" value={fb.page_url || "—"} link={fb.page_url || undefined} />
              <Meta label="Ekran" value={fb.viewport || "—"} />
            </dl>
          </div>

          {attachments.length > 0 && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-3 text-sm font-semibold text-slate-700">
                Ekler ({attachments.length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {attachments.map((a) => (
                  <a
                    key={a.id}
                    href={`/api/admin/attachments/${a.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-40 overflow-hidden rounded-lg border border-slate-200 hover:border-brand"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/api/admin/attachments/${a.id}`}
                      alt={a.kind}
                      className="h-28 w-full object-cover"
                    />
                    <span className="block px-2 py-1 text-xs text-slate-500">
                      {a.kind === "screenshot" ? "Ekran görüntüsü" : "Yüklenen"}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <FeedbackEditor
            id={fb.id}
            status={fb.status}
            priority={fb.priority}
            note={fb.admin_note || ""}
          />
        </div>
      </div>
    </Shell>
  );
}

function Meta({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="truncate text-slate-700">
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
