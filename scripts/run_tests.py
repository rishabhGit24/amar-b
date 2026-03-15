#!/usr/bin/env python3
"""
Test runner script for AMAR MVP
"""

import os
import sys
import subprocess
from pathlib import Path

def run_backend_tests():
    """Run backend tests"""
    print("🧪 Running backend tests...")
    backend_dir = Path(__file__).parent.parent / "backend"
    
    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/", "-v", "--tb=short"
        ], cwd=backend_dir, check=True)
        print("✅ Backend tests passed!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Backend tests failed!")
        return False

def run_frontend_tests():
    """Run frontend tests"""
    print("🧪 Running frontend tests...")
    frontend_dir = Path(__file__).parent.parent / "frontend"
    
    # Check if node_modules exists
    if not (frontend_dir / "node_modules").exists():
        print("📦 Installing frontend dependencies...")
        try:
            subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
        except subprocess.CalledProcessError:
            print("❌ Failed to install frontend dependencies!")
            return False
    
    try:
        result = subprocess.run([
            "npm", "test", "--", "--run", "--watchAll=false"
        ], cwd=frontend_dir, check=True)
        print("✅ Frontend tests passed!")
        return True
    except subprocess.CalledProcessError:
        print("❌ Frontend tests failed!")
        return False

def main():
    """Run all tests"""
    print(" Running AMAR MVP test suite...\n")
    
    backend_success = run_backend_tests()
    print()
    
    frontend_success = run_frontend_tests()
    print()
    
    if backend_success and frontend_success:
        print("🎉 All tests passed!")
        return 0
    else:
        print("💥 Some tests failed!")
        return 1

if __name__ == "__main__":
    exit(main())