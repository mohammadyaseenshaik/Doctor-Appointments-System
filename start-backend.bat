@echo off
REM ============================================================
REM  MedBook - Doctor Appointment System
REM  Start Backend Server (Spring Boot on port 8080)
REM ============================================================

echo.
echo  ===== MedBook Backend Starting =====
echo  Spring Boot 3 + H2 Database
echo  API: http://localhost:8080
echo  H2 Console: http://localhost:8080/h2-console
echo.
echo  Demo Credentials:
echo    Admin:   admin@hospital.com / admin123
echo    Patient: patient@example.com / patient123
echo =============================================

cd /d "%~dp0backend"

REM Try mvn from PATH first
where mvn >nul 2>&1
if %ERRORLEVEL%==0 (
    echo Using Maven from PATH...
    mvn spring-boot:run
) else (
    REM Try mvnw wrapper
    if exist "mvnw.cmd" (
        echo Using Maven Wrapper...
        call mvnw.cmd spring-boot:run
    ) else (
        echo.
        echo ERROR: Maven not found!
        echo.
        echo To fix this, install Maven:
        echo   1. Download from: https://maven.apache.org/download.cgi
        echo   2. Extract to C:\tools\maven
        echo   3. Add C:\tools\maven\bin to PATH
        echo   4. Run this script again
        echo.
        echo OR use IntelliJ IDEA / Spring Tool Suite which have embedded Maven
        pause
    )
)
pause
