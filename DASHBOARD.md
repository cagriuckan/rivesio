# Revisto — Proje Panosu

> Her oturum sonunda güncellenir. Son güncelleme: **2026-07-05**

## Proje Özeti
Merkezi feedback widget sunucusu + admin paneli. Next.js 15 (App Router, `[locale]` ile next-intl), React 19, Tailwind v4, Postgres + Drizzle (local port 5433, snake_case Row mapping, epoch-ms bigint), Better Auth (multi-tenant), Resend e-posta, web-push, S3. Widget ayrı build edilir (`npm run build:widget`), custom `server.js` ile servis edilir.

## Mevcut Durum
- **Branch:** `feat/issues-1-2-3` (main'e henüz merge edilmedi)
- Son commit: `fd35b44` — Sites redesign + Widget Agents + UI polish
- **Commitlenmemiş çalışma:** Logo/branding geçişi — yeni `ThemedLogo` bileşeni (`src/components/ui/ThemedLogo.tsx`), `logo-light.png` / `logo-dark.png` assetleri; Header, Sidebar, AuthShell, UserSettings, Avatar, ChatThread, email şablonu ve manifest/icon güncellemeleri.

## Kalanlar / Yapılacaklar
- [x] Branding değişiklikleri commit'lendi (`116bd84`) ve push'landı
- [x] PR açık/güncel: https://github.com/cagriuckan/revisto/pull/15
- [ ] PR #15'i gözden geçirip main'e merge et

## Alınan Kararlar
- 2026-07: Tema duyarlı logo için tek `ThemedLogo` bileşeni (light/dark asset çifti)
- 2026-07: İkon tek kaynak: `public/icon.png` (512px master). `icon-192.png` `npm run icons` ile türetilir; favicon.ico/apple-icon/icon-512/svg'ler silindi, tüm referanslar icon.png'ye bağlı
- Mimari kararlar için bkz. Claude memory: `revisto-architecture-v2`, `db-architecture`

## Faydalı Komutlar
| Komut | Ne yapar |
|---|---|
| `npm run dev` | Next dev sunucusu |
| `npm run build` | Widget + Next build |
| `npm run db:push` / `db:studio` | Drizzle şema push / studio |
