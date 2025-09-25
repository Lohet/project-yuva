@echo off
title YUVA Medical Platform Launcher
color 0A

echo.
echo ========================================
echo    YUVA Medical Platform Launcher
echo ========================================
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

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Some Python dependencies may not have installed properly
) else (
    echo ✓ Python dependencies installed
)

REM Install Node.js dependencies
echo Installing Node.js dependencies...
npm install >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Some Node.js dependencies may not have installed properly
) else (
    echo ✓ Node.js dependencies installed
)

echo.
echo Starting servers...
echo.

REM Start backend server
echo Starting Backend API Server (Port 5000)...
start "YUVA Backend" cmd /k "cd /d %~dp0 && echo Starting Backend API Server... && python api.py"

REM Wait for backend to start
echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend server
echo Starting Frontend Server (Port 3000)...
start "YUVA Frontend" cmd /k "cd /d %~dp0 && echo Starting Frontend Server... && npm run dev"

echo.
echo ========================================
echo    Servers are starting up...
echo ========================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend App: http://localhost:3000
echo.
echo The application will open automatically in your browser.
echo.
echo Press any key to close this launcher...
pause >nul
