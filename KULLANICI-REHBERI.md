# 📖 T.C. Aile Hekimliği Kura Sistemi - Kullanıcı Rehberi

## 🔐 Kullanıcı Rolleri ve Yetkileri

Sistemde **2 farklı kullanıcı rolü** bulunmaktadır:

### 1. **Normal Kullanıcı (user)**
- Kura listesini görüntüleme
- Başvuru yapma
- Kendi başvurularını takip etme
- Boş pozisyonları görme
- Profil bilgilerini güncelleme
- PDF indirme

### 2. **Admin Kullanıcı (admin)**
Tüm normal kullanıcı yetkilerine ek olarak:
- Admin paneline erişim (`/admin`)
- İlleri aktif/pasif etme
- PDF otomasyonu yönetimi
- Toplu veri içe aktarma
- İl bazlı istatistikleri görme
- Sistem ayarları yönetimi

## 🚀 Test Kullanıcıları

### Normal Kullanıcı
```
TC Kimlik: 12345678901
Şifre: 123456
E-posta: normal@test.com
Rol: user
```

### Admin Kullanıcı
```
TC Kimlik: 98765432109
Şifre: admin123
E-posta: admin@test.com
Rol: admin
```

## 📱 Sistem Panelleri ve Erişim

### 1. **Giriş Ekranı**
- **URL:** `/login`
- Mobil cihazlarda özel tasarım
- TC Kimlik veya e-posta ile giriş

### 2. **Ana Panel (Dashboard)**
- **URL:** `/` (ana sayfa)
- **Kimler Girebilir:** Tüm giriş yapmış kullanıcılar
- Özet istatistikler
- Hızlı erişim butonları
- Son duyurular

### 3. **Kura Listesi**
- **URL:** `/kura-listesi`
- **Kimler Girebilir:** Tüm giriş yapmış kullanıcılar
- İl bazlı filtreleme
- İlçe bazlı arama
- Sıralama seçenekleri

### 4. **Başvuru Formu**
- **URL:** `/basvuru-formu`
- **Kimler Girebilir:** Tüm giriş yapmış kullanıcılar
- Tercih yapma
- Pozisyon seçimi

### 5. **Başvurularım**
- **URL:** `/basvurularim`
- **Kimler Girebilir:** Tüm giriş yapmış kullanıcılar
- Başvuru durumu takibi
- Geçmiş başvurular

### 6. **Boş Pozisyonlar**
- **URL:** `/bos-pozisyonlar`
- **Kimler Girebilir:** Tüm giriş yapmış kullanıcılar
- İl/ilçe bazlı boş pozisyonlar
- Detaylı bilgi

### 7. **Profil**
- **URL:** `/profile`
- **Kimler Girebilir:** Tüm giriş yapmış kullanıcılar
- Kişisel bilgiler
- Şifre değiştirme
- İletişim bilgileri güncelleme

### 8. **Admin Paneli** ⚙️
- **URL:** `/admin`
- **Kimler Girebilir:** SADECE admin rolüne sahip kullanıcılar
- İl yönetimi
- PDF otomasyonu
- Sistem istatistikleri
- Toplu işlemler

## 🌍 İl Yönetimi (Admin)

Admin panelinden yapılabilecekler:

1. **İlleri Aktif/Pasif Etme**
   - 81 il arasından seçim
   - Toplu güncelleme
   - İl bazlı PDF yükleme

2. **PDF Otomasyonu**
   - Otomatik veri çekme
   - Manuel PDF yükleme
   - Senkronizasyon durumu

3. **İstatistikler**
   - İl bazlı başvuru sayıları
   - Boş/dolu pozisyon oranları
   - Tercih istatistikleri

## 💻 Kurulum ve Test

### Backend'de Test Kullanıcıları Oluşturma

```bash
cd backend
npm install     # İlk kurulumda
npm run seed    # Test kullanıcılarını oluştur
npm run dev     # Sunucuyu başlat
```

### Frontend'i Çalıştırma

```bash
cd frontend
npm install     # İlk kurulumda
npm start       # Uygulamayı başlat
```

## 🔒 Güvenlik Notları

- Test kullanıcıları sadece geliştirme ortamı içindir
- Production'da gerçek kullanıcı bilgileri kullanılmalıdır
- Admin şifreleri düzenli olarak değiştirilmelidir

## 📝 Git'e Push Etme

```bash
# Root dizinde (Aile-hekimligi-kura)
git add .
git commit -m "İl bazlı kura sistemi ve admin paneli eklendi"
git push origin main
```

## 🚀 Deployment Sonrası

Render.com'a deploy ettikten sonra:

1. Backend URL'ini environment variable olarak ayarlayın
2. Test kullanıcılarını oluşturmak için:
   ```bash
   npm run seed  # Render.com console'dan çalıştırın
   ```

## ⚠️ Önemli Notlar

1. **Tek Deployment URL:** `https://aile-hekimligi.vercel.app`
2. **Backend API:** `https://aile-hekimligi-api.onrender.com`
3. **MongoDB:** Atlas cloud database kullanılıyor
4. **Paketler:** Backend'e `axios` ve `cheerio` eklendi (Render otomatik yükler)

## 🆘 Sorun Giderme

### "Admin paneline giremiyorum"
- Admin kullanıcısı ile giriş yaptığınızdan emin olun (TC: 98765432109)

### "Test kullanıcıları çalışmıyor"
- Backend'de `npm run seed` komutunu çalıştırın

### "CORS hatası alıyorum"
- Backend `.env` dosyasında `FRONTEND_URL` doğru ayarlanmış mı kontrol edin

---

**Hazırlayan:** T.C. Aile Hekimliği Kura Sistemi Geliştirme Ekibi
**Versiyon:** 1.0.0
**Güncelleme:** Ekim 2024