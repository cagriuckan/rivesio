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
      {/* Icon + label */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-col items-start gap-1.5">
          <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", t.bg)}>
            <Ico className={cn("h-4 w-4", t.text)} />
          </span>
          <span className="text-xs font-medium text-subtle">{label}</span>
        </div>
        {href && (
          <Icon.arrowRight className="h-4 w-4 text-faint opacity-0 transition-opacity group-hover:opacity-100" />
        )}
      </div>

      {/* Value */}
      <div className="text-2xl font-bold tracking-tight text-strong tnum">{value}</div>
      {hint && (
        <div className="mt-1 text-xs text-subtle">{hint}</div>
      )}
    </>
  );

  const className = cn(
    "group block rounded-xl border border-line bg-surface p-4 transition-colors",
    href && "hover:border-line-strong"
  );

  return href ? (
    <Link href={href} className={className}>{inner}</Link>
  ) : (
    <div className={className}>{inner}</div>
  );
}
