import { Suspense } from "react";
import type { SVGProps } from "react";
import ContentActions from "./ContentActions";
import { cn } from "../ui/cn";

type IconFn = (p: SVGProps<SVGSVGElement>) => React.ReactNode;

export default function PageHeader({
  title,
  subtitle,
  icon: IconComp,
  iconClassName,
  actions,
}: {
  title: string;
  subtitle?: string;
  icon?: IconFn;
  iconClassName?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex shrink-0 flex-wrap items-center justify-between gap-3  pb-3 pl-0 pr-0 pt-0">
      {/* Left: icon + title */}
      <div className="flex items-center gap-3.5">
        {IconComp && (
          <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line", iconClassName)}>
            <IconComp className="h-4 w-4 text-subtle" />
          </span>
        )}
        <div>
          <h1 className="text-md lg:text-lg font-semibold leading-tight text-strong">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm lg:text-md text-subtle">{subtitle}</p>}
        </div>
      </div>

      {/* Right: global actions + page actions */}
      <div className="flex items-center gap-3">
        {actions && <div className="flex items-center gap-2.5">{actions}</div>}
        <div className="hidden md:block">
          <Suspense>
            <ContentActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
