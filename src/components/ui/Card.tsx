import { cn } from "./cn";

export function Card({
  className,
  interactive = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface shadow-sm ring-1 ring-line",
        interactive &&
          "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2.5 px-5 py-2.5 border-b border-line-soft",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  icon: IconComp,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> & {
  icon?: (p: React.SVGProps<SVGSVGElement>) => React.ReactNode;
}) {
  return (
    <h3
      className={cn("flex items-center gap-2 text-sm font-semibold text-strong", className)}
      {...props}
    >
      {IconComp && (
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <IconComp className="h-3 w-3" />
        </span>
      )}
      <span className="min-w-0 truncate">{children}</span>
    </h3>
  );
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />;
}
