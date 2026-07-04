"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

export function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line/60">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-xs font-bold uppercase tracking-wider text-subtle">{title}</span>
        <Icon.chevronDown className={cn("h-4 w-4 text-faint transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5 last:mb-0">
      <div className="text-[11px] font-medium text-faint">{label}</div>
      <div className="mt-0.5 break-words text-sm text-primary">{children}</div>
    </div>
  );
}
