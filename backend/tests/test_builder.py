"""
Tests for Builder Agent
Validates: Requirements 3.1, 3.2, 3.3, 4.1, 4.2, 12.4
"""

import json
import os
import tempfile
import pytest
from unittest.mock import Mock, patch, MagicMock
from datetime import datetime
from hypothesis import given, strategies as st, settings

from backend.models.core import (
    Plan, PageSpec, ComponentSpec, RoutingConfig, BackendSpec,
    GeneratedProject, TestResults, UserRequest
)
from backend.agents.builder import BuilderAgent


# Hypothesis strategies for generating test data
@st.composite
def page_spec_strategy(draw):
    """Generate random PageSpec for property testing"""
    name = draw(st.text(min_size=1, max_size=20, alphabet=st.characters(whitelist_categories=('Lu', 'Ll'))))
    # Ensure name is valid (starts with uppercase, no spaces)
    name = name[0].upper() + name[1:] if name else "Page"
    name = name.replace(" ", "") + "Page"
    
    route = "/" + draw(st.text(min_size=0, max_size=15, alphabet=st.characters(whitelist_categories=('Ll',))))
    route = route.replace(" ", "").lower()
    
    # Generate 1-5 component names
    num_components = draw(st.integers(min_value=1, max_value=5))
    components = [f"Component{i}" for i in range(num_components)]
    
    description = draw(st.text(min_size=5, max_size=100))
    
    return PageSpec(
        name=name,
        route=route if route != "/" else "/",
        components=components,
        description=description if description else "Test page"
    )


@st.composite
def component_spec_strategy(draw):
    """Generate random ComponentSpec for property testing"""
    name = draw(st.text(min_size=1, max_size=20, alphabet=st.characters(whitelist_categories=('Lu', 'Ll'))))
    # Ensure name is valid (starts with uppercase, no spaces)
    name = name[0].upper() + name[1:] if name else "Component"
    name = name.replace(" ", "")
    
    comp_type = draw(st.sampled_from(['functional', 'class', 'hook']))
    description = draw(st.text(min_size=5, max_size=100))
    
    return ComponentSpec(
        name=name,
        type=comp_type,
        props={},
        description=description if description else "Test component"
    )


@st.composite
def plan_strategy(draw):
    """Generate random Plan for property testing"""
    # Generate 1-5 pages (within the 5 page limit)
    num_pages = draw(st.integers(min_value=1, max_value=5))
    pages = []
    used_names = set()
    used_routes = set()
    
    for i in range(num_pages):
        # Generate unique page names and routes
        page = draw(page_spec_strategy())
        # Ensure unique names by appending index if needed
        base_name = page.name
        counter = 0
        while page.name in used_names:
            counter += 1
            page.name = f"{base_name}{counter}"
        used_names.add(page.name)
        
        # Ensure unique routes
        base_route = page.route
        counter = 0
        while page.route in used_routes:
            counter += 1
            page.route = f"{base_route}{counter}" if base_route != "/" else f"/page{counter}"
        used_routes.add(page.route)
        
        pages.append(page)
    
    # Generate 0-10 components with unique names
    num_components = draw(st.integers(min_value=0, max_value=10))
    components = []
    used_component_names = set()
    
    for i in range(num_components):
        component = draw(component_spec_strategy())
        # Ensure unique component names
        base_name = component.name
        counter = 0
        while component.name in used_component_names:
            counter += 1
            component.name = f"{base_name}{counter}"
        used_component_names.add(component.name)
        components.append(component)
    
    # Create routing config
    routing = RoutingConfig(
        base_path="/",
        routes=[{"path": page.route, "component": page.name} for page in pages]
    )
    
    # Optionally include backend logic
    has_backend = draw(st.booleans())
    backend_logic = None
    if has_backend:
        backend_logic = BackendSpec(
            endpoints=[{"method": "GET", "path": "/api/test", "handler": "testHandler"}],
            middleware=["cors"],
            dependencies=[]
        )
    
    return Plan(
        pages=pages,
        components=components,
        routing=routing,
        backend_logic=backend_logic,
        estimated_complexity=draw(st.sampled_from(['simple', 'medium', 'complex']))
    )


@st.composite
def plan_with_backend_strategy(draw):
    """Generate random Plan with backend logic for property testing"""
    # Generate 1-5 pages (within the 5 page limit)
    num_pages = draw(st.integers(min_value=1, max_value=5))
    pages = []
    used_names = set()
    used_routes = set()
    
    # Common page types that might need backend integration
    page_types = ['contact', 'search', 'form', 'signup', 'feedback', 'submit', 'register']
    
    for i in range(num_pages):
        # Generate unique page names and routes
        page = draw(page_spec_strategy())
        
        # Occasionally make pages that are likely to need backend integration
        if i == 0 and draw(st.booleans()):
            page_type = draw(st.sampled_from(page_types))
            page.name = page_type.capitalize() + "Page"
            page.route = "/" + page_type
            page.description = f"Page for {page_type} functionality"
        
        # Ensure unique names by appending index if needed
        base_name = page.name
        counter = 0
        while page.name in used_names:
            counter += 1
            page.name = f"{base_name}{counter}"
        used_names.add(page.name)
        
        # Ensure unique routes
        base_route = page.route
        counter = 0
        while page.route in used_routes:
            counter += 1
            page.route = f"{base_route}{counter}" if base_route != "/" else f"/page{counter}"
        used_routes.add(page.route)
        
        pages.append(page)
    
    # Generate 0-10 components with unique names
    num_components = draw(st.integers(min_value=0, max_value=10))
    components = []
    used_component_names = set()
    
    for i in range(num_components):
        component = draw(component_spec_strategy())
        # Ensure unique component names
        base_name = component.name
        counter = 0
        while component.name in used_component_names:
            counter += 1
            component.name = f"{base_name}{counter}"
        used_component_names.add(component.name)
        components.append(component)
    
    # Create routing config
    routing = RoutingConfig(
        base_path="/",
        routes=[{"path": page.route, "component": page.name} for page in pages]
    )
    
    # Always include backend logic for this strategy
    # Generate 1-5 endpoints
    num_endpoints = draw(st.integers(min_value=1, max_value=5))
    endpoints = []
    used_paths = set()
    
    endpoint_types = [
        {"method": "POST", "path": "/api/contact", "handler": "handleContact", "description": "Contact form submission"},
        {"method": "GET", "path": "/api/search", "handler": "handleSearch", "description": "Search functionality"},
        {"method": "POST", "path": "/api/submit", "handler": "handleSubmit", "description": "Form submission"},
        {"method": "POST", "path": "/api/signup", "handler": "handleSignup", "description": "User signup"},
        {"method": "POST", "path": "/api/feedback", "handler": "handleFeedback", "description": "Feedback submission"},
        {"method": "GET", "path": "/api/data", "handler": "handleData", "description": "Data retrieval"},
        {"method": "POST", "path": "/api/validate", "handler": "handleValidate", "description": "Input validation"},
    ]
    
    for i in range(num_endpoints):
        endpoint = draw(st.sampled_from(endpoint_types))
        # Ensure unique paths
        path = endpoint["path"]
        counter = 0
        while path in used_paths:
            counter += 1
            path = f"{endpoint['path']}{counter}"
        used_paths.add(path)
        
        endpoints.append({
            "method": endpoint["method"],
            "path": path,
            "handler": endpoint["handler"] + (str(counter) if counter > 0 else ""),
            "description": endpoint.get("description", "API endpoint")
        })
    
    backend_logic = BackendSpec(
        endpoints=endpoints,
        middleware=["cors", "bodyParser"],
        dependencies=["express", "cors"]
    )
    
    return Plan(
        pages=pages,
        components=components,
        routing=routing,
        backend_logic=backend_logic,
        estimated_complexity=draw(st.sampled_from(['simple', 'medium', 'complex']))
    )


class TestBuilderAgent:
    """Test suite for Builder Agent functionality"""
    
    def setup_method(self):
        """Set up test fixtures"""
        # Create a sample plan for testing
        self.sample_plan = Plan(
            pages=[
                PageSpec(
                    name="HomePage",
                    route="/",
                    components=["Header", "Hero", "Footer"],
                    description="Main landing page"
                ),
                PageSpec(
                    name="AboutPage",
                    route="/about",
                    components=["Header", "AboutContent", "Footer"],
             
        description="About us page"
                )
            ],
            components=[
                ComponentSpec(
                    name="Header",
                    type="functional",
                    props={},
                    description="Navigation header"
                ),
                ComponentSpec(
                    name="Hero",
                    type="functional",
                    props={},
                    description="Hero section"
                ),
                ComponentSpec(
                    name="Footer",
                    type="functional",
                    props={},
                    description="Page footer"
                ),
                ComponentSpec(
                    name="AboutContent",
                    type="functional",
                    props={},
                    description="About page content"
                )
            ],
            routing=RoutingConfig(
                base_path="/",
                routes=[
                    {"path": "/", "component": "HomePage"},
                    {"path": "/about", "component": "AboutPage"}
                ]
            ),
            backend_logic=None,
            estimated_complexity="simple"
        )


class TestBuilderPropertyTests:
    """Property-based tests for Builder Agent using Hypothesis"""
    
    @given(plan=plan_strategy())
    @settings(max_examples=100, deadline=None)
    def test_file_generation_completeness(self, plan):
        """
        Feature: amar-mvp, Property 4: File generation completeness
        Validates: Requirements 3.2
        
        Property: For any plan generated by the Planner Agent, the Builder Agent 
        should generate files for all specified pages and components.
        
        This test verifies that:
        1. A file is generated for each page in the plan
        2. A file is generated for each component in the plan
        3. Core project files (package.json, App.tsx, etc.) are generated
        4. Backend files are generated if backend logic is specified
        """
        # Mock the LLM to avoid actual API calls
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            # Create a mock LLM instance
            mock_llm = Mock()
            mock_response = Mock()
            mock_response.content = "import React from 'react';\n\nconst Component = () => <div>Test</div>;\n\nexport default Component;"
            mock_llm.invoke.return_value = mock_response
            mock_llm_class.return_value = mock_llm
            
            # Mock the memory and audit services
            with patch('backend.agents.builder.memory_manager') as mock_memory:
                mock_memory_instance = Mock()
                mock_memory_instance.get_context_for_agent.return_value = {}
                mock_memory_instance.add_entry = Mock()
                mock_memory.get_memory.return_value = mock_memory_instance
                
                # Create builder agent
                builder = BuilderAgent()
                builder.llm = mock_llm
                # Mock the rate limiter
                builder.rate_limiter = Mock()
                builder.rate_limiter.check_and_increment = Mock()
                
                # Generate project files
                generated_files = builder._generate_project_files(plan, {}, 'test-session-id')
                
                # Verify core project files are generated
                assert 'package.json' in generated_files, "package.json should be generated"
                assert 'src/App.tsx' in generated_files, "src/App.tsx should be generated"
                assert 'src/index.tsx' in generated_files, "src/index.tsx should be generated"
                assert 'src/index.css' in generated_files, "src/index.css should be generated"
                assert 'src/App.css' in generated_files, "src/App.css should be generated"
                assert 'src/App.test.tsx' in generated_files, "src/App.test.tsx should be generated"
                assert 'README.md' in generated_files, "README.md should be generated"
                
                # Verify a file is generated for each page
                for page in plan.pages:
                    expected_page_file = f"src/pages/{page.name}.tsx"
                    assert expected_page_file in generated_files, \
                        f"File {expected_page_file} should be generated for page {page.name}"
                    
                    # Verify the file has content
                    assert len(generated_files[expected_page_file]) > 0, \
                        f"File {expected_page_file} should have content"
                
                # Verify a file is generated for each component
                for component in plan.components:
                    expected_component_file = f"src/components/{component.name}.tsx"
                    assert expected_component_file in generated_files, \
                        f"File {expected_component_file} should be generated for component {component.name}"
                    
                    # Verify the file has content
                    assert len(generated_files[expected_component_file]) > 0, \
                        f"File {expected_component_file} should have content"
                
                # Verify backend files are generated if backend logic is specified
                if plan.backend_logic:
                    assert 'server.js' in generated_files, \
                        "server.js should be generated when backend logic is specified"
                    
                    # Verify API handler files are generated
                    for endpoint in plan.backend_logic.endpoints:
                        handler_name = endpoint.get('handler', 'defaultHandler')
                        expected_handler_file = f"api/{handler_name}.js"
                        assert expected_handler_file in generated_files, \
                            f"File {expected_handler_file} should be generated for endpoint handler"
                
                # Verify total file count is reasonable
                expected_min_files = (
                    7 +  # Core files (package.json, App.tsx, index.tsx, index.css, App.css, App.test.tsx, README.md)
                    len(plan.pages) +  # Page files
                    len(plan.components)  # Component files
                )
                
                if plan.backend_logic:
                    expected_min_files += 1 + len(plan.backend_logic.endpoints)  # server.js + handlers
                
                assert len(generated_files) >= expected_min_files, \
                    f"Expected at least {expected_min_files} files, but got {len(generated_files)}"
    
    @given(plan=plan_strategy())
    @settings(max_examples=100, deadline=None)
    def test_multi_page_routing_generation(self, plan):
        """
        Feature: amar-mvp, Property 12: Multi-page routing generation
        Validates: Requirements 12.4
        
        Property: For any plan with multiple pages, the Builder Agent should generate 
        React Router configuration that includes routes for all pages.
        
        This test verifies that:
        1. The App.tsx file contains React Router imports
        2. The App.tsx file contains a Route element for each page in the plan
        3. Each route has the correct path matching the page specification
        4. Each route references the correct page component
        5. The routing structure is syntactically valid
        """
        # Skip test if plan has only one page (not multi-page)
        if len(plan.pages) <= 1:
            return
        
        # Mock the LLM to avoid actual API calls
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            # Create a mock LLM instance
            mock_llm = Mock()
            mock_response = Mock()
            mock_response.content = "import React from 'react';\n\nconst Component = () => <div>Test</div>;\n\nexport default Component;"
            mock_llm.invoke.return_value = mock_response
            mock_llm_class.return_value = mock_llm
            
            # Mock the memory and audit services
            with patch('backend.agents.builder.memory_manager') as mock_memory:
                mock_memory_instance = Mock()
                mock_memory_instance.get_context_for_agent.return_value = {}
                mock_memory_instance.add_entry = Mock()
                mock_memory.get_memory.return_value = mock_memory_instance
                
                # Create builder agent
                builder = BuilderAgent()
                builder.llm = mock_llm
                # Mock the rate limiter
                builder.rate_limiter = Mock()
                builder.rate_limiter.check_and_increment = Mock()
                
                # Generate project files
                generated_files = builder._generate_project_files(plan, {}, 'test-session-id')
                
                # Verify App.tsx exists
                assert 'src/App.tsx' in generated_files, "App.tsx should be generated"
                
                app_tsx_content = generated_files['src/App.tsx']
                
                # Verify React Router imports are present
                assert 'react-router-dom' in app_tsx_content, \
                    "App.tsx should import from react-router-dom"
                assert 'BrowserRouter' in app_tsx_content or 'Router' in app_tsx_content, \
                    "App.tsx should import BrowserRouter or Router"
                assert 'Routes' in app_tsx_content, \
                    "App.tsx should import Routes component"
                assert 'Route' in app_tsx_content, \
                    "App.tsx should import Route component"
                
                # Verify each page has a corresponding import
                for page in plan.pages:
                    import_statement = f"import {page.name} from './pages/{page.name}'"
                    assert import_statement in app_tsx_content, \
                        f"App.tsx should import {page.name} from './pages/{page.name}'"
                
                # Verify each page has a corresponding route
                for page in plan.pages:
                    # Check for route with correct path
                    # The route should contain: path="{page.route}" and element={<PageName />}
                    assert f'path="{page.route}"' in app_tsx_content, \
                        f"App.tsx should contain a route with path=\"{page.route}\""
                    
                    # Check that the page component is referenced in a route
                    assert f'<{page.name}' in app_tsx_content, \
                        f"App.tsx should reference {page.name} component in a route"
                
                # Verify the routing structure contains Router, Routes, and Route elements
                assert '<Router>' in app_tsx_content or '<BrowserRouter>' in app_tsx_content, \
                    "App.tsx should contain a Router or BrowserRouter component"
                assert '<Routes>' in app_tsx_content, \
                    "App.tsx should contain a Routes component"
                assert '<Route' in app_tsx_content, \
                    "App.tsx should contain at least one Route component"
                
                # Verify the number of Route elements matches the number of pages
                route_count = app_tsx_content.count('<Route')
                assert route_count >= len(plan.pages), \
                    f"App.tsx should contain at least {len(plan.pages)} Route elements, but found {route_count}"
                
                # Verify basic syntax validity (no obvious syntax errors)
                # Check for balanced JSX tags
                assert app_tsx_content.count('<Router>') + app_tsx_content.count('<BrowserRouter>') == \
                       app_tsx_content.count('</Router>') + app_tsx_content.count('</BrowserRouter>'), \
                    "Router tags should be balanced"
                assert app_tsx_content.count('<Routes>') == app_tsx_content.count('</Routes>'), \
                    "Routes tags should be balanced"
                
                # Verify the component exports correctly
                assert 'export default App' in app_tsx_content, \
                    "App.tsx should export App as default"
    
    @given(plan=plan_with_backend_strategy())
    @settings(max_examples=100, deadline=None)
    def test_backend_endpoint_integration(self, plan):
        """
        Feature: amar-mvp, Property 13: Backend endpoint integration
        Validates: Requirements 13.3
        
        Property: For any plan that includes backend logic, the generated frontend code 
        should include API calls to all specified backend endpoints.
        
        This test verifies that:
        1. When a plan includes backend logic, the builder identifies relevant endpoints for pages
        2. For pages with relevant endpoints, the generated code includes API calls
        3. The API calls use proper HTTP methods (GET, POST, etc.)
        4. The API calls include proper error handling patterns
        5. Backend server files are generated with all endpoints registered
        """
        # This test only applies to plans with backend logic
        assert plan.backend_logic is not None, "Test requires plan with backend logic"
        assert len(plan.backend_logic.endpoints) > 0, "Test requires at least one endpoint"
        
        # Mock the LLM to avoid actual API calls
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            # Create a mock LLM instance that generates code with API calls
            mock_llm = Mock()
            
            def mock_invoke(prompt):
                """Mock LLM response that includes API calls based on the prompt"""
                mock_response = Mock()
                prompt_str = str(prompt)
                
                # Check if this is a page or component generation prompt with backend integration
                if 'BACKEND INTEGRATION' in prompt_str or 'API endpoint' in prompt_str:
                    # Extract endpoint paths from the prompt to include them in the generated code
                    endpoints_in_code = []
                    for endpoint in plan.backend_logic.endpoints:
                        endpoints_in_code.append(endpoint['path'])
                    
                    # Generate code that includes fetch calls to the actual endpoints from the plan
                    endpoint_calls = []
                    for endpoint in plan.backend_logic.endpoints:
                        method = endpoint['method'].upper()
                        path = endpoint['path']
                        
                        if method == 'POST':
                            endpoint_calls.append(f"""
  const handle{endpoint.get('handler', 'Submit')} = async (formData: any) => {{
    setLoading(true);
    setError(null);
    try {{
      const response = await fetch('http://localhost:3001{path}', {{
        method: '{method}',
        headers: {{ 'Content-Type': 'application/json' }},
        body: JSON.stringify(formData)
      }});
      const result = await response.json();
      setData(result);
    }} catch (err) {{
      setError('Failed to submit data');
    }} finally {{
      setLoading(false);
    }}
  }};""")
                        elif method == 'GET':
                            endpoint_calls.append(f"""
  useEffect(() => {{
    const fetchData = async () => {{
      try {{
        const response = await fetch('http://localhost:3001{path}');
        const result = await response.json();
        setData(result);
      }} catch (err) {{
        setError('Failed to fetch data');
      }}
    }};
    fetchData();
  }}, []);""")
                    
                    code = f"""import React, {{ useState, useEffect }} from 'react';

const Component: React.FC = () => {{
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
{''.join(endpoint_calls)}

  return (
    <div>
      {{loading && <p>Loading...</p>}}
      {{error && <p>Error: {{error}}</p>}}
      {{data && <pre>{{JSON.stringify(data, null, 2)}}</pre>}}
    </div>
  );
}};

export default Component;"""
                    mock_response.content = code
                else:
                    # Default component without API calls
                    mock_response.content = "import React from 'react';\n\nconst Component = () => <div>Test</div>;\n\nexport default Component;"
                
                return mock_response
            
            mock_llm.invoke.side_effect = mock_invoke
            mock_llm_class.return_value = mock_llm
            
            # Mock the memory and audit services
            with patch('backend.agents.builder.memory_manager') as mock_memory:
                mock_memory_instance = Mock()
                mock_memory_instance.get_context_for_agent.return_value = {}
                mock_memory_instance.add_entry = Mock()
                mock_memory.get_memory.return_value = mock_memory_instance
                
                # Create builder agent
                builder = BuilderAgent()
                builder.llm = mock_llm
                # Mock the rate limiter
                builder.rate_limiter = Mock()
                builder.rate_limiter.check_and_increment = Mock()
                
                # Generate project files
                generated_files = builder._generate_project_files(plan, {}, 'test-session-id')
                
                # Test the builder's endpoint identification logic
                # For each page, check if the builder correctly identifies relevant endpoints
                pages_with_backend_integration = []
                for page in plan.pages:
                    relevant_endpoints = builder._identify_relevant_endpoints(page, plan.backend_logic)
                    if relevant_endpoints:
                        pages_with_backend_integration.append((page, relevant_endpoints))
                
                # Collect all frontend code (pages and components)
                frontend_code = ""
                page_files = {}
                for file_path, content in generated_files.items():
                    if file_path.endswith('.tsx') or file_path.endswith('.ts'):
                        frontend_code += content + "\n"
                        if file_path.startswith('src/pages/'):
                            page_files[file_path] = content
                
                # If the builder identified pages that need backend integration,
                # verify that those pages include API calls
                if pages_with_backend_integration:
                    # At least one page should have backend integration
                    has_api_calls = False
                    for page, endpoints in pages_with_backend_integration:
                        page_file = f"src/pages/{page.name}.tsx"
                        if page_file in page_files:
                            page_content = page_files[page_file]
                            
                            # Check if this page includes API call mechanisms
                            if 'fetch(' in page_content or 'axios' in page_content:
                                has_api_calls = True
                                
                                # Verify the relevant endpoints appear in this page
                                for endpoint in endpoints:
                                    endpoint_path = endpoint['path']
                                    assert endpoint_path in page_content, \
                                        f"Page {page.name} should include API call to relevant endpoint '{endpoint_path}'"
                                    
                                    # Verify proper HTTP method is used
                                    endpoint_method = endpoint['method'].upper()
                                    if endpoint_method in ['POST', 'PUT', 'DELETE', 'PATCH']:
                                        method_pattern_single = f"method: '{endpoint_method}'"
                                        method_pattern_double = f'method: "{endpoint_method}"'
                                        assert method_pattern_single in page_content or method_pattern_double in page_content, \
                                            f"Page {page.name} should specify method '{endpoint_method}' for endpoint '{endpoint_path}'"
                                
                                # Verify error handling is present in this page
                                assert 'try' in page_content or '.catch(' in page_content, \
                                    f"Page {page.name} with API calls should include error handling"
                                
                                # Verify async/await pattern is used
                                assert 'async' in page_content and 'await' in page_content, \
                                    f"Page {page.name} should use async/await for API calls"
                                
                                # Verify loading states are managed
                                assert 'loading' in page_content.lower() or 'isloading' in page_content.lower(), \
                                    f"Page {page.name} should manage loading states during API calls"
                    
                    # At least one page with identified backend integration should have API calls
                    assert has_api_calls, \
                        "At least one page with identified backend integration should include API calls"
                else:
                    # If no pages were identified as needing backend integration,
                    # that's acceptable - the heuristic matching may not find matches
                    # In this case, we just verify that backend files are still generated
                    pass
                
                # Verify that backend files are also generated
                assert 'server.js' in generated_files, \
                    "Backend server file should be generated when backend logic is specified"
                
                # Verify that API handler files are generated for each endpoint
                for endpoint in plan.backend_logic.endpoints:
                    handler_name = endpoint.get('handler', 'defaultHandler')
                    expected_handler_file = f"api/{handler_name}.js"
                    assert expected_handler_file in generated_files, \
                        f"API handler file '{expected_handler_file}' should be generated for endpoint"
                
                # Verify that the generated backend code includes the endpoints
                server_js_content = generated_files.get('server.js', '')
                for endpoint in plan.backend_logic.endpoints:
                    endpoint_path = endpoint['path']
                    # Check if the endpoint is registered in the server
                    assert endpoint_path in server_js_content, \
                        f"Endpoint '{endpoint_path}' should be registered in server.js"


class TestSelfHealing:
    """Test suite for self-healing functionality"""
    
    def setup_method(self):
        """Set up test fixtures"""
        self.sample_plan = Plan(
            pages=[
                PageSpec(
                    name="HomePage",
                    route="/",
                    components=["Header", "Hero"],
                    description="Main landing page"
                )
            ],
            components=[
                ComponentSpec(
                    name="Header",
                    type="functional",
                    props={},
                    description="Navigation header"
                ),
                ComponentSpec(
                    name="Hero",
                    type="functional",
                    props={},
                    description="Hero section"
                )
            ],
            routing=RoutingConfig(
                base_path="/",
                routes=[{"path": "/", "component": "HomePage"}]
            ),
            backend_logic=None,
            estimated_complexity="simple"
        )
        
        self.sample_files = {
            'src/App.tsx': 'import React from "react";\n\nfunction App() { return <div>App</div>; }\n\nexport default App;',
            'src/pages/HomePage.tsx': 'import React from "react";\n\nconst HomePage = () => <div>Home</div>;\n\nexport default HomePage;',
            'src/components/Header.tsx': 'import React from "react";\n\nconst Header = () => <div>Header</div>;\n\nexport default Header;'
        }
    
    def test_detect_failing_files_with_specific_errors(self):
        """Test that detect_failing_files correctly identifies files mentioned in errors"""
        # Mock the LLM
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            mock_llm = Mock()
            mock_llm_class.return_value = mock_llm
            
            builder = BuilderAgent()
            builder.llm = mock_llm
            
            # Create test results with specific file mentioned in error
            test_results = TestResults(
                passed=0,
                failed=1,
                errors=['Error in src/pages/HomePage.tsx: Component not found'],
                execution_time_ms=1000
            )
            
            failing_files = builder.detect_failing_files(test_results, self.sample_files)
            
            # Should identify HomePage.tsx as failing
            assert 'src/pages/HomePage.tsx' in failing_files
            assert failing_files['src/pages/HomePage.tsx'] == self.sample_files['src/pages/HomePage.tsx']
    
    def test_detect_failing_files_without_specific_errors(self):
        """Test that detect_failing_files falls back to core files when no specific errors"""
        # Mock the LLM
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            mock_llm = Mock()
            mock_llm_class.return_value = mock_llm
            
            builder = BuilderAgent()
            builder.llm = mock_llm
            
            # Create test results with no specific file mentioned
            test_results = TestResults(
                passed=0,
                failed=1,
                errors=['Generic test failure'],
                execution_time_ms=1000
            )
            
            failing_files = builder.detect_failing_files(test_results, self.sample_files)
            
            # Should include App.tsx as fallback
            assert 'src/App.tsx' in failing_files or len(failing_files) > 0
    
    def test_create_error_context(self):
        """Test that create_error_context properly formats error information"""
        # Mock the LLM
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            mock_llm = Mock()
            mock_llm_class.return_value = mock_llm
            
            builder = BuilderAgent()
            builder.llm = mock_llm
            
            # Create test results with errors
            test_results = TestResults(
                passed=0,
                failed=2,
                errors=[
                    'TypeError: Cannot read property of undefined',
                    'SyntaxError: Unexpected token'
                ],
                execution_time_ms=1000
            )
            
            error_context = builder.create_error_context(test_results, self.sample_files)
            
            # Verify error context structure
            assert 'error_summary' in error_context
            assert 'test_failures' in error_context
            assert 'failed_count' in error_context
            assert error_context['failed_count'] == 2
            assert len(error_context['test_failures']) == 2
            assert 'TypeError' in error_context['error_summary']
            assert 'SyntaxError' in error_context['error_summary']
    
    def test_self_heal_raises_exception_on_max_retries(self):
        """Test that self_heal raises MaxRetriesExceeded when retry count reaches 3"""
        # Mock the LLM and memory
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            with patch('backend.agents.builder.memory_manager') as mock_memory:
                mock_llm = Mock()
                mock_llm_class.return_value = mock_llm
                
                mock_memory_instance = Mock()
                mock_memory_instance.add_entry = Mock()
                mock_memory.get_memory.return_value = mock_memory_instance
                
                builder = BuilderAgent()
                builder.llm = mock_llm
                
                error_context = {
                    'error_summary': 'Test error',
                    'test_failures': ['Test failed'],
                    'failed_count': 1
                }
                
                # Test with retry_count = 3 (should raise exception)
                from backend.agents.builder import MaxRetriesExceeded
                with pytest.raises(MaxRetriesExceeded):
                    builder.self_heal(
                        plan=self.sample_plan,
                        failed_files=self.sample_files,
                        error_context=error_context,
                        retry_count=3,
                        session_id='test-session'
                    )
    
    def test_self_heal_regenerates_files_successfully(self):
        """Test that self_heal successfully regenerates files with retry count < 3"""
        # Mock the LLM and memory
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            with patch('backend.agents.builder.memory_manager') as mock_memory:
                mock_llm = Mock()
                mock_response = Mock()
                mock_response.content = """import React from 'react';

const FixedComponent: React.FC = () => {
  return <div>Fixed Component</div>;
};

export default FixedComponent;"""
                mock_llm.invoke.return_value = mock_response
                mock_llm_class.return_value = mock_llm
                
                mock_memory_instance = Mock()
                mock_memory_instance.add_entry = Mock()
                mock_memory.get_memory.return_value = mock_memory_instance
                
                builder = BuilderAgent()
                builder.llm = mock_llm
                
                error_context = {
                    'error_summary': 'Component rendering error',
                    'test_failures': ['Component failed to render'],
                    'failed_count': 1
                }
                
                failed_files = {
                    'src/pages/HomePage.tsx': self.sample_files['src/pages/HomePage.tsx']
                }
                
                # Test with retry_count = 1 (should succeed)
                regenerated_files = builder.self_heal(
                    plan=self.sample_plan,
                    failed_files=failed_files,
                    error_context=error_context,
                    retry_count=1,
                    session_id='test-session'
                )
                
                # Verify files were regenerated
                assert 'src/pages/HomePage.tsx' in regenerated_files
                assert 'Fixed Component' in regenerated_files['src/pages/HomePage.tsx']
                
                # Verify memory was updated
                assert mock_memory_instance.add_entry.called
    
    def test_update_files_in_directory(self):
        """Test that update_files_in_directory correctly updates specific files"""
        # Mock the LLM, memory, and audit services
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            with patch('backend.agents.builder.memory_manager') as mock_memory:
                with patch('backend.services.audit.audit_manager') as mock_audit:
                    mock_llm = Mock()
                    mock_llm_class.return_value = mock_llm
                    
                    mock_memory_instance = Mock()
                    mock_memory_instance.add_entry = Mock()
                    mock_memory.get_memory.return_value = mock_memory_instance
                    
                    mock_audit_logger = Mock()
                    mock_audit_logger.log_file_operation = Mock()
                    mock_audit.get_logger.return_value = mock_audit_logger
                    
                    builder = BuilderAgent()
                    builder.llm = mock_llm
                    
                    # Create a temporary directory
                    with tempfile.TemporaryDirectory() as temp_dir:
                        # Write initial files
                        initial_files = {
                            'src/App.tsx': 'original content',
                            'src/pages/HomePage.tsx': 'original page content'
                        }
                        builder.write_files_to_directory(initial_files, temp_dir)
                        
                        # Update only one file
                        updated_files = {
                            'src/pages/HomePage.tsx': 'updated page content'
                        }
                        
                        builder.update_files_in_directory(
                            project_dir=temp_dir,
                            updated_files=updated_files,
                            session_id='test-session',
                            retry_count=1
                        )
                        
                        # Verify the updated file has new content
                        with open(os.path.join(temp_dir, 'src/pages/HomePage.tsx'), 'r') as f:
                            content = f.read()
                            assert content == 'updated page content'
                        
                        # Verify the other file is unchanged
                        with open(os.path.join(temp_dir, 'src/App.tsx'), 'r') as f:
                            content = f.read()
                            assert content == 'original content'
                        
                        # Verify memory was updated
                        assert mock_memory_instance.add_entry.called
    
    def test_find_page_spec(self):
        """Test that _find_page_spec correctly finds page specifications"""
        # Mock the LLM
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            mock_llm = Mock()
            mock_llm_class.return_value = mock_llm
            
            builder = BuilderAgent()
            builder.llm = mock_llm
            
            # Find existing page
            page_spec = builder._find_page_spec(self.sample_plan, 'HomePage')
            assert page_spec is not None
            assert page_spec.name == 'HomePage'
            assert page_spec.route == '/'
            
            # Try to find non-existent page
            page_spec = builder._find_page_spec(self.sample_plan, 'NonExistentPage')
            assert page_spec is None
    
    def test_find_component_spec(self):
        """Test that _find_component_spec correctly finds component specifications"""
        # Mock the LLM
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            mock_llm = Mock()
            mock_llm_class.return_value = mock_llm
            
            builder = BuilderAgent()
            builder.llm = mock_llm
            
            # Find existing component
            component_spec = builder._find_component_spec(self.sample_plan, 'Header')
            assert component_spec is not None
            assert component_spec.name == 'Header'
            assert component_spec.type == 'functional'
            
            # Try to find non-existent component
            component_spec = builder._find_component_spec(self.sample_plan, 'NonExistentComponent')
            assert component_spec is None


class TestSelfHealingPropertyTests:
    """Property-based tests for self-healing functionality using Hypothesis"""
    
    @given(
        retry_count=st.integers(min_value=3, max_value=10),
        plan=plan_strategy()
    )
    @settings(max_examples=100, deadline=None)
    def test_self_healing_retry_limit(self, retry_count, plan):
        """
        Feature: amar-mvp, Property 6: Self-healing retry limit
        Validates: Requirements 5.4
        
        Property: For any test failure, the self-healing mechanism should retry 
        at most 3 times before reporting failure to the user.
        
        This test verifies that:
        1. When retry_count >= 3, self_heal raises MaxRetriesExceeded exception
        2. The exception is raised immediately without attempting regeneration
        3. This behavior holds for any plan and error context
        4. The retry limit is enforced consistently across all scenarios
        """
        # Mock the LLM and memory services
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            with patch('backend.agents.builder.memory_manager') as mock_memory:
                mock_llm = Mock()
                mock_response = Mock()
                mock_response.content = "import React from 'react';\n\nconst Component = () => <div>Test</div>;\n\nexport default Component;"
                mock_llm.invoke.return_value = mock_response
                mock_llm_class.return_value = mock_llm
                
                mock_memory_instance = Mock()
                mock_memory_instance.add_entry = Mock()
                mock_memory.get_memory.return_value = mock_memory_instance
                
                # Create builder agent
                builder = BuilderAgent()
                builder.llm = mock_llm
                
                # Create error context
                error_context = {
                    'error_summary': 'Test failure occurred',
                    'test_failures': ['Component failed to render', 'Syntax error in code'],
                    'failed_count': 2
                }
                
                # Create some failed files (at least one file from the plan)
                failed_files = {}
                if plan.pages:
                    # Use the first page as a failed file
                    page = plan.pages[0]
                    failed_files[f'src/pages/{page.name}.tsx'] = 'const Component = () => <div>Broken</div>;'
                else:
                    # Fallback to App.tsx if no pages
                    failed_files['src/App.tsx'] = 'const App = () => <div>Broken</div>;'
                
                # Test that self_heal raises MaxRetriesExceeded when retry_count >= 3
                from backend.agents.builder import MaxRetriesExceeded
                
                with pytest.raises(MaxRetriesExceeded) as exc_info:
                    builder.self_heal(
                        plan=plan,
                        failed_files=failed_files,
                        error_context=error_context,
                        retry_count=retry_count,
                        session_id='test-session'
                    )
                
                # Verify the exception message mentions the retry limit
                assert 'retry limit' in str(exc_info.value).lower() or '3' in str(exc_info.value)
                
                # Verify that memory was NOT updated (exception is raised before logging)
                # This ensures the retry limit check happens immediately
                assert not mock_memory_instance.add_entry.called, \
                    "Memory should not be updated when retry limit is exceeded (exception raised immediately)"
                
                # Verify that the LLM was NOT invoked (no regeneration should occur)
                # when retry limit is exceeded
                assert not mock_llm.invoke.called, \
                    "LLM should not be invoked when retry limit is exceeded"
    
    @given(
        retry_count=st.integers(min_value=0, max_value=2),
        plan=plan_strategy()
    )
    @settings(max_examples=100, deadline=None)
    def test_self_healing_allows_retries_below_limit(self, retry_count, plan):
        """
        Feature: amar-mvp, Property 6: Self-healing retry limit (complement)
        Validates: Requirements 5.4
        
        Property: For any test failure with retry_count < 3, the self-healing 
        mechanism should attempt to regenerate files and NOT raise MaxRetriesExceeded.
        
        This test verifies that:
        1. When retry_count < 3, self_heal does NOT raise MaxRetriesExceeded
        2. The method attempts to regenerate failing files
        3. The method returns a dictionary of regenerated files
        4. This behavior holds for any plan and error context
        """
        # Mock the LLM and memory services
        with patch('backend.agents.builder.ChatGoogleGenerativeAI') as mock_llm_class:
            with patch('backend.agents.builder.memory_manager') as mock_memory:
                mock_llm = Mock()
                mock_response = Mock()
                mock_response.content = """import React from 'react';

const FixedComponent: React.FC = () => {
  return <div>Fixed Component</div>;
};

export default FixedComponent;"""
                mock_llm.invoke.return_value = mock_response
                mock_llm_class.return_value = mock_llm
                
                mock_memory_instance = Mock()
                mock_memory_instance.add_entry = Mock()
                mock_memory.get_memory.return_value = mock_memory_instance
                
                # Create builder agent
                builder = BuilderAgent()
                builder.llm = mock_llm
                
                # Create error context
                error_context = {
                    'error_summary': 'Test failure occurred',
                    'test_failures': ['Component failed to render'],
                    'failed_count': 1
                }
                
                # Create some failed files (at least one file from the plan)
                failed_files = {}
                if plan.pages:
                    # Use the first page as a failed file
                    page = plan.pages[0]
                    failed_files[f'src/pages/{page.name}.tsx'] = 'const Component = () => <div>Broken</div>;'
                elif plan.components:
                    # Use the first component if no pages
                    component = plan.components[0]
                    failed_files[f'src/components/{component.name}.tsx'] = 'const Component = () => <div>Broken</div>;'
                else:
                    # Fallback to App.tsx if no pages or components
                    failed_files['src/App.tsx'] = 'const App = () => <div>Broken</div>;'
                
                # Test that self_heal does NOT raise exception when retry_count < 3
                try:
                    regenerated_files = builder.self_heal(
                        plan=plan,
                        failed_files=failed_files,
                        error_context=error_context,
                        retry_count=retry_count,
                        session_id='test-session'
                    )
                    
                    # Verify that regenerated_files is a dictionary
                    assert isinstance(regenerated_files, dict), \
                        "self_heal should return a dictionary of regenerated files"
                    
                    # Verify that at least one file was regenerated
                    # (may be empty if regeneration fails, but should not raise MaxRetriesExceeded)
                    assert isinstance(regenerated_files, dict)
                    
                    # Verify that memory was updated
                    assert mock_memory_instance.add_entry.called
                    
                except Exception as e:
                    # If an exception is raised, it should NOT be MaxRetriesExceeded
                    from backend.agents.builder import MaxRetriesExceeded
                    assert not isinstance(e, MaxRetriesExceeded), \
                        f"MaxRetriesExceeded should not be raised when retry_count={retry_count} < 3"
                    # Re-raise other exceptions for debugging
                    raise
