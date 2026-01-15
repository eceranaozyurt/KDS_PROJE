# API Dokümantasyonu

KDS Projesi - RESTful API Endpoints
Base URL: http://localhost:3000

İçindekiler:
1. Kimlik Doğrulama
2. Pazarlar - CRUD
3. Pazarlar - Senaryo API'leri
4. Hata Kodları
5. Örnek İstekler

## Kimlik Doğrulama

Login Sayfası
GET /login
Açıklama: Login sayfasını gösterir
Kimlik Gerekli: Hayır
Response Type: HTML

Giriş Yap
POST /login
Açıklama: Kullanıcı giriş işlemi
Kimlik Gerekli: Hayır

Request Body:
{
  "username": "admin",
  "password": "1234"
}

Success: /login sayfasına yönlendir ve session oluştur

Çıkış Yap
GET /logout
Açıklama: Kullanıcı çıkış işlemi
Kimlik Gerekli: Evet
Response: Session yok edilir, /login sayfasına yönlendrilir

## Pazarlar - CRUD Operations

1. Tüm Pazarları Listele
GET /api/pazarlar
Açıklama: Veritabanındaki tüm pazarları döner
Kimlik Gerekli: Hayır

Success Response (200):
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pazar_adi": "İstanbul",
      "yillik_talep_adet": 5000000,
      "bolge": "Marmara"
    }
  ],
  "count": 1
}

2. Spesifik Pazarı Getir
GET /api/pazarlar/:id
Parametreler: id (Path)
Açıklama: Belirtilen ID'ye ait pazarı döner

Success Response (200):
{
  "success": true,
  "data": {
    "id": 1,
    "pazar_adi": "İstanbul",
    "yillik_talep_adet": 5000000,
    "bolge": "Marmara"
  }
}

Error (404):
{
  "success": false,
  "error": {
    "message": "Pazar bulunamadı"
  }
}

3. Yeni Pazar Ekle
POST /api/pazarlar
Açıklama: Yeni pazar oluşturur

Request Body:
{
  "pazar_adi": "Adana",
  "yillik_talep_adet": 1500000,
  "bolge": "Çukurova"
}

Zorunlu Alanlar:
- pazar_adi (string, max 100 char)
- yillik_talep_adet (integer, > 0, < 10000000)

Opsiyonel Alanlar:
- bolge (string)

Success Response (201):
{
  "success": true,
  "message": "Pazar başarıyla oluşturuldu",
  "data": {
    "id": 15,
    "pazar_adi": "Adana",
    "yillik_talep_adet": 1500000,
    "bolge": "Çukurova"
  }
}

Validasyon Hataları:
- Pazar adı ve yıllık talep zorunludur
- Yıllık talep 0'dan büyük olmalıdır
- Yıllık talep 10 milyondan az olmalıdır
- Pazar adı maksimum 100 karakter olmalıdır

4. Pazarı Güncelle
PUT /api/pazarlar/:id
Parametreler: id (Path)
Açıklama: Pazarı günceller (tüm alanlar opsiyonel)

Request Body:
{
  "pazar_adi": "Adana (Güncelleme)",
  "yillik_talep_adet": 2000000
}

Success Response (200):
{
  "success": true,
  "message": "Pazar başarıyla güncellendi",
  "data": {
    "id": 15,
    "pazar_adi": "Adana (Güncelleme)",
    "yillik_talep_adet": 2000000,
    "bolge": "Çukurova"
  }
}

5. Pazarı Sil
DELETE /api/pazarlar/:id
Parametreler: id (Path)
Açıklama: Pazarı siler

Success Response (200):
{
  "success": true,
  "message": "Pazar başarıyla silindi"
}

Error (404):
{
  "success": false,
  "error": {
    "message": "Pazar bulunamadı"
  }
}

## Pazarlar - Senaryo API'leri

SENARYO 1: En Yüksek Talep Pazarları
GET /api/pazarlar/scenario/top-markets?limit=5

Açıklama:
En yüksek yıllık talep sahibi pazarları döner. Sadece 10 milyondan az talep sahibi pazarlar gösterilir.

İş Kuralı:
Şirket bu pazarlara yakın kurulursa, dağıtım maliyetini minimize edebilir.

Query Parametreler:
- limit (integer, default: 5): Kaç pazarı döneceği

Success Response (200):
{
  "success": true,
  "scenario": "En Yüksek Talep Sahibi Pazarlar",
  "data": [
    {
      "id": 1,
      "pazar_adi": "İstanbul",
      "yillik_talep_adet": 5000000,
      "bolge": "Marmara"
    },
    {
      "id": 2,
      "pazar_adi": "Ankara",
      "yillik_talep_adet": 2500000,
      "bolge": "Orta Anadolu"
    }
  ],
  "count": 2
}

Örnek İstekler:
curl "http://localhost:3000/api/pazarlar/scenario/top-markets?limit=3"

SENARYO 2: Bölgeye Göre Pazarlar
GET /api/pazarlar/scenario/region/:bolge

Açıklama:
Belirtilen bölgedeki tüm pazarları ve ortalama taleplerini döner.

İş Kuralı:
Bölgesel pazarların yoğunluğunu analiz ederek, tesisi hangi bölgeye kurmak en uygun belirlenir.

Path Parametreler:
- bolge (string): Bölge adı (örn: "Marmara", "Doğu", "Orta Anadolu")

Success Response (200):
{
  "success": true,
  "scenario": "Bölge Bazında Pazar Analizi",
  "bolge": "Marmara",
  "data": [
    {
      "id": 1,
      "pazar_adi": "İstanbul",
      "yillik_talep_adet": 5000000,
      "bolge": "Marmara"
    },
    {
      "id": 6,
      "pazar_adi": "Bursa",
      "yillik_talep_adet": 1500000,
      "bolge": "Marmara"
    }
  ],
  "count": 2,
  "orttalamaTalep": 3250000
}

Örnek İstekler:
curl "http://localhost:3000/api/pazarlar/scenario/region/Marmara"

## Hata Kodları

HTTP Status Kodları:
200 - OK (Başarılı GET/PUT/DELETE)
201 - Created (Başarılı POST)
400 - Bad Request (Validasyon hatası)
404 - Not Found (Kayıt bulunamadı)
500 - Internal Server Error (Sunucu hatası)

## Örnek İstekler

cURL ile Test Etme:

1. Pazarları listele
curl http://localhost:3000/api/pazarlar

2. Yeni pazar ekle
curl -X POST http://localhost:3000/api/pazarlar \
  -H "Content-Type: application/json" \
  -d '{
    "pazar_adi": "Adana",
    "yillik_talep_adet": 1500000,
    "bolge": "Çukurova"
  }'

3. Pazarı güncelle
curl -X PUT http://localhost:3000/api/pazarlar/1 \
  -H "Content-Type: application/json" \
  -d '{"yillik_talep_adet": 5500000}'

4. En yüksek talep pazarlarını getir
curl "http://localhost:3000/api/pazarlar/scenario/top-markets?limit=3"

5. Bölge bazında pazarları getir
curl "http://localhost:3000/api/pazarlar/scenario/region/Marmara"

6. Pazarı sil
curl -X DELETE http://localhost:3000/api/pazarlar/1

Response Formatı:

Success:
{
  "success": true,
  "message": "İşlem açıklaması",
  "data": { /* ilgili veri */ },
  "count": 5
}

Error:
{
  "success": false,
  "error": {
    "message": "Hata açıklaması",
    "code": "ERROR_CODE",
    "timestamp": "2026-01-15T10:30:00.000Z"
  }
}

