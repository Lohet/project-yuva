@echo off
title YUVA Medical Platform - Fixed Version
color 0A

echo.
echo ========================================
echo    YUVA Medical Platform - Fixed Version
echo ========================================
echo.

echo This version fixes the "failed to fetch" translation issues
echo by using a lightweight backend server.
echo.

echo Checking prerequisites...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
)
echo ✓ Python is installed

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

echo.
echo Starting Backend Server (Simple API)...
echo This uses a lightweight HTTP server that works reliably.
start "YUVA Backend" cmd /k "cd /d %~dp0 && echo Starting Simple Backend API... && python simple_api.py"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
echo The frontend will automatically try multiple ports if needed.
start "YUVA Frontend" cmd /k "cd /d %~dp0 && echo Starting Frontend Server... && npm run dev"

echo.
echo ========================================
echo    Servers are starting up...
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend App: http://localhost:3000 (or 3001 if 3000 is busy)
echo.
echo Features now working:
echo ✓ Medical Translation (with LibreTranslate + local fallback)
echo ✓ AI Disease Prediction (with symptom mapping)
echo ✓ Hospital Locations
echo ✓ Robust error handling
echo.
echo The application will open automatically in your browser.
echo.
echo Press any key to close this launcher...
pause >nul
