"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icons";
import { cn } from "@/components/ui/cn";

export default function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(localStorage.getItem("kf_theme") !== "light");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("kf_theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("kf_theme", "light");
    }
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-subtle",
        "transition-colors hover:bg-raised hover:text-primary outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent",
        className
      )}
      aria-label={dark ? "Açık temaya geç" : "Koyu temaya geç"}
      title={dark ? "Açık tema" : "Koyu tema"}
    >
      {dark ? <Icon.sun className="h-4 w-4" /> : <Icon.moon className="h-4 w-4" />}
    </button>
  );
}
