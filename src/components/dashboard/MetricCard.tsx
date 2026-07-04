import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import type { SVGProps } from "react";

type Tone = "accent" | "info" | "warning" | "success" | "danger";

const TONE_CHIP: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent",
  info: "bg-info-soft text-info-text",
  warning: "bg-warning-soft text-warning-text",
  success: "bg-success-soft text-success-text",
  danger: "bg-danger-soft text-danger-text",
};

export interface Delta {
  value: number; // percent, signed
  positiveIsGood?: boolean;
}

export default function MetricCard({
  label,
  value,
  meta,
  href,
  icon: IconComp,
  tone = "accent",
  delta,
}: {
  label: string;
  value: number | string;
  meta?: string;
  href: string;
  icon: (p: SVGProps<SVGSVGElement>) => React.ReactNode;
  tone?: Tone;
  delta?: Delta;
}) {
  const up = delta ? delta.value > 0 : false;
  const good = delta ? (up === (delta.positiveIsGood ?? true)) : false;

  return (
    <Link
      href={href}
      className="group rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", TONE_CHIP[tone])}>
          <IconComp className="h-[18px] w-[18px]" />
        </span>
        {delta && delta.value !== 0 && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold tnum",
              good ? "bg-success-soft text-success-text" : "bg-danger-soft text-danger-text",
            )}
          >
            <Icon.trendUp className={cn("h-3 w-3", !up && "rotate-180")} />
            {Math.abs(delta.value)}%
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-subtle">{label}</p>
      <div className="mt-1.5 text-3xl font-bold leading-none tracking-tight text-strong tnum">{value}</div>
      {meta && <p className="mt-3 text-xs text-subtle">{meta}</p>}
    </Link>
  );
}
