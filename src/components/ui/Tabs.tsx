import NextLink from "next/link";
import { cn } from "./cn";

type LinkComponent = React.ComponentType<{
  href: string;
  className?: string;
  "aria-current"?: "page" | undefined;
  children: React.ReactNode;
}>;

export type TabItem = {
  href: string;
  label: React.ReactNode;
  active: boolean;
};

export function Tabs({
  items,
  linkComponent: Link = NextLink as LinkComponent,
  className,
}: {
  items: TabItem[];
  /** Override the link component (e.g. the locale-aware Link from next-intl). */
  linkComponent?: LinkComponent;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-md border border-line bg-raised p-0.5",
        className
      )}
    >
      {items.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "rounded px-3 py-1.5 text-xs font-medium transition-colors",
            item.active ? "bg-surface text-primary shadow-sm" : "text-subtle hover:text-primary"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
