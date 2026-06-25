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

Next.js 15 (App Router) · MySQL (mysql2) · Cloudflare R2 (ekler) · Tailwind · jose (JWT) · zod · esbuild + html2canvas (widget).

> **Node sürümü:** 20–22 kullanın (`.nvmrc` → 22).
> **Veritabanı:** MySQL/MariaDB (Hostinger uyumlu). Şema ilk açılışta otomatik oluşturulur.

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
| `DB_HOST` / `DB_PORT` | MySQL sunucusu (Hostinger'da genelde `127.0.0.1:3306`) |
| `DB_USER` / `DB_PASSWORD` | MySQL kullanıcı bilgileri |
| `DB_NAME` | MySQL veritabanı adı |
| `UPLOAD_DIR` | Ekler için yerel fallback dizini (R2 ayarlıysa kullanılmaz) |
| `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` / `R2_BUCKET` | Cloudflare R2 (ekler) |
| `AUTO_APPROVE_SITES` | `1` → yeni siteler otomatik onaylı; `0` (önerilen) → panelden onaylarsın |

## Hostinger Node.js'e kurulum

> ⚠️ **Bu bir Node.js sunucu uygulamasıdır, statik site DEĞİLDİR.** Hostinger'ın
> "statik site / website build" Git akışı bunu deploy edemez ve **"No output directory
> found after build"** hatası verir. Mutlaka **hPanel → Gelişmiş → Node.js** (Phusion
> Passenger) altında bir **Node.js uygulaması** olarak kur.

Hostinger Node.js uygulamaları `npm start` çalıştırmaz; bir **başlangıç dosyası** yükler.
Bu repoda o dosya `server.js`'tir (Next.js'i production modda başlatır, portu `PORT`
ortam değişkeninden alır).

1. **Node.js uygulaması oluştur** (hPanel → Gelişmiş → Node.js):
   - **Node sürümü:** 20 veya 22
   - **Uygulama kökü (application root):** reponun bulunduğu klasör
   - **Başlangıç dosyası (application startup file):** `server.js`
   - **Uygulama URL'si:** alan adın/subdomain
2. **Kodu getir (Git auto-deploy):** repoyu uygulama köküne bağla/çek. Git yalnızca kodu
   indirir — derlemeyi aşağıdaki adımda sen tetiklersin.
3. **Bağımlılıklar + derleme** (SSH ya da Node.js panelindeki "Run NPM install" / script):
   ```bash
   npm install --include=dev   # build için devDependencies (esbuild, typescript) gerekli
   npm run build               # önce widget (esbuild), sonra next build → .next
   ```
4. **MySQL veritabanı:** hPanel → Veritabanları → MySQL'den bir veritabanı + kullanıcı
   oluştur ve `DB_*` değişkenlerine gir. Tablolar uygulama ilk açıldığında otomatik kurulur.
5. **Ortam değişkenleri:** Node.js panelinin "Environment variables" bölümünden yukarıdaki
   tabloyu gir. Ekler R2'ye gittiği için yerel kalıcı disk gerekmez. `PORT` GİRME (Passenger atar).
6. **Restart App** ile uygulamayı yeniden başlat. `PUBLIC_BASE_URL`'i alan adına eşitle.

### Her güncellemede (Git push sonrası)

Git auto-deploy kodu çeker ama Passenger eski süreci çalıştırmaya devam eder. Yeni kodun
yayına girmesi için:

```bash
npm install        # package.json değiştiyse
npm run build
```
ardından panelden **Restart App**. (İstersen bu iki komutu Hostinger'ın deploy hook'una
ekleyebilirsin.)

> Rate limit sayaçları bellek-içidir (tek instance varsayılır). MySQL paylaşımlı
> olduğundan veritabanı yatay ölçeklemede sorun değildir; yalnızca rate limit için
> ortak bir depo (ör. Redis) gerekir.

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
