# Kuruluş Yeri Karar Destek Sistemi

## Proje Açıklaması

Kuruluş Yeri Karar Destek Sistemi, YEŞİLCE TEKSTİL VE TİCARET A.Ş için geliştirilmiş bir uygulamadır. Sistem, yeni bir tesis kurulacak konumu belirlemek için pazar talebini, dağıtım maliyetlerini, hammadde maliyetlerini ve büyüme oranlarını dikkate alarak analiz yapar.

## Özellikler

- Güvenli kullanıcı kimlik doğrulaması
- Detaylı pazar analizi ve görselleştirme
- Coğrafi konum haritası
- Dinamik senaryo analizi ile büyüme oranı modelleme
- RESTful API ile CRUD işlemleri

## Mimari Yapı

Proje MVC (Model-View-Controller) mimarisine uygun olarak tasarlanmıştır.

### Dosya Yapısı

```
kds-proje/
├── models/
│   ├── kdsModel.js              # KDS analiz modeli
│   └── pazarModel.js            # Pazarlar CRUD işlemleri
├── controllers/
│   ├── authController.js        # Kimlik doğrulama
│   ├── kdsController.js         # Dashboard ve analiz
│   └── pazarController.js       # Pazarlar API
├── routes/
│   └── web.js                   # Endpoint yönetimi
├── views/
│   ├── login.ejs                # Login formu
│   └── dashboard.ejs            # Ana dashboard
├── middlewares/
│   ├── guvenlik.js              # Session doğrulama
│   └── errorHandler.js          # Hata yönetimi
├── config/
│   └── db.js                    # Veritabanı bağlantısı
├── .env                         # Ortam değişkenleri
├── .env.example                 # Konfigürasyon şablonu
├── app.js                       # Ana uygulama
├── package.json                 # Bağımlılıklar
└── API_DOCUMENTATION.md         # API rehberi
```

## Veritabanı Şeması

```
kullanicilar
├── id (PK)
├── kullanici_adi
└── sifre

pazarlar
├── id (PK)
├── pazar_adi
├── yillik_talep_adet
└── bolge

aday_arsalar
├── id (PK)
├── arsa_adi
├── uzunluk_m2
├── koordinat_lat
└── koordinat_lng

tedarikciler
├── id (PK)
├── ad
├── tur
└── konum

mevcut_tesisler
├── id (PK)
├── tesis_adi
├── kapasite
└── lokasyon

uretim_gecmisi
├── id (PK)
├── yil
└── uretilen_adet
```


## Giriş Bilgileri

Varsayılan test kullanıcısı:
- Kullanıcı Adı: admin
- Şifre: 1234

## İş Kuralları

### Pazar Yönetimi

Pazarlar sisteme eklenirken aşağıdaki kurallara uyulmalıdır:

- Pazar adı zorunludur ve maksimum 100 karakter olmalıdır
- Yıllık talep miktarı 0'dan büyük olmalıdır
- Yıllık talep miktarı 10 milyondan az olmalıdır
- Bölge bilgisi opsiyonel olarak eklenebilir

### Senaryo 1: En Yüksek Talep Pazarları

Bu senaryo, en yüksek yıllık talep sahibi pazarları listeleme amacındadır. Sistem şunları yapar:

- Pazarları yıllık talep miktarına göre sıralar
- Sadece 10 milyondan az talep sahibi pazarları gösterir
- Bu pazarlara yakın bir tesis kurulması dağıtım maliyetini minimize eder

### Senaryo 2: Bölgesel Dağılım Analizi

Bu senaryo, belirtilen bölgedeki pazarların dağılımını ve ortalama taleplerini gösterir. Sistem şunları yapar:

- Pazarları bölgeye göre filtreler
- Bölge içindeki pazarlar için ortalama talep hesaplar
- Talepte yüksek bölgeleri işletme yeri olarak önerir

## API Endpoint'leri

### Pazarlar - CRUD

Pazarlar için temel CRUD işlemleri:

- GET /api/pazarlar - Tüm pazarları listele
- POST /api/pazarlar - Yeni pazar ekle
- GET /api/pazarlar/:id - Spesifik pazarı getir
- PUT /api/pazarlar/:id - Pazarı güncelle
- DELETE /api/pazarlar/:id - Pazarı sil

### Pazarlar - Senaryo API'leri

- GET /api/pazarlar/scenario/top-markets?limit=5 - En yüksek talep pazarları
- GET /api/pazarlar/scenario/region/:bolge - Bölge bazında pazarlar

Detaylı API dokümantasyonu için API_DOCUMENTATION.md dosyasını incelemeyi önerilir.

## Kimlik Doğrulama

Sistemin çoğu özelliğine erişmek için kimlik doğrulaması gerekmektedir. Kullanıcı login sayfasından kimlik bilgilerini girdikten sonra session oluşturulur ve dashboard'a erişim sağlanır.

## Güvenlik

- Session-based authentication ile koruma
- Prepared statements kullanılarak SQL Injection önleme
- Merkezi hata yönetimi
- Input validasyonu
- Gizli verilerin .env dosyasında saklanması

## Test Etme

API endpoint'lerini test etmek için:

```bash
# Tüm pazarları listele
curl http://localhost:3000/api/pazarlar

# Yeni pazar ekle
curl -X POST http://localhost:3000/api/pazarlar \
  -H "Content-Type: application/json" \
  -d '{"pazar_adi":"Adana","yillik_talep_adet":1500000,"bolge":"Çukurova"}'

# En yüksek talep pazarlarını getir
curl "http://localhost:3000/api/pazarlar/scenario/top-markets?limit=5"

# Bölge bazında pazarları getir
curl "http://localhost:3000/api/pazarlar/scenario/region/Marmara"
```

Postman gibi API test araçları da kullanılabilir.

## Dosya Açıklamaları

models/kdsModel.js - Stored Procedure'ları çağırarak tesis kurulum yeri analizi yapar.

models/pazarModel.js - Pazarlar tablosu için CRUD işlemleri ve senaryo sorguları içerir.

controllers/authController.js - Login, logout ve session yönetimini gerçekleştirir.

controllers/kdsController.js - Dashboard sayfasını hazırlar ve senaryo simülasyonlarını yürütür.

controllers/pazarController.js - Pazarlar API endpoint'lerini yönetir ve iş kurallarını uygular.

routes/web.js - Tüm HTTP endpoint'lerini tanımlar ve uygun controller'lara yönlendirir.

middlewares/guvenlik.js - Session doğrulaması yaparak korumalı sayfaları yönetir.

middlewares/errorHandler.js - Tüm uygulama hatalarını yakalar ve standart format'ta döner.

config/db.js - MySQL veritabanı bağlantı havuzunu oluşturur ve yönetir.




## Kaynaklar

- Express.js: https://expressjs.com/
- MySQL2: https://www.npmjs.com/package/mysql2
- EJS: https://ejs.co/
- Bootstrap 5: https://getbootstrap.com/
- Vercel: https://vercel.com/

---

Proje: Sunucu Tabanlı Programlama
Tarih: 15 Ocak 2026
Versiyon: 1.0.0


