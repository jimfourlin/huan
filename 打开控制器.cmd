@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting HUAN image controller...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":43210" ^| findstr "LISTENING"') do (
  echo Closing old HUAN save helper on port 43210...
  taskkill /PID %%a /F >nul 2>nul
)

start "HUAN Save Helper" /min cmd /c start-save-helper.cmd
timeout /t 2 /nobreak >nul
start "" "%~dp0huan-controller.html"
