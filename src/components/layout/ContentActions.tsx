"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/components/ui/cn";
import { useUser } from "@/contexts/UserContext";
import { useThemePref } from "@/hooks/useThemePref";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { Tooltip } from "@/components/ui/Tooltip";
import NotificationBell from "./NotificationBell";
import { authClient } from "@/lib/auth-client";

const THEME_ICON = { light: Icon.sun, dark: Icon.moon, system: Icon.monitor } as const;

export default function ContentActions() {
  const userInfo = useUser();
  const user = userInfo.name || userInfo.email;
  const router = useRouter();
  const tt = useTranslations("theme");
  const { theme, setTheme, cycleTheme } = useThemePref();

  async function logout() {
    await authClient.signOut();
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
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-subtle transition-colors hover:border-line-strong hover:bg-raised hover:text-primary outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={tt("label")}
        >
          <ThemeIcon className="h-5 w-5" />
        </button>
      </Tooltip>

      {/* Notifications */}
      <NotificationBell />

      {/* Profile avatar */}
      <Dropdown
        align="right"
        panelClassName="w-52"
        trigger={({ open, triggerProps }) => (
          <button
            {...triggerProps}
            className={cn(
              "flex items-center rounded-full outline-none transition-opacity f focus-visible:ring-accent",
              open ? "opacity-80" : "hover:opacity-80"
            )}
          >
            <Avatar name={user} src={userInfo.image} size="md" />
          </button>
        )}
      >
        {(close) => (
          <>
            {/* User info */}
            <div className="flex items-center gap-2.5 px-2 py-2">
              <Avatar name={user} src={userInfo.image} size="md" />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-strong">{user}</div>
                <div className="text-xs text-subtle">{userInfo.email}</div>
              </div>
            </div>

            <DropdownSeparator />
              {/* Settings */}
              <DropdownItem
              icon={Icon.settings}
              onClick={() => {
                close();
                router.push("/settings");
              }}
            >
              Settings
            </DropdownItem>

            {/* Logout */}
            <DropdownItem icon={Icon.logout} onClick={logout}>
              Log out
            </DropdownItem>

            <DropdownSeparator />


            {/* Language */}
            <div className="px-2 pb-0.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-faint">Language</div>
            <div className="px-1 pb-1">
              <LanguageSwitcher className="w-full justify-center" />
            </div>

            {/* Theme */}
            <div className="px-2 pb-0.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-faint">{tt("label")}</div>
            <div className="mx-1 mb-1 flex items-center gap-0.5 rounded-md bg-raised p-0.5">
              <button
                onClick={() => setTheme("light")}
                aria-pressed={theme === "light"}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors",
                  theme === "light" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary"
                )}
              >
                <Icon.sun className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                aria-pressed={theme === "dark"}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors",
                  theme === "dark" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary"
                )}
              >
                <Icon.moon className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setTheme("system")}
                aria-pressed={theme === "system"}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors",
                  theme === "system" ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary"
                )}
              >
                <Icon.monitor className="h-3.5 w-3.5" />
              </button>
            </div>


          
          </>
        )}
      </Dropdown>
    </div>
  );
}
