@echo off
cd /d "%~dp0"
title HUAN Save Helper
echo Starting HUAN save helper...
set "LOCAL_NODE=%~dp0node\node.exe"
set "CODEX_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if exist "%LOCAL_NODE%" (
  set "NODE_EXE=%LOCAL_NODE%"
) else (
  where node >nul 2>nul
  if not errorlevel 1 (
    set "NODE_EXE=node"
  ) else if exist "%CODEX_NODE%" (
    set "NODE_EXE=%CODEX_NODE%"
  ) else (
    echo Node.js not found. Please install Node.js or run this inside Codex.
    pause
    exit /b 1
  )
)
"%NODE_EXE%" "%~dp0huan-save-helper.js"
