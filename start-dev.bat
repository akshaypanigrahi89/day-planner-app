@echo off
echo Starting Day Planner App Local Dev Environment...

:: Start Backend
echo Starting Backend (FastAPI on Port 8005)...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate.bat 2>nul || echo Virtual env not found. Proceeding with global python... && pip install -r requirements.txt && python create_user.py && uvicorn main:app --reload --port 8005"

:: Start Frontend
echo Starting Frontend (Vite on Port 5173)...
start "Frontend Server" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ============================================================
echo Servers are starting up!
echo Frontend will be available at: http://localhost:5173
echo Backend API will be available at: http://localhost:8005
echo ============================================================
pause
