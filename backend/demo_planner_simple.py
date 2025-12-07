#!/usr/bin/env python3
"""
Simple demo for Planner Agent validation functionality
Shows plan validation without requiring API keys
"""

import os
import sys
from unittest.mock import Mock, patch

# Add the parent directory to the path so we can import backend modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.core import UserRequest
from backend.agents.plan_validator import PlanValidator, validate_plan_completeness


def demo_plan_validation():
    """Demonstrate the Plan Validation functionality"""
    
    print("=== AMAR MVP Plan Validator Demo ===\n")
    
    # Sample plan data
    sample_plan = {
        "pages": [
            {
                "name": "HomePage",
                "route": "/",
                "components": ["Header", "Hero", "Footer"],
                "description": "Main landing page with hero section"
            },
            {
                "name": "AboutPage",
                "route": "/about",
                "components": ["Header", "AboutContent", "Footer"],
                "description": "About page with personal information"
            },
            {
                "name": "ContactPage",
                "route": "/contact",
                "components": ["Header", "ContactForm", "Footer"],
                "description": "Contact page with form"
            }
        ],
        "components": [
            {
                "name": "Header",
                "type": "functional",
                "props": {"title": "string"},
                "description": "Navigation header component"
            },
            {
                "name": "Hero",
                "type": "functional",
                "props": {"name": "string"},
                "description": "Hero section component"
            },
            {
                "name": "AboutContent",
                "type": "functional",
                "props": {"bio": "string"},
                "description": "About content component"
            },
            {
                "name": "ContactForm",
                "type": "functional",
                "props": {},
                "description": "Contact form with validation"
            },
            {
                "name": "Footer",
                "type": "functional",
                "props": {},
                "description": "Footer component"
            }
        ],
        "routing": {
            "base_path": "/",
            "routes": [
                {"path": "/", "component": "HomePage"},
                {"path": "/about", "component": "AboutPage"},
                {"path": "/contact", "component": "ContactPage"}
            ],
            "navigation_links": [
                {"label": "Home", "path": "/"},
                {"label": "About", "path": "/about"},
                {"label": "Contact", "path": "/contact"}
            ]
        },
        "backend_logic": {
            "endpoints": [
                {"method": "POST", "path": "/api/contact", "handler": "handleContactForm"}
            ],
            "middleware": ["cors", "bodyParser"],
            "dependencies": ["express"]
        },
        "estimated_complexity": "medium"
    }
    
    print("📋 Sample Plan:")
    print(f"  • Pages: {len(sample_plan['pages'])}")
    print(f"  • Components: {len(sample_plan['components'])}")
    print(f"  • Routes: {len(sample_plan['routing']['routes'])}")
    print(f"  • Backend endpoints: {len(sample_plan['backend_logic']['endpoints'])}")
    print(f"  • Complexity: {sample_plan['estimated_complexity']}\n")
    
    # Test plan completeness validation
    print("🔍 Testing Plan Completeness Validation...")
    completeness_result = validate_plan_completeness(sample_plan)
    
    if completeness_result['valid']:
        print("✅ Plan completeness validation passed!")
    else:
        print("❌ Plan completeness validation failed:")
        for error in completeness_result['errors']:
            print(f"  • {error}")
    
    print(f"Summary: {completeness_result['summary']}\n")
    
    # Test detailed structure validation
    print("🔍 Testing Detailed Structure Validation...")
    validator = PlanValidator()
    
    # First create the Plan object
    from backend.models.core import Plan, PageSpec, ComponentSpec, RoutingConfig, BackendSpec
    
    try:
        pages = [PageSpec(**page) for page in sample_plan['pages']]
        components = [ComponentSpec(**comp) for comp in sample_plan['components']]
        routing = RoutingConfig(**sample_plan['routing'])
        backend_logic = BackendSpec(**sample_plan['backend_logic'])
        
        plan = Plan(
            pages=pages,
            components=components,
            routing=routing,
            backend_logic=backend_logic,
            estimated_complexity=sample_plan['estimated_complexity']
        )
        
        validation_result = validator.validate_plan_structure(plan)
        
        if validation_result['valid']:
            print("✅ Detailed structure validation passed!")
        else:
            print("❌ Detailed structure validation failed:")
            for error in validation_result['errors']:
                print(f"  • {error}")
        
        if validation_result['warnings']:
            print("⚠️  Warnings:")
            for warning in validation_result['warnings']:
                print(f"  • {warning}")
        
        print(f"\nValidation Summary:")
        summary = validation_result['summary']
        for key, value in summary.items():
            print(f"  • {key}: {value}")
        
    except Exception as e:
        print(f"❌ Validation failed: {str(e)}")
    
    # Test invalid plan (too many pages)
    print("\n🔍 Testing Invalid Plan (Too Many Pages)...")
    invalid_plan = sample_plan.copy()
    
    # Add more pages to exceed the limit
    for i in range(4, 7):  # Add pages 4, 5, 6 (total will be 6 pages)
        invalid_plan['pages'].append({
            "name": f"Page{i}",
            "route": f"/page{i}",
            "components": ["Header", "Footer"],
            "description": f"Additional page {i}"
        })
    
    invalid_result = validate_plan_completeness(invalid_plan)
    
    if not invalid_result['valid']:
        print("✅ Correctly detected invalid plan!")
        for error in invalid_result['errors']:
            print(f"  • {error}")
    else:
        print("❌ Failed to detect invalid plan")
    
    print("\n=== Demo Complete ===")


if __name__ == "__main__":
    demo_plan_validation()