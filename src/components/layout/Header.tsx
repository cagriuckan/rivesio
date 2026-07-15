"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import ContentActions from "./ContentActions";
import ThemedLogo from "@/components/ui/ThemedLogo";

export default function Header({
  onMenuToggle,
  sidebarOpen,
}: {
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}) {
  const t = useTranslations("nav");

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
            <Icon.close className="h-5 w-5" />
          ) : (
            <Icon.menu className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Brand */}
      <Link href="/" className="flex items-center gap-2">
        <ThemedLogo width={110} height={30} className="h-8 w-auto" />
      </Link>

      {/* Right: mode switch, notifications, user menu */}
      <div className="ml-auto flex items-center">
        <Suspense>
          <ContentActions />
        </Suspense>
      </div>
    </header>
  );
}
