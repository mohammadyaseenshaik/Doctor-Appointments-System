@echo off
SET "JAVA_HOME=C:\Program Files\Java\jdk-25.0.2"
SET "PATH=%JAVA_HOME%\bin;%PATH%"
SET "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"
echo Starting Spring Boot backend...
echo JAVA_HOME = %JAVA_HOME%
echo Project dir = %PROJECT_DIR%
call mvnw.cmd spring-boot:run
