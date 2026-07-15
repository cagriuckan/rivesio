# Revisto — Proje Panosu

> Her oturum sonunda güncellenir. Son güncelleme: **2026-07-06**

## Proje Özeti
Merkezi feedback widget sunucusu + admin paneli. Next.js 15 (App Router, `[locale]` ile next-intl), React 19, Tailwind v4, Postgres + Drizzle (local port 5433, snake_case Row mapping, epoch-ms bigint), Better Auth (multi-tenant), Resend e-posta, web-push, S3. Widget ayrı build edilir (`npm run build:widget`), custom `server.js` ile servis edilir.

## Mevcut Durum
- **Branch:** `feat/issues-1-2-3` (main'e henüz merge edilmedi)
- Son commit: `8d2a352` — ikonlar tek kaynağa (`public/icon.png`) bağlandı
- **Commitlenmemiş çalışma:** Landing page — `src/components/landing/LandingPage.tsx` (Framer esintili koyu tasarım: floating pill nav, hero + inbox mock, 6 iconbox, sağ-sol dönüşümlü 3 highlight bölümü [Topla/Önceliklendir/Yanıtla], gradient CTA, footer). AI iddiaları landing ve login sayfasından kaldırıldı (ürün henüz AI içermiyor). `/` artık girişsiz ziyaretçiye landing gösteriyor (middleware'de `/` korumadan çıkarıldı, `[locale]/page.tsx` login redirect yerine landing render ediyor). `landing` çevirileri en/tr eklendi. Fiyatlandırma yok — beta süresince ücretsiz mesajı. Ayrıca: site fontu Inter'e geçti, tipografi ölçeği bir kademe küçüldü (base 14px), global spacing %10 sıkılaştı (`--spacing: 0.225rem`), header 56px / sidebar 232px. Landing hero'daki inbox mock kaldırıldı, yerine WebGL Strands animasyonu geldi (`src/components/landing/Strands.tsx`, React Bits + `ogl` bağımlılığı).

## Kalanlar / Yapılacaklar
- [ ] Landing page'i commit'le ve PR #15'e ekle (veya ayrı PR)
- [ ] PR #15'i gözden geçirip main'e merge et

## Alınan Kararlar
- 2026-07: Tema duyarlı logo için tek `ThemedLogo` bileşeni (light/dark asset çifti)
- 2026-07: Landing page kök `/` route'unda yaşıyor (ayrı route yok): girişsiz → landing, girişli → dashboard. Beta boyunca fiyatlandırma bölümü yok
- 2026-07: Tipografi Inter + kompakt ölçek: font tokenları `globals.css @theme`'de, base metin 14px, tüm spacing utility'leri `--spacing: 0.225rem` üzerinden %10 daha sıkı
- 2026-07: İkon tek kaynak: `public/icon.png` (512px master). `icon-192.png` `npm run icons` ile türetilir; favicon.ico/apple-icon/icon-512/svg'ler silindi, tüm referanslar icon.png'ye bağlı
- Mimari kararlar için bkz. Claude memory: `revisto-architecture-v2`, `db-architecture`

## Faydalı Komutlar
| Komut | Ne yapar |
|---|---|
| `npm run dev` | Next dev sunucusu |
| `npm run build` | Widget + Next build |
| `npm run db:push` / `db:studio` | Drizzle şema push / studio |
