"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

export interface WidgetOption {
  id: string;
  name: string;
  themeSlug: string;
  accentColor: string;
}

export default function WidgetSwitcher({ widgets }: { widgets: WidgetOption[] }) {
  const t = useTranslations("widgetSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("w");

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const active = widgets.find((w) => w.id === current) ?? null;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function select(id: string | null) {
    setOpen(false);
    const sp = new URLSearchParams(params.toString());
    if (id) sp.set("w", id);
    else sp.delete("w");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg border border-line bg-surface px-2.5 py-2",
          "text-left transition-colors hover:border-line-strong outline-none",
          "focus-visible:ring-2 focus-visible:ring-accent",
          open && "border-line-strong"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md"
          style={{ background: active ? active.accentColor : "var(--color-raised)" }}
        >
          {active ? (
            <span className="text-2xs font-bold text-white">{active.name.slice(0, 1).toUpperCase()}</span>
          ) : (
            <Icon.layers className="h-3.5 w-3.5 text-subtle" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-primary">
            {active ? active.name : t("all")}
          </span>
          <span className="block truncate text-2xs text-subtle">
            {active ? active.themeSlug : t("count", { count: widgets.length })}
          </span>
        </span>
        <Icon.chevronDown className={cn("h-3.5 w-3.5 shrink-0 text-subtle transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          className="ds-fade-in absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-lg border border-line bg-overlay p-1"
          role="listbox"
        >
          <OptionRow
            label={t("all")}
            sub={t("allMerged", { count: widgets.length })}
            selected={!active}
            onClick={() => select(null)}
            icon={<Icon.layers className="h-3.5 w-3.5 text-subtle" />}
          />
          {widgets.length > 0 && <div className="my-1 h-px bg-line-soft" />}
          {widgets.map((w) => (
            <OptionRow
              key={w.id}
              label={w.name}
              sub={w.themeSlug}
              selected={active?.id === w.id}
              onClick={() => select(w.id)}
              icon={
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-sm text-[8px] font-bold text-white"
                  style={{ background: w.accentColor }}
                >
                  {w.name.slice(0, 1).toUpperCase()}
                </span>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OptionRow({
  label, sub, selected, onClick, icon,
}: {
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      role="option"
      aria-selected={selected}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors",
        selected ? "bg-accent-soft" : "hover:bg-raised"
      )}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-sm font-medium", selected ? "text-accent-text" : "text-primary")}>
          {label}
        </span>
        <span className="block truncate text-2xs text-subtle">{sub}</span>
      </span>
      {selected && <Icon.check className="h-3.5 w-3.5 shrink-0 text-accent-text" />}
    </button>
  );
}
