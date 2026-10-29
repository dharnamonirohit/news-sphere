@echo off
setlocal
echo ========================================================
echo Launching NewsSphere Platform (Full-Stack AI System)
echo ========================================================

set ROOT_DIR=%~dp0
if "%ROOT_DIR:~-1%"=="\" set ROOT_DIR=%ROOT_DIR:~0,-1%

echo 1. Launching Python FastAPI AI Engine on port 8000...
start "NewsSphere Python AI Engine (Port 8000)" cmd /k "cd /d "%ROOT_DIR%\recommendation-service" && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

echo 2. Launching React Vite Frontend on port 5173...
start "NewsSphere Frontend (Port 5173)" cmd /k "cd /d "%ROOT_DIR%\frontend" && npm run dev"

echo.
echo ========================================================
echo Platform is booting!
echo.
echo - Web Application:        http://localhost:5173/feed
echo - Python AI Microservice: http://localhost:8000/health
echo - Interactive API Docs:    http://localhost:8000/docs
echo ========================================================
pause
