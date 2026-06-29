"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, usePathname } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import WidgetSwitcher, { type WidgetOption } from "./WidgetSwitcher";

const NAV = [
  { href: "/",          key: "overview",  icon: Icon.dashboard },
  { href: "/feedbacks", key: "feedbacks", icon: Icon.feedback },
  { href: "/sites",     key: "sites",     icon: Icon.globe },
  { href: "/projects",  key: "widgets",   icon: Icon.code },
] as const;

export default function Sidebar({
  widgets,
  onClose,
}: {
  widgets: WidgetOption[];
  onClose?: () => void;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const params = useSearchParams();
  const w = params.get("w");

  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);

  return (
    <aside
      className="flex h-full shrink-0 flex-col bg-base"
      style={{ width: "var(--sidebar-w)" }}
    >
      {/* Widget filter */}
      <div className="p-4 pb-3">
        <div className="mb-2 px-1.5 text-2xs font-semibold uppercase tracking-wider text-faint">Widgets</div>
        <WidgetSwitcher widgets={widgets} />
      </div>

      <div className="mx-4 h-px bg-line" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 pt-3" aria-label={t("mainMenu")}>
        <div className="mb-2 px-1.5 text-2xs font-semibold uppercase tracking-wider text-faint">{t("menu")}</div>
        <ul className="space-y-1" role="list">
          {NAV.map((n) => {
            const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
            const NavIcon = n.icon;
            return (
              <li key={n.href}>
                <Link
                  href={withWidget(n.href)}
                  aria-current={active ? "page" : undefined}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
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
                  {t(n.key)}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
