"use client";

import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/Avatar";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { Icon } from "@/components/ui/Icons";
import { usePathname, useRouter } from "@/i18n/navigation";

const TITLE_KEY: Record<string, string> = {
  "/": "overview",
  "/feedbacks": "feedbacks",
  "/sites": "sites",
  "/projects": "widgets",
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
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const title = t(TITLE_KEY[pathname] ?? "overview");

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-base px-5"
      style={{ height: "var(--header-h)" }}
    >
      {/* Left: hamburger (mobile) + brand */}
      <div className="flex items-center gap-2">
        {/* Hamburger — mobile only */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
            aria-label={sidebarOpen ? t("closeMenu") : t("openMenu")}
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
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm" aria-hidden>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <linearGradient id="brandG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <rect width="100" height="100" rx="26" fill="url(#brandG)"/>
              <rect x="17" y="24" width="66" height="44" rx="11" fill="white"/>
              <path d="M26 68 L18 84 L44 68 Z" fill="white"/>
              <polyline points="31,46 43,58 69,32" fill="none" stroke="#6366f1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="text-base font-bold tracking-tight text-strong">{tc("brand")}</span>
          <span className="hidden h-5 w-px bg-line-strong sm:block" aria-hidden />
          <span className="hidden text-sm font-medium text-muted sm:block">{title}</span>
        </div>
      </div>

      {/* Right: theme + user */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher className="mr-0.5" />
        <ThemeToggle />
        <button
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-raised text-subtle transition-colors hover:bg-line hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Notifications"
        >
          <Icon.bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent ring-2 ring-base" />
        </button>
        <div className="mx-0.5 h-5 w-px bg-line-strong" aria-hidden />
        <div className="hidden items-center gap-2 rounded-full bg-raised py-1 pl-1 pr-3 sm:flex">
          <Avatar name={user} size="sm" />
          <span className="text-xs font-semibold text-secondary">{user}</span>
        </div>
        <div className="flex sm:hidden">
          <Avatar name={user} size="sm" />
        </div>
        <button
          onClick={logout}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-raised text-subtle transition-colors hover:bg-line hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={t("logout")}
          title={t("logout")}
        >
          <Icon.logout className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
