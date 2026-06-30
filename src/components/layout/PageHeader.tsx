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
    <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line pb-3 pl-0 pr-0 pt-0">
      {/* Left: icon + title */}
      <div className="flex items-center gap-2.5">
        {IconComp && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center text-accent">
            <IconComp className="h-4 w-4 text-accent" />
          </span>
        )}
        <div>
          <h1 className="text-base font-semibold leading-tight text-strong">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-subtle">{subtitle}</p>}
        </div>
      </div>

      {/* Right: global actions + page actions */}
      <div className="flex items-center gap-3">
        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
        <Suspense>
          <ContentActions />
        </Suspense>
      </div>
    </div>
  );
}
