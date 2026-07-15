import { Card, CardHeader, CardTitle, CardBody } from "@/components/ui/Card";
import { DonutChart, TONE_HEX } from "@/components/ui/DonutChart";
import type { Tone } from "@/components/ui/Badge";

export interface BreakdownItem {
  label: string;
  value: number;
  tone: Tone;
}

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
      <CardBody className="flex items-center gap-5">
        <DonutChart
          size={104}
          thickness={14}
          segments={items.map((i) => ({ value: i.value, color: TONE_HEX[i.tone] }))}
          centerValue={total}
        />
        <ul className="min-w-0 flex-1 space-y-2.5">
          {items.map((i) => {
            const pct = total ? Math.round((i.value / total) * 100) : 0;
            return (
              <li key={i.label} className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: TONE_HEX[i.tone] }} />
                <span className="min-w-0 flex-1 truncate text-sm text-secondary">{i.label}</span>
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
