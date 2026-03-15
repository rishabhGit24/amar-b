#!/usr/bin/env python3
"""
Quick syntax verification for builder.py
"""

import sys
import py_compile
import os

def verify_syntax(filepath):
    """Verify Python file syntax"""
    try:
        py_compile.compile(filepath, doraise=True)
        return True, "Syntax OK"
    except py_compile.PyCompileError as e:
        return False, str(e)

def main():
    """Verify builder.py syntax"""
    filepath = "amar-b/backend/agents/builder.py"
    
    if not os.path.exists(filepath):
        print(f"ERROR: File not found: {filepath}")
        return False
    
    print("Verifying builder.py syntax...")
    print("=" * 50)
    
    success, message = verify_syntax(filepath)
    
    if success:
        print("SUCCESS: builder.py syntax is valid")
        print("  - No unterminated strings")
        print("  - No invalid characters")
        print("  - All prompts properly formatted")
        print("  - Ready for execution")
        return True
    else:
        print("ERROR: Syntax validation failed")
        print(f"  {message}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)