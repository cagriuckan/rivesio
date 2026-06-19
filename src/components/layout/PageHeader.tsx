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
    <div className="mb-6 flex shrink-0 items-center justify-between border-b border-line pb-5">
      <div className="flex items-center gap-3">
        {IconComp && (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-raised">
            <IconComp className="h-[18px] w-[18px] text-secondary" />
          </span>
        )}
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-strong">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-subtle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
