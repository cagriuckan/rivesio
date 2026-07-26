import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge, FEEDBACK_TONE, PRIORITY_TONE } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { relativeTime } from "@/lib/time";
import type { FeedbackWithMeta } from "@/lib/admin-repo";
import type { FeedbackStatus } from "@/lib/types";
import {
  CONVERSATION_LABEL_KEY,
  CONVERSATION_TONE,
  getConversationState,
} from "@/components/feedbacks/conversationState";

const AVATAR_HUES = [222, 262, 292, 172, 20, 340, 200, 45];

function avatarStyle(seed: string): React.CSSProperties {
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const hue = AVATAR_HUES[h % AVATAR_HUES.length];
  return { backgroundColor: `hsl(${hue} 70% 92%)`, color: `hsl(${hue} 55% 38%)` };
}

const STATUS_BORDER: Record<FeedbackStatus, string> = {
  new: "border-l-info",
  planned: "border-l-violet",
  in_progress: "border-l-warning",
  resolved: "border-l-success",
  wontfix: "border-l-subtle",
};

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
  const ti = await getTranslations("feedbacks.inbox");
  const tStatus = await getTranslations("status");
  const tPriority = await getTranslations("priority");
  await getLocale();

  const unreadCount = feedbacks.filter((f) => f.unread).length;
  const join = baseHref.includes("?") ? "&" : "?";

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex min-w-0 items-center gap-2">
          <CardTitle icon={Icon.inbox}>{t("recentTitle")}</CardTitle>
          {unreadCount > 0 && (
            <span className="rounded-md bg-accent-soft px-1.5 py-0.5 text-[11px] font-bold text-accent-text tnum">
              {unreadCount}
            </span>
          )}
        </div>
        <Link
          href={baseHref}
          className="flex shrink-0 items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          {tc("all")} <Icon.chevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      {feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-raised">
            <Icon.inbox className="h-5 w-5 text-subtle" />
          </div>
          <p className="text-sm font-medium text-secondary">{t("recentEmpty")}</p>
          <p className="mt-1 max-w-[220px] text-xs text-faint">{t("recentEmptyHint")}</p>
        </div>
      ) : (
        <ul className="divide-y divide-line-soft">
          {feedbacks.map((f) => {
            const name = f.wp_user || f.email || f.domain;
            const conv = getConversationState(f);
            const meta = [f.domain, f.category].filter(Boolean).join(" · ");
            return (
              <li key={f.id}>
                <Link
                  href={`${baseHref}${join}f=${f.id}`}
                  className={cn(
                    "group flex items-start gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-raised",
                    STATUS_BORDER[f.status],
                    f.status === "resolved" && "opacity-70",
                  )}
                >
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={avatarStyle(name)}
                  >
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="flex min-w-0 items-center gap-1.5">
                        <span
                          className={cn(
                            "truncate text-sm",
                            f.unread ? "font-bold text-strong" : "font-medium text-primary",
                          )}
                        >
                          {name}
                        </span>
                        {f.priority === "high" && (
                          <Badge
                            tone={PRIORITY_TONE.high}
                            className="!px-1.5 !py-0 !text-[10px] !leading-4"
                          >
                            {tPriority("high")}
                          </Badge>
                        )}
                      </span>
                      <span className="shrink-0 text-[11px] text-faint tnum">
                        {relativeTime(f.last_activity_at, tt)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span
                        className={cn(
                          "truncate text-xs",
                          f.unread ? "font-medium text-secondary" : "text-subtle",
                        )}
                      >
                        {f.last_message_author === "admin" ? `${t("youPrefix")}: ` : ""}
                        {f.last_message}
                      </span>
                      {f.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" />}
                    </div>
                    {meta && (
                      <p className="mt-1 truncate text-[11px] text-faint">{meta}</p>
                    )}
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge
                        tone={CONVERSATION_TONE[conv]}
                        dot
                        className="!px-1.5 !py-0 !text-[10px] !leading-4"
                      >
                        {ti(CONVERSATION_LABEL_KEY[conv] as "convUnanswered")}
                      </Badge>
                      <Badge
                        tone={FEEDBACK_TONE[f.status]}
                        className="!px-1.5 !py-0 !text-[10px] !leading-4"
                      >
                        {tStatus(f.status)}
                      </Badge>
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
