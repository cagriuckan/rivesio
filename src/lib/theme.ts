export type ThemePref = "light" | "dark" | "system";

const STORAGE_KEY = "kf_theme";
const THEME_EVENT = "kf_theme_change";
const ORDER: ThemePref[] = ["light", "dark", "system"];

export function getStoredTheme(): ThemePref {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "dark" || v === "system" ? v : "light";
}

export function applyTheme(pref: ThemePref) {
  localStorage.setItem(STORAGE_KEY, pref);
  const isDark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: pref }));
}

export function onThemeChange(listener: (pref: ThemePref) => void) {
  function handler(e: Event) {
    listener((e as CustomEvent<ThemePref>).detail);
  }
  window.addEventListener(THEME_EVENT, handler);
  return () => window.removeEventListener(THEME_EVENT, handler);
}

export function nextTheme(pref: ThemePref): ThemePref {
  return ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length];
}
