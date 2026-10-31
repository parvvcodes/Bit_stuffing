@echo off
title Bit Stuffing Project Launcher
echo ============================================
echo   Bit Stuffing - Full Stack Launcher
echo ============================================
echo.

:: Navigate to project root
cd /d "%~dp0"

:: ---- Start Backend ----
echo [1/2] Starting FastAPI backend on http://127.0.0.1:8000 ...
start "Backend - FastAPI" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

:: Brief pause to let backend start first
timeout /t 3 /nobreak >nul

:: ---- Start Frontend ----
echo [2/2] Starting React frontend on http://localhost:5173 ...
start "Frontend - Vite" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ============================================
echo   Both servers are starting!
echo.
echo   Frontend : http://localhost:5173
echo   Backend  : http://127.0.0.1:8000
echo   API Docs : http://127.0.0.1:8000/docs
echo ============================================
echo.
echo Close this window anytime. The servers run
echo in their own windows.
echo.
pause

