import { Link } from "@/i18n/navigation";
import { cn } from "@/components/ui/cn";
import { Icon } from "@/components/ui/Icons";
import type { Tone } from "@/components/ui/Badge";

const TONE_ICON: Record<Tone, { bg: string; text: string }> = {
  neutral: { bg: "bg-raised",       text: "text-secondary" },
  accent:  { bg: "bg-accent-soft",  text: "text-accent-text" },
  success: { bg: "bg-success-soft", text: "text-success-text" },
  warning: { bg: "bg-warning-soft", text: "text-warning-text" },
  danger:  { bg: "bg-danger-soft",  text: "text-danger-text" },
  info:    { bg: "bg-info-soft",    text: "text-info-text" },
  violet:  { bg: "bg-violet-soft",  text: "text-violet-text" },
};

function TrendPill({ change }: { change: number }) {
  if (change === 0)
    return (
      <span className="rounded-full bg-raised px-2 py-1 text-2xs font-semibold text-subtle">—</span>
    );
  const up = change > 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-2xs font-semibold",
        up ? "bg-success-soft text-success-text" : "bg-danger-soft text-danger-text"
      )}
    >
      <Icon.trendUp className={cn("h-3 w-3", !up && "rotate-180 -scale-x-100")} />
      {up ? "+" : "−"}
      {Math.abs(change)}%
    </span>
  );
}

export default function StatCard({
  label,
  value,
  icon,
  tone = "neutral",
  hint,
  href,
  change,
  changeLabel,
}: {
  label: string;
  value: number | string;
  icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  tone?: Tone;
  hint?: React.ReactNode;
  href?: string;
  change?: number;
  changeLabel?: string;
}) {
  const Ico = icon;
  const t = TONE_ICON[tone];

  const inner = (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", t.bg)}>
            <Ico className={cn("h-[18px] w-[18px]", t.text)} />
          </span>
          <span className="text-sm font-medium text-muted">{label}</span>
        </div>
        <Icon.dots className="h-4 w-4 text-faint" />
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="text-3xl font-bold tracking-tight text-strong tnum leading-none">
          {value}
        </div>
        {change !== undefined && <TrendPill change={change} />}
      </div>
      {hint && <div className="mt-2 text-xs text-subtle">{hint}</div>}
      {changeLabel && <div className="mt-2 text-xs text-subtle">{changeLabel}</div>}
    </>
  );

  const className = cn(
    "group block rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-line transition-all duration-200",
    href && "hover:shadow-md hover:-translate-y-0.5"
  );

  return href ? (
    <Link href={href} className={className}>
      {inner}
    </Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
