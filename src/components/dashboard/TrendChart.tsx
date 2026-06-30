"use client";

import { useTranslations } from "next-intl";
import type { TrendPoint } from "@/lib/admin-repo";

function shortDate(date: string) {
  const [, m, d] = date.split("-");
  return `${parseInt(d)}/${parseInt(m)}`;
}

export default function TrendChart({
  data,
  label,
}: {
  data: TrendPoint[];
  label?: string;
}) {
  const t = useTranslations("trend");
  const chartLabel = label ?? t("defaultLabel");
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = Math.max(...data.map((d) => d.count), 1);
  const n = data.length;

  // Show ~6 date labels evenly distributed
  const labelStep = Math.max(1, Math.floor(n / 6));

  return (
    <div className="flex h-full flex-col rounded-xl border border-line bg-surface p-5">
      <div className="mb-5 flex shrink-0 items-start justify-between">
        <div>
          <p className="text-xs font-medium text-subtle">{chartLabel}</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-strong tnum">{total}</p>
        </div>
        <span className="text-xs text-subtle">{t("days", { count: n })}</span>
      </div>

      {/* Bars — fill remaining vertical space */}
      <div className="flex min-h-[100px] flex-1 items-end gap-[3px]" aria-label={chartLabel} role="img">
        {data.map((d) => {
          const filled = d.count > 0;
          const heightPct = filled ? Math.max(4, (d.count / max) * 100) : 1.5;
          return (
            <div
              key={d.date}
              className="flex-1 rounded-[2px]"
              style={{
                height: `${heightPct}%`,
                background: filled ? "var(--color-accent)" : "var(--color-line-strong)",
                opacity: filled ? 0.75 : 1,
              }}
              title={`${shortDate(d.date)}: ${d.count}`}
            />
          );
        })}
      </div>

      {/* Date labels */}
      <div className="mt-2 flex shrink-0">
        {data.map((d, i) => {
          const showLabel = i === 0 || (i + 1) % labelStep === 0 || i === n - 1;
          return (
            <span key={d.date} className="flex-1 text-center text-[10px] text-subtle">
              {showLabel ? shortDate(d.date) : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}
