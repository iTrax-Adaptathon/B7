@echo off
title Adaptive Fitness Coach - Starter
echo ===================================================
echo   Adaptive Fitness Coach - Starting All Services
echo ===================================================
echo.

echo [1] Opening Adaptive Fitness Coach Web Application...
start "" "%~dp0frontend\index.html"

echo.
echo [2] Launching Backend Server in background...
start "Adaptive Fitness Backend" "%~dp0start_backend.bat"

echo.
echo [3] Launching Frontend Dev Server...
start "Adaptive Fitness Frontend" "%~dp0start_frontend.bat"

echo.
echo ===================================================
echo App has been opened in your browser!
echo ===================================================
