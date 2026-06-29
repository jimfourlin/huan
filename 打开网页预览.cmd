@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Starting HUAN save helper and preview server...

echo Closing old HUAN preview/save-helper processes...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ports = @(43210) + (4177..4196); $pids = @(); foreach ($port in $ports) { $lines = netstat -ano | Select-String (':' + $port + '\s') | Where-Object { $_ -match 'LISTENING' }; foreach ($line in $lines) { $parts = ($line.ToString() -split '\s+') | Where-Object { $_ }; $pidValue = [int]$parts[-1]; if ($pidValue -gt 0) { $pids += $pidValue } } }; $pids | Select-Object -Unique | ForEach-Object { Write-Host ('Closing process ' + $_); Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"

start "HUAN Save Helper" /min cmd /c start-save-helper.cmd
"%~dp0node\node.exe" huan-preview-server.js
pause
