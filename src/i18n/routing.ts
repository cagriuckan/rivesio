import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "tr"],
  defaultLocale: "en",
  // Always show the locale in the URL (/en, /tr).
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
