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
import ThemedLogo from "@/components/ui/ThemedLogo";

const NAV = [
  { href: "/",          key: "overview",  icon: Icon.dashboard },
  { href: "/feedbacks", key: "feedbacks", icon: Icon.feedback },
  { href: "/sites",     key: "sites",     icon: Icon.globe },
  { href: "/projects",  key: "widgets",   icon: Icon.code },
] as const;

export default function Sidebar({
  widgets,
  user,
  userInfo,
  navCounts,
  onClose,
  collapsed,
  onToggleCollapse,
  hasOwnedProjects = true,
}: {
  widgets: WidgetOption[];
  user: string;
  userInfo: { name: string; email: string; image: string | null };
  navCounts?: { feedbacks?: number; sites?: number };
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  hasOwnedProjects?: boolean;
}) {
  const t = useTranslations("nav");
  const tu = useTranslations("user");
  const tp = useTranslations("premium");
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const w = params.get("w");
  // Pure agents (no owned widgets) only get the inbox — site/widget
  // management belongs to the owner.
  const nav = hasOwnedProjects ? NAV : NAV.filter((n) => n.key === "overview" || n.key === "feedbacks");

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
      className={cn(
        "content-radius-tight flex h-full shrink-0 flex-col overflow-x-hidden transition-[width] duration-200",
        onClose ? "bg-base" : "bg-transparent",
      )}
      style={{ width: collapsed ? "72px" : "var(--sidebar-w)" }}
    >
      {/* Brand */}
      <div className={cn("flex items-center py-3", collapsed ? "justify-center px-2" : "gap-0 px-4")}>
        {collapsed ? (
          /* Collapsed: show only the square icon with expand overlay */
          <div className="relative group/brand shrink-0">
            <Link
              href={withWidget("/")}
              onClick={onClose}
              aria-label="Dashboard"
              className="block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src="/icon-512.png"
                alt="Rivesio"
                width={48}
                height={48}
                className="rounded-xl"
              />
            </Link>
            <button
              onClick={onToggleCollapse}
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-md bg-black/60 opacity-0 shadow-sm transition-opacity group-hover/brand:opacity-100"
              aria-label="Expand sidebar"
            >
              <Icon.panelLeft className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        ) : (
          /* Expanded: show the full themed wordmark logo + beta badge */
          <>
            <Link
              href={withWidget("/")}
              onClick={onClose}
              aria-label="Dashboard"
              className="inline-flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <ThemedLogo/>
              <span className="inline-flex h-5 shrink-0 items-center rounded-full border border-warning/30 bg-warning-soft px-1.5 py-0.5 text-[9px] font-bold uppercase text-warning-text">
                Beta
              </span>
            </Link>
            <div className="flex-1" />
            {!onClose && (
              <Tooltip label="Collapse" side="bottom">
                <button
                  onClick={onToggleCollapse}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-raised hover:text-primary"
                  aria-label="Collapse sidebar"
                >
                  <Icon.panelLeft className="h-4 w-4" />
                </button>
              </Tooltip>
            )}
          </>
        )}
      </div>

      {/* Widget switcher */}
      <div className={collapsed ? "flex justify-center pb-2" : "px-3 py-2"}>
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
          {nav.map((n) => {
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
                          ? "bg-accent-soft text-accent"
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
                      "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-accent-soft text-accent"
                        : " hover:bg-raised hover:text-primary"
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-accent" />
                    )}
                    <NavIcon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-accent" : "text-subtle group-hover:text-muted"
                      )}
                    />
                    <span className={cn("flex-1", active && "")}>{t(n.key)}</span>
                    {count > 0 && (
                      <span
                        className={cn(
                          "inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tnum",
                          active
                            ? "bg-accent text-white"
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

        {/* Other */}
        {collapsed ? (
          <div className="mx-2 my-2 h-px bg-line" />
        ) : (
          <div className="mb-1.5 px-2.5 pt-4 text-xs font-semibold uppercase tracking-wider text-faint">
            {t("other")}
          </div>
        )}
        <ul className="space-y-0.5" role="list">
          <li>
            {(() => {
              const active = pathname.startsWith("/settings");
              return collapsed ? (
                <Tooltip label={t("settings")} side="right" className="w-full">
                  <Link
                    href="/settings"
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                    className={cn(
                      "group flex w-full items-center justify-center rounded-xl py-2 text-sm font-medium transition-all",
                      active ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-primary"
                    )}
                  >
                    <Icon.settings className={cn("h-4 w-4 shrink-0", active ? "text-accent" : "text-subtle group-hover:text-muted")} />
                  </Link>
                </Tooltip>
              ) : (
                <Link
                  href="/settings"
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all",
                    active ? "bg-accent-soft text-accent" : "text-muted hover:bg-raised hover:text-primary"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-accent" />
                  )}
                  <Icon.settings className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-accent" : "text-subtle group-hover:text-muted")} />
                  <span className={cn("flex-1", active && "")}>{t("settings")}</span>
                </Link>
              );
            })()}
          </li>
          <li>
            {collapsed ? (
              <Tooltip label={`${t("support")} — ${t("soon")}`} side="right" className="w-full">
                <span
                  aria-disabled="true"
                  className="flex w-full cursor-not-allowed items-center justify-center rounded-xl py-2 opacity-40"
                >
                  <Icon.helpCircle className="h-4 w-4 shrink-0 text-subtle" />
                </span>
              </Tooltip>
            ) : (
              <span
                aria-disabled="true"
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium text-muted opacity-40"
              >
                <Icon.helpCircle className="h-4 w-4 shrink-0 text-subtle" />
                <span className="flex-1">{t("support")}</span>
                <span className="inline-flex h-4 items-center rounded-full bg-raised px-1.5 text-[9px] font-bold uppercase text-faint">
                  {t("soon")}
                </span>
              </span>
            )}
          </li>
        </ul>
      </nav>

      {/* Premium CTA */}
      {collapsed ? (
        <div className="flex justify-center pb-1">
          <Tooltip label={tp("title")} side="right">
            <Link
              href="/settings"
              onClick={onClose}
              aria-label={tp("title")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-grad-accent text-white shadow-accent transition-transform hover:scale-105"
            >
              <Icon.sparkles className="h-4 w-4" />
            </Link>
          </Tooltip>
        </div>
      ) : (
        <div className="px-3 pb-1">
          <div className="relative overflow-hidden rounded-2xl bg-grad-accent p-3.5 text-white shadow-accent">
            <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -right-2 -bottom-10 h-20 w-20 rounded-full bg-white/5" />
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/15">
                <Icon.sparkles className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold">{tp("title")}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-white/75">{tp("desc")}</p>
            <Link
              href="/settings"
              onClick={onClose}
              className="mt-2.5 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-lg bg-white/95 text-xs font-bold text-accent-text transition-colors hover:bg-white"
            >
              {tp("cta")}
              <Icon.arrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={cn("px-3 py-2", collapsed && "flex justify-center")}>
        {collapsed ? (
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Expand sidebar"
          >
            <Avatar name={user} src={userInfo.image} size="md" />
          </button>
        ) : (
          <div className="space-y-1.5">
            <UserMenu userInfo={userInfo} />
            <div className="px-1.5 space-y-1">
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] font-medium text-subtle">
                <a href="#" className="transition-colors hover:text-primary">
                  {tu("privacyPolicy")}
                </a>
                <a href="#" className="transition-colors hover:text-primary">
                  {tu("termsOfService")}
                </a>
              </div>
              <div className="text-[10px] font-semibold text-faint tracking-wider">
                Beta v0.0.1
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
