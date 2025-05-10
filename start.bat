@echo off
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if %errorlevel% NEQ 0 (
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

set "SOURCE=%~dp0barni5"
set "TARGET=C:\barni5"

if not exist "%TARGET%" (
    xcopy "%SOURCE%" "%TARGET%" /E /I /Y
)

java -version >nul 2>&1
if %errorlevel% NEQ 0 (
    echo Java not found. Opening download page...
    start https://javadl.oracle.com/webapps/download/AutoDL?BundleId=252044_8a1589aa0fe24566b4337beee47c2d29
    echo Please install Java manually, then run this script again.
    pause
    exit /b
)

cd /d "%~dp0"
echo Running npm install...
call npm install

if %errorlevel% NEQ 0 (
    echo npm install failed. Press any key to exit.
    pause >nul
    exit /b
)

echo Starting node index.js...
call node index.js

echo Script finished. Press any key to close.
pause >nul
