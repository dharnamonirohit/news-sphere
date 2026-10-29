@echo off
echo ========================================================
echo Starting NewsSphere Python AI Recommendation Service
echo ========================================================
cd /d "%~dp0\recommendation-service"
echo Running FastAPI Server on http://localhost:8000...
echo Health check: http://localhost:8000/health
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
