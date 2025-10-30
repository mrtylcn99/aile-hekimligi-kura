# 🏥 T.C. Aile Hekimliği Kura Sistemi - React Native

## 📱 Gerçek Native Android APK Uygulaması

Bu proje **T.C. Sağlık Bakanlığı** için geliştirilmiş olan Aile Hekimliği Kura Başvuru ve Takip Sistemi'nin **React Native** versiyonudur.

### ✨ Özellikler

- 🔐 **JWT ile Güvenli Kimlik Doğrulama**
- 📋 **Kura Başvuruları Yönetimi**
- 📊 **İstatistik ve Dashboard**
- 🎨 **Orange/White Healthcare Teması**
- 📱 **100% Native Android APK**
- 🔄 **Online Veri Senkronizasyonu**
- 🛡️ **KVKK Uyumlu**

---

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- **Node.js**: 16.x veya üzeri
- **React Native CLI**: 2.0.1 veya üzeri
- **Android Studio**: Arctic Fox (2020.3.1) veya üzeri
- **JDK**: 11 veya üzeri
- **Android SDK**: API Level 21-34

### 1. Projeyi Klonlayın

```bash
git clone <your-repo-url>
cd mobile
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Android Emülatörü/Cihazını Hazırlayın

#### Android Studio Emülatörü:
```bash
# Android Studio'dan emülatör başlatın
# veya
emulator -avd <your-avd-name>
```

#### Fiziksel Cihaz:
1. USB Debugging açın
2. Cihazı bilgisayara bağlayın
3. `adb devices` ile kontrol edin

### 4. Metro Bundle'ı Başlatın

```bash
npx react-native start
```

### 5. Android Uygulamasını Çalıştırın

```bash
# Debug modda çalıştır
npx react-native run-android

# Belirli cihazda çalıştır
npx react-native run-android --deviceId=<device-id>
```

---

## 📦 APK Oluşturma

### Debug APK

```bash
cd android
./gradlew assembleDebug

# APK lokasyonu:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Release APK (Production)

#### 1. Keystore Oluşturun:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Keystore Bilgilerini Ayarlayın:

`android/gradle.properties` dosyasına ekleyin:

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

#### 3. Release APK Oluşturun:

```bash
cd android
./gradlew assembleRelease

# APK lokasyonu:
# android/app/build/outputs/apk/release/app-release.apk
```

#### 4. APK'yı Optimize Edin:

```bash
cd android
./gradlew bundleRelease

# AAB lokasyonu (Play Store için):
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 🏗️ Proje Yapısı

```
mobile/
├── src/
│   ├── components/         # Yeniden kullanılabilir componentler
│   ├── screens/           # Ana ekranlar
│   │   ├── auth/          # Giriş/Kayıt ekranları
│   │   └── main/          # Ana uygulama ekranları
│   ├── navigation/        # React Navigation yapısı
│   ├── contexts/          # React Context (AuthContext)
│   ├── services/          # API ve servisler
│   ├── styles/           # Genel stiller ve temalar
│   └── utils/            # Yardımcı fonksiyonlar
├── android/              # Android native kod
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── java/     # Java/Kotlin dosyaları
│   │   │   ├── res/      # Android resources
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle  # App level gradle
│   ├── build.gradle      # Project level gradle
│   └── settings.gradle   # Gradle settings
├── package.json
├── babel.config.js
├── metro.config.js
└── README.md
```

---

## 🎨 Tema ve Renkler

### Orange Healthcare Theme

```typescript
Colors = {
  primary: '#ff6b35',         // Ana turuncu
  primaryDark: '#cc5528',     // Koyu turuncu
  primaryLight: '#ff8c42',    // Açık turuncu
  secondary: '#ffa560',       // İkincil turuncu
  accent: '#fff5f0',         // Krem
  background: '#ffffff',      // Beyaz arkaplan
  text: '#2d2d2d',           // Ana metin
  success: '#22c55e',        // Yeşil
  error: '#ef4444',          // Kırmızı
  warning: '#f59e0b',        // Sarı
}
```

---

## 🔧 API Yapılandırması

### Backend Bağlantısı

`src/services/ApiService.ts` dosyasında:

```typescript
const API_BASE_URL = 'https://your-backend-app.onrender.com';
```

### Auth Context

`src/contexts/AuthContext.tsx`:
- AsyncStorage ile token yönetimi
- Otomatik login state kontrolü
- API interceptor'ları

---

## 🧪 Test ve Debug

### Flipper Debug

```bash
# Flipper'ı başlatın
npx react-native doctor

# Network isteklerini görüntüleyin
# AsyncStorage verilerini kontrol edin
```

### React Native Debugger

```bash
# Chrome DevTools
# Component Inspector
# Redux DevTools (eğer kullanılıyorsa)
```

### Log Kontrolü

```bash
# Android logs
npx react-native log-android

# Metro bundler logs
npx react-native start --verbose
```

---

## 🚨 Sorun Giderme

### Metro Cache Temizleme

```bash
npx react-native start --reset-cache
```

### Android Clean Build

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Node Modules Temizleme

```bash
rm -rf node_modules
npm install
```

### Common Issues

1. **"Unable to load script"**
   ```bash
   adb reverse tcp:8081 tcp:8081
   ```

2. **"Task :app:installDebug FAILED"**
   ```bash
   adb uninstall com.ailehekimligikura
   ```

3. **"Duplicate resources"**
   ```bash
   cd android && ./gradlew clean
   ```

---

## 📱 APK İmzalama ve Dağıtım

### Google Play Store

1. **AAB (Android App Bundle) oluşturun**
2. **Play Console'da uygulama kaydı yapın**
3. **KVKK ve Gizlilik Politikası ekleyin**
4. **Screenshots ve açıklamalar hazırlayın**

### Direct APK Dağıtımı

1. **Release APK'yı oluşturun**
2. **APK'yı imzalayın**
3. **Güvenlik kontrollerini yapın**
4. **Kurumsal dağıtım kanalları kullanın**

---

## 🔐 Güvenlik

- **SSL pinning** (production için)
- **Code obfuscation** (ProGuard/R8)
- **API key protection**
- **KVKK compliance**
- **Secure storage** (Keychain/Keystore)

---

## 👥 Katkıda Bulunma

Bu proje T.C. Sağlık Bakanlığı için geliştirilmiştir. Tüm değişiklikler resmi kanallardan onaylanmalıdır.

---

## 📄 Lisans

© 2024 T.C. Sağlık Bakanlığı. Tüm hakları saklıdır.

---

## 📞 Destek

- **E-posta**: support@ailehekimligi.gov.tr
- **Telefon**: 444-AHKS (444-2457)
- **Web**: https://ailehekimligi.saglik.gov.tr

---

## 🔄 Versiyon Geçmişi

### v1.0.0 (İlk Sürüm)
- ✅ React Native implementasyonu
- ✅ JWT Authentication
- ✅ Dashboard ve Kura Listesi
- ✅ Başvuru Yönetimi
- ✅ Profile Yönetimi
- ✅ Orange Healthcare Teması
- ✅ Android APK Build