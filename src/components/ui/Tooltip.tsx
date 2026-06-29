"use client";

import { cn } from "./cn";

type Side = "top" | "bottom" | "left" | "right";

const sideClasses: Record<Side, string> = {
  right:  "left-full top-1/2 ml-2 -translate-y-1/2",
  left:   "right-full top-1/2 mr-2 -translate-y-1/2",
  top:    "bottom-full left-1/2 mb-2 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-2 -translate-x-1/2",
};

export function Tooltip({
  label,
  side = "right",
  children,
  className,
}: {
  label: string;
  side?: Side;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group/tip relative inline-flex", className)}>
      {children}
      <span
        className={cn(
          "pointer-events-none absolute z-[9999] whitespace-nowrap rounded-md",
          "bg-strong px-2 py-1 text-xs font-medium text-white shadow-md",
          "opacity-0 transition-opacity delay-150 group-hover/tip:opacity-100",
          sideClasses[side]
        )}
        role="tooltip"
      >
        {label}
      </span>
    </div>
  );
}
