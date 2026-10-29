@echo off
echo ========================================================
echo Starting NewsSphere Frontend (React + Vite)
echo ========================================================
cd /d "%~dp0\frontend"
if not exist node_modules (
    echo Installing dependencies...
    call npm install
)
echo Launching Vite Dev Server on http://localhost:5173...
npm run dev
pause
