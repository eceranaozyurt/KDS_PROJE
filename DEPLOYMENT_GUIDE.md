# Vercel'e Deployment Rehberi

## Ön Gereklilikler

1. Node.js (v18 veya üstü) yüklü olmalı
2. npm yüklü olmalı
3. Vercel hesabı (https://vercel.com/)
4. Git kurulu olmalı
5. GitHub hesabı (isteğe bağlı ama önerilir)

## Adım 1: Vercel CLI Yükle

```bash
npm install -g vercel
```

## Adım 2: Vercel'e Giriş Yap

```bash
vercel login
```

Browser açılacak ve Vercel hesabına giriş yapmanız istenecek.

## Adım 3: Projeyi GitHub'a Pushla (Önerilir)

```bash
git add -A
git commit -m "Final submission - Vercel ready"
git push origin main
```

## Adım 4: Projeyi Vercel'e Deploy Et

Proje dizininde aşağıdaki komutu çalıştır:

```bash
vercel
```

Sorular sorulacak:
- Set up and deploy: Y
- Which scope: Hesap adını seç
- Link to existing project: N
- Project name: kds-proje (veya istediğin ad)
- Directory: ./ (current directory)

## Adım 5: Environment Variables Ayarla

### Seçenek A: CLI ile

Deploy sonrası:

```bash
vercel env add DB_HOST
vercel env add DB_USER
vercel env add DB_PASSWORD
vercel env add DB_NAME
```

Her birinin değerini gir.

### Seçenek B: Vercel Dashboard ile

1. https://vercel.com/dashboard adresine git
2. Projeyi seç
3. Settings → Environment Variables
4. Aşağıdaki değişkenleri ekle:

| Variable | Value | Örnek |
|----------|-------|-------|
| DB_HOST | MySQL sunucu adresi | db.example.com |
| DB_USER | Veritabanı kullanıcısı | admin |
| DB_PASSWORD | Veritabanı şifresi | secret123 |
| DB_NAME | Veritabanı adı | tesis_yer_secimi |

5. Değişkenleri ekledikten sonra "Redeploy" tıkla

## Adım 6: Veritabanı Bağlantısı

### Önemli: Localhost Kullanma!

MySQL veritabanınız Vercel'den erişilebilir olmalıdır:

❌ ÇALIŞMAZ: localhost, 127.0.0.1
✅ ÇALIŞIR: Cloud hosting, remote server

### Seçenekler:

#### Seçenek 1: Cloud MySQL Servisi (Önerilir)

Ücretsiz seçenekler:
- **PlanetScale** (https://planetscale.com/) - MySQL uyumlu
- **Railway** (https://railway.app/) - MySQL hosting
- **Render** (https://render.com/) - PostgreSQL/MySQL
- **Heroku** - PostgreSQL
- **AWS RDS** - Free tier MySQL

#### Seçenek 2: Kendi Sunucunuz

Eğer kendi sunucunuzda MySQL'iniz varsa:
- Firewall ayarlarını kontrol et
- Vercel IP'lerine izin ver
- Username/password doğrulamalarını kontrol et

#### Seçenek 3: Docker ile Local Test

Deploy öncesi local test için:

```bash
npm start
```

http://localhost:3000/login adresine git

Giriş: admin / 1234

## Adım 7: Deploy Kontrol Et

### Vercel Dashboard'ta

1. Logs sekmesinde build ayrıntılarını kontrol et
2. Errors yoksa deploy başarılı demektir
3. URL'ye tıklayarak siteyi aç

### Test İçin

Deployed URL: https://yourproject.vercel.app

```bash
# API test
curl https://yourproject.vercel.app/api/pazarlar
```

## Sorun Giderme

### Hata: "Cannot find module"

Çözüm:
```bash
npm install
npm run build
vercel --prod
```

### Hata: "Database connection failed"

Sebepleri:
1. DB_HOST, DB_USER, DB_PASSWORD, DB_NAME eksik/yanlış
2. MySQL sunucusu Vercel'den erişilemiyor
3. MySQL firewall ayarları

Çözüm:
- Vercel Dashboard → Environment Variables kontrol et
- MySQL sunucusunun Vercel IP'lerine izin verip vermediğini kontrol et
- Lokal olarak bağlantıyı test et: `node -e "require('./config/db')"`

### Hata: "Port already in use"

Vercel otomatik port ayarlar, bu sorun yaşanmaz normalde.

## Başarılı Deploy İşaretleri

✅ Build logs hatasız tamamlandı
✅ Vercel tarafından URL verildi
✅ Web sayfası yükleniyor
✅ API endpoint'leri cevap veriyor
✅ Login sayfası erişilebilir
✅ Database bağlantısı çalışıyor

## Continuous Deployment

GitHub'a push yaptığında otomatik deploy olmak için:

1. Vercel Dashboard'ta Git kurulumunu yap
2. GitHub reposu ile bağla
3. Main branch'e her push'ta otomatik deploy olur

## Rollback (Önceki versiyona dönme)

```bash
vercel rollback
```

## Yardımcı Linkler

- Vercel Documentation: https://vercel.com/docs
- Vercel CLI: https://vercel.com/docs/cli
- Environment Variables: https://vercel.com/docs/concepts/projects/environment-variables
- Networking: https://vercel.com/support/articles/how-do-i-access-a-database-on-my-local-machine-from-a-vercel-deployment

## Notlar

- İlk deploy biraz zaman alabilir
- Veritabanı bağlantısı en sık sorun kaynağıdır
- Session management Vercel'de de çalışır
- Static files otomatik optimize edilir
