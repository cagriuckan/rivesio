"use client";

import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, nextTheme, onThemeChange, type ThemePref } from "@/lib/theme";

export function useThemePref() {
  const [theme, setThemeState] = useState<ThemePref>("light");

  useEffect(() => {
    setThemeState(getStoredTheme());
    return onThemeChange(setThemeState);
  }, []);

  function setTheme(next: ThemePref) {
    setThemeState(next);
    applyTheme(next);
  }

  function cycleTheme() {
    setTheme(nextTheme(theme));
  }

  return { theme, setTheme, cycleTheme };
}
