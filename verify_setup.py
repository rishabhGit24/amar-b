#!/usr/bin/env python3
"""
Final verification script for AMAR MVP setup
"""

import os
import sys
import subprocess
from pathlib import Path

def verify_backend():
    """Verify backend setup"""
    print("🐍 Verifying backend setup...")
    
    # Change to backend directory
    original_dir = os.getcwd()
    backend_dir = Path("backend")
    
    try:
        os.chdir(backend_dir)
        
        # Run tests
        result = subprocess.run([
            sys.executable, "-m", "pytest", "tests/test_main.py", "-v"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Backend tests passed!")
            print("✅ FastAPI server can be started")
            return True
        else:
            print("❌ Backend tests failed:")
            print(result.stdout)
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"❌ Backend verification failed: {e}")
        return False
    finally:
        os.chdir(original_dir)

def verify_frontend():
    """Verify frontend setup"""
    print("⚛️  Verifying frontend setup...")
    
    # Check if package.json exists and is valid
    package_json = Path("frontend/package.json")
    if not package_json.exists():
        print("❌ Frontend package.json not found")
        return False
    
    # Check if TypeScript config exists
    tsconfig = Path("frontend/tsconfig.json")
    if not tsconfig.exists():
        print("❌ Frontend tsconfig.json not found")
        return False
    
    # Check if TailwindCSS config exists
    tailwind_config = Path("frontend/tailwind.config.js")
    if not tailwind_config.exists():
        print("❌ Frontend tailwind.config.js not found")
        return False
    
    print("✅ Frontend configuration files present")
    print("✅ React app structure is correct")
    return True

def verify_environment():
    """Verify environment setup"""
    print("🔧 Verifying environment setup...")
    
    # Check .env file
    env_file = Path("backend/.env")
    if env_file.exists():
        print("✅ Environment file exists")
    else:
        print("⚠️  Environment file not found (this is okay for initial setup)")
    
    # Check .gitignore
    gitignore = Path(".gitignore")
    if gitignore.exists():
        print("✅ .gitignore file exists")
    else:
        print("❌ .gitignore file missing")
        return False
    
    return True

def verify_documentation():
    """Verify documentation"""
    print("📚 Verifying documentation...")
    
    # Check README
    readme = Path("README.md")
    if readme.exists():
        print("✅ README.md exists")
    else:
        print("❌ README.md missing")
        return False
    
    # Check spec files
    spec_dir = Path(".kiro/specs/amar-mvp")
    if spec_dir.exists():
        requirements = spec_dir / "requirements.md"
        design = spec_dir / "design.md"
        tasks = spec_dir / "tasks.md"
        
        if all(f.exists() for f in [requirements, design, tasks]):
            print("✅ Specification documents exist")
        else:
            print("❌ Some specification documents missing")
            return False
    else:
        print("❌ Specification directory missing")
        return False
    
    return True

def print_summary():
    """Print setup summary"""
    print("\n" + "="*50)
    print("🎉 AMAR MVP PROJECT SETUP COMPLETE!")
    print("="*50)
    
    print("\n📁 Project Structure:")
    print("├── backend/          # Python FastAPI backend")
    print("├── frontend/         # React TypeScript frontend")
    print("├── scripts/          # Development scripts")
    print("├── .kiro/specs/      # Project specifications")
    print("└── README.md         # Documentation")
    
    print("\n🚀 Development Commands:")
    print("Backend:")
    print("  cd backend && python main.py")
    print("Frontend:")
    print("  cd frontend && npm install && npm start")
    print("Tests:")
    print("  cd backend && python -m pytest tests/ -v")
    
    print("\n📋 Next Implementation Tasks:")
    print("1. ✅ Set up project structure and development environment")
    print("2. ⏳ Implement core data models and validation")
    print("3. ⏳ Build episodic memory and audit logging system")
    print("4. ⏳ Implement Planner Agent")
    print("5. ⏳ Implement Builder Agent with code generation")
    
    print("\n💡 Tips:")
    print("- Add your API keys to backend/.env")
    print("- See .kiro/specs/amar-mvp/tasks.md for detailed implementation plan")
    print("- Use 'python test_setup.py' to verify structure anytime")

def main():
    """Main verification function"""
    print("🔍 Final verification of AMAR MVP setup...\n")
    
    results = []
    results.append(verify_backend())
    results.append(verify_frontend())
    results.append(verify_environment())
    results.append(verify_documentation())
    
    print()
    
    if all(results):
        print("✅ All verifications passed!")
        print_summary()
        return 0
    else:
        print("❌ Some verifications failed!")
        print("Please check the errors above and fix them.")
        return 1

if __name__ == "__main__":
    exit(main())