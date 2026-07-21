# Rivesio — Proje Panosu

> Her oturum sonunda güncellenir. Son güncelleme: **2026-07-21**

## Proje Özeti
Merkezi feedback widget sunucusu + admin paneli. Next.js 15 (App Router, `[locale]` ile next-intl), React 19, Tailwind v4, Postgres + Drizzle (local port 5433, snake_case Row mapping, epoch-ms bigint), Better Auth (multi-tenant), Resend e-posta, web-push, S3. Widget ayrı build edilir (`npm run build:widget`), custom `server.js` ile servis edilir.

## Mevcut Durum
- **Klasör:** `/Users/cagri/dev/Rivesio`
- **GitHub:** https://github.com/cagriuckan/rivesio
- **Branch:** `feat/issues-1-2-3`
- Landing SEO tamam: meta/OG/Twitter, robots.txt, sitemap (`/en`+`/tr`), hreflang, Organization+WebSite JSON-LD, panel `noindex` — kararlar `seo.config.md`

## Kalanlar / Yapılacaklar
- [ ] PR’ı gözden geçirip main’e merge et
- [ ] Prod `PUBLIC_BASE_URL` ile sitemap/canonical doğrula
- [ ] İdeal OG: 1200×630 `og.png` (şimdilik `dashboard-preview.png`)
- [ ] Logo asset’lerinde eski “Revisto” yazısı varsa güncelle

## Alınan Kararlar
- 2026-07-21: SEO tipik set (A1/B1/C1/D1/E1/F1) — title `Page | Rivesio`, index yalnız landing, AI bot serbest, schema without sameAs/SearchAction
- 2026-07-21: Ürün adı **Rivesio**; repo `cagriuckan/rivesio`
- 2026-07: Tema duyarlı logo `ThemedLogo`; landing kök `/`; beta’da fiyatlandırma yok
- 2026-07: İkon tek kaynak `public/icon.png`
- Mimari: Claude memory `rivesio-architecture-v2`, `db-architecture`

## Faydalı Komutlar
| Komut | Ne yapar |
|---|---|
| `npm run dev` | Next dev sunucusu |
| `npm run build` | Widget + Next build |
| `npm run db:push` / `db:studio` | Drizzle şema push / studio |
