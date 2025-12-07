#!/usr/bin/env python3
"""
Test script to verify the project structure is set up correctly
"""

import os
import json
from pathlib import Path

def test_backend_structure():
    """Test backend directory structure"""
    print("Testing backend structure...")
    
    # Check main files
    assert os.path.exists("backend/main.py"), "main.py missing"
    assert os.path.exists("backend/requirements.txt"), "requirements.txt missing"
    assert os.path.exists("backend/config.py"), "config.py missing"
    assert os.path.exists("backend/.env.example"), ".env.example missing"
    
    # Check directories
    assert os.path.exists("backend/agents"), "agents directory missing"
    assert os.path.exists("backend/models"), "models directory missing"
    assert os.path.exists("backend/services"), "services directory missing"
    assert os.path.exists("backend/tests"), "tests directory missing"
    
    # Check __init__.py files
    assert os.path.exists("backend/agents/__init__.py"), "agents/__init__.py missing"
    assert os.path.exists("backend/models/__init__.py"), "models/__init__.py missing"
    assert os.path.exists("backend/services/__init__.py"), "services/__init__.py missing"
    assert os.path.exists("backend/tests/__init__.py"), "tests/__init__.py missing"
    
    print("✓ Backend structure is correct")

def test_frontend_structure():
    """Test frontend directory structure"""
    print("Testing frontend structure...")
    
    # Check main files
    assert os.path.exists("frontend/package.json"), "package.json missing"
    assert os.path.exists("frontend/tsconfig.json"), "tsconfig.json missing"
    assert os.path.exists("frontend/tailwind.config.js"), "tailwind.config.js missing"
    assert os.path.exists("frontend/postcss.config.js"), "postcss.config.js missing"
    
    # Check public directory
    assert os.path.exists("frontend/public/index.html"), "public/index.html missing"
    assert os.path.exists("frontend/public/manifest.json"), "public/manifest.json missing"
    
    # Check src directory
    assert os.path.exists("frontend/src/index.tsx"), "src/index.tsx missing"
    assert os.path.exists("frontend/src/App.tsx"), "src/App.tsx missing"
    assert os.path.exists("frontend/src/index.css"), "src/index.css missing"
    assert os.path.exists("frontend/src/App.css"), "src/App.css missing"
    assert os.path.exists("frontend/src/types/index.ts"), "src/types/index.ts missing"
    
    print("✓ Frontend structure is correct")

def test_package_json():
    """Test package.json content"""
    print("Testing package.json content...")
    
    with open("frontend/package.json", "r") as f:
        package_data = json.load(f)
    
    # Check essential dependencies
    deps = package_data.get("dependencies", {})
    assert "react" in deps, "React dependency missing"
    assert "react-dom" in deps, "React DOM dependency missing"
    assert "typescript" in deps, "TypeScript dependency missing"
    
    dev_deps = package_data.get("devDependencies", {})
    assert "tailwindcss" in dev_deps, "TailwindCSS dependency missing"
    assert "@testing-library/react" in dev_deps, "React Testing Library missing"
    
    # Check scripts
    scripts = package_data.get("scripts", {})
    assert "start" in scripts, "Start script missing"
    assert "build" in scripts, "Build script missing"
    assert "test" in scripts, "Test script missing"
    
    print("✓ Package.json is correctly configured")

def test_root_files():
    """Test root level files"""
    print("Testing root files...")
    
    assert os.path.exists("README.md"), "README.md missing"
    assert os.path.exists(".gitignore"), ".gitignore missing"
    
    print("✓ Root files are correct")

def main():
    """Run all tests"""
    print("🚀 Testing AMAR MVP project structure...\n")
    
    try:
        test_backend_structure()
        test_frontend_structure()
        test_package_json()
        test_root_files()
        
        print("\n✅ All structure tests passed!")
        print("📁 Project structure is set up correctly")
        print("\n📋 Next steps:")
        print("1. Install backend dependencies: cd backend && pip install -r requirements.txt")
        print("2. Install frontend dependencies: cd frontend && npm install")
        print("3. Set up environment variables: cp backend/.env.example backend/.env")
        print("4. Add your API keys to backend/.env")
        
    except AssertionError as e:
        print(f"\n❌ Structure test failed: {e}")
        return 1
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())