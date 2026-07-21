import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { absoluteUrl, localePath } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routing.locales.map((locale) => ({
    url: absoluteUrl(localePath(locale)),
    lastModified,
    alternates: {
      languages: Object.fromEntries([
        ...routing.locales.map((l) => [l, absoluteUrl(localePath(l))]),
        ["x-default", absoluteUrl(localePath(routing.defaultLocale))],
      ]),
    },
  }));
}
