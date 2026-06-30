import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { cn } from "@/components/ui/cn";
import type { Tone } from "@/components/ui/Badge";

export interface BreakdownItem {
  label: string;
  value: number;
  tone: Tone;
}

const BAR: Record<Tone, string> = {
  neutral: "bg-subtle",
  accent:  "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger:  "bg-danger",
  info:    "bg-info",
  violet:  "bg-violet",
};

const DOT = BAR;

export default function BreakdownCard({
  title,
  items,
  action,
  icon,
}: {
  title: string;
  items: BreakdownItem[];
  action?: React.ReactNode;
  icon?: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}) {
  const total = items.reduce((s, i) => s + i.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle icon={icon}>{title}</CardTitle>
        {action}
      </CardHeader>
      <CardBody>
        {/* Segmented bar */}
        <div className="mb-4 flex h-2 w-full gap-0.5 overflow-hidden rounded-full bg-inset">
          {total === 0 ? (
            <div className="h-full w-full bg-line" />
          ) : (
            items
              .filter((i) => i.value > 0)
              .map((i) => (
                <div
                  key={i.label}
                  className={cn("h-full rounded-full", BAR[i.tone])}
                  style={{ width: `${(i.value / total) * 100}%` }}
                />
              ))
          )}
        </div>

        {/* Legend */}
        <ul className="space-y-2.5">
          {items.map((i) => {
            const pct = total ? Math.round((i.value / total) * 100) : 0;
            return (
              <li key={i.label} className="flex items-center gap-2.5">
                <span className={cn("h-2 w-2 shrink-0 rounded-full", DOT[i.tone])} />
                <span className="flex-1 text-sm text-secondary">{i.label}</span>
                <span className="text-sm font-semibold text-primary tnum">{i.value}</span>
                <span className="w-9 text-right text-xs text-faint tnum">{pct}%</span>
              </li>
            );
          })}
        </ul>
      </CardBody>
    </Card>
  );
}
