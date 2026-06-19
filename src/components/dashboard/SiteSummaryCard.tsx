import Link from "next/link";
import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

function Tile({
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
      className="flex flex-col gap-1 rounded-lg border border-line bg-inset p-3 transition-colors hover:border-line-strong"
    >
      <span className="flex items-center gap-1.5 text-xs text-subtle">
        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
        {label}
      </span>
      <span className="text-xl font-bold text-strong tnum">{value}</span>
    </Link>
  );
}

export default function SiteSummaryCard({
  approved, pending, blocked, total, baseHref,
}: {
  approved: number;
  pending: number;
  blocked: number;
  total: number;
  baseHref: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Siteler</CardTitle>
        <Link
          href={baseHref}
          className="flex items-center gap-1 text-xs font-medium text-accent-text hover:underline"
        >
          Yönet <Icon.chevronRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-3 gap-2">
          <Tile label="Onaylı" value={approved} dot="bg-success" href={`${baseHref}?status=approved`} />
          <Tile label="Bekleyen" value={pending} dot="bg-warning" href={`${baseHref}?status=pending`} />
          <Tile label="Engelli" value={blocked} dot="bg-danger" href={`${baseHref}?status=blocked`} />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg bg-raised px-3 py-2">
          <span className="text-xs text-subtle">Toplam kayıtlı site</span>
          <span className="text-sm font-semibold text-primary tnum">{total}</span>
        </div>
      </CardBody>
    </Card>
  );
}
