@echo off
echo ========================================
echo   T.C. AILE HEKIMLIGI KURA APK BUILDER
echo ========================================
echo.

:: Version bilgilerini al
set /p version=APK version numarasi girin (ornek: 1.0.0):
set versionCode=100

:: Klasör oluştur
if not exist "apps\v%version%" mkdir "apps\v%version%"

echo [1/5] Backend baglantisi kontrol ediliyor...
curl -s https://aile-hekimligi-backend.onrender.com/health > nul 2>&1
if %errorlevel% neq 0 (
    echo [HATA] Backend'e baglanilamiyor! Render.com'u kontrol edin.
    pause
    exit /b 1
)
echo [OK] Backend aktif

echo [2/5] React Native Metro temizleniyor...
cd mobile
call npx react-native start --reset-cache --max-workers=2 > nul 2>&1 &
timeout /t 5 > nul

echo [3/5] Android build hazirlaniyor...
cd android

:: Gradle wrapper kontrolü
if not exist gradlew.bat (
    echo [!] Gradle wrapper olusturuluyor...
    call gradle wrapper
)

:: Temizlik
echo [4/5] Onceki build temizleniyor...
call gradlew.bat clean > nul 2>&1

:: Release APK build
echo [5/5] APK olusturuluyor... (Bu 3-5 dakika surebilir)
call gradlew.bat assembleRelease

:: APK'yı kopyala
if exist "app\build\outputs\apk\release\app-release.apk" (
    echo.
    echo [BASARILI] APK olusturuldu!
    copy "app\build\outputs\apk\release\app-release.apk" "..\..\apps\v%version%\AileHekimligi-v%version%.apk"
    echo APK Konumu: apps\v%version%\AileHekimligi-v%version%.apk

    :: Boyut bilgisi
    for %%I in ("..\..\apps\v%version%\AileHekimligi-v%version%.apk") do (
        set size=%%~zI
        set /a sizeMB=!size! / 1048576
        echo APK Boyutu: !sizeMB! MB
    )
) else (
    echo [HATA] APK olusturulamadi!
    echo Hata detaylari icin android\app\build\outputs\logs klasorunu kontrol edin.
)

cd ..\..
echo.
echo ========================================
echo   ISLEM TAMAMLANDI
echo ========================================
pause