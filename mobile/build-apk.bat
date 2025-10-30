@echo off
REM T.C. Aile Hekimliği Kura Sistemi
REM Android APK Build Script for Windows

echo 🏥 T.C. Aile Hekimliği Kura Sistemi - APK Build Script
echo ==================================================

REM Build tipini al (default: debug)
set BUILD_TYPE=%1
if "%BUILD_TYPE%"=="" set BUILD_TYPE=debug

echo 🔧 Build Type: %BUILD_TYPE%

REM Node modules kontrolü
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
)

REM Android klasörü kontrolü
if not exist "android" (
    echo ❌ Android folder not found!
    exit /b 1
)

REM Metro cache temizle
echo 🧹 Clearing Metro cache...
start /B npx react-native start --reset-cache
timeout /t 5 >nul
taskkill /f /im node.exe >nul 2>&1

REM Android clean
echo 🧹 Cleaning Android build...
cd android
call gradlew.bat clean
cd ..

REM APK oluştur
echo 🔨 Building APK...
cd android

if "%BUILD_TYPE%"=="release" (
    echo 📱 Building Release APK...
    call gradlew.bat assembleRelease
    set APK_PATH=app\build\outputs\apk\release\app-release.apk
    echo ✅ Release APK created: android\%APK_PATH%
) else (
    echo 📱 Building Debug APK...
    call gradlew.bat assembleDebug
    set APK_PATH=app\build\outputs\apk\debug\app-debug.apk
    echo ✅ Debug APK created: android\%APK_PATH%
)

cd ..

REM APK kontrolü ve kopyalama
if exist "android\%APK_PATH%" (
    echo 📊 APK created successfully!
    copy "android\%APK_PATH%" "AileHekimligi-%BUILD_TYPE%.apk"
    echo 📋 APK copied to: .\AileHekimligi-%BUILD_TYPE%.apk
) else (
    echo ❌ APK build failed!
    exit /b 1
)

echo 🎉 Build completed successfully!
echo.
echo 📱 Install APK:
echo    adb install .\AileHekimligi-%BUILD_TYPE%.apk
echo.
echo 🚀 Run on device:
echo    npx react-native run-android

pause