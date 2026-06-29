"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { Tooltip } from "@/components/ui/Tooltip";
import WidgetSwitcher, { type WidgetOption } from "./WidgetSwitcher";
import UserMenu from "./UserMenu";
import { Avatar } from "@/components/ui/Avatar";

const NAV = [
  { href: "/",          key: "overview",  icon: Icon.dashboard },
  { href: "/feedbacks", key: "feedbacks", icon: Icon.feedback },
  { href: "/sites",     key: "sites",     icon: Icon.globe },
  { href: "/projects",  key: "widgets",   icon: Icon.code },
] as const;

export default function Sidebar({
  widgets,
  user,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  widgets: WidgetOption[];
  user: string;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useSearchParams();
  const w = params.get("w");
  const activeWidget = widgets.find((wg) => wg.id === w) ?? null;

  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);

  return (
    <aside
      className="flex h-full shrink-0 flex-col transition-[width] duration-200"
      style={{ width: collapsed ? "72px" : "var(--sidebar-w)" }}
    >
      {/* Brand */}
      <div className={cn("flex items-center py-3", collapsed ? "justify-center px-2" : "gap-2.5 px-4")}>
        {/* Logo + toggle overlay when collapsed */}
        <div className="relative group/brand shrink-0">
          <Image
            src="/icon.png"
            alt="Revisto"
            width={48}
            height={48}
            className="rounded-xl"
          />
          {collapsed && (
            <button
              onClick={onToggleCollapse}
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 group-hover/brand:opacity-100 transition-opacity"
              aria-label="Expand sidebar"
            >
              <Icon.panelLeft className="h-5 w-5 text-white" />
            </button>
          )}
        </div>

        {!collapsed && (
          <>
            <span className="flex-1 text-xl font-bold tracking-tight text-strong">Revisto</span>
            <Tooltip label="Collapse" side="bottom">
              <button
                onClick={onToggleCollapse}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-raised hover:text-primary"
                aria-label="Collapse sidebar"
              >
                <Icon.panelLeft className="h-4 w-4" />
              </button>
            </Tooltip>
          </>
        )}
      </div>

      <div className="mx-3 h-px bg-line" />

      {/* Widget switcher */}
      {collapsed ? (
        <div className="flex justify-center py-2.5">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-80"
            style={{ background: activeWidget ? activeWidget.accentColor : "var(--color-subtle)" }}
          >
            {activeWidget ? (
              activeWidget.name.slice(0, 1).toUpperCase()
            ) : (
              <Icon.layers className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : (
        <div className="p-3 pb-2">
          <Suspense>
            <WidgetSwitcher widgets={widgets} />
          </Suspense>
        </div>
      )}

      <div className="mx-3 h-px bg-line" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2" aria-label={t("mainMenu")}>
        {!collapsed && (
          <div className="mb-1.5 px-2.5 pt-1 text-2xs font-semibold uppercase tracking-wider text-faint">
            {t("menu")}
          </div>
        )}
        <ul className="space-y-0.5" role="list">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            const NavIcon = n.icon;
            return (
              <li key={n.href}>
                <Tooltip label={t(n.key)} side="right" className={cn(!collapsed && "hidden")}>
                  <Link
                    href={withWidget(n.href)}
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center rounded-xl py-2 text-sm font-medium transition-all",
                      collapsed ? "justify-center px-0" : "gap-3 px-2.5",
                      active
                        ? "bg-surface text-strong shadow-sm ring-1 ring-line"
                        : "text-muted hover:bg-raised hover:text-primary"
                    )}
                  >
                    <NavIcon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        active ? "text-accent" : "text-subtle group-hover:text-muted"
                      )}
                    />
                    {!collapsed && t(n.key)}
                  </Link>
                </Tooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mx-3 h-px bg-line" />
      <div className={cn("p-3", collapsed && "flex justify-center")}>
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Expand sidebar"
          >
            <Avatar name={user} size="md" />
          </button>
        ) : (
          <UserMenu user={user} />
        )}
      </div>
    </aside>
  );
}
