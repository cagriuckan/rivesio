"use client";

import { Suspense, type MouseEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
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
  navCounts,
  onClose,
  collapsed,
  onToggleCollapse,
}: {
  widgets: WidgetOption[];
  user: string;
  navCounts?: { feedbacks?: number; sites?: number };
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const t = useTranslations("nav");
  const tu = useTranslations("user");
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const w = params.get("w");

  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);
  const handleNavClick = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    onClose?.();
    if (href === "/feedbacks" && params.has("f")) {
      event.preventDefault();
      router.push(withWidget("/feedbacks"));
    }
  };

  return (
    <aside
      className="content-radius-tight flex h-full shrink-0 flex-col overflow-x-hidden transition-[width] duration-200"
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
      <nav className="flex-1 overflow-x-hidden overflow-y-auto p-2" aria-label={t("mainMenu")}>
        {!collapsed && (
          <div className="mb-1.5 px-2.5 pt-1 text-xs font-semibold uppercase tracking-wider text-faint">
            {t("menu")}
          </div>
        )}
        <ul className="space-y-0.5" role="list">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            const NavIcon = n.icon;
            const count = navCounts?.[n.key as "feedbacks" | "sites"] ?? 0;
            return (
              <li key={n.href}>
                {collapsed ? (
                  <Tooltip label={count > 0 ? `${t(n.key)} (${count})` : t(n.key)} side="right" className="w-full">
                    <Link
                      href={withWidget(n.href)}
                      aria-current={active ? "page" : undefined}
                      onClick={handleNavClick(n.href)}
                      className={cn(
                        "group relative flex w-full items-center justify-center rounded-xl py-2 text-sm font-medium transition-all",
                        active
                          ? "bg-surface text-strong shadow-sm ring-1 ring-line-strong"
                          : "text-muted hover:bg-raised hover:text-primary"
                      )}
                    >
                      <NavIcon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors",
                          active ? "text-accent" : "text-subtle group-hover:text-muted"
                        )}
                      />
                      {count > 0 && (
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-base" />
                      )}
                    </Link>
                  </Tooltip>
                ) : (
                  <Link
                    href={withWidget(n.href)}
                    aria-current={active ? "page" : undefined}
                    onClick={handleNavClick(n.href)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-surface text-strong shadow-sm ring-1 ring-line-strong"
                        : "text-muted hover:bg-raised hover:text-primary"
                    )}
                  >
                    <NavIcon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-accent" : "text-subtle group-hover:text-muted"
                      )}
                    />
                    <span className="flex-1">{t(n.key)}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold tnum",
                          active
                            ? "bg-accent-soft text-accent-text"
                            : "bg-raised text-muted group-hover:bg-surface"
                        )}
                      >
                        {count > 99 ? "99+" : count}
                      </span>
                    )}
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
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-subtle">
                <a href="#" className="transition-colors hover:text-primary">
                  {tu("privacyPolicy")}
                </a>
                <a href="#" className="transition-colors hover:text-primary">
                  {tu("termsOfService")}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
