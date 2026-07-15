export interface DonutSegment {
  value: number;
  color: string;
}

/** SVG ring chart — rounded segments with a value/label centered inside. */
export function DonutChart({
  segments,
  size = 128,
  thickness = 16,
  centerValue,
  centerLabel,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  centerValue?: React.ReactNode;
  centerLabel?: React.ReactNode;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const gap = total > 0 ? c * 0.012 : 0;

  let offset = 0;
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s, i) => {
      const frac = s.value / total;
      const len = Math.max(0, frac * c - gap);
      const dashoffset = -offset;
      offset += frac * c;
      return { ...s, len, dashoffset, key: i };
    });

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-inset)" strokeWidth={thickness} />
        {total > 0 &&
          arcs.map((a) => (
            <circle
              key={a.key}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={a.color}
              strokeWidth={thickness}
              strokeDasharray={`${a.len} ${c - a.len}`}
              strokeDashoffset={a.dashoffset}
              strokeLinecap="round"
            />
          ))}
      </svg>
      {(centerValue !== undefined || centerLabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center">
          {centerValue !== undefined && (
            <span className="text-xl font-extrabold leading-none text-strong tnum">{centerValue}</span>
          )}
          {centerLabel && <span className="mt-1 text-[10px] leading-tight text-subtle">{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}

export const TONE_HEX: Record<string, string> = {
  neutral: "var(--color-subtle)",
  accent: "var(--color-accent)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
  info: "var(--color-info)",
  violet: "var(--color-violet)",
};

export const TONE_CYCLE = ["accent", "info", "violet", "success", "warning", "danger"] as const;
