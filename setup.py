#!/usr/bin/env python3
"""
AMAR MVP Setup Script
Automates the initial setup of the development environment
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def check_prerequisites():
    """Check if required tools are installed"""
    print("🔍 Checking prerequisites...")
    
    # Check Python
    try:
        result = subprocess.run([sys.executable, "--version"], 
                              capture_output=True, text=True)
        print(f"✅ Python: {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ Python not found!")
        return False
    
    # Check Node.js
    try:
        result = subprocess.run(["node", "--version"], 
                              capture_output=True, text=True)
        print(f"✅ Node.js: {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ Node.js not found! Please install Node.js 18+")
        return False
    
    # Check npm
    try:
        result = subprocess.run(["npm", "--version"], 
                              capture_output=True, text=True)
        print(f"✅ npm: {result.stdout.strip()}")
    except FileNotFoundError:
        print("❌ npm not found!")
        return False
    
    return True

def setup_backend():
    """Set up backend environment"""
    print("\n🐍 Setting up backend...")
    
    backend_dir = Path("backend")
    
    # Create .env file if it doesn't exist
    env_file = backend_dir / ".env"
    env_example = backend_dir / ".env.example"
    
    if not env_file.exists() and env_example.exists():
        shutil.copy(env_example, env_file)
        print("✅ Created .env file from template")
    
    # Install Python dependencies
    print("📦 Installing Python dependencies...")
    try:
        subprocess.run([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ], cwd=backend_dir, check=True)
        print("✅ Backend dependencies installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install backend dependencies")
        return False
    
    return True

def setup_frontend():
    """Set up frontend environment"""
    print("\n⚛️  Setting up frontend...")
    
    frontend_dir = Path("frontend")
    
    # Install Node.js dependencies
    print("📦 Installing Node.js dependencies...")
    try:
        subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
        print("✅ Frontend dependencies installed")
    except subprocess.CalledProcessError:
        print("❌ Failed to install frontend dependencies")
        return False
    
    return True

def run_initial_tests():
    """Run initial tests to verify setup"""
    print("\n🧪 Running initial tests...")
    
    # Test backend
    try:
        subprocess.run([
            sys.executable, "-m", "pytest", "tests/test_main.py", "-v"
        ], cwd="backend", check=True)
        print("✅ Backend tests passed")
    except subprocess.CalledProcessError:
        print("⚠️  Backend tests failed (this might be expected)")
    
    # Test frontend build
    try:
        subprocess.run([
            "npm", "run", "build"
        ], cwd="frontend", check=True)
        print("✅ Frontend builds successfully")
    except subprocess.CalledProcessError:
        print("⚠️  Frontend build failed (this might be expected)")

def print_next_steps():
    """Print next steps for the user"""
    print("\n🎉 Setup complete! Next steps:")
    print("\n📝 Configuration:")
    print("1. Edit backend/.env and add your API keys:")
    print("   - GEMINI_API_KEY=your_gemini_api_key_here")
    print("   - VERCEL_TOKEN=your_vercel_token_here (optional)")
    print("   - NETLIFY_TOKEN=your_netlify_token_here (optional)")
    
    print("\n🚀 Development:")
    print("1. Start backend: python scripts/start_backend.py")
    print("2. Start frontend: cd frontend && npm start")
    print("3. Run tests: python scripts/run_tests.py")
    
    print("\n📚 Documentation:")
    print("- See README.md for detailed instructions")
    print("- Check .kiro/specs/amar-mvp/ for requirements and design")

def main():
    """Main setup function"""
    print("🚀 AMAR MVP Development Environment Setup\n")
    
    if not check_prerequisites():
        print("\n❌ Prerequisites check failed!")
        return 1
    
    if not setup_backend():
        print("\n❌ Backend setup failed!")
        return 1
    
    if not setup_frontend():
        print("\n❌ Frontend setup failed!")
        return 1
    
    run_initial_tests()
    print_next_steps()
    
    return 0

if __name__ == "__main__":
    exit(main())