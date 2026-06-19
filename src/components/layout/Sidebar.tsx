"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/components/ui/cn";
import ThemeToggle from "./ThemeToggle";
import WidgetSwitcher, { type WidgetOption } from "./WidgetSwitcher";

const NAV = [
  { href: "/",          label: "Genel Bakış",      icon: Icon.dashboard },
  { href: "/feedbacks", label: "Geri Bildirimler", icon: Icon.feedback },
  { href: "/sites",     label: "Siteler",          icon: Icon.globe },
  { href: "/projects",  label: "Widget'lar",       icon: Icon.code },
];

export default function Sidebar({ widgets, user }: { widgets: WidgetOption[]; user: string }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const w = params.get("w");

  // Preserve the active widget across navigation.
  const withWidget = (href: string) => (w ? `${href}?w=${w}` : href);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-[248px] shrink-0 flex-col border-r border-line bg-base">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-violet shadow-accent">
          <Icon.feedback className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight text-strong">Kanews</div>
          <div className="text-2xs font-medium text-subtle">Feedback</div>
        </div>
      </div>

      {/* Widget switcher */}
      <div className="px-3 pb-3">
        <WidgetSwitcher widgets={widgets} />
      </div>

      <div className="mx-3 h-px bg-line-soft" />

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        <div className="mb-1.5 px-2 text-2xs font-semibold uppercase tracking-wider text-faint">
          Menü
        </div>
        {NAV.map((n) => {
          const active = n.href === "/" ? pathname === "/" : pathname.startsWith(n.href);
          const NavIcon = n.icon;
          return (
            <Link
              key={n.href}
              href={withWidget(n.href)}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-soft text-accent-text"
                  : "text-secondary hover:bg-raised hover:text-primary"
              )}
            >
              <NavIcon className={cn("h-[17px] w-[17px] shrink-0", active ? "text-accent-text" : "text-subtle group-hover:text-primary")} />
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-1.5 py-1">
          <Avatar name={user} size="md" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="truncate text-sm font-semibold text-primary">{user}</div>
            <div className="flex items-center gap-1 text-2xs text-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Yönetici
            </div>
          </div>
          <ThemeToggle />
          <button
            onClick={logout}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle transition-colors hover:bg-danger-soft hover:text-danger-text outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Çıkış yap"
            title="Çıkış yap"
          >
            <Icon.logout className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
