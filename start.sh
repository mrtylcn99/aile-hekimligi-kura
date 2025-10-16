#!/bin/bash

echo "Aile Hekimliği Kura Sistemi Başlatılıyor..."
echo ""

# Backend başlat
echo "Backend başlatılıyor..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!

# Frontend başlat
echo ""
echo "Frontend başlatılıyor..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

echo ""
echo "Sistem başlatıldı!"
echo "Backend: http://localhost:5000 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"
echo ""
echo "Durdurmak için Ctrl+C kullanın"

# İşlemlerin bitmesini bekle
wait $BACKEND_PID $FRONTEND_PID