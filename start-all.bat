@echo off
REM Academic Compass - Start Both Backend and Frontend
REM This script starts the backend API server and frontend dev server concurrently

echo.
echo ========================================
echo   Academic Compass - Starting Services
echo ========================================
echo.

echo [1/2] Starting Backend Server (Port 5000)...
start "Backend - Port 5000" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak

echo [2/2] Starting Frontend Server...
start "Frontend - Port 8080/8081" cmd /k "npm run dev"

echo.
echo ========================================
echo   Services Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:8080 or http://localhost:8081
echo.
echo Press Ctrl+C in any window to stop that service
echo.
pause
