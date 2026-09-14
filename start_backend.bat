@echo off
title Adaptive Fitness Coach - Backend
echo ===================================================
echo   Adaptive Fitness Coach - Django Backend
echo ===================================================
echo.

cd /d "%~dp0adaptive-fitness-coach\backend" 2>nul || cd /d "%~dp0backend" 2>nul || (
  echo [ERROR] Could not find backend folder!
  pause
  exit /b 1
)

echo [1/4] Installing Python requirements...
python -m pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo [WARNING] 'python -m pip' failed, trying 'pip'...
  pip install -r requirements.txt
)

echo.
echo [2/4] Running database migrations...
python manage.py migrate
if %ERRORLEVEL% NEQ 0 (
  echo [WARNING] Trying 'py manage.py migrate'...
  py manage.py migrate
)

echo.
echo [3/4] Seeding initial exercises...
python manage.py seed_data
if %ERRORLEVEL% NEQ 0 (
  py manage.py seed_data
)

echo.
echo [4/4] Starting Django development server at http://127.0.0.1:8000/
echo ===================================================
python manage.py runserver 8000
if %ERRORLEVEL% NEQ 0 (
  py manage.py runserver 8000
)

pause
