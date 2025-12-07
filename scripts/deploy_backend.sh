#!/bin/bash

# AMAR MVP Backend Deployment Script
# This script helps deploy the backend to Railway or Heroku

set -e

echo "🚀 AMAR MVP Backend Deployment"
echo "================================"
echo ""

# Check if platform is specified
if [ -z "$1" ]; then
    echo "Usage: ./deploy_backend.sh [railway|heroku]"
    echo ""
    echo "Examples:"
    echo "  ./deploy_backend.sh railway"
    echo "  ./deploy_backend.sh heroku"
    exit 1
fi

PLATFORM=$1

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Deploy to Railway
if [ "$PLATFORM" = "railway" ]; then
    echo "📦 Deploying to Railway..."
    echo ""
    
    # Check if Railway CLI is installed
    if ! command_exists railway; then
        echo "❌ Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    # Check if logged in
    echo "🔐 Checking Railway authentication..."
    if ! railway whoami >/dev/null 2>&1; then
        echo "Please login to Railway:"
        railway login
    fi
    
    # Deploy
    echo "🚀 Deploying to Railway..."
    railway up
    
    echo ""
    echo "✅ Deployment initiated!"
    echo "📊 Check status: railway status"
    echo "📝 View logs: railway logs"
    echo "🌐 Open dashboard: railway open"
    
# Deploy to Heroku
elif [ "$PLATFORM" = "heroku" ]; then
    echo "📦 Deploying to Heroku..."
    echo ""
    
    # Check if Heroku CLI is installed
    if ! command_exists heroku; then
        echo "❌ Heroku CLI not found. Please install it first:"
        echo "   https://devcenter.heroku.com/articles/heroku-cli"
        exit 1
    fi
    
    # Check if logged in
    echo "🔐 Checking Heroku authentication..."
    if ! heroku auth:whoami >/dev/null 2>&1; then
        echo "Please login to Heroku:"
        heroku login
    fi
    
    # Check if app exists
    echo "🔍 Checking for existing Heroku app..."
    if ! heroku apps:info >/dev/null 2>&1; then
        echo "No Heroku app found. Creating one..."
        read -p "Enter app name (or press Enter for auto-generated): " APP_NAME
        if [ -z "$APP_NAME" ]; then
            heroku create
        else
            heroku create "$APP_NAME"
        fi
    fi
    
    # Check environment variables
    echo "🔧 Checking environment variables..."
    if [ -z "$(heroku config:get GEMINI_API_KEY)" ]; then
        echo "⚠️  GEMINI_API_KEY not set!"
        read -p "Enter your Gemini API key: " GEMINI_KEY
        heroku config:set GEMINI_API_KEY="$GEMINI_KEY"
    fi
    
    if [ -z "$(heroku config:get VERCEL_TOKEN)" ]; then
        echo "⚠️  VERCEL_TOKEN not set!"
        read -p "Enter your Vercel token: " VERCEL_TOKEN
        heroku config:set VERCEL_TOKEN="$VERCEL_TOKEN"
    fi
    
    if [ -z "$(heroku config:get NETLIFY_TOKEN)" ]; then
        echo "⚠️  NETLIFY_TOKEN not set!"
        read -p "Enter your Netlify token: " NETLIFY_TOKEN
        heroku config:set NETLIFY_TOKEN="$NETLIFY_TOKEN"
    fi
    
    # Set production environment
    heroku config:set ENVIRONMENT=production
    
    # Deploy
    echo "🚀 Deploying to Heroku..."
    git push heroku main
    
    echo ""
    echo "✅ Deployment complete!"
    echo "📊 Check status: heroku ps"
    echo "📝 View logs: heroku logs --tail"
    echo "🌐 Open app: heroku open"
    
else
    echo "❌ Unknown platform: $PLATFORM"
    echo "Supported platforms: railway, heroku"
    exit 1
fi

echo ""
echo "🎉 Deployment script completed!"
