import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Badge, FEEDBACK_TONE } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { relativeTime } from "@/lib/time";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

export default async function RecentFeedbacks({
  feedbacks,
  detailHref,
}: {
  feedbacks: FeedbackWithMeta[];
  detailHref: string;
}) {
  const t = await getTranslations("dashboard");
  const tc = await getTranslations("common");
  const ts = await getTranslations("status");
  const tt = await getTranslations("time");
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentTitle")}</CardTitle>
        <Link
          href={detailHref}
          className="flex items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          {tc("all")} <Icon.chevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardBody className="p-0">
        {feedbacks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon.inbox className="mb-2 h-6 w-6 text-faint" />
            <p className="text-sm text-subtle">{t("recentEmpty")}</p>
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
                        {ts(f.status)}
                      </Badge>
                      <span className="truncate text-2xs text-subtle">{f.domain}</span>
                    </div>
                  </div>
                  <span className="shrink-0 text-2xs text-faint tnum">{relativeTime(f.created_at, tt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
