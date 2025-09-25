@echo off
echo Starting YUVA Medical Platform...
echo.
echo This will start both backend and frontend servers.
echo Backend will run on http://localhost:5000
echo Frontend will run on http://localhost:3000
echo.
echo Press any key to continue...
pause >nul

echo.
echo Starting Backend Server...
start "YUVA Backend" cmd /k "cd /d %~dp0 && start_backend.bat"

echo.
echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo Starting Frontend Server...
start "YUVA Frontend" cmd /k "cd /d %~dp0 && start_frontend.bat"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause >nul

