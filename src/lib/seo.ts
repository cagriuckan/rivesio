import type { Metadata } from "next";
import { env } from "@/lib/env";
import { routing, type Locale } from "@/i18n/routing";

/** Absolute site origin used for metadataBase, sitemap, robots, and JSON-LD. */
export function siteOrigin(): string {
  return env.publicBaseUrl || "http://localhost:3000";
}

export function absoluteUrl(path = "/"): string {
  const origin = siteOrigin();
  if (!path || path === "/") return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Locale-prefixed path, e.g. `/en` or `/tr/login`. */
export function localePath(locale: string, path = "/"): string {
  const rest = !path || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${rest}`;
}

export const SITE_NAME = "Rivesio";
export const OG_IMAGE_PATH = "/dashboard-preview.png";
export const OG_IMAGE_WIDTH = 2880;
export const OG_IMAGE_HEIGHT = 1800;
export const THEME_COLOR = "#0B1437";

/** Bidirectional hreflang cluster for a locale-prefixed path (no locale in `path`). */
export function languageAlternates(path = "/"): NonNullable<Metadata["alternates"]>["languages"] {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localePath(locale, path);
  }
  languages["x-default"] = localePath(routing.defaultLocale, path);
  return languages;
}

export function buildOrganizationWebsiteJsonLd(locale: Locale, description: string) {
  const origin = siteOrigin();
  const pageUrl = absoluteUrl(localePath(locale));
  const logoUrl = absoluteUrl("/icon-512.png");
  const ogImageUrl = absoluteUrl(OG_IMAGE_PATH);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${origin}/#organization`,
        name: SITE_NAME,
        url: origin,
        logo: {
          "@type": "ImageObject",
          url: logoUrl,
          width: 512,
          height: 512,
          caption: SITE_NAME,
        },
        image: {
          "@type": "ImageObject",
          url: ogImageUrl,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          caption: `${SITE_NAME} dashboard preview`,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${origin}/#website`,
        name: SITE_NAME,
        url: origin,
        description,
        inLanguage: locale,
        publisher: { "@id": `${origin}/#organization` },
        mainEntityOfPage: pageUrl,
      },
    ],
  };
}
