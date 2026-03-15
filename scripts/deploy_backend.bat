@echo off
REM AMAR MVP Backend Deployment Script for Windows
REM This script helps deploy the backend to Railway or Heroku

echo.
echo  AMAR MVP Backend Deployment
echo ================================
echo.

if "%1"=="" (
    echo Usage: deploy_backend.bat [railway^|heroku]
    echo.
    echo Examples:
    echo   deploy_backend.bat railway
    echo   deploy_backend.bat heroku
    exit /b 1
)

set PLATFORM=%1

if "%PLATFORM%"=="railway" (
    echo 📦 Deploying to Railway...
    echo.
    
    REM Check if Railway CLI is installed
    where railway >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Railway CLI not found. Installing...
        npm install -g @railway/cli
    )
    
    REM Check if logged in
    echo 🔐 Checking Railway authentication...
    railway whoami >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Please login to Railway:
        railway login
    )
    
    REM Deploy
    echo  Deploying to Railway...
    railway up
    
    echo.
    echo ✅ Deployment initiated!
    echo 📊 Check status: railway status
    echo 📝 View logs: railway logs
    echo 🌐 Open dashboard: railway open
    
) else if "%PLATFORM%"=="heroku" (
    echo 📦 Deploying to Heroku...
    echo.
    
    REM Check if Heroku CLI is installed
    where heroku >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Heroku CLI not found. Please install it first:
        echo    https://devcenter.heroku.com/articles/heroku-cli
        exit /b 1
    )
    
    REM Check if logged in
    echo 🔐 Checking Heroku authentication...
    heroku auth:whoami >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Please login to Heroku:
        heroku login
    )
    
    REM Check if app exists
    echo 🔍 Checking for existing Heroku app...
    heroku apps:info >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo No Heroku app found. Creating one...
        set /p APP_NAME="Enter app name (or press Enter for auto-generated): "
        if "%APP_NAME%"=="" (
            heroku create
        ) else (
            heroku create %APP_NAME%
        )
    )
    
    REM Set environment variables
    echo 🔧 Setting environment variables...
    set /p GEMINI_KEY="Enter your Gemini API key: "
    heroku config:set GEMINI_API_KEY=%GEMINI_KEY%
    
    set /p VERCEL_TOKEN="Enter your Vercel token: "
    heroku config:set VERCEL_TOKEN=%VERCEL_TOKEN%
    
    set /p NETLIFY_TOKEN="Enter your Netlify token: "
    heroku config:set NETLIFY_TOKEN=%NETLIFY_TOKEN%
    
    heroku config:set ENVIRONMENT=production
    
    REM Deploy
    echo  Deploying to Heroku...
    git push heroku main
    
    echo.
    echo ✅ Deployment complete!
    echo 📊 Check status: heroku ps
    echo 📝 View logs: heroku logs --tail
    echo 🌐 Open app: heroku open
    
) else (
    echo ❌ Unknown platform: %PLATFORM%
    echo Supported platforms: railway, heroku
    exit /b 1
)

echo.
echo 🎉 Deployment script completed!
