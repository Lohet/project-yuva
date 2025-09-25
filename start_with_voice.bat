@echo off
title YUVA Medical Platform - With Voice Translation
color 0A

echo.
echo ========================================
echo    YUVA Medical Platform + Voice
echo ========================================
echo.

echo This version includes voice translation capabilities
echo for hands-free medical communication.
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
echo Installing voice translation dependencies...
pip install -r voice_requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Some voice dependencies may not have installed properly
    echo You can still use the web interface without voice features
) else (
    echo ✓ Voice translation dependencies installed
)

echo.
echo Starting Backend Server...
start "YUVA Backend" cmd /k "cd /d %~dp0 && echo Starting Simple Backend API... && python simple_api.py"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server...
start "YUVA Frontend" cmd /k "cd /d %~dp0 && echo Starting Frontend Server... && npm run dev"

echo.
echo ========================================
echo    Servers are starting up...
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend App: http://localhost:3000 (or 3001 if 3000 is busy)
echo.
echo Voice Features:
echo ✓ Web-based voice translation (browser microphone)
echo ✓ Standalone voice translator (Python script)
echo ✓ Medical phrase recognition
echo ✓ Multi-language support
echo.
echo To use standalone voice translator:
echo   python voice_translator.py
echo.
echo The application will open automatically in your browser.
echo.
echo Press any key to close this launcher...
pause >nul
