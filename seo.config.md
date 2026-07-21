# Rivesio SEO config

Decisions recorded 2026-07-21 (seo-pro-max).

## Scope
Meta basics · Indexing · robots.txt · sitemap · Open Graph · Twitter Cards · Organization + WebSite JSON-LD · hreflang · favicons

## Choices
| Decision | Value |
|---|---|
| Site name | Rivesio |
| Tagline (EN) | Feedback Widget with Screenshots & Inbox Chat |
| Title template | `Rivesio — %s` |
| Title / description length | ~55 / ~150 (SERP limits) |
| keywords meta | omitted (TR/EU / Google-Bing audience) |
| Theme color | `#0B1437` (dark accent `#8da2e3`) |
| Indexable | `/en`, `/tr` landing only |
| noindex | login, signup, agent-invite, panel routes |
| Canonical | self-canonical; utm stripped by Next metadataBase URLs |
| robots.txt | allow all; disallow `/api/`, `/_next/`, panel paths |
| AI crawlers | allowed |
| Sitemap | `/en`, `/tr` only; `lastmod` yes; no changefreq/priority |
| OG image | `/dashboard-preview.png` (2880×1800) |
| Twitter card | `summary_large_image`; no @handle |
| Schema | Organization + WebSite `@graph`; no SearchAction; no sameAs |
| hreflang | `en`, `tr`, `x-default=/en` in HTML head |
| Favicons | `favicon.ico` / `icon-512.png` / `icon-192.png` / `manifest.ts` |

## Public base
`PUBLIC_BASE_URL` (see `.env`). metadataBase, sitemap, robots, and JSON-LD use this value.
