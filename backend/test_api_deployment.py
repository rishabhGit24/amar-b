"""
Test script for API-based deployment
Run this to verify your deployment tokens work
"""

import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from agents.deployer_api import DeployerAgentAPI
from config import get_settings


def test_deployment_setup():
    """Test if deployment is properly configured"""
    
    print("=" * 60)
    print("AMAR API Deployment Configuration Test")
    print("=" * 60)
    print()
    
    # Initialize deployer
    deployer = DeployerAgentAPI()
    
    # Check configuration
    settings = get_settings()
    
    print("📋 Configuration Status:")
    print("-" * 60)
    
    # Check Vercel
    if settings.vercel_token:
        print("✅ Vercel Token: Configured")
        print(f"   Token preview: {settings.vercel_token[:10]}...")
    else:
        print("❌ Vercel Token: Not configured")
        print("   Set VERCEL_TOKEN in backend/.env")
    
    print()
    
    # Check Netlify
    if settings.netlify_token:
        print("✅ Netlify Token: Configured")
        print(f"   Token preview: {settings.netlify_token[:10]}...")
    else:
        print("❌ Netlify Token: Not configured")
        print("   Set NETLIFY_TOKEN in backend/.env")
    
    print()
    print("-" * 60)
    
    # Check platform availability
    availability = deployer.check_platform_availability()
    
    print()
    print("🚀 Deployment Platform Status:")
    print("-" * 60)
    print(f"Vercel Available: {'✅ Yes' if availability['vercel'] else '❌ No'}")
    print(f"Netlify Available: {'✅ Yes' if availability['netlify'] else '❌ No'}")
    print(f"Any Platform Available: {'✅ Yes' if availability['any_available'] else '❌ No'}")
    print(f"Deployment Method: {availability['deployment_method']}")
    print()
    
    # Test API connectivity
    print("🔌 Testing API Connectivity:")
    print("-" * 60)
    
    if settings.vercel_token:
        print("Testing Vercel API...")
        try:
            import requests
            response = requests.get(
                "https://api.vercel.com/v2/user",
                headers={"Authorization": f"Bearer {settings.vercel_token}"},
                timeout=10
            )
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ Vercel API: Connected")
                print(f"   User: {user_data.get('user', {}).get('username', 'Unknown')}")
            else:
                print(f"❌ Vercel API: Error (Status {response.status_code})")
                print(f"   Response: {response.text[:100]}")
        except Exception as e:
            print(f"❌ Vercel API: Connection failed")
            print(f"   Error: {str(e)}")
    
    print()
    
    if settings.netlify_token:
        print("Testing Netlify API...")
        try:
            import requests
            response = requests.get(
                "https://api.netlify.com/api/v1/user",
                headers={"Authorization": f"Bearer {settings.netlify_token}"},
                timeout=10
            )
            if response.status_code == 200:
                user_data = response.json()
                print(f"✅ Netlify API: Connected")
                print(f"   User: {user_data.get('full_name', 'Unknown')}")
            else:
                print(f"❌ Netlify API: Error (Status {response.status_code})")
                print(f"   Response: {response.text[:100]}")
        except Exception as e:
            print(f"❌ Netlify API: Connection failed")
            print(f"   Error: {str(e)}")
    
    print()
    print("=" * 60)
    
    # Summary
    if availability['any_available']:
        print("✅ READY TO DEPLOY!")
        print()
        print("Your system is configured and ready to deploy applications.")
        print("Try deploying an app through the web interface.")
    else:
        print("❌ NOT READY TO DEPLOY")
        print()
        print("Please configure at least one deployment token:")
        print()
        print("1. Get a token:")
        print("   - Vercel: https://vercel.com/account/tokens")
        print("   - Netlify: https://app.netlify.com/user/applications")
        print()
        print("2. Add to backend/.env:")
        print("   VERCEL_TOKEN=your_token_here")
        print("   OR")
        print("   NETLIFY_TOKEN=your_token_here")
        print()
        print("3. Restart the server:")
        print("   cd backend")
        print("   python main.py")
    
    print("=" * 60)


if __name__ == "__main__":
    test_deployment_setup()
