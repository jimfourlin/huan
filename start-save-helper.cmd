@echo off
cd /d "%~dp0"
title HUAN Save Helper
echo Starting HUAN save helper...
"%~dp0node\node.exe" "%~dp0huan-save-helper.js"
