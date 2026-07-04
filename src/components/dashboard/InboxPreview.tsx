import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { relativeTime } from "@/lib/time";
import type { FeedbackWithMeta } from "@/lib/admin-repo";

const AVATAR_HUES = [222, 262, 292, 172, 20, 340, 200, 45];
function avatarStyle(seed: string): React.CSSProperties {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const hue = AVATAR_HUES[h % AVATAR_HUES.length];
  return { backgroundColor: `hsl(${hue} 70% 92%)`, color: `hsl(${hue} 55% 38%)` };
}

/** Recent conversations rendered inbox-style, linking straight into the Inbox. */
export default async function InboxPreview({
  feedbacks,
  baseHref,
}: {
  feedbacks: FeedbackWithMeta[];
  baseHref: string;
}) {
  const t = await getTranslations("dashboard");
  const tc = await getTranslations("common");
  const tt = await getTranslations("time");
  await getLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={Icon.inbox}>{t("recentTitle")}</CardTitle>
        <Link
          href={baseHref}
          className="flex items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          {tc("all")} <Icon.chevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      {feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <Icon.inbox className="mb-2 h-6 w-6 text-faint" />
          <p className="text-sm text-subtle">{t("recentEmpty")}</p>
        </div>
      ) : (
        <ul className="divide-y divide-line-soft">
          {feedbacks.map((f) => {
            const name = f.wp_user || f.email || f.domain;
            return (
              <li key={f.id}>
                <Link
                  href={`${baseHref}${baseHref.includes("?") ? "&" : "?"}f=${f.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-raised"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={avatarStyle(name)}
                  >
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm", f.unread ? "font-bold text-strong" : "font-medium text-primary")}>
                        {name}
                      </span>
                      <span className="shrink-0 text-[11px] text-faint tnum">{relativeTime(f.last_activity_at, tt)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className={cn("truncate text-xs", f.unread ? "font-medium text-secondary" : "text-subtle")}>
                        {f.last_message_author === "admin" ? `${t("youPrefix")}: ` : ""}
                        {f.last_message}
                      </span>
                      {f.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
