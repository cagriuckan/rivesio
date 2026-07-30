"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { Dropdown } from "@/components/ui/Dropdown";
import { WIDGET_SCOPE_COOKIE } from "@/lib/widget-scope";

export interface WidgetOption {
  id: string;
  name: string;
  slug: string;
  accentColor: string;
  logoUrl?: string | null;
  isActive?: boolean;
}

function readScopeCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${WIDGET_SCOPE_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeScopeCookie(id: string | null) {
  if (id) document.cookie = `${WIDGET_SCOPE_COOKIE}=${encodeURIComponent(id)};path=/;SameSite=Lax`;
  else document.cookie = `${WIDGET_SCOPE_COOKIE}=;path=/;Max-Age=0`;
}

function WidgetMark({
  widget,
  className,
  size = "md",
}: {
  widget: Pick<WidgetOption, "name" | "accentColor" | "logoUrl">;
  className?: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-5 w-5" : "h-9 w-9";
  if (widget.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={widget.logoUrl}
        alt=""
        className={cn(dim, "shrink-0 rounded-lg object-cover ring-1 ring-line", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        dim,
        "flex shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm",
        size === "sm" && "rounded-full text-[10px] shadow-none",
        className,
      )}
      style={{ background: widget.accentColor }}
    >
      {widget.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export default function WidgetSwitcher({ widgets, collapsed }: { widgets: WidgetOption[]; collapsed?: boolean }) {
  const t = useTranslations("widgetSwitcher");
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("w");

  const active = widgets.find((w) => w.id === current) ?? null;

  // Keep the scope cookie aligned with `?w=` so Shell (layout) can filter
  // nav badges on the same navigation — including cold loads with a widget URL.
  useEffect(() => {
    const cookie = readScopeCookie();
    if ((current || null) === (cookie || null)) return;
    writeScopeCookie(current);
    router.refresh();
  }, [current, router]);

  function select(id: string | null, close: () => void) {
    close();
    // Set cookie before refresh so Shell re-renders with scoped nav counts
    // even if the navigation middleware hasn't landed yet.
    writeScopeCookie(id);
    const sp = new URLSearchParams(params.toString());
    if (id) sp.set("w", id);
    else sp.delete("w");
    const qs = sp.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    router.refresh();
  }

  return (
    <Dropdown
      role="listbox"
      panelClassName={cn(
        "w-52 max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg bg-overlay",
        collapsed && "min-w-[208px]",
      )}
      trigger={({ open, triggerProps }) =>
        collapsed ? (
          /* Collapsed: icon-only trigger, portal dropdown */
          <button
            {...triggerProps}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-80 outline-none focus-visible:ring-2 focus-visible:ring-accent overflow-hidden",
              open && "opacity-80",
              !active && "bg-subtle",
            )}
            style={active && !active.logoUrl ? { background: active.accentColor } : undefined}
          >
            {active ? (
              active.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.logoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                active.name.slice(0, 1).toUpperCase()
              )
            ) : (
              <Icon.layers className="h-4 w-4" />
            )}
          </button>
        ) : (
          /* Expanded: full trigger */
          <button
            {...triggerProps}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl bg-surface px-2.5 py-2.5 text-left text-strong shadow-sm ring-1 ring-line-strong transition-colors outline-none hover:ring-accent-line focus-visible:ring-2 focus-visible:ring-accent",
              open && "bg-raised ring-accent-line"
            )}
          >
            {active ? (
              <WidgetMark widget={active} />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white shadow-sm bg-accent">
                <Icon.layers className="h-4 w-4" />
              </span>
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-strong">
                {active ? active.name : t("all")}
              </span>
              <span className="block truncate text-xs text-subtle">
                {active ? active.slug : t("count", { count: widgets.length })}
              </span>
            </span>
            <Icon.expandUpDown
              className={cn("h-4 w-4 shrink-0 text-subtle transition-transform", open && "rotate-180")}
            />
          </button>
        )
      }
    >
      {(close) => (
        <DropdownList
          widgets={widgets}
          active={active}
          t={t}
          onSelect={(id) => select(id, close)}
        />
      )}
    </Dropdown>
  );
}

function DropdownList({ widgets, active, t, onSelect }: {
  widgets: WidgetOption[];
  active: WidgetOption | null;
  t: (key: string, values?: Record<string, string | number | Date>) => string;
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
          sub={w.isActive === false ? t("inactive") : ""}
          selected={active?.id === w.id}
          onClick={() => onSelect(w.id)}
          muted={w.isActive === false}
          icon={
            w.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={w.logoUrl} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              <span className="text-[10px] font-bold text-white">{w.name.slice(0, 1).toUpperCase()}</span>
            )
          }
          iconBg={w.logoUrl ? "transparent" : w.accentColor}
        />
      ))}
    </>
  );
}

function OptionRow({ label, sub, selected, onClick, icon, iconBg, muted }: {
  label: string;
  sub: string;
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  iconBg: string;
  muted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      role="option"
      aria-selected={selected}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors",
        selected ? "bg-accent-soft" : "hover:bg-raised",
        muted && "opacity-60",
      )}
    >
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{ background: iconBg }}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-sm font-medium", selected ? "text-accent-text" : "text-primary")}>
          {label}
        </span>
        {sub ? (
          <span className="block truncate text-[11px] text-subtle">{sub}</span>
        ) : null}
      </span>
      {selected && <Icon.check className="h-4 w-4 shrink-0 text-accent-text" />}
    </button>
  );
}
