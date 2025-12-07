@echo off
REM AMAR MVP Frontend Deployment Script for Windows
REM This script helps deploy the frontend to Vercel or Netlify

echo.
echo 🚀 AMAR MVP Frontend Deployment
echo ================================
echo.

if "%1"=="" (
    echo Usage: deploy_frontend.bat [vercel^|netlify] [backend-url]
    echo.
    echo Examples:
    echo   deploy_frontend.bat vercel https://your-backend.railway.app
    echo   deploy_frontend.bat netlify https://your-backend.herokuapp.com
    exit /b 1
)

set PLATFORM=%1
set BACKEND_URL=%2

if "%BACKEND_URL%"=="" (
    echo ⚠️  Backend URL not provided!
    set /p BACKEND_URL="Enter your backend URL: "
)

REM Change to frontend directory
cd frontend

if "%PLATFORM%"=="vercel" (
    echo 📦 Deploying to Vercel...
    echo.
    
    REM Check if Vercel CLI is installed
    where vercel >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Vercel CLI not found. Installing...
        npm install -g vercel
    )
    
    REM Check if logged in
    echo 🔐 Checking Vercel authentication...
    vercel whoami >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Please login to Vercel:
        vercel login
    )
    
    REM Create .env.production with backend URL
    echo 🔧 Configuring environment variables...
    echo REACT_APP_API_URL=%BACKEND_URL% > .env.production
    
    REM Deploy
    echo 🚀 Deploying to Vercel...
    vercel --prod
    
    echo.
    echo ✅ Deployment complete!
    echo 📝 Note: You may need to set REACT_APP_API_URL in Vercel dashboard
    echo 🌐 Vercel dashboard: https://vercel.com/dashboard
    
) else if "%PLATFORM%"=="netlify" (
    echo 📦 Deploying to Netlify...
    echo.
    
    REM Check if Netlify CLI is installed
    where netlify >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Netlify CLI not found. Installing...
        npm install -g netlify-cli
    )
    
    REM Check if logged in
    echo 🔐 Checking Netlify authentication...
    netlify status >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo Please login to Netlify:
        netlify login
    )
    
    REM Create .env.production with backend URL
    echo 🔧 Configuring environment variables...
    echo REACT_APP_API_URL=%BACKEND_URL% > .env.production
    
    REM Build
    echo 🔨 Building application...
    npm run build
    
    REM Deploy
    echo 🚀 Deploying to Netlify...
    netlify deploy --prod
    
    echo.
    echo ✅ Deployment complete!
    echo 📝 Note: You may need to set REACT_APP_API_URL in Netlify dashboard
    echo 🌐 Netlify dashboard: https://app.netlify.com/
    
) else (
    echo ❌ Unknown platform: %PLATFORM%
    echo Supported platforms: vercel, netlify
    exit /b 1
)

echo.
echo ⚠️  IMPORTANT: Update backend CORS settings!
echo Add your frontend URL to the backend's CORS_ORIGINS environment variable
echo.
echo 🎉 Deployment script completed!
