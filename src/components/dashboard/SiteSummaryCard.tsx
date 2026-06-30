import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

function StatRow({
  label, value, dot, href,
}: {
  label: string;
  value: number;
  dot: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between py-2.5 transition-colors hover:opacity-80 first:pt-0 last:pb-0"
    >
      <span className="flex items-center gap-2 text-sm text-subtle">
        <span className={cn("h-2 w-2 rounded-full shrink-0", dot)} />
        {label}
      </span>
      <span className="text-sm font-semibold text-primary tnum">{value}</span>
    </Link>
  );
}

export default async function SiteSummaryCard({
  approved, pending, blocked, total, baseHref,
}: {
  approved: number;
  pending: number;
  blocked: number;
  total: number;
  baseHref: string;
}) {
  const t = await getTranslations("siteSummary");
  const statusHref = (status: string) => `${baseHref}${baseHref.includes("?") ? "&" : "?"}status=${status}`;
  return (
    <Card>
      <CardHeader>
        <CardTitle icon={Icon.globe}>{t("title")}</CardTitle>
        <Link
          href={baseHref}
          className="flex items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          {t("manage")} <Icon.chevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardBody>
        <div className="divide-y divide-line-soft">
          <StatRow label={t("approved")} value={approved} dot="bg-success" href={statusHref("approved")} />
          <StatRow label={t("pending")} value={pending} dot="bg-warning" href={statusHref("pending")} />
          <StatRow label={t("blocked")} value={blocked} dot="bg-danger" href={statusHref("blocked")} />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="text-xs text-faint">{t("totalRegistered")}</span>
          <span className="text-sm font-semibold text-secondary tnum">{total}</span>
        </div>
      </CardBody>
    </Card>
  );
}
