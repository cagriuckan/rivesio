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
      {/* Workspace-switcher style trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors outline-none",
          "ring-1 ring-line hover:bg-raised hover:ring-line-strong focus-visible:ring-2 focus-visible:ring-accent",
          open && "bg-raised ring-line-strong"
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Icon avatar */}
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
          style={{ background: active ? active.accentColor : "var(--color-subtle)" }}
        >
          {active ? (
            active.name.slice(0, 1).toUpperCase()
          ) : (
            <Icon.layers className="h-4 w-4" />
          )}
        </span>

        {/* Text */}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-strong">
            {active ? active.name : t("all")}
          </span>
          <span className="block truncate text-xs text-subtle">
            {active ? active.themeSlug : t("count", { count: widgets.length })}
          </span>
        </span>

        {/* Chevron */}
        <Icon.chevronDown
          className={cn("h-4 w-4 shrink-0 text-subtle transition-transform", open && "rotate-180")}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="ds-fade-in absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-line bg-overlay p-1.5 shadow-lg"
          role="listbox"
        >
          <OptionRow
            label={t("all")}
            sub={t("allMerged", { count: widgets.length })}
            selected={!active}
            onClick={() => select(null)}
            icon={<Icon.layers className="h-4 w-4 text-subtle" />}
            iconBg="var(--color-raised)"
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
                <span className="text-[10px] font-bold text-white">
                  {w.name.slice(0, 1).toUpperCase()}
                </span>
              }
              iconBg={w.accentColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OptionRow({
  label, sub, selected, onClick, icon, iconBg,
}: {
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <button
      onClick={onClick}
      role="option"
      aria-selected={selected}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
        selected ? "bg-accent-soft" : "hover:bg-raised"
      )}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white"
        style={{ background: iconBg }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-sm font-medium", selected ? "text-accent-text" : "text-primary")}>
          {label}
        </span>
        <span className="block truncate text-xs text-subtle">{sub}</span>
      </span>
      {selected && <Icon.check className="h-4 w-4 shrink-0 text-accent-text" />}
    </button>
  );
}
