# Rivesio — Proje Panosu

> Her oturum sonunda güncellenir. Son güncelleme: **2026-08-02**

## Proje Özeti
Merkezi feedback widget sunucusu + admin paneli. Next.js 15 App Router, React 19, Tailwind v4, Postgres + Drizzle, Better Auth, Resend, web-push, R2.

## Mevcut Durum
- **Repo:** https://github.com/cagriuckan/rivesio · `main`
- **Prod:** rivesio.com · DB: Neon
- **Sürüm:** Beta v0.1.1 / package `0.1.1`
- Bildirimler: ajan daveti in-app/push + e-posta sonucu; bekleyen davetler (kabul/red); atama/status_change/reply→assignee
- Inbox triage durumları: `open` / `pending` / `in_progress` / `resolved` / `closed` (migration `0008`)
- Widget **pasife alma**: `projects.is_active` (migration `0007`); kart menüsü + ayarlar toggle; pasifte script no-op, register/submit/conversation reddedilir
- `allowConversation` kapalıysa widget’ta Geçmiş sekmesi (ve tabs bar) render edilmiyor
- Widget konum: sol/sağ alt + masaüstü/mobil ayrı offset + zIndex (varsayılan 99999)
- Admin perf: `(panel)/layout` Shell; reply `after()`; sites local state
- Sites: pagination (20), görünür toplu seçim, belirgin hover aksiyonlar; quick-add banner kaldırıldı
- Widget logo FAB + panel başlık + Projects kart / switcher
- Mobile tab bar: expo-glass-tabs web portu (minimize-on-scroll, scrubbing, sliding highlight)
- Dashboard: Son geri bildirimler + Kategoriler kartları zenginleştirildi
- Widget kategorileri TR/EN etiketli; wire format `categories: string[]` + `categoryLabels` (eski bundle uyumu)

## Kalanlar / Yapılacaklar
- [ ] Hostinger redeploy (bildirim düzeltmeleri + `0009_notification_types`)
- [ ] Prod `RESEND_API_KEY` + VAPID keys doğrula (e-posta/push yoksa sessiz kalır)
- [ ] Soft nav + reply + sites pagination smoke test
- [ ] Prod signup smoke test
- [ ] İdeal OG 1200×630
- [ ] Ajan daveti smoke (mevcut kullanıcıya bell + e-posta + kabul/red)
- [ ] Mobile glass tab bar smoke test (scroll minimize + finger scrub)
- [ ] Widget kategori dili smoke test (`lang=en` / `lang=tr`)
- [ ] Widget pasife alma smoke test (kart / ayarlar / embed gizlenme)
- [ ] Inbox durum seti smoke test (open→in_progress on reply, pending/closed filtre)

## Alınan Kararlar
- 2026-08-02: Sürüm Beta v0.1.1 — bildirim sistemi (ajan daveti, atama, push/e-posta)
- 2026-08-02: Ajan daveti `notify(agent_invite)` + dedicated e-posta; panelde bekleyen davetler kabul/red; atama/status/reply assignee kanalları
- 2026-08-02: Sürüm Beta v0.1.0 / package `0.1.0`
- 2026-08-02: Inbox triage `open/pending/in_progress/resolved/closed`; ilk ajan yanıtı `open`→`in_progress`; `planned/wontfix` kaldırıldı
- 2026-08-02: Sidebar gelen kutusu badge'i `status=open` + ziyaretçi son konuşan; ajan/owner son mesajlı thread'ler sayıya dahil değil
- 2026-07-31: Widget konum yalnız bottom-left/right; offset masaüstü (`offsetX/Y`) ve mobil (`offsetXMobile/YMobile`) ayrı; z-index ayarlanabilir
- 2026-07-31: `allowConversation=false` → widget Geçmiş sekmesi + tabs bar yok; yalnız form
- 2026-07-30: Widget pasif = `is_active=false`; silmeden gizler; admin panel + inbox çalışmaya devam eder
- 2026-07-26: Widget API `categories` string[] + `categoryLabels` map; object[] kısa süre eski bundle’ı kırıyordu
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
