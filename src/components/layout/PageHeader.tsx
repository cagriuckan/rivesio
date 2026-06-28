import type { SVGProps } from "react";

type IconFn = (p: SVGProps<SVGSVGElement>) => React.ReactNode;

export default function PageHeader({
  title,
  subtitle,
  icon: IconComp,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: IconFn;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex shrink-0 flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3.5">
        {IconComp && (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-grad-accent text-white shadow-accent">
            <IconComp className="h-5 w-5" />
          </span>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-strong">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
