import { Suspense } from "react";
import type { SVGProps } from "react";
import ContentActions from "./ContentActions";

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
    <div className="mb-6 flex shrink-0 flex-wrap items-center justify-between gap-3">
      {/* Left: icon + title */}
      <div className="flex items-center gap-3">
        {IconComp && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-grad-accent text-white shadow-accent">
            <IconComp className="h-[18px] w-[18px]" />
          </span>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-strong">{title}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      </div>

      {/* Right: global actions + page actions */}
      <div className="flex items-center gap-2">
        <Suspense>
          <ContentActions />
        </Suspense>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
