#!/usr/bin/env python3
"""
Test script to verify MUI improvements in the AMAR system
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.agents.builder import BuilderAgent
from backend.models.core import Plan, PageSpec, ComponentSpec

def test_mui_validation():
    """Test the MUI validation functionality"""
    builder = BuilderAgent()
    
    # Test 1: Valid MUI code
    valid_mui_code = """
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Star } from '@mui/icons-material';

const TestComponent = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h1">Title</Typography>
      <Typography variant="body1">Content</Typography>
      <Button variant="contained">Click</Button>
    </Box>
  );
};
"""
    
    # Test 2: Invalid code with plain HTML
    invalid_code = """
import React from 'react';

const TestComponent = () => {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
      <button>Click</button>
    </div>
  );
};
"""
    
    print("🧪 Testing MUI Validation...")
    
    # Test valid code
    result1 = builder._validate_mui_compliance(valid_mui_code, 'component')
    print(f"Valid MUI code test: {'✅ PASS' if result1 else '❌ FAIL'}")
    
    # Test invalid code
    result2 = builder._validate_mui_compliance(invalid_code, 'component')
    print(f"Invalid HTML code test: {'✅ PASS' if not result2 else '❌ FAIL'}")
    
    return result1 and not result2

def test_mui_fallback_templates():
    """Test the MUI fallback templates"""
    builder = BuilderAgent()
    
    print("\n🧪 Testing MUI Fallback Templates...")
    
    # Test page template
    page_spec = PageSpec(
        name="TestPage",
        route="/test",
        description="A test page for e-commerce",
        components=["Hero", "Features"]
    )
    
    page_code = builder._generate_basic_page_template(page_spec)
    page_valid = builder._validate_mui_compliance(page_code, 'page')
    print(f"Page template MUI compliance: {'✅ PASS' if page_valid else '❌ FAIL'}")
    
    # Test component template
    component_spec = ComponentSpec(
        name="TestComponent",
        type="functional",
        description="A test component",
        props={"title": "string"}
    )
    
    component_code = builder._generate_basic_component_template(component_spec)
    component_valid = builder._validate_mui_compliance(component_code, 'component')
    print(f"Component template MUI compliance: {'✅ PASS' if component_valid else '❌ FAIL'}")
    
    return page_valid and component_valid

def test_app_component_mui():
    """Test the App component MUI setup"""
    builder = BuilderAgent()
    
    print("\n🧪 Testing App Component MUI Setup...")
    
    # Create a simple plan
    plan = Plan(
        pages=[
            PageSpec(name="HomePage", route="/", description="Home page", components=[])
        ],
        components=[],
        backend_logic=None
    )
    
    app_code = builder._generate_app_component(plan)
    app_valid = builder._validate_mui_compliance(app_code, 'app')
    print(f"App component MUI compliance: {'✅ PASS' if app_valid else '❌ FAIL'}")
    
    # Check for specific MUI requirements
    has_theme_provider = 'ThemeProvider' in app_code
    has_create_theme = 'createTheme' in app_code
    has_css_baseline = 'CssBaseline' in app_code
    
    print(f"ThemeProvider present: {'✅ PASS' if has_theme_provider else '❌ FAIL'}")
    print(f"createTheme present: {'✅ PASS' if has_create_theme else '❌ FAIL'}")
    print(f"CssBaseline present: {'✅ PASS' if has_css_baseline else '❌ FAIL'}")
    
    return app_valid and has_theme_provider and has_create_theme and has_css_baseline

def main():
    """Run all MUI improvement tests"""
    print(" Testing AMAR MUI Improvements")
    print("=" * 50)
    
    try:
        # Run tests
        test1_passed = test_mui_validation()
        test2_passed = test_mui_fallback_templates()
        test3_passed = test_app_component_mui()
        
        # Summary
        print("\n📊 Test Summary:")
        print("=" * 50)
        total_tests = 3
        passed_tests = sum([test1_passed, test2_passed, test3_passed])
        
        print(f"Tests passed: {passed_tests}/{total_tests}")
        print(f"Success rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if passed_tests == total_tests:
            print("\n🎉 All MUI improvements are working correctly!")
            print("✅ Generated code will now use Material-UI components")
            print("✅ Fallback templates are MUI-compliant")
            print("✅ App component includes ThemeProvider setup")
        else:
            print(f"\n⚠️  {total_tests - passed_tests} test(s) failed")
            print("❌ Some MUI improvements need attention")
        
        return passed_tests == total_tests
        
    except Exception as e:
        print(f"\n❌ Test execution failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)