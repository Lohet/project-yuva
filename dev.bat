@echo off
title YUVA Development Server
color 0A

echo.
echo ========================================
echo    YUVA Development Server
echo ========================================
echo.

echo Starting both API and Frontend servers...
echo.

REM Start Python API server in background
echo [1/2] Starting API Server (Port 5000)...
start "YUVA API" cmd /k "cd /d %~dp0 && python simple_api.py"

REM Wait for API server to start
echo Waiting for API server to initialize...
timeout /t 3 /nobreak >nul

REM Start Frontend server
echo [2/2] Starting Frontend Server (Port 3000)...
echo.
echo ========================================
echo    Servers Starting...
echo ========================================
echo API Server:  http://localhost:5000
echo Frontend:    http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo ========================================
echo.

REM Start Vite dev server (this will block)
npm run dev:frontend
