"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/components/ui/cn";
import { useUser } from "@/contexts/UserContext";
import { useThemePref } from "@/hooks/useThemePref";
import { Dropdown, DropdownSeparator } from "@/components/ui/Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { Tooltip } from "@/components/ui/Tooltip";

const THEME_ICON = { light: Icon.sun, dark: Icon.moon, system: Icon.monitor } as const;

export default function ContentActions() {
  const user = useUser();
  const router = useRouter();
  const tt = useTranslations("theme");
  const { theme, setTheme, cycleTheme } = useThemePref();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const ThemeIcon = THEME_ICON[theme];

  return (
    <div className="relative flex items-center gap-1.5">
      {/* Mode toggle */}
      <Tooltip label={tt(theme)} side="bottom">
        <button
          onClick={cycleTheme}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={tt("label")}
        >
          <ThemeIcon className="h-4 w-4" />
        </button>
      </Tooltip>

      {/* Notifications */}
      <Tooltip label="Notifications" side="bottom">
        <button
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Notifications"
        >
          <Icon.bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent ring-1 ring-base" />
        </button>
      </Tooltip>

      {/* Profile avatar */}
      <Dropdown
        align="right"
        panelClassName="w-56"
        trigger={({ open, triggerProps }) => (
          <button
            {...triggerProps}
            className={cn(
              "flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent transition-opacity",
              open ? "opacity-80" : "hover:opacity-80"
            )}
          >
            <Avatar name={user} size="md" />
          </button>
        )}
      >
        {(close) => (
          <>
            {/* User info */}
            <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1">
              <Avatar name={user} size="md" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-strong">{user}</div>
                <div className="text-xs text-subtle">Administrator</div>
              </div>
            </div>

            <DropdownSeparator />

            {/* Language */}
            <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-faint">Language</div>
            <div className="px-1 pb-1.5">
              <LanguageSwitcher className="w-full justify-center" />
            </div>

            <DropdownSeparator />

            {/* Theme */}
            <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-faint">{tt("label")}</div>
            <div className="flex items-center gap-0.5 rounded-lg bg-raised p-0.5 mx-1 mb-1.5">
              <button
                onClick={() => setTheme("light")}
                aria-pressed={theme === "light"}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  theme === "light" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary"
                )}
              >
                <Icon.sun className="h-3.5 w-3.5" /> {tt("lightShort")}
              </button>
              <button
                onClick={() => setTheme("dark")}
                aria-pressed={theme === "dark"}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  theme === "dark" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary"
                )}
              >
                <Icon.moon className="h-3.5 w-3.5" /> {tt("darkShort")}
              </button>
              <button
                onClick={() => setTheme("system")}
                aria-pressed={theme === "system"}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                  theme === "system" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary"
                )}
              >
                <Icon.monitor className="h-3.5 w-3.5" /> {tt("systemShort")}
              </button>
            </div>

            <DropdownSeparator />

            {/* Settings */}
            <button
              role="menuitem"
              onClick={close}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-raised hover:text-primary"
            >
              <Icon.settings className="h-4 w-4 shrink-0 text-subtle" />
              Settings
            </button>

            {/* Logout */}
            <button
              role="menuitem"
              onClick={logout}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-raised hover:text-primary"
            >
              <Icon.logout className="h-4 w-4 shrink-0 text-subtle" />
              Log out
            </button>
          </>
        )}
      </Dropdown>
    </div>
  );
}
