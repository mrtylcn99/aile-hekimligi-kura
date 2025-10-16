# Aile Hekimliği Kura Sistemi

Aile hekimlerinin İstanbul İl Sağlık Müdürlüğü kura sürecini takip edebilmesi ve başvuru formlarını oluşturabilmesi için geliştirilmiş web uygulaması.

## Özellikler

- Kullanıcı kayıt ve giriş sistemi (TC Kimlik, telefon, e-posta)
- Telefon doğrulama (OTP)
- Kura listesi görüntüleme ve filtreleme
- Hizmet puanına göre sıralama
- Pozisyon tercihi (Kabul/Red/Pas)
- Otomatik başvuru formu oluşturma
- PDF çıktı alma
- Bildirim sistemi
- Reklam alanları (esnek yapı)

## Kurulum

**Proje Konumu:** `C:\Users\merth\Desktop\Denemeler\Aile-hekimligi-kura\aile-hekimligi-kura`

### Gereksinimler

- Node.js (v14 veya üzeri)
- PostgreSQL (v12 veya üzeri)
- npm veya yarn

### Backend Kurulumu

```bash
# Ana dizin: C:\Users\merth\Desktop\Denemeler\Aile-hekimligi-kura
cd aile-hekimligi-kura\backend
npm install
```

#### PostgreSQL Veritabanı Kurulumu

1. PostgreSQL'de yeni veritabanı oluşturun
2. `database/schema.sql` dosyasını çalıştırın
3. `.env` dosyasını düzenleyin:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aile_hekimligi_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
NODE_ENV=development
```

#### Backend'i Başlatma

```bash
npm run dev   # Development
npm start     # Production
```

### Frontend Kurulumu

```bash
# Ana dizin: C:\Users\merth\Desktop\Denemeler\Aile-hekimligi-kura
cd aile-hekimligi-kura\frontend
npm install
npm start
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Kullanım

### 1. Kayıt Olma
- TC Kimlik, telefon, e-posta ve diğer bilgilerle kayıt
- Telefon doğrulama (SMS OTP)

### 2. Profil Tamamlama
- Doğum bilgileri
- Sicil numarası
- Ünvan seçimi
- Mezuniyet bilgileri

### 3. Kura Listesi
- İlçe ve ünvana göre filtreleme
- Hizmet puanına göre sıralama
- Pozisyon tercihi yapma

### 4. Başvuru Formu
- Otomatik form doldurma
- PDF olarak indirme
- Yerel klasöre kaydetme

## API Endpoints

### Auth
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/send-otp` - OTP gönderimi
- `POST /api/auth/verify-phone` - Telefon doğrulama

### User
- `GET /api/user/profile` - Profil bilgileri
- `PUT /api/user/profile` - Profil güncelleme
- `GET /api/user/tercihler` - Kullanıcı tercihleri
- `GET /api/user/bildirimler` - Bildirimler

### Kura
- `GET /api/kura/liste` - Kura listesi
- `GET /api/kura/siram` - Kullanıcının sırası
- `POST /api/kura/tercih` - Tercih yapma
- `GET /api/kura/istatistikler` - İstatistikler

### PDF
- `POST /api/pdf/upload` - PDF yükleme ve işleme
- `POST /api/pdf/basvuru-formu` - Başvuru formu oluşturma

## Klasör Yapısı

```
aile-hekimligi-kura/
├── backend/
│   ├── config/         # Veritabanı konfigürasyonu
│   ├── routes/         # API rotaları
│   ├── middleware/     # Auth middleware
│   ├── validators/     # Veri doğrulama
│   ├── utils/          # PDF işleme
│   ├── uploads/        # Yüklenen PDF'ler
│   └── server.js       # Ana server dosyası
├── frontend/
│   ├── public/         # Statik dosyalar
│   ├── src/
│   │   ├── components/ # React componentleri
│   │   ├── contexts/   # Context API
│   │   ├── pages/      # Sayfa componentleri
│   │   └── App.js      # Ana component
├── database/
│   └── schema.sql      # Veritabanı şeması
├── exports/            # Oluşturulan PDF'ler
└── documents/          # Dokümantasyon
```

## Güvenlik

- JWT token ile kimlik doğrulama
- Şifre hashleme (bcrypt)
- Rate limiting
- Input validation (Joi)
- SQL injection koruması

## Geliştirme Notları

- PDF parse işlemi manuel güncelleme gerektirir
- SMS entegrasyonu için Netgsm veya İleti Merkezi kullanılabilir
- Reklam alanları esnek yapıda tasarlanmıştır
- Kura sıralaması hizmet puanına göre yapılır (ileride değiştirilebilir)

## Lisans

Bu proje özel kullanım içindir.