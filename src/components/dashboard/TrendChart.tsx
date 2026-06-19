"use client";

import type { TrendPoint } from "@/lib/admin-repo";

function shortDate(date: string) {
  const [, m, d] = date.split("-");
  return `${parseInt(d)}/${parseInt(m)}`;
}

export default function TrendChart({
  data,
  label = "Günlük geri bildirimler",
}: {
  data: TrendPoint[];
  label?: string;
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const max = Math.max(...data.map((d) => d.count), 1);
  const n = data.length;

  const VW = 600;
  const BAR_H = 80;
  const LABEL_H = 16;
  const VH = BAR_H + LABEL_H;

  const gap = 3;
  const barW = (VW - gap * (n - 1)) / n;

  // Show ~6 date labels evenly distributed
  const labelStep = Math.max(1, Math.floor(n / 6));

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-subtle">{label}</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight text-strong tnum">{total}</p>
        </div>
        <span className="text-xs text-subtle">{n} gün</span>
      </div>

      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        width="100%"
        height={VH}
        aria-label={label}
        role="img"
        style={{ display: "block", overflow: "visible" }}
      >
        {data.map((d, i) => {
          const x = i * (barW + gap);
          const filled = d.count > 0;
          const h = filled ? Math.max(4, (d.count / max) * BAR_H) : 3;
          const y = BAR_H - h;
          const showLabel = i === 0 || (i + 1) % labelStep === 0 || i === n - 1;

          return (
            <g key={d.date}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={filled ? 2 : 1}
                fill={filled ? "var(--color-accent)" : "var(--color-line-strong)"}
                opacity={filled ? 0.75 : 1}
              />
              {showLabel && (
                <text
                  x={x + barW / 2}
                  y={BAR_H + LABEL_H - 2}
                  textAnchor="middle"
                  fontSize="9"
                  fill="var(--color-subtle)"
                >
                  {shortDate(d.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
