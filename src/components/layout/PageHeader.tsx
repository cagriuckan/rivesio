import { Suspense } from "react";
import type { SVGProps } from "react";
import ContentActions from "./ContentActions";
import { cn } from "../ui/cn";

type IconFn = (p: SVGProps<SVGSVGElement>) => React.ReactNode;

/**
 * Shared page chrome for panel routes. Keep spacing/typography identical so
 * Overview / Sites / Projects / Settings / nested settings all align.
 */
export default function PageHeader({
  title,
  subtitle,
  icon: IconComp,
  iconClassName,
  actions,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: IconFn;
  iconClassName?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-line pb-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {IconComp && (
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface",
              iconClassName,
            )}
          >
            <IconComp className="h-4 w-4 text-subtle" />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-md font-semibold leading-tight text-strong lg:text-lg">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-subtle lg:text-sm">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
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
