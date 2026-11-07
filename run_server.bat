@echo off
title EduVirtual LMS – Web Server
color 0A
echo.
echo  ============================================
echo    EduVirtual LMS – Static Web Server
echo    Platform Pembelajaran Virtual (HTML Only)
echo  ============================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
  echo  [ERROR] Python tidak ditemukan!
  echo  Silakan install Python dari https://www.python.org/downloads/
  echo  Pastikan centang "Add Python to PATH" saat instalasi.
  pause
  exit /b 1
)

echo  [OK] Python ditemukan.
echo  [INFO] Memulai server pada http://localhost:8080
echo  [INFO] Tekan Ctrl+C untuk menghentikan server.
echo.

cd /d "%~dp0html"
python -m http.server 8080
pause
