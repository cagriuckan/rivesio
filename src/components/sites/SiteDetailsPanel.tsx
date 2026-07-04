"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, SITE_TONE } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icons";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Section, Row } from "@/components/ui/DetailSection";
import { formatDate } from "@/lib/labels";
import type { SiteStatus } from "@/lib/types";
import type { SiteWithCounts } from "@/lib/admin-repo";

export default function SiteDetailsPanel({
  site,
  onChangeStatus,
  onToggleFavorite,
  onDelete,
}: {
  site: SiteWithCounts;
  onChangeStatus: (status: SiteStatus) => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("sites");
  const ts = useTranslations("siteStatus");
  const tc = useTranslations("common");
  const locale = useLocale();

  const statusOptions: Array<{ label: string; status: SiteStatus }> =
    site.status === "approved"
      ? [{ label: t("block"), status: "blocked" }]
      : site.status === "blocked"
        ? [
            { label: t("approve"), status: "approved" },
            { label: t("unblock"), status: "pending" },
          ]
        : [
            { label: t("approve"), status: "approved" },
            { label: t("block"), status: "blocked" },
          ];

  const limitLabel = (value: number | null, fallback: number | null) => {
    if (value !== null) return String(value);
    if (fallback !== null) return `${fallback} (${t("inheritsDefault")})`;
    return t("unlimited");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex flex-col items-center border-b border-line px-4 py-5 text-center">
        <Avatar name={site.domain} size="lg" />
        <div className="mt-2 flex items-center gap-1.5">
          <h3 className="max-w-full truncate text-sm font-bold text-strong">{site.label || site.domain}</h3>
          {Boolean(site.is_favorite) && <Icon.star className="h-3.5 w-3.5 shrink-0 fill-warning text-warning" />}
        </div>
        {site.label && <p className="max-w-full truncate text-xs text-subtle">{site.domain}</p>}
        <div className="mt-2">
          <Badge tone={SITE_TONE[site.status]} dot>{ts(site.status)}</Badge>
        </div>

        {/* Quick actions */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
          {statusOptions.map((option) => (
            <button
              key={option.status}
              type="button"
              onClick={() => onChangeStatus(option.status)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-secondary transition-colors hover:bg-raised hover:text-primary"
            >
              <Icon.checkCircle className="h-3.5 w-3.5 text-subtle" />
              {option.label}
            </button>
          ))}
          <Link
            href={`/sites/${site.id}/settings`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-3 text-xs font-semibold text-secondary transition-colors hover:bg-raised hover:text-primary"
          >
            <Icon.settings className="h-3.5 w-3.5 text-subtle" />
            {t("actionSettings")}
          </Link>
          <ActionMenu
            label={t("actions")}
            groups={[
              [
                {
                  key: "favorite",
                  label: site.is_favorite ? t("actionRemoveFavorite") : t("actionAddFavorite"),
                  icon: Icon.star,
                  onSelect: onToggleFavorite,
                },
              ],
              [{ key: "delete", label: t("actionDelete"), icon: Icon.trash, onSelect: onDelete, danger: true }],
            ]}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Section title={t("sectionOverview")}>
          <Row label={t("colWidget")}>{site.project_name}</Row>
          <Row label={t("sourceLabel")}>
            {site.source === "manual" ? t("sourceManual") : t("sourceAuto")}
          </Row>
          <Row label={t("firstSeen")}>{formatDate(site.first_seen, locale)}</Row>
          <Row label={t("colLastSeen")}>{formatDate(site.last_seen, locale)}</Row>
        </Section>

        <Section title={t("sectionActivity")}>
          <Row label={t("colFeedback")}>{site.feedback_count}</Row>
        </Section>

        <Section title={t("sectionLimits")} defaultOpen={false}>
          <Row label={t("dailyLimitSite")}>
            {limitLabel(site.daily_limit_site, site.project_default_daily_limit_site)}
          </Row>
          <Row label={t("dailyLimitVisitor")}>
            {limitLabel(site.daily_limit_visitor, site.project_default_daily_limit_visitor)}
          </Row>
          <Row label={t("supportDays")}>
            {site.support_days !== null
              ? `${site.support_days} ${t("daysSuffix")}`
              : site.project_default_support_days !== null
                ? `${site.project_default_support_days} ${t("daysSuffix")} (${t("inheritsDefault")})`
                : t("unlimited")}
          </Row>
          <Row label={t("allowConversation")}>
            {(site.allow_conversation ?? site.project_allow_conversation) ? tc("yes") : tc("no")}
          </Row>
        </Section>

        <div className="px-4 py-4">
          <button
            onClick={onDelete}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-danger/30 px-3 text-xs font-semibold text-danger-text transition-colors hover:bg-danger-soft"
          >
            <Icon.trash className="h-3.5 w-3.5" />
            {t("actionDelete")}
          </button>
        </div>
      </div>
    </div>
  );
}
