#!/bin/bash

# T.C. Aile Hekimliği Kura Sistemi
# Android APK Build Script

echo "🏥 T.C. Aile Hekimliği Kura Sistemi - APK Build Script"
echo "=================================================="

# Renkli output için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Error handling
set -e

# Build tipini kontrol et
BUILD_TYPE=${1:-debug}

echo -e "${BLUE}🔧 Build Type: $BUILD_TYPE${NC}"

# Node modules kontrolü
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
fi

# Android klasörü kontrolü
if [ ! -d "android" ]; then
    echo -e "${RED}❌ Android folder not found!${NC}"
    exit 1
fi

# Metro cache temizle
echo -e "${YELLOW}🧹 Clearing Metro cache...${NC}"
npx react-native start --reset-cache &
METRO_PID=$!
sleep 5
kill $METRO_PID

# Android clean
echo -e "${YELLOW}🧹 Cleaning Android build...${NC}"
cd android
./gradlew clean
cd ..

# APK oluştur
echo -e "${BLUE}🔨 Building APK...${NC}"
cd android

if [ "$BUILD_TYPE" == "release" ]; then
    echo -e "${GREEN}📱 Building Release APK...${NC}"
    ./gradlew assembleRelease
    APK_PATH="app/build/outputs/apk/release/app-release.apk"
    echo -e "${GREEN}✅ Release APK created: android/$APK_PATH${NC}"
else
    echo -e "${GREEN}📱 Building Debug APK...${NC}"
    ./gradlew assembleDebug
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    echo -e "${GREEN}✅ Debug APK created: android/$APK_PATH${NC}"
fi

cd ..

# APK bilgilerini göster
if [ -f "android/$APK_PATH" ]; then
    APK_SIZE=$(du -h "android/$APK_PATH" | cut -f1)
    echo -e "${GREEN}📊 APK Size: $APK_SIZE${NC}"
    echo -e "${GREEN}📍 APK Location: $(pwd)/android/$APK_PATH${NC}"

    # APK'yı root dizinine kopyala
    cp "android/$APK_PATH" "./AileHekimligi-$BUILD_TYPE.apk"
    echo -e "${GREEN}📋 APK copied to: ./AileHekimligi-$BUILD_TYPE.apk${NC}"
else
    echo -e "${RED}❌ APK build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Build completed successfully!${NC}"
echo ""
echo -e "${BLUE}📱 Install APK:${NC}"
echo "   adb install ./AileHekimligi-$BUILD_TYPE.apk"
echo ""
echo -e "${BLUE}🚀 Run on device:${NC}"
echo "   npx react-native run-android"