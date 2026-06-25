"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import type { WidgetOption } from "./WidgetSwitcher";

const TABS = [
  { href: "/",          key: "overviewShort",  icon: Icon.dashboard },
  { href: "/feedbacks", key: "feedbacksShort", icon: Icon.feedback },
  { href: "/sites",     key: "sites",          icon: Icon.globe },
  { href: "/projects",  key: "widgets",        icon: Icon.code },
] as const;

export default function BottomTabBar({ widgets: _widgets }: { widgets: WidgetOption[] }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useSearchParams();
  const w = params.get("w");
  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-line bg-base md:hidden"
      aria-label={t("bottomNav")}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((tab) => {
        const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        const TabIcon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={withWidget(tab.href)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
              active ? "text-accent" : "text-subtle"
            )}
          >
            <TabIcon className={cn("h-5 w-5", active ? "text-accent" : "text-subtle")} />
            {t(tab.key)}
          </Link>
        );
      })}
    </nav>
  );
}
