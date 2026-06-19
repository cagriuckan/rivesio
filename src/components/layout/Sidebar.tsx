"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import WidgetSwitcher, { type WidgetOption } from "./WidgetSwitcher";

const NAV = [
  { href: "/",          label: "Genel Bakış",      icon: Icon.dashboard },
  { href: "/feedbacks", label: "Geri Bildirimler", icon: Icon.feedback },
  { href: "/sites",     label: "Siteler",          icon: Icon.globe },
  { href: "/projects",  label: "Widget'lar",       icon: Icon.code },
];

export default function Sidebar({
  widgets,
  onClose,
}: {
  widgets: WidgetOption[];
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const params = useSearchParams();
  const w = params.get("w");

  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);

  return (
    <aside
      className="flex h-full shrink-0 flex-col border-r border-line bg-base"
      style={{ width: "var(--sidebar-w)" }}
    >
      {/* Widget filter */}
      <div className="p-3 pb-2">
        <div className="mb-2 px-1 text-2xs font-medium uppercase tracking-wider text-faint">Widgets</div>
        <WidgetSwitcher widgets={widgets} />
      </div>

      <div className="mx-3 h-px bg-line" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 pt-2" aria-label="Ana menü">
        <div className="mb-2 px-1 text-2xs font-medium uppercase tracking-wider text-faint">Menü</div>
        <ul className="space-y-0.5" role="list">
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
                    "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-accent-soft text-accent-text"
                      : "text-secondary hover:bg-raised hover:text-primary"
                  )}
                >
                  <NavIcon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-colors",
                      active ? "text-accent" : "text-subtle group-hover:text-muted"
                    )}
                  />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
