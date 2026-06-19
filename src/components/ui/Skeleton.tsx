import { cn } from "./cn";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("ds-shimmer rounded-md", className)} {...props} />;
}
