@echo off
echo ========================================
echo  Preparing Project for Deployment
echo ========================================
echo.

echo [1/4] Building Backend...
cd backend
call mvnw.cmd clean package -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend build failed!
    pause
    exit /b 1
)
echo Backend JAR created: backend/target/appointment-1.0.0.jar
echo.

echo [2/4] Installing Frontend Dependencies...
cd ../frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo.

echo [3/4] Building Frontend for Production...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo Frontend build created: frontend/dist/
echo.

echo [4/4] Checking Git Status...
cd ..
git status
echo.

echo ========================================
echo  Build Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Review DEPLOYMENT_GUIDE.md
echo 2. Follow DEPLOYMENT_CHECKLIST.md
echo 3. Push to GitHub: git push origin main
echo 4. Deploy to Render/Railway/Heroku
echo.
echo Files ready:
echo - Backend: backend/target/appointment-1.0.0.jar
echo - Frontend: frontend/dist/
echo.
pause
