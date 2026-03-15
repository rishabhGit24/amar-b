#!/bin/bash

# AMAR MVP Frontend Deployment Script
# This script helps deploy the frontend to Vercel or Netlify

set -e

echo " AMAR MVP Frontend Deployment"
echo "================================"
echo ""

# Check if platform is specified
if [ -z "$1" ]; then
    echo "Usage: ./deploy_frontend.sh [vercel|netlify] [backend-url]"
    echo ""
    echo "Examples:"
    echo "  ./deploy_frontend.sh vercel https://your-backend.railway.app"
    echo "  ./deploy_frontend.sh netlify https://your-backend.herokuapp.com"
    exit 1
fi

PLATFORM=$1
BACKEND_URL=$2

if [ -z "$BACKEND_URL" ]; then
    echo "⚠️  Backend URL not provided!"
    read -p "Enter your backend URL: " BACKEND_URL
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Change to frontend directory
cd frontend

# Deploy to Vercel
if [ "$PLATFORM" = "vercel" ]; then
    echo "📦 Deploying to Vercel..."
    echo ""
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        echo "❌ Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Check if logged in
    echo "🔐 Checking Vercel authentication..."
    if ! vercel whoami >/dev/null 2>&1; then
        echo "Please login to Vercel:"
        vercel login
    fi
    
    # Create .env.production with backend URL
    echo "🔧 Configuring environment variables..."
    echo "REACT_APP_API_URL=$BACKEND_URL" > .env.production
    
    # Deploy
    echo " Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "✅ Deployment complete!"
    echo "📝 Note: You may need to set REACT_APP_API_URL in Vercel dashboard"
    echo "🌐 Vercel dashboard: https://vercel.com/dashboard"
    
# Deploy to Netlify
elif [ "$PLATFORM" = "netlify" ]; then
    echo "📦 Deploying to Netlify..."
    echo ""
    
    # Check if Netlify CLI is installed
    if ! command_exists netlify; then
        echo "❌ Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Check if logged in
    echo "🔐 Checking Netlify authentication..."
    if ! netlify status >/dev/null 2>&1; then
        echo "Please login to Netlify:"
        netlify login
    fi
    
    # Create .env.production with backend URL
    echo "🔧 Configuring environment variables..."
    echo "REACT_APP_API_URL=$BACKEND_URL" > .env.production
    
    # Build
    echo "🔨 Building application..."
    npm run build
    
    # Deploy
    echo " Deploying to Netlify..."
    netlify deploy --prod
    
    echo ""
    echo "✅ Deployment complete!"
    echo "📝 Note: You may need to set REACT_APP_API_URL in Netlify dashboard"
    echo "🌐 Netlify dashboard: https://app.netlify.com/"
    
else
    echo "❌ Unknown platform: $PLATFORM"
    echo "Supported platforms: vercel, netlify"
    exit 1
fi

echo ""
echo "⚠️  IMPORTANT: Update backend CORS settings!"
echo "Add your frontend URL to the backend's CORS_ORIGINS environment variable"
echo ""
echo "🎉 Deployment script completed!"
