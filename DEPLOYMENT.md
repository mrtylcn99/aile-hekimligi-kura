# T.C. Aile Hekimliği Kura Sistemi - Deployment Guide

## 🚀 Deployment Yapılandırması

Bu proje hem frontend hem de backend için cloud deployment'a hazır şekilde yapılandırılmıştır.

## Frontend Deployment

### Vercel Deployment

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi import edin
4. Framework olarak "Create React App" seçin
5. Root Directory'yi `aile-hekimligi-kura/frontend` olarak ayarlayın
6. Environment Variables ekleyin:
   ```
   REACT_APP_API_URL=https://your-backend-api.onrender.com
   ```
7. Deploy butonuna tıklayın

### Netlify Deployment

1. [Netlify](https://netlify.com) hesabınıza giriş yapın
2. "Add new site" > "Import an existing project" seçin
3. GitHub repository'nizi bağlayın
4. Build settings:
   - Base directory: `aile-hekimligi-kura/frontend`
   - Build command: `npm run build`
   - Publish directory: `aile-hekimligi-kura/frontend/build`
5. Environment Variables ekleyin
6. Deploy site butonuna tıklayın

## Backend Deployment

### Render Deployment

1. [Render](https://render.com) hesabınıza giriş yapın
2. "New Web Service" oluşturun
3. GitHub repository'nizi bağlayın
4. Ayarlar:
   - Name: `aile-hekimligi-api`
   - Root Directory: `aile-hekimligi-kura/backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Environment Variables ekleyin:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   NODE_ENV=production
   CRON_SECRET=your_cron_secret
   ```
6. Create Web Service butonuna tıklayın

### Railway Deployment

1. [Railway](https://railway.app) hesabınıza giriş yapın
2. "New Project" > "Deploy from GitHub repo" seçin
3. Repository'yi seçin
4. Environment Variables ekleyin
5. Deploy butonuna tıklayın

## 📱 PWA Özellikleri

Sistem Progressive Web App (PWA) olarak çalışacak şekilde yapılandırılmıştır:

- ✅ Offline çalışma desteği
- ✅ Ana ekrana kurulum
- ✅ Push notification desteği (gelecekte eklenecek)
- ✅ Tam ekran modda çalışma
- ✅ Otomatik güncelleme kontrolü

## 🔒 Güvenlik Ayarları

- CORS yapılandırması tüm deployment domain'lerini destekler
- JWT token authentication
- Rate limiting (gelecekte eklenecek)
- MongoDB sanitization
- Helmet.js güvenlik başlıkları

## 📊 PDF Otomasyonu

Backend, İstanbul İl Sağlık Müdürlüğü web sitesinden otomatik PDF çekme özelliğine sahiptir:

- `/api/pdf-automation/import-latest` - En son PDF'i içe aktarır
- `/api/pdf-automation/available-pdfs` - Mevcut PDF'leri listeler
- `/api/pdf-automation/auto-sync` - Cron job için otomatik senkronizasyon

## 🌍 Çoklu Domain Desteği

Sistem aşağıdaki domain'lerde çalışacak şekilde yapılandırılmıştır:

- `https://aile-hekimligi-kura.vercel.app`
- `https://aile-hekimligi-kura.netlify.app`
- `https://aile-hekimligi.vercel.app`
- `https://aile-hekimligi.netlify.app`

## 📝 Notlar

- MongoDB Atlas ücretsiz cluster kullanılabilir
- Render ücretsiz plan yeterlidir (550 saat/ay)
- Vercel ve Netlify ücretsiz planları yeterlidir
- SSL sertifikaları otomatik olarak sağlanır

## 🆘 Sorun Giderme

### CORS Hatası
Backend'deki `server.js` dosyasında frontend URL'nizi allowed origins listesine ekleyin.

### MongoDB Bağlantı Hatası
MongoDB Atlas'ta IP whitelist'e deployment servisinin IP'sini veya 0.0.0.0/0 ekleyin.

### Build Hatası
Node.js versiyonunun 18+ olduğundan emin olun.

## 📧 İletişim

Deployment ile ilgili sorunlar için issue açabilirsiniz.