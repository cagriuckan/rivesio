"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icons";

export default function Header({
  onMenuToggle,
  sidebarOpen,
}: {
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");

  return (
    <header
      className="flex h-full shrink-0 items-center border-b border-line bg-base px-4 md:hidden"
      style={{ height: "var(--header-h)" }}
    >
      {/* Hamburger — mobile only */}
      {onMenuToggle && (
        <button
          onClick={onMenuToggle}
          className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
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

      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg shadow-sm" aria-hidden>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <linearGradient id="brandGm" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1"/>
                <stop offset="100%" stopColor="#8b5cf6"/>
              </linearGradient>
            </defs>
            <rect width="100" height="100" rx="24" fill="url(#brandGm)"/>
            <rect x="17" y="23" width="66" height="46" rx="13" fill="white"/>
            <path d="M27 69 L19 86 L45 69 Z" fill="white"/>
            <polyline points="30,47 42,59 70,31" fill="none" stroke="url(#brandGm)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span className="text-sm font-bold tracking-tight text-strong">{tc("brand")}</span>
      </div>
    </header>
  );
}
