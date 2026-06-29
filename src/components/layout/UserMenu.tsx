"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";
import LanguageSwitcher from "./LanguageSwitcher";

export default function UserMenu({ user }: { user: string }) {
  const t = useTranslations("nav");
  const tt = useTranslations("theme");
  const tu = useTranslations("user");
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [pos, setPos] = useState<{ bottom: number; left: number; width: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    setDark(localStorage.getItem("kf_theme") === "dark");
  }, []);

  function openMenu() {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
        width: rect.width,
      });
    }
    setOpen((v) => !v);
  }

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !(e.target as Element)?.closest?.("[data-usermenu-dropdown]")
      ) {
        setOpen(false);
      }
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
    setOpen(false);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const dropdown = open && pos && mounted ? (
    <div
      data-usermenu-dropdown
      role="menu"
      className="ds-fade-in fixed z-[9999] rounded-xl border border-line bg-surface p-1.5 shadow-lg"
      style={{ bottom: pos.bottom, left: pos.left, width: pos.width }}
    >
      {/* Language */}
      <div className="px-2 pb-1 pt-1.5 text-2xs font-semibold uppercase tracking-wider text-faint">
        Language
      </div>
      <div className="px-1 pb-1">
        <LanguageSwitcher className="w-full justify-center" />
      </div>

      <div className="my-1.5 h-px bg-line" />

      {/* Theme */}
      <div className="px-2 pb-1 text-2xs font-semibold uppercase tracking-wider text-faint">
        {tt("label")}
      </div>
      <div className="flex items-center gap-0.5 rounded-lg bg-raised p-0.5" role="group" aria-label={tt("label")}>
        <button
          type="button"
          onClick={() => setTheme(false)}
          aria-pressed={!dark}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
            !dark ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary",
          )}
        >
          <Icon.sun className="h-3.5 w-3.5" />
          {tt("lightShort")}
        </button>
        <button
          type="button"
          onClick={() => setTheme(true)}
          aria-pressed={dark}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
            dark ? "bg-surface text-strong shadow-sm" : "text-subtle hover:text-primary",
          )}
        >
          <Icon.moon className="h-3.5 w-3.5" />
          {tt("darkShort")}
        </button>
      </div>

      <div className="my-1.5 h-px bg-line" />

      <button
        type="button"
        role="menuitem"
        onClick={logout}
        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-raised hover:text-primary"
      >
        <Icon.logout className="h-4 w-4 shrink-0 text-subtle" />
        {t("logout")}
      </button>
    </div>
  ) : null;

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={openMenu}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={tu("menu")}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent",
          open ? "bg-raised" : "hover:bg-raised",
        )}
      >
        <Avatar name={user} size="md" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-strong">{user}</span>
          <span className="block truncate text-xs text-subtle">{tu("role")}</span>
        </span>
        <Icon.chevronDown
          className={cn("h-4 w-4 shrink-0 text-subtle transition-transform", open && "rotate-180")}
        />
      </button>

      {mounted && createPortal(dropdown, document.body)}
    </div>
  );
}
