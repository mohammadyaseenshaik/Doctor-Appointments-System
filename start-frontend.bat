@echo off
REM ============================================================
REM  MedBook - Doctor Appointment System
REM  Start Frontend Server (React Vite on port 5173)
REM ============================================================

echo.
echo  ===== MedBook Frontend Starting =====
echo  React 18 + Vite
echo  URL: http://localhost:5173
echo =============================================

cd /d "%~dp0frontend"

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

npm run dev
pause
