"""
Tests for Planner Agent
Validates: Requirements 2.1, 2.2, 12.1, 12.2
"""

import pytest
from unittest.mock import Mock, patch
from datetime import datetime
from hypothesis import given, strategies as st, settings

from backend.models.core import UserRequest, Plan
from backend.agents.planner import PlannerAgent
from backend.agents.plan_validator import PlanValidator, validate_plan_completeness


class TestPlannerAgent:
    """Test suite for Planner Agent functionality"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.mock_llm_response = Mock()
        self.mock_llm_response.content = '''
        {
            "pages": [
                {
                    "name": "HomePage",
                    "route": "/",
                    "components": ["Header", "Hero", "Footer"],
                    "description": "Main landing page"
                }
            ],
            "components": [
                {
                    "name": "Header",
                    "type": "functional",
                    "props": {"title": "string"},
                    "description": "Navigation header"
                },
                {
                    "name": "Hero",
                    "type": "functional",
                    "props": {},
                    "description": "Hero section"
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
                    {"path": "/", "component": "HomePage"}
                ],
                "navigation_links": [
                    {"label": "Home", "path": "/"}
                ]
            },
            "backend_logic": null,
            "estimated_complexity": "simple"
        }
        '''
    
    @patch('backend.agents.planner.ChatGoogleGenerativeAI')
    def test_planner_initialization(self, mock_llm_class):
        """Test that Planner Agent initializes correctly"""
        mock_llm_class.return_value = Mock()
        
        planner = PlannerAgent()
        
        assert planner.settings is not None
        assert planner.validator is not None
        mock_llm_class.assert_called_once()
    
    @patch('backend.agents.planner.ChatGoogleGenerativeAI')
    def test_analyze_request_success(self, mock_llm_class):
        """Test successful request analysis"""
        mock_llm = Mock()
        mock_llm.invoke.return_value = self.mock_llm_response
        mock_llm_class.return_value = mock_llm
        
        planner = PlannerAgent()
        user_request = UserRequest(description="Build a simple landing page")
        
        response = planner.analyze_request(user_request)
        
        assert response.success is True
        assert response.agent_name == 'planner'
        assert 'plan' in response.output
        assert len(response.errors) == 0
        assert response.execution_time_ms >= 0
    
    @patch('backend.agents.planner.ChatGoogleGenerativeAI')
    def test_analyze_request_with_invalid_json(self, mock_llm_class):
        """Test handling of invalid JSON from LLM"""
        mock_llm = Mock()
        mock_response = Mock()
        mock_response.content = "Invalid JSON response"
        mock_llm.invoke.return_value = mock_response
        mock_llm_class.return_value = mock_llm
        
        planner = PlannerAgent()
        user_request = UserRequest(description="Build a simple landing page")
        
        response = planner.analyze_request(user_request)
        
        assert response.success is False
        assert len(response.errors) > 0
        assert "Plan generation failed" in response.errors[0]
    
    def test_extract_json_from_response(self):
        """Test JSON extraction from LLM response"""
        with patch('backend.agents.planner.ChatGoogleGenerativeAI'):
            planner = PlannerAgent()
            
            # Test valid JSON
            response_text = '{"test": "value"}'
            result = planner._extract_json_from_response(response_text)
            assert result == {"test": "value"}
            
            # Test JSON with extra text
            response_text = 'Here is the JSON: {"test": "value"} and some more text'
            result = planner._extract_json_from_response(response_text)
            assert result == {"test": "value"}
    
    def test_validate_and_create_plan(self):
        """Test plan validation and creation"""
        with patch('backend.agents.planner.ChatGoogleGenerativeAI'):
            planner = PlannerAgent()
            
            plan_dict = {
                "pages": [
                    {
                        "name": "HomePage",
                        "route": "/",
                        "components": ["Header"],
                        "description": "Main page"
                    }
                ],
                "components": [
                    {
                        "name": "Header",
                        "type": "functional",
                        "props": {},
                        "description": "Header component"
                    }
                ],
                "routing": {
                    "base_path": "/",
                    "routes": [{"path": "/", "component": "HomePage"}]
                },
                "backend_logic": None,
                "estimated_complexity": "simple"
            }
            
            plan = planner._validate_and_create_plan(plan_dict)
            
            assert isinstance(plan, Plan)
            assert len(plan.pages) == 1
            assert len(plan.components) == 1
            assert plan.backend_logic is None


class TestPlanValidator:
    """Test suite for Plan Validator"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.validator = PlanValidator()
    
    def test_validate_plan_completeness_success(self):
        """Test successful plan completeness validation"""
        plan_dict = {
            "pages": [
                {
                    "name": "HomePage",
                    "route": "/",
                    "components": ["Header"],
                    "description": "Main page"
                }
            ],
            "components": [
                {
                    "name": "Header",
                    "type": "functional",
                    "props": {},
                    "description": "Header component"
                }
            ],
            "routing": {
                "base_path": "/",
                "routes": [{"path": "/", "component": "HomePage"}]
            }
        }
        
        result = validate_plan_completeness(plan_dict)
        
        assert result['valid'] is True
        assert len(result['errors']) == 0
    
    def test_validate_plan_completeness_missing_fields(self):
        """Test plan completeness validation with missing fields"""
        plan_dict = {
            "pages": []
        }
        
        result = validate_plan_completeness(plan_dict)
        
        assert result['valid'] is False
        assert len(result['errors']) > 0
        assert "Missing required fields" in result['errors'][0]
    
    def test_validate_page_count_limit(self):
        """Test page count validation"""
        # Create plan with too many pages
        pages = []
        for i in range(6):  # Exceeds limit of 5
            pages.append({
                "name": f"Page{i}",
                "route": f"/page{i}",
                "components": ["Header"],
                "description": f"Page {i}"
            })
        
        plan_dict = {
            "pages": pages,
            "components": [
                {
                    "name": "Header",
                    "type": "functional",
                    "props": {},
                    "description": "Header component"
                }
            ],
            "routing": {
                "base_path": "/",
                "routes": [{"path": "/", "component": "HomePage"}]
            }
        }
        
        result = validate_plan_completeness(plan_dict)
        
        assert result['valid'] is False
        assert any("exceeds maximum of 5 pages" in error for error in result['errors'])


class TestPlannerPropertyTests:
    """Property-based tests for Planner Agent"""
    
    @patch('backend.agents.planner.ChatGoogleGenerativeAI')
    @given(st.text(min_size=10, max_size=200))
    @settings(max_examples=100)
    def test_plan_structure_completeness_property(self, mock_llm_class, user_description):
        """
        Feature: amar-mvp, Property 3: Plan structure completeness
        Validates: Requirements 2.2
        
        For any valid user request, the Planner Agent output should contain 
        all required fields: pages list, components list, routing configuration, 
        and backend specification (if applicable).
        """
        # Create a valid mock LLM response with all required fields
        mock_llm_response = Mock()
        mock_llm_response.content = '''
        {
            "pages": [
                {
                    "name": "HomePage",
                    "route": "/",
                    "components": ["Header", "Hero", "Footer"],
                    "description": "Main landing page"
                },
                {
                    "name": "AboutPage", 
                    "route": "/about",
                    "components": ["Header", "AboutContent", "Footer"],
                    "description": "About us page"
                }
            ],
            "components": [
                {
                    "name": "Header",
                    "type": "functional",
                    "props": {"title": "string"},
                    "description": "Navigation header"
                },
                {
                    "name": "Hero",
                    "type": "functional",
                    "props": {},
                    "description": "Hero section"
                },
                {
                    "name": "Footer",
                    "type": "functional",
                    "props": {},
                    "description": "Footer component"
                },
                {
                    "name": "AboutContent",
                    "type": "functional",
                    "props": {},
                    "description": "About page content"
                }
            ],
            "routing": {
                "base_path": "/",
                "routes": [
                    {"path": "/", "component": "HomePage"},
                    {"path": "/about", "component": "AboutPage"}
                ],
                "navigation_links": [
                    {"label": "Home", "path": "/"},
                    {"label": "About", "path": "/about"}
                ]
            },
            "backend_logic": null,
            "estimated_complexity": "simple"
        }
        '''
        
        mock_llm = Mock()
        mock_llm.invoke.return_value = mock_llm_response
        mock_llm_class.return_value = mock_llm
        
        # Create planner and test request
        planner = PlannerAgent()
        user_request = UserRequest(description=user_description)
        
        # Execute the request
        response = planner.analyze_request(user_request)
        
        # If the request succeeds, verify plan structure completeness
        if response.success:
            assert 'plan' in response.output, "Response should contain 'plan' field"
            
            plan_data = response.output['plan']
            
            # Verify all required top-level fields are present
            required_fields = {'pages', 'components', 'routing', 'backend_logic', 'estimated_complexity'}
            missing_fields = required_fields - set(plan_data.keys())
            assert not missing_fields, f"Plan missing required fields: {missing_fields}"
            
            # Verify pages structure
            assert isinstance(plan_data['pages'], list), "Pages should be a list"
            assert len(plan_data['pages']) > 0, "Plan should contain at least one page"
            assert len(plan_data['pages']) <= 5, "Plan should not exceed 5 pages"
            
            for page in plan_data['pages']:
                page_required_fields = {'name', 'route', 'components', 'description'}
                page_missing_fields = page_required_fields - set(page.keys())
                assert not page_missing_fields, f"Page missing required fields: {page_missing_fields}"
                assert isinstance(page['components'], list), "Page components should be a list"
            
            # Verify components structure
            assert isinstance(plan_data['components'], list), "Components should be a list"
            
            for component in plan_data['components']:
                comp_required_fields = {'name', 'type', 'description'}
                comp_missing_fields = comp_required_fields - set(component.keys())
                assert not comp_missing_fields, f"Component missing required fields: {comp_missing_fields}"
                assert component['type'] in ['functional', 'class', 'hook'], f"Invalid component type: {component['type']}"
            
            # Verify routing structure
            assert isinstance(plan_data['routing'], dict), "Routing should be a dictionary"
            routing_required_fields = {'base_path', 'routes'}
            routing_missing_fields = routing_required_fields - set(plan_data['routing'].keys())
            assert not routing_missing_fields, f"Routing missing required fields: {routing_missing_fields}"
            
            assert isinstance(plan_data['routing']['routes'], list), "Routes should be a list"
            for route in plan_data['routing']['routes']:
                route_required_fields = {'path', 'component'}
                route_missing_fields = route_required_fields - set(route.keys())
                assert not route_missing_fields, f"Route missing required fields: {route_missing_fields}"
            
            # Verify backend_logic structure (if present)
            if plan_data['backend_logic'] is not None:
                assert isinstance(plan_data['backend_logic'], dict), "Backend logic should be a dictionary"
                backend_required_fields = {'endpoints'}
                backend_missing_fields = backend_required_fields - set(plan_data['backend_logic'].keys())
                assert not backend_missing_fields, f"Backend logic missing required fields: {backend_missing_fields}"
                
                assert isinstance(plan_data['backend_logic']['endpoints'], list), "Backend endpoints should be a list"
                for endpoint in plan_data['backend_logic']['endpoints']:
                    endpoint_required_fields = {'method', 'path', 'handler'}
                    endpoint_missing_fields = endpoint_required_fields - set(endpoint.keys())
                    assert not endpoint_missing_fields, f"Endpoint missing required fields: {endpoint_missing_fields}"
            
            # Verify estimated_complexity
            assert plan_data['estimated_complexity'] in ['simple', 'medium', 'complex'], \
                f"Invalid complexity level: {plan_data['estimated_complexity']}"
        
        # If the request fails, it should be due to input validation, not missing structure
        else:
            # The failure should be due to input validation (empty description) or other valid reasons
            # not due to missing plan structure fields
            assert len(response.errors) > 0, "Failed response should contain error messages"
    
    @patch('backend.agents.planner.ChatGoogleGenerativeAI')
    @given(st.integers(min_value=6, max_value=20))
    @settings(max_examples=100)
    def test_page_limit_enforcement_property(self, mock_llm_class, page_count):
        """
        Feature: amar-mvp, Property 2: Page limit enforcement
        Validates: Requirements 1.5, 12.3
        
        For any user request that specifies more than 5 pages, 
        the Planner Agent should reject the request and return an error message.
        """
        # Create mock LLM response with too many pages
        pages = []
        components = []
        routes = []
        nav_links = []
        
        for i in range(page_count):
            page_name = f"Page{i}"
            route = f"/page{i}" if i > 0 else "/"
            
            pages.append({
                "name": page_name,
                "route": route,
                "components": ["Header", "Footer"],
                "description": f"Description for page {i}"
            })
            
            routes.append({
                "path": route,
                "component": page_name
            })
            
            nav_links.append({
                "label": f"Page {i}",
                "path": route
            })
        
        # Add required components
        components.extend([
            {
                "name": "Header",
                "type": "functional",
                "props": {"title": "string"},
                "description": "Navigation header"
            },
            {
                "name": "Footer",
                "type": "functional",
                "props": {},
                "description": "Footer component"
            }
        ])
        
        mock_llm_response = Mock()
        mock_llm_response.content = f'''
        {{
            "pages": {pages},
            "components": {components},
            "routing": {{
                "base_path": "/",
                "routes": {routes},
                "navigation_links": {nav_links}
            }},
            "backend_logic": null,
            "estimated_complexity": "complex"
        }}
        '''
        
        mock_llm = Mock()
        mock_llm.invoke.return_value = mock_llm_response
        mock_llm_class.return_value = mock_llm
        
        # Create planner and test request
        planner = PlannerAgent()
        user_request = UserRequest(description=f"Build a website with {page_count} pages")
        
        # Execute the request
        response = planner.analyze_request(user_request)
        
        # Verify that the request is rejected
        assert response.success is False, f"Expected failure for {page_count} pages, but got success"
        assert len(response.errors) > 0, f"Expected errors for {page_count} pages, but got none"
        
        # Check that the error message mentions page limit
        error_message = " ".join(response.errors).lower()
        assert any(keyword in error_message for keyword in ["page", "limit", "exceed", "maximum", "5"]), \
            f"Error message should mention page limit violation: {response.errors}"
    
    @patch('backend.agents.planner.ChatGoogleGenerativeAI')
    @given(st.integers(min_value=1, max_value=5))
    @settings(max_examples=100)
    def test_page_count_identification_property(self, mock_llm_class, expected_page_count):
        """
        Feature: amar-mvp, Property 12: Page count identification
        Validates: Requirements 12.1
        
        For any user request, when the Planner Agent analyzes the request,
        the system should correctly identify the number of pages required.
        """
        # Generate page descriptions for the expected count
        page_descriptions = [
            "home page", "about page", "contact page", "services page", "portfolio page"
        ][:expected_page_count]
        
        # Create user description that mentions specific pages
        if expected_page_count == 1:
            user_description = "Build a simple landing page for my business"
        else:
            pages_text = ", ".join(page_descriptions[:-1]) + f" and {page_descriptions[-1]}"
            user_description = f"Build a website with {pages_text}"
        
        # Create mock LLM response with the expected number of pages
        pages = []
        components = []
        routes = []
        nav_links = []
        
        page_names = ["HomePage", "AboutPage", "ContactPage", "ServicesPage", "PortfolioPage"]
        page_routes = ["/", "/about", "/contact", "/services", "/portfolio"]
        
        for i in range(expected_page_count):
            pages.append({
                "name": page_names[i],
                "route": page_routes[i],
                "components": ["Header", "Footer"],
                "description": f"Description for {page_descriptions[i]}"
            })
            
            routes.append({
                "path": page_routes[i],
                "component": page_names[i]
            })
            
            nav_links.append({
                "label": page_descriptions[i].title(),
                "path": page_routes[i]
            })
        
        # Add required components
        components.extend([
            {
                "name": "Header",
                "type": "functional",
                "props": {"title": "string"},
                "description": "Navigation header"
            },
            {
                "name": "Footer",
                "type": "functional",
                "props": {},
                "description": "Footer component"
            }
        ])
        
        # Create proper JSON response
        import json
        response_data = {
            "pages": pages,
            "components": components,
            "routing": {
                "base_path": "/",
                "routes": routes,
                "navigation_links": nav_links
            },
            "backend_logic": None,
            "estimated_complexity": "simple"
        }
        
        mock_llm_response = Mock()
        mock_llm_response.content = json.dumps(response_data, indent=2)
        
        mock_llm = Mock()
        mock_llm.invoke.return_value = mock_llm_response
        mock_llm_class.return_value = mock_llm
        
        # Create planner and test request
        planner = PlannerAgent()
        user_request = UserRequest(description=user_description)
        
        # Execute the request
        response = planner.analyze_request(user_request)
        
        # Verify that the request succeeds (since page count is within limits)
        assert response.success is True, f"Expected success for {expected_page_count} pages, but got failure: {response.errors}"
        
        # Verify that the plan contains the expected number of pages
        assert 'plan' in response.output, "Response should contain 'plan' field"
        plan_data = response.output['plan']
        
        actual_page_count = len(plan_data['pages'])
        assert actual_page_count == expected_page_count, \
            f"Expected {expected_page_count} pages but got {actual_page_count} pages in plan"
        
        # Verify that each page has the required structure
        for i, page in enumerate(plan_data['pages']):
            assert 'name' in page, f"Page {i} missing 'name' field"
            assert 'route' in page, f"Page {i} missing 'route' field"
            assert 'components' in page, f"Page {i} missing 'components' field"
            assert 'description' in page, f"Page {i} missing 'description' field"
            
            # Verify that the page name is reasonable
            assert isinstance(page['name'], str) and len(page['name']) > 0, \
                f"Page {i} name should be a non-empty string"
            
            # Verify that the route is reasonable
            assert isinstance(page['route'], str) and page['route'].startswith('/'), \
                f"Page {i} route should be a string starting with '/'"
        
        # Verify that routing configuration matches the page count
        assert len(plan_data['routing']['routes']) == expected_page_count, \
            f"Expected {expected_page_count} routes but got {len(plan_data['routing']['routes'])}"
        
        # Verify that all pages have corresponding routes
        page_names_in_plan = {page['name'] for page in plan_data['pages']}
        route_components = {route['component'] for route in plan_data['routing']['routes']}
        assert page_names_in_plan == route_components, \
            f"Page names {page_names_in_plan} don't match route components {route_components}"


if __name__ == "__main__":
    pytest.main([__file__])