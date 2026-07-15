import { Link } from "@/i18n/navigation";
import { cn } from "@/components/ui/cn";
import type { SVGProps } from "react";

type Tone = "accent" | "info" | "warning" | "success";

const TONE_CHIP: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent-text",
  info: "bg-info-soft text-info-text",
  warning: "bg-warning-soft text-warning-text",
  success: "bg-success-soft text-success-text",
};

export interface QuickStat {
  label: string;
  value: number | string;
  meta?: string;
  href: string;
  icon: (p: SVGProps<SVGSVGElement>) => React.ReactNode;
  tone: Tone;
  delta?: { value: number; positiveIsGood?: boolean };
}

export default function QuickOverview({
  title,
  subtitle,
  stats,
}: {
  title: string;
  subtitle: string;
  stats: QuickStat[];
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-line p-5 sm:p-6"
      style={{
        backgroundImage:
          "linear-gradient(120deg, color-mix(in srgb, var(--color-accent) 10%, var(--color-panel)) 0%, color-mix(in srgb, var(--color-info) 12%, var(--color-panel)) 50%, color-mix(in srgb, var(--color-warning) 12%, var(--color-panel)) 100%)",
      }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--color-info)_18%,transparent)] blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 left-1/4 h-52 w-52 rounded-full bg-[color-mix(in_srgb,var(--color-warning)_16%,transparent)] blur-3xl" />

      <div className="relative mb-5">
        <h2 className="text-base font-bold text-strong">{title}</h2>
        <p className="mt-0.5 text-xs text-subtle">{subtitle}</p>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const up = s.delta ? s.delta.value > 0 : false;
          const good = s.delta ? up === (s.delta.positiveIsGood ?? true) : false;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="group flex flex-col rounded-2xl border border-line bg-surface/70 p-4 shadow-sm backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-surface/90 hover:shadow-md"
            >
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", TONE_CHIP[s.tone])}>
                <s.icon className="h-4 w-4" />
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold leading-none tracking-tight text-strong tnum">{s.value}</span>
                {s.delta && s.delta.value !== 0 && (
                  <span className={cn("text-xs font-bold tnum", good ? "text-success-text" : "text-danger-text")}>
                    ({up ? "+" : ""}
                    {s.delta.value}%)
                  </span>
                )}
              </div>
              <p className="mt-1.5 truncate text-sm font-medium text-secondary">{s.label}</p>
              {s.meta && <p className="mt-0.5 truncate text-xs text-subtle">{s.meta}</p>}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
