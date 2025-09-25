@echo off
title YUVA Medical Platform - Simple Launcher
color 0A

echo.
echo ========================================
echo    YUVA Medical Platform - Simple Mode
echo ========================================
echo.

echo Starting simple backend server...
echo This version uses a lightweight HTTP server
echo that doesn't require FastAPI dependencies.
echo.

python simple_api.py

pause
