# Rivesio — Proje Panosu

> Her oturum sonunda güncellenir. Son güncelleme: **2026-07-21**

## Proje Özeti
Merkezi feedback widget sunucusu + admin paneli. Next.js 15 (App Router, `[locale]` ile next-intl), React 19, Tailwind v4, Postgres + Drizzle (local port 5433, snake_case Row mapping, epoch-ms bigint), Better Auth (multi-tenant), Resend e-posta, web-push, S3. Widget ayrı build edilir (`npm run build:widget`), custom `server.js` ile servis edilir.

## Mevcut Durum
- **Klasör:** `/Users/cagri/dev/Rivesio` (eski `revisto` taşındı)
- **GitHub:** https://github.com/cagriuckan/rivesio
- **Branch:** `feat/issues-1-2-3` (main'e henüz merge edilmedi)
- Son commit: `c3cd2ba` — uygulama adı Revisto → Rivesio (package, UI, widget API, skill)
- Landing + dashboard redesign önceki commitlerde (`9d19d71`); rebrand üstüne eklendi

## Kalanlar / Yapılacaklar
- [ ] PR #15'i gözden geçirip main'e merge et (rebrand dahil)
- [ ] Local Postgres DB adı / `.env` `DATABASE_URL` gerekirse `rivesio` ile hizala
- [ ] Logo asset'lerindeki "Revisto" yazısı varsa görsel olarak Rivesio'ya güncelle

## Alınan Kararlar
- 2026-07-21: Ürün adı **Rivesio**; repo `cagriuckan/rivesio`, yerel klasör `Rivesio`. Widget host API `window.RivesioFeedback`, DOM id `rivesio-widget`
- 2026-07: Tema duyarlı logo için tek `ThemedLogo` bileşeni (light/dark asset çifti)
- 2026-07: Landing page kök `/` route'unda yaşıyor (ayrı route yok): girişsiz → landing, girişli → dashboard. Beta boyunca fiyatlandırma bölümü yok
- 2026-07: Tipografi Inter + kompakt ölçek: font tokenları `globals.css @theme`'de, base metin 14px, tüm spacing utility'leri `--spacing: 0.225rem` üzerinden %10 daha sıkı
- 2026-07: İkon tek kaynak: `public/icon.png` (512px master). `icon-192.png` `npm run icons` ile türetilir; favicon.ico/apple-icon/icon-512/svg'ler silindi, tüm referanslar icon.png'ye bağlı
- Mimari kararlar için bkz. Claude memory: `rivesio-architecture-v2`, `db-architecture`

## Faydalı Komutlar
| Komut | Ne yapar |
|---|---|
| `npm run dev` | Next dev sunucusu |
| `npm run build` | Widget + Next build |
| `npm run db:push` / `db:studio` | Drizzle şema push / studio |
