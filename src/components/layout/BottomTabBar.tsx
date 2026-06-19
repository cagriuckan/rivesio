"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import type { WidgetOption } from "./WidgetSwitcher";

const TABS = [
  { href: "/",          label: "Bakış",        icon: Icon.dashboard },
  { href: "/feedbacks", label: "Bildirimler",  icon: Icon.feedback },
  { href: "/sites",     label: "Siteler",      icon: Icon.globe },
  { href: "/projects",  label: "Widget'lar",   icon: Icon.code },
];

export default function BottomTabBar({ widgets }: { widgets: WidgetOption[] }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const w = params.get("w");
  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-line bg-base md:hidden"
      aria-label="Alt navigasyon"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        const TabIcon = t.icon;
        return (
          <Link
            key={t.href}
            href={withWidget(t.href)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
              active ? "text-accent" : "text-subtle"
            )}
          >
            <TabIcon className={cn("h-5 w-5", active ? "text-accent" : "text-subtle")} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
