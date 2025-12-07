#!/usr/bin/env python3
"""
Development startup script for AMAR MVP Backend
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Start the backend development server"""
    # Change to backend directory
    backend_dir = Path(__file__).parent.parent / "backend"
    os.chdir(backend_dir)
    
    print("🚀 Starting AMAR MVP Backend...")
    print(f"📁 Working directory: {backend_dir}")
    
    # Check if .env exists
    if not os.path.exists(".env"):
        print("⚠️  No .env file found. Creating from .env.example...")
        if os.path.exists(".env.example"):
            import shutil
            shutil.copy(".env.example", ".env")
            print("✅ Created .env file. Please add your API keys!")
        else:
            print("❌ No .env.example found!")
            return 1
    
    # Start the server
    try:
        subprocess.run([sys.executable, "main.py"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Backend server stopped")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start backend: {e}")
        return 1

if __name__ == "__main__":
    exit(main())