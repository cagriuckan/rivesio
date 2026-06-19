"use client";

import { usePathname } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import ThemeToggle from "./ThemeToggle";
import { Icon } from "@/components/ui/Icons";
import { useRouter } from "next/navigation";

const PAGE_TITLE: Record<string, string> = {
  "/": "Genel Bakış",
  "/feedbacks": "Geri Bildirimler",
  "/sites": "Siteler",
  "/projects": "Widget'lar",
};

export default function Header({
  user,
  onMenuToggle,
  sidebarOpen,
}: {
  user: string;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const title = PAGE_TITLE[pathname] ?? PAGE_TITLE["/"];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header
      className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-base px-4"
      style={{ height: "var(--header-h)" }}
    >
      {/* Left: hamburger (mobile) + brand */}
      <div className="flex items-center gap-2">
        {/* Hamburger — mobile only */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
            aria-label={sidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? (
              <Icon.close className="h-4 w-4" />
            ) : (
              <Icon.menu className="h-4 w-4" />
            )}
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent">
            <Icon.feedback className="h-3.5 w-3.5 text-white" strokeWidth={2.25} />
          </div>
          <span className="text-sm font-semibold tracking-tight text-strong">Revisto</span>
          <span className="hidden h-4 w-px bg-line-strong sm:block" aria-hidden />
          <span className="hidden text-sm text-secondary sm:block">{title}</span>
        </div>
      </div>

      {/* Right: theme + user */}
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <div className="mx-1 h-4 w-px bg-line-strong" aria-hidden />
        <div className="hidden items-center gap-2 rounded-md px-2 py-1 sm:flex">
          <Avatar name={user} size="sm" />
          <span className="text-xs font-medium text-secondary">{user}</span>
        </div>
        <div className="flex sm:hidden">
          <Avatar name={user} size="sm" />
        </div>
        <button
          onClick={logout}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Çıkış yap"
          title="Çıkış yap"
        >
          <Icon.logout className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
