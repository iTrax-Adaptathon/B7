@echo off
title Adaptive Fitness Coach - Frontend
echo ===================================================
echo   Adaptive Fitness Coach - React + Vite Frontend
echo ===================================================
echo.

cd /d "%~dp0frontend"

echo [1/2] Checking npm packages...
if not exist "node_modules\" (
  echo Installing dependencies with npm...
  call npm install
)

echo.
echo [2/2] Starting Vite dev server at http://localhost:5173/
echo ===================================================
call npm run dev

pause
