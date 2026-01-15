/**
 * API Test Rehberi
 */

const API_BASE = 'http://localhost:3000';

console.log(`
API TEST KOMUTLARI
==================

Base URL: ${API_BASE}

GIRIŞ İŞLEMI:
1. http://localhost:3000/login adresine git
2. Kullanıcı: admin
3. Şifre: 1234

TEST KOMUTLARI:

Tüm pazarları listele:
curl ${API_BASE}/api/pazarlar

Yeni pazar ekle:
curl -X POST ${API_BASE}/api/pazarlar \\
  -H "Content-Type: application/json" \\
  -d '{"pazar_adi":"İzmir","yillik_talep_adet":3000000,"bolge":"Ege"}'

Pazarı güncelle (ID 1):
curl -X PUT ${API_BASE}/api/pazarlar/1 \\
  -H "Content-Type: application/json" \\
  -d '{"yillik_talep_adet":6000000}'

En yüksek talep pazarları:
curl "${API_BASE}/api/pazarlar/scenario/top-markets?limit=5"

Bölgeye göre pazarlar:
curl "${API_BASE}/api/pazarlar/scenario/region/Marmara"

Pazarı sil (ID 1):
curl -X DELETE ${API_BASE}/api/pazarlar/1

Detaylı API dokümantasyonu: API_DOCUMENTATION.md
`);
