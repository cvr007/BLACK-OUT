@echo off
title BLACKOUT - Emergency Digital Kit
echo ===================================================
echo   BLACKOUT - Offline-First Emergency Digital Kit
echo ===================================================
echo Starting Backend Relay Node & Vite Frontend Client...

REM Ensure portable node is in PATH
set "PATH=C:\Users\rex\AppData\Local\Programs\nodejs;%PATH%"

cd /d "%~dp0"

REM Launch default browser after 3 seconds in background
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:5173"

REM Start dev servers
npm run dev
