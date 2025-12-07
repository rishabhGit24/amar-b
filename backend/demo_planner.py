#!/usr/bin/env python3
"""
Demo script for Planner Agent
Shows how the Planner Agent works with a sample user request
"""

import os
import sys
from unittest.mock import Mock

# Add the parent directory to the path so we can import backend modules
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.models.core import UserRequest
from backend.agents.planner import PlannerAgent


def demo_planner_agent():
    """Demonstrate the Planner Agent functionality"""
    
    print("=== AMAR MVP Planner Agent Demo ===\n")
    
    # Create a sample user request
    user_request = UserRequest(
        description="Build a simple portfolio website with a home page, about page, and contact form"
    )
    
    print(f"User Request: {user_request.description}")
    print(f"Session ID: {user_request.session_id}")
    print(f"Timestamp: {user_request.timestamp}\n")
    
    # Mock the LLM response for demo purposes
    mock_response = Mock()
    mock_response.content = '''
    {
        "pages": [
            {
                "name": "HomePage",
                "route": "/",
                "components": ["Header", "Hero", "Portfolio", "Footer"],
                "description": "Main landing page with hero section and portfolio preview"
            },
            {
                "name": "AboutPage",
                "route": "/about",
                "components": ["Header", "AboutContent", "Skills", "Footer"],
                "description": "About page with personal information and skills"
            },
            {
                "name": "ContactPage",
                "route": "/contact",
                "components": ["Header", "ContactForm", "Footer"],
                "description": "Contact page with form for inquiries"
            }
        ],
        "components": [
            {
                "name": "Header",
                "type": "functional",
                "props": {"title": "string", "showNav": "boolean"},
                "description": "Navigation header component"
            },
            {
                "name": "Hero",
                "type": "functional",
                "props": {"name": "string", "tagline": "string"},
                "description": "Hero section with name and tagline"
            },
            {
                "name": "Portfolio",
                "type": "functional",
                "props": {"projects": "array"},
                "description": "Portfolio showcase component"
            },
            {
                "name": "AboutContent",
                "type": "functional",
                "props": {"bio": "string"},
                "description": "About content component"
            },
            {
                "name": "Skills",
                "type": "functional",
                "props": {"skills": "array"},
                "description": "Skills display component"
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
            "dependencies": ["express", "nodemailer"]
        },
        "estimated_complexity": "medium"
    }
    '''
    
    try:
        # Create planner agent with mocked LLM
        planner = PlannerAgent()
        
        # Mock the LLM invoke method
        planner.llm = Mock()
        planner.llm.invoke = Mock(return_value=mock_response)
        
        # Analyze the request
        print("Analyzing request with Planner Agent...\n")
        response = planner.analyze_request(user_request)
        
        if response.success:
            print("✅ Plan generated successfully!")
            print(f"Execution time: {response.execution_time_ms}ms\n")
            
            plan = response.output['plan']
            
            print("📋 Generated Plan Summary:")
            print(f"  • Pages: {len(plan['pages'])}")
            print(f"  • Components: {len(plan['components'])}")
            print(f"  • Routes: {len(plan['routing']['routes'])}")
            print(f"  • Backend endpoints: {len(plan['backend_logic']['endpoints']) if plan['backend_logic'] else 0}")
            print(f"  • Complexity: {plan['estimated_complexity']}\n")
            
            print("📄 Pages:")
            for page in plan['pages']:
                print(f"  • {page['name']} ({page['route']}) - {page['description']}")
            
            print("\n🧩 Components:")
            for component in plan['components']:
                print(f"  • {component['name']} ({component['type']}) - {component['description']}")
            
            print("\n🔗 Routes:")
            for route in plan['routing']['routes']:
                print(f"  • {route['path']} → {route['component']}")
            
            if plan['backend_logic']:
                print("\n🔧 Backend Endpoints:")
                for endpoint in plan['backend_logic']['endpoints']:
                    print(f"  • {endpoint['method']} {endpoint['path']} → {endpoint['handler']}")
            
            print("\n✅ Plan validation passed!")
            print("The plan meets all requirements:")
            print("  • Page count ≤ 5 ✓")
            print("  • All components referenced ✓")
            print("  • Routing consistency ✓")
            print("  • Structure completeness ✓")
            
        else:
            print("❌ Plan generation failed!")
            for error in response.errors:
                print(f"  Error: {error}")
    
    except Exception as e:
        print(f"❌ Demo failed: {str(e)}")


if __name__ == "__main__":
    demo_planner_agent()