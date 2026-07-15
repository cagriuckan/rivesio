"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import type { WidgetOption } from "./WidgetSwitcher";

const ALL_TABS = [
  { href: "/",          key: "overviewShort",  icon: Icon.dashboard },
  { href: "/feedbacks", key: "feedbacksShort", icon: Icon.feedback },
  { href: "/sites",     key: "sites",          icon: Icon.globe },
  { href: "/projects",  key: "widgets",        icon: Icon.code },
] as const;

export default function BottomTabBar({
  widgets: _widgets,
  hasOwnedProjects = true,
}: {
  widgets: WidgetOption[];
  hasOwnedProjects?: boolean;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useSearchParams();
  const w = params.get("w");
  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);
  const TABS = hasOwnedProjects ? ALL_TABS : ALL_TABS.filter((tab) => tab.key === "overviewShort" || tab.key === "feedbacksShort");

  const activeIndex = Math.max(
    0,
    TABS.findIndex((tab) => (tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href)))
  );

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-3 md:hidden"
      aria-label={t("bottomNav")}
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      <div
        className="pointer-events-auto relative mx-auto flex max-w-sm items-center overflow-hidden rounded-full p-1.5 backdrop-blur-3xl backdrop-saturate-150 bg-[var(--tabbar-glass-bg)] shadow-[var(--tabbar-glass-shadow)]"
      >
        {/* specular highlight sweep — top edge shine */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[image:var(--tabbar-glass-shine)]" />
        <div className="pointer-events-none absolute inset-0 rounded-full border border-[var(--tabbar-glass-border)]" />

        {/* sliding liquid-glass selection bubble */}
        <div
          className="pointer-events-none absolute inset-y-1.5 left-1.5 rounded-full transition-transform duration-[480ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] bg-[image:var(--tabbar-bubble-bg)] shadow-[var(--tabbar-bubble-shadow)]"
          style={{
            width: `calc((100% - 0.75rem) / ${TABS.length})`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {TABS.map((tab, i) => {
          const active = i === activeIndex;
          const TabIcon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={withWidget(tab.href)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative z-10 flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-2 py-1.5 text-[10px] font-semibold transition-colors duration-300",
                active
                  ? "text-accent"
                  : "text-secondary/70 active:text-primary"
              )}
            >
              <TabIcon
                className={cn(
                  "h-[18px] w-[18px] transition-transform duration-300",
                  active ? "scale-105 text-accent" : "text-subtle"
                )}
              />
              <span className="max-w-full truncate">{t(tab.key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
