# NewsSphere PowerShell Launcher
$rootDir = $PSScriptRoot

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching NewsSphere AI-Powered News Platform" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Start Python FastAPI AI Recommendation Service in separate window
Write-Host "1. Launching Python FastAPI AI Engine on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\recommendation-service'; python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

# 2. Start Vite React Frontend in separate window
Write-Host "2. Launching Vite React Frontend on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\frontend'; npm run dev"

Write-Host ""
Write-Host "Services are starting in dedicated windows:" -ForegroundColor Green
Write-Host "  - Frontend Feed:  http://localhost:5173/feed" -ForegroundColor White
Write-Host "  - Python Health:  http://localhost:8000/health" -ForegroundColor White
Write-Host "  - Swagger Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this launcher window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
