# Rivesio — Proje Panosu

> Her oturum sonunda güncellenir. Son güncelleme: **2026-07-21**

## Proje Özeti
Merkezi feedback widget sunucusu + admin paneli. Next.js 15 App Router, React 19, Tailwind v4, Postgres + Drizzle, Better Auth, Resend, web-push, R2.

## Mevcut Durum
- **Repo:** https://github.com/cagriuckan/rivesio · `main` (`04cfa92`)
- **Prod:** rivesio.com · DB: Neon (migrate uygulandı)
- Landing: hero → feature bento → FAQ → CTA → footer; Beta badge logo yanında
- Varsayılan widget: `wk_9M0Uw9noVWCAPE-s8yiYBPMk` locale layout’ta
- Widget, destek süresi sınırsızsa destek rozeti göstermiyor
- SEO meta güçlendirildi (title ~55, desc ~150; googleBot max-preview)

## Kalanlar / Yapılacaklar
- [ ] Hostinger redeploy (main push edildi)
- [ ] Prod signup smoke test
- [ ] İdeal OG 1200×630
- [ ] Web push: Settings → “Push'u aç” ile izin; Enable hatası sessiz kalıyor (UX iyileştirme)

## Alınan Kararlar
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
