"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Icon } from "@/components/ui/Icons";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/components/ui/cn";
import { useUser } from "@/contexts/UserContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { Tooltip } from "@/components/ui/Tooltip";

export default function ContentActions() {
  const user = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDark(localStorage.getItem("kf_theme") === "dark");
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function setTheme(next: boolean) {
    setDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("kf_theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("kf_theme", "light");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div ref={ref} className="relative flex items-center gap-1.5">
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
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={cn(
          "flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent transition-opacity",
          open ? "opacity-80" : "hover:opacity-80"
        )}
      >
        <Avatar name={user} size="md" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="ds-fade-in absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-xl border border-line bg-surface p-1.5 shadow-lg"
        >
          {/* User info */}
          <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1">
            <Avatar name={user} size="md" />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-strong">{user}</div>
              <div className="text-xs text-subtle">Administrator</div>
            </div>
          </div>

          <div className="h-px bg-line mb-1.5" />

          {/* Language */}
          <div className="px-2 pb-1 text-2xs font-semibold uppercase tracking-wider text-faint">Language</div>
          <div className="px-1 pb-1.5">
            <LanguageSwitcher className="w-full justify-center" />
          </div>

          <div className="h-px bg-line my-1.5" />

          {/* Theme */}
          <div className="px-2 pb-1 text-2xs font-semibold uppercase tracking-wider text-faint">Theme</div>
          <div className="flex items-center gap-0.5 rounded-lg bg-raised p-0.5 mx-1 mb-1.5">
            <button
              onClick={() => setTheme(false)}
              aria-pressed={!dark}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                !dark ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary"
              )}
            >
              <Icon.sun className="h-3.5 w-3.5" /> Light
            </button>
            <button
              onClick={() => setTheme(true)}
              aria-pressed={dark}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
                dark ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary"
              )}
            >
              <Icon.moon className="h-3.5 w-3.5" /> Dark
            </button>
          </div>

          <div className="h-px bg-line my-1.5" />

          {/* Settings */}
          <button
            role="menuitem"
            onClick={() => setOpen(false)}
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
        </div>
      )}
    </div>
  );
}
