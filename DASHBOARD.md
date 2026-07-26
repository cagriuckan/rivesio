# Rivesio — Proje Panosu

> Her oturum sonunda güncellenir. Son güncelleme: **2026-07-26**

## Proje Özeti
Merkezi feedback widget sunucusu + admin paneli. Next.js 15 App Router, React 19, Tailwind v4, Postgres + Drizzle, Better Auth, Resend, web-push, R2.

## Mevcut Durum
- **Repo:** https://github.com/cagriuckan/rivesio · `main`
- **Prod:** rivesio.com · DB: Neon
- Admin perf: `(panel)/layout` Shell; reply `after()`; sites local state
- Sites: pagination (20), görünür toplu seçim, belirgin hover aksiyonlar; quick-add banner kaldırıldı
- Widget logo FAB + panel başlık + Projects kart / switcher
- Mobile tab bar: expo-glass-tabs web portu (minimize-on-scroll, scrubbing, sliding highlight)
- Dashboard: Son geri bildirimler + Kategoriler kartları zenginleştirildi
- Widget kategorileri TR/EN etiketli (`LocalizedCategory`); görünür metin sayfa diline göre

## Kalanlar / Yapılacaklar
- [ ] Hostinger redeploy (perf + sites/logo + glass tabs + dashboard + localized categories)
- [ ] Soft nav + reply + sites pagination smoke test
- [ ] Prod signup smoke test
- [ ] İdeal OG 1200×630
- [ ] Web push UX iyileştirme
- [ ] Mobile glass tab bar smoke test (scroll minimize + finger scrub)
- [ ] Widget kategori dili smoke test (`lang=en` / `lang=tr`)

## Alınan Kararlar
- 2026-07-26: Kategori `value` sabit (feedback/agent); `labels.tr/en` widget görünür metin
- 2026-07-26: Dashboard kategori satırları `?category=` ile Inbox filtresine deep-link
- 2026-07-26: Mobile tab bar `expo-glass-tabs` UX’inin web portu; Expo paketi kurulmadı (Next.js)
- 2026-07-26: Sites quick-add banner kaldırıldı; ekleme header AddSiteButton ile
- 2026-07-26: Widget logo FAB’da chat ikonu yerine (yoksa ikon kalır)
- 2026-07-26: Shell sayfa başına değil `(panel)` layout’ta; guest `/` Shell’siz geçer
- 2026-07-26: Admin reply e-postası `after()` ile fire-and-forget; Inbox optimistic reply + SSE dedupe
- 2026-07-26: Prod widget script yalnız landing’de (panel’de yok)
- 2026-07-21: Landing sade set; özellikler feedback / screenshot / chat odaklı
- 2026-07-21: Prod widget script site-wide; Neon DB; `PUBLIC_BASE_URL=https://rivesio.com`
- 2026-07-21: Title `Rivesio — %s`; keywords meta yok
- 2026-07-21: Widget destek rozeti yalnızca süreli veya süresi dolmuş destek için gösterilir

## Faydalı Komutlar
| Komut | Ne yapar |
|---|---|
| `npm run dev` | Next dev |
| `npm run build` | Widget + Next build |
| `npm run db:migrate` | Drizzle migrate |
