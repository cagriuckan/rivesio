"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

export default function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(localStorage.getItem("kf_theme") === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("kf_theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("kf_theme", "light");
    }
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full text-subtle bg-raised",
        "transition-colors hover:bg-line hover:text-primary outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
      aria-label={dark ? t("toLight") : t("toDark")}
      title={dark ? t("light") : t("dark")}
    >
      {dark ? <Icon.sun className="h-4 w-4" /> : <Icon.moon className="h-4 w-4" />}
    </button>
  );
}
