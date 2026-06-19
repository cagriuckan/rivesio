import Link from "next/link";
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

export default function StatCard({
  label,
  value,
  icon,
  tone = "neutral",
  hint,
  href,
}: {
  label: string;
  value: number | string;
  icon: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  tone?: Tone;
  hint?: React.ReactNode;
  href?: string;
}) {
  const Ico = icon;
  const t = TONE_ICON[tone];

  const inner = (
    <>
      <div className="mb-4 flex items-center justify-between">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg", t.bg)}>
          <Ico className={cn("h-[18px] w-[18px]", t.text)} />
        </span>
        {href && (
          <Icon.arrowRight className="h-4 w-4 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>
      <div className="text-3xl font-bold tracking-tight text-strong tnum">{value}</div>
      <div className="mt-1 flex items-center gap-1.5 text-sm text-subtle">
        <span>{label}</span>
        {hint && <span className="text-faint">·</span>}
        {hint}
      </div>
    </>
  );

  const className = cn(
    "group block rounded-xl border border-line bg-surface p-5 shadow-sm transition-colors",
    href && "hover:border-line-strong"
  );

  return href ? (
    <Link href={href} className={className}>{inner}</Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
