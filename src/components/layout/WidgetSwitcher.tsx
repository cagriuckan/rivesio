"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

export default function WidgetSwitcher({ widgets, collapsed }: { widgets: WidgetOption[]; collapsed?: boolean }) {
  const t = useTranslations("widgetSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("w");

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const active = widgets.find((w) => w.id === current) ?? null;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      const insideTrigger = ref.current?.contains(target);
      const insidePortal = (target as Element)?.closest?.("[data-widget-dropdown]");
      if (!insideTrigger && !insidePortal) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openMenu() {
    if (collapsed && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 8, left: rect.left, width: Math.max(rect.width, 220) });
    }
    setOpen((v) => !v);
  }

  function select(id: string | null) {
    setOpen(false);
    const sp = new URLSearchParams(params.toString());
    if (id) sp.set("w", id);
    else sp.delete("w");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    router.refresh();
  }

  const dropdownContent = (
    <DropdownList
      widgets={widgets}
      active={active}
      t={t}
      onSelect={select}
    />
  );

  return (
    <div ref={ref} className="relative">
      {collapsed ? (
        /* Collapsed: icon-only trigger, portal dropdown */
        <button
          ref={triggerRef}
          onClick={openMenu}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-accent",
            open && "opacity-80"
          )}
          style={{ background: active ? active.accentColor : "var(--color-subtle)" }}
        >
          {active ? active.name.slice(0, 1).toUpperCase() : <Icon.layers className="h-4 w-4" />}
        </button>
      ) : (
        /* Expanded: full trigger */
        <button
          onClick={openMenu}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors outline-none",
            "ring-1 ring-line hover:bg-raised hover:ring-line-strong focus-visible:ring-2 focus-visible:ring-accent",
            open && "bg-raised ring-line-strong"
          )}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm"
            style={{ background: active ? active.accentColor : "var(--color-subtle)" }}
          >
            {active ? active.name.slice(0, 1).toUpperCase() : <Icon.layers className="h-4 w-4" />}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-strong">
              {active ? active.name : t("all")}
            </span>
            <span className="block truncate text-xs text-subtle">
              {active ? active.themeSlug : t("count", { count: widgets.length })}
            </span>
          </span>
          <Icon.chevronDown
            className={cn("h-4 w-4 shrink-0 text-subtle transition-transform", open && "rotate-180")}
          />
        </button>
      )}

      {/* Dropdown — inline for expanded, portal for collapsed */}
      {open && !collapsed && (
        <div
          className="ds-fade-in absolute left-0 right-0 top-[calc(100%+4px)] z-50 overflow-hidden rounded-xl border border-line bg-overlay p-1.5 shadow-lg"
          role="listbox"
        >
          {dropdownContent}
        </div>
      )}

      {open && collapsed && mounted && dropdownPos && createPortal(
        <div
          data-widget-dropdown
          role="listbox"
          className="ds-fade-in fixed z-[9999] overflow-hidden rounded-xl border border-line bg-overlay p-1.5 shadow-lg"
          style={{ top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
        >
          {dropdownContent}
        </div>,
        document.body
      )}
    </div>
  );
}

function DropdownList({ widgets, active, t, onSelect }: {
  widgets: WidgetOption[];
  active: WidgetOption | null;
  t: (key: string, values?: Record<string, unknown>) => string;
  onSelect: (id: string | null) => void;
}) {
  return (
    <>
      <OptionRow
        label={t("all")}
        sub={t("allMerged", { count: widgets.length })}
        selected={!active}
        onClick={() => onSelect(null)}
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
          onClick={() => onSelect(w.id)}
          icon={<span className="text-[10px] font-bold text-white">{w.name.slice(0, 1).toUpperCase()}</span>}
          iconBg={w.accentColor}
        />
      ))}
    </>
  );
}

function OptionRow({ label, sub, selected, onClick, icon, iconBg }: {
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
