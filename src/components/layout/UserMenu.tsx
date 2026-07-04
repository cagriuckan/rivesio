"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import { useThemePref } from "@/hooks/useThemePref";
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from "@/components/ui/Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { authClient } from "@/lib/auth-client";

export default function UserMenu({
  userInfo,
}: {
  userInfo: { name: string; email: string; image: string | null };
}) {
  const user = userInfo.name || userInfo.email;
  const t = useTranslations("nav");
  const tt = useTranslations("theme");
  const tu = useTranslations("user");
  const tl = useTranslations("language");
  const router = useRouter();
  const { theme, setTheme } = useThemePref();

  async function logout() {
    await authClient.signOut();
    router.replace("/login");
    router.refresh();
  }

  const menuItems = [
    { label: tu("settings"), icon: Icon.settings, href: "/settings" },
    { label: tu("subscription"), icon: Icon.creditCard, href: "/settings" },
    { label: tu("usage"), icon: Icon.barChart, href: "/settings" },
  ];

  return (
    <Dropdown
      portal
      side="bottom"
      panelClassName="w-64"
      trigger={({ open, triggerProps }) => (
        <button
          {...triggerProps}
          aria-label={tu("menu")}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl bg-surface px-2 py-2 text-left text-strong shadow-sm ring-1 ring-line-strong transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent",
            open ? "bg-raised ring-accent-line" : " hover:ring-accent-line",
          )}
        >
          <Avatar name={user} src={userInfo.image} size="md" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-strong">{user}</span>
            <span className="block truncate text-xs text-subtle">{userInfo.email}</span>
          </span>
          <Icon.expandUpDown
            className={cn("h-4 w-4 shrink-0 text-subtle transition-transform", open && "rotate-180")}
          />
        </button>
      )}
    >
      {(close) => (
        <>
          {/* Identity */}
          <div className="flex items-center gap-2.5 px-2 py-2">
            <Avatar name={user} src={userInfo.image} size="md" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-strong">{user}</span>
              <span className="block truncate text-xs text-subtle">{userInfo.email}</span>
            </span>
          </div>

          <DropdownSeparator />

          {/* Items */}
          <div className="space-y-0.5">
            {menuItems.map(({ label, icon, href }) => (
              <DropdownItem key={label} icon={icon} onClick={() => { close(); router.push(href); }}>
                {label}
              </DropdownItem>
            ))}
          </div>

          <DropdownSeparator />

          {/* Language */}
          <DropdownLabel>{tl("label")}</DropdownLabel>
          <div className="px-1 pb-1.5">
            <LanguageSwitcher className="w-full justify-center" />
          </div>

          <DropdownSeparator />

          {/* Theme */}
          <DropdownLabel>{tt("label")}</DropdownLabel>
          <div className="flex items-center gap-0.5 rounded-lg bg-raised p-0.5" role="group" aria-label={tt("label")}>
            <button
              type="button"
              onClick={() => setTheme("light")}
              aria-pressed={theme === "light"}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                theme === "light" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary",
              )}
            >
              <Icon.sun className="h-3.5 w-3.5" />

            </button>
            <button
              type="button"
              onClick={() => setTheme("dark")}
              aria-pressed={theme === "dark"}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                theme === "dark" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary",
              )}
            >
              <Icon.moon className="h-3.5 w-3.5" />
            
            </button>
            <button
              type="button"
              onClick={() => setTheme("system")}
              aria-pressed={theme === "system"}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
                theme === "system" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary",
              )}
            >
              <Icon.monitor className="h-3.5 w-3.5" />
 
            </button>
          </div>

          <DropdownSeparator />

          <DropdownItem icon={Icon.logout} onClick={logout}>
            {t("logout")}
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
}
