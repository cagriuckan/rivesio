# Kanews Feedback

Kanthemes temaları için merkezi geri bildirim sistemi. İki parçadan oluşur:

1. **Sunucu + panel** (bu repo) — Next.js 15 uygulaması. Gömülebilir widget'ı servis eder,
   geri bildirimleri toplar ve yönetmen için bir admin panel sunar. Hostinger Node.js'te çalışır.
2. **Tema entegrasyonu** — Kanews temasındaki `class/Feedback/FeedbackWidget.php`, widget'ı
   yalnızca yöneticilere, lisans anahtarıyla birlikte yükler.

## Özellikler

- Sağ altta "Geri bildirim" butonu; popup form (kategori, açıklama, **ekran yakala**, görsel
  yükle 0/4), `⌘/Ctrl + /` kısayolu.
- **Lisans + tema + onay kontrolü**: her site `widget_key` + lisans + domain ile kaydolur;
  yalnızca panelden onayladığın siteler geri bildirim gönderebilir.
- Panelden site **engelleme/onaylama**, geri bildirimleri okuma, durum/öncelik/çözüm notu ile
  **planlama**, ekran görüntüsü/görsel eklerini görüntüleme.
- **Her tema için ayrı widget** (proje): farklı `widget_key`, renk, kategori, konum.
- Tek yöneticili giriş (env'deki kullanıcı + scrypt parola hash + imzalı çerez).

## Teknoloji

Next.js 15 (App Router) · better-sqlite3 · Tailwind · jose (JWT) · zod · esbuild + html2canvas (widget).

> **Node sürümü:** 20–22 kullanın (`.nvmrc` → 22). `better-sqlite3` yerel bir modüldür ve
> kurulum sırasında çalışan Node sürümüne derlenir.

## Yerel geliştirme

```bash
nvm use            # node 22
npm install
cp .env.example .env
npm run hash -- "panel-parolaniz"   # çıkan ADMIN_PASSWORD_HASH satırını .env'e yapıştır
# .env içine JWT_SECRET üret:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

npm run build      # önce widget'ı (esbuild) sonra Next'i derler
npm start          # veya geliştirme için: npm run dev
```

İlk çalıştırmada veritabanı ve **"Kanews"** projesi otomatik oluşturulur. Widget anahtarını
panelin **Widget'lar** sayfasında görürsün.

### Tarayıcıda denemek

`demo.html` dosyasını aç (veya bir statik sunucuyla servis et), içindeki `WIDGET_KEY` ve sunucu
adresini kendi değerlerinle değiştir. Site ilk yüklemede **pending** gelir; panelin
**Siteler** sayfasından onayladıktan sonra buton görünür.

## Ortam değişkenleri (.env)

| Değişken | Açıklama |
|---|---|
| `ADMIN_USER` | Panel kullanıcı adı |
| `ADMIN_PASSWORD_HASH` | `npm run hash -- "..."` çıktısı (scrypt) |
| `JWT_SECRET` | Oturum çerezini imzalayan uzun rastgele dizi |
| `PUBLIC_BASE_URL` | Sunucunun herkese açık adresi (sonunda `/` yok) |
| `DB_PATH` | SQLite dosyası (kalıcı diskte) |
| `UPLOAD_DIR` | Yüklenen eklerin dizini (kalıcı diskte) |
| `AUTO_APPROVE_SITES` | `1` → yeni siteler otomatik onaylı; `0` (önerilen) → panelden onaylarsın |

## Hostinger Node.js'e kurulum

1. **Node uygulaması oluştur** (hPanel → Website → Node.js). Node sürümü **22**.
   Uygulama köküne bu repoyu yükle (Git veya dosya yöneticisi).
2. **Bağımlılıklar ve derleme** (SSH veya hPanel "Run npm script"):
   ```bash
   npm install        # better-sqlite3 burada derlenir
   npm run build
   ```
3. **Ortam değişkenleri**: hPanel'in env arayüzünden yukarıdaki tüm değerleri gir.
   `DB_PATH` ve `UPLOAD_DIR` için uygulama kökü altında kalıcı bir yol seç (ör. `./data/...`).
4. **Başlatma komutu**: `npm start` (Next standalone). Uygulama portunu Hostinger atar;
   Next `PORT` değişkenini kullanır.
5. Alan adını/şubdomaini uygulamaya yönlendir ve `PUBLIC_BASE_URL`'i ona eşitle.

> Tek instance varsayılır (rate limit ve SQLite bellek-içi sayaçlar buna göre). Yatay
> ölçeklemede paylaşımlı bir veri deposu gerekir.

## Tema entegrasyonu

`class/Feedback/FeedbackWidget.php` temaya dâhildir ve `functions.php` sonunda başlatılır.
WordPress yöneticisinde **Ayarlar → Geri Bildirim** sayfasından:

- Widget'ı aç/kapat,
- Sunucu adresini ve **widget anahtarını** gir (panelden alınır).

Alternatif olarak `wp-config.php` ile sabitleyebilirsin:

```php
define( 'KANEWS_FEEDBACK_URL', 'https://feedback.kanthemes.com' );
define( 'KANEWS_FEEDBACK_WIDGET_KEY', 'wk_xxx' );
```

Lisans anahtarı, temanın mevcut **sipariş anahtarı** ayarından (`kanews_order_auth`) otomatik
okunur. Widget yalnızca `manage_options` yetkili (yönetici) kullanıcılara yüklenir.

## API uçları

| Uç | Açıklama |
|---|---|
| `GET /api/widget/<key>.js` | Projeye özel konfigle gömülen widget JS'i |
| `POST /api/v1/register` | Site kaydı/yenileme; `enabled` + `status` döner |
| `POST /api/v1/feedback` | Geri bildirim oluşturur (lisans/tema/onay zorunlu) |
| `POST /api/v1/feedback/<id>/attachment` | Ekran görüntüsü/görsel yükler (maks 4, image/*) |
| `POST /api/admin/login` · `logout` | Yönetici oturumu |
| Panel sayfaları | `/` `/feedbacks` `/sites` `/projects` (çerezle korumalı) |

## Güvenlik notları

- Public uçlarda CORS açıktır; güvenlik origin yerine `widget_key` + lisans + domain + onay
  kontrolüyle sağlanır.
- Yüklenen ekler uygulama kökü dışında (UPLOAD_DIR) tutulur ve yalnızca oturum açmış
  yöneticiye `/api/admin/attachments/<id>` üzerinden servis edilir.
- Giriş ve gönderim uçlarında IP bazlı rate limit vardır.
