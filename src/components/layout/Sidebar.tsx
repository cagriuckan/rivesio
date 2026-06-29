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

const FOOTER_LINKS = ["Lorem", "Ipsum", "Dolor"] as const;

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

  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);

  return (
    <aside
      className="flex h-full shrink-0 flex-col transition-[width] duration-200"
      style={{ width: collapsed ? "72px" : "var(--sidebar-w)" }}
    >
      {/* Brand */}
      <div className={cn("flex items-center pt-3 pb-0", collapsed ? "justify-center px-2" : "gap-2.5 px-4")}>
        {/* Logo + toggle overlay when collapsed */}
        <div className="relative group/brand shrink-0">
          <Link
            href={withWidget("/")}
            onClick={onClose}
            aria-label="Dashboard"
            className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image
              src="/icon.png"
              alt="Revisto"
              width={48}
              height={48}
              className="rounded-xl"
            />
          </Link>
          {collapsed && (
            <button
              onClick={onToggleCollapse}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 opacity-0 shadow-sm transition-opacity group-hover/brand:opacity-100"
              aria-label="Expand sidebar"
            >
              <Icon.panelLeft className="h-3.5 w-3.5 text-white" />
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

      {/* Widget switcher */}
      <div className={collapsed ? "flex justify-center py-2" : "p-3 pb-2"}>
        <Suspense>
          <WidgetSwitcher widgets={widgets} collapsed={collapsed} />
        </Suspense>
      </div>

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
                {collapsed ? (
                  <Tooltip label={t(n.key)} side="right" className="w-full">
                    <Link
                      href={withWidget(n.href)}
                      aria-current={active ? "page" : undefined}
                      onClick={onClose}
                      className={cn(
                        "group flex w-full items-center justify-center rounded-xl py-2 text-sm font-medium transition-all",
                        active
                          ? "bg-surface text-strong shadow-sm ring-1 ring-line-strong"
                          : "text-muted hover:bg-raised hover:text-primary"
                      )}
                    >
                      <NavIcon
                        className={cn(
                          "h-[18px] w-[18px] shrink-0 transition-colors",
                          active ? "text-accent" : "text-subtle group-hover:text-muted"
                        )}
                      />
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    href={withWidget(n.href)}
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-surface text-strong shadow-sm ring-1 ring-line-strong"
                        : "text-muted hover:bg-raised hover:text-primary"
                    )}
                  >
                    <NavIcon
                      className={cn(
                        "h-[18px] w-[18px] shrink-0 transition-colors",
                        active ? "text-accent" : "text-subtle group-hover:text-muted"
                      )}
                    />
                    {t(n.key)}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
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
          <div className="space-y-3">
            <UserMenu user={user} />
            <div className="px-1.5">
              <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-2xs font-medium text-subtle">
                {FOOTER_LINKS.map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="transition-colors hover:text-primary"
                  >
                    {label}
                  </a>
                ))}
              </div>
              <p className="text-2xs text-faint">&copy; 2026 Revisto</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
