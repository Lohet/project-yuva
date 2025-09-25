@echo off
title YUVA Medical Platform - Automated Startup
color 0A

echo.
echo ========================================
echo    YUVA Medical Platform - Automated
echo ========================================
echo.

echo This will automatically start both the API and frontend servers
echo when you run 'npm run dev'
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
echo Installing dependencies...
echo.

REM Install Node.js dependencies including concurrently
echo Installing Node.js dependencies...
npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Some Node.js dependencies may not have installed properly
) else (
    echo ✓ Node.js dependencies installed
)

echo.
echo ========================================
echo    Starting Automated Development
echo ========================================
echo.
echo Both API and Frontend will start automatically
echo API Server: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start both servers using npm script
npm run dev

echo.
echo Development servers stopped.
pause
