import Link from "next/link";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge, FEEDBACK_TONE } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { FEEDBACK_STATUS_LABEL } from "@/lib/labels";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m}dk`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}sa`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}g`;
  return `${Math.floor(d / 30)}ay`;
}

export default function RecentFeedbacks({
  feedbacks,
  detailHref,
}: {
  feedbacks: FeedbackWithMeta[];
  detailHref: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Son geri bildirimler</CardTitle>
        <Link
          href={detailHref}
          className="flex items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          Tümü <Icon.chevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        {feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon.inbox className="mb-2 h-6 w-6 text-faint" />
            <p className="text-sm text-subtle">Henüz geri bildirim yok.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line-soft">
            {feedbacks.map((f) => (
              <li key={f.id}>
                <Link
                  href={`${detailHref}${detailHref.includes("?") ? "&" : "?"}f=${f.id}`}
                  className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-raised"
                >
                  <Avatar name={f.wp_user || f.domain} size="sm" className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary">{f.message}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge tone={FEEDBACK_TONE[f.status]} dot>
                        {FEEDBACK_STATUS_LABEL[f.status]}
                      </Badge>
                      <span className="truncate text-2xs text-subtle">{f.domain}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-2xs text-faint tnum">{relativeTime(f.created_at)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
