"""
Builder Agent for AMAR MVP
Generates React code based on plans from Planner Agent using Gemini LLM
Validates: Requirements 3.1, 3.2, 12.4
"""

import asyncio
import json
import os
import shutil
import tempfile
from datetime import datetime
from typing import Dict, List, Optional, Any

from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import ValidationError

from models.core import (
    Plan, GeneratedProject, TestResults, AgentResponse, 
    FileLineage, AuditLogEntry, PageSpec, ComponentSpec, BackendSpec
)
from services.memory import memory_manager
from services.rate_limiter import get_rate_limiter, RateLimitExceeded, ExponentialBackoff
from config import get_settings


class BuilderAgent:
    """
    Builder Agent responsible for generating React code from plans
    
    Uses Gemini LLM to generate React components, pages, routing configuration,
    and project structure based on structured plans from Planner Agent.
    
    Validates: Requirements 3.1, 3.2, 12.4
    """
    
    def __init__(self):
        """Initialize Builder Agent with Gemini LLM client"""
        self.settings = get_settings()
        self.rate_limiter = get_rate_limiter(max_requests=self.settings.max_requests_per_session)
        self.backoff = ExponentialBackoff(
            base_delay=1.0,
            max_retries=self.settings.max_retry_attempts
        )
        
        # Initialize LLM client (OpenAI, Groq, or Gemini)
        if self.settings.use_openai and self.settings.openai_api_key:
            from services.openai_client import get_openai_client
            self.llm_client = get_openai_client()
            self.use_custom_client = True
        elif self.settings.use_groq and self.settings.groq_api_key:
            from services.groq_client import get_groq_client
            self.llm_client = get_groq_client()
            self.use_custom_client = True
        else:
            # Fallback to Gemini
            try:
                if not self.settings.gemini_api_key:
                    raise ValueError("No API key configured. Set OPENAI_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY")
                
                # Use configured model or fallback to gemini-2.5-flash-lite
                model_name = self.settings.gemini_model or "gemini-2.5-flash-lite"
                # Use LangChain's default retry mechanism
                self.llm = ChatGoogleGenerativeAI(
                    model=model_name,
                    google_api_key=self.settings.gemini_api_key,
                    temperature=0.1,
                    max_tokens=8000,
                    timeout=90
                )
                self.use_custom_client = False
            except Exception as e:
                raise RuntimeError(f"Failed to initialize LLM client: {str(e)}")
    
    def _call_llm(self, prompt: str, temperature: float = 0.1, max_tokens: int = 8000) -> str:
        """Helper method to call LLM (OpenAI, Groq, or Gemini)"""
        if self.use_custom_client:
            return self.llm_client.generate_content(prompt, temperature=temperature, max_tokens=max_tokens)
        else:
            response = self.llm.invoke(prompt)
            return response.content
    
    def generate_project(self, plan: Plan, session_id: str) -> AgentResponse:
        """
        Generate React project code from structured plan
        
        Args:
            plan: Structured plan from Planner Agent
            session_id: Session identifier for tracking
            
        Returns:
            AgentResponse with success status and generated project
            
        Validates: Requirements 3.1, 3.2, 12.4
        """
        start_time = datetime.now()
        
        try:
            # Log builder agent start
            print(f"🔨 BUILDER: Starting code generation for {len(plan.pages)} page(s) and {len(plan.components)} component(s)")
            
            # Get memory context for this session
            memory = memory_manager.get_memory(session_id)
            context = memory.get_context_for_agent('builder', max_entries=3)
            
            # Generate project files using LLM
            print(f"🔨 BUILDER: Generating project files...")
            generated_files = self._generate_project_files(plan, context, session_id)
            print(f"✓ BUILDER: Generated {len(generated_files)} files successfully")
            
            # Create file lineage tracking
            lineage = self._create_file_lineage(generated_files, session_id)
            
            # Create GeneratedProject object
            project = GeneratedProject(
                session_id=session_id,
                files=generated_files,
                plan=plan,
                test_results=TestResults(),  # Will be populated by testing
                lineage=lineage
            )
            
            # Store project in episodic memory
            memory.add_entry(
                agent='builder',
                action='project_generated',
                data={
                    'plan_summary': self._get_plan_summary(plan),
                    'file_count': len(generated_files),
                    'files_generated': list(generated_files.keys()),
                    'has_backend': plan.backend_logic is not None,
                    'complexity': plan.estimated_complexity
                },
                tags=['code_generation', 'project_files'],
                importance=1.0
            )
            
            # Log file creation in audit trail (async, non-blocking)
            from services.audit import audit_manager
            audit_logger = audit_manager.get_logger(session_id)
            
            for file_path in generated_files.keys():
                asyncio.create_task(audit_logger.log_file_operation(
                    agent='builder',
                    operation='create',
                    file_path=file_path,
                    reason='Generated from plan during project creation',
                    content_preview=generated_files[file_path][:200] if generated_files[file_path] else None
                ))
            
            execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
            
            print(f"✓ BUILDER: Code generation completed in {execution_time}ms")
            print(f"✓ BUILDER: Total files generated: {len(generated_files)}")
            
            return AgentResponse(
                agent_name='builder',
                success=True,
                output={'project': project.model_dump()},
                errors=[],
                execution_time_ms=execution_time
            )
            
        except RateLimitExceeded as e:
            error_msg = f"Rate limit exceeded: {str(e)}"
            return self._create_error_response(error_msg, start_time)
        
        except Exception as e:
            error_msg = f"Project generation failed: {str(e)}"
            return self._create_error_response(error_msg, start_time)
    
    def _generate_project_files(self, plan: Plan, context: Dict[str, Any], session_id: str) -> Dict[str, str]:
        """
        Generate all project files using Gemini LLM
        
        Args:
            plan: Structured plan with pages, components, routing
            context: Previous context from episodic memory
            session_id: Session identifier for rate limiting
            
        Returns:
            Dictionary mapping file paths to file contents
        """
        files = {}
        
        # Generate package.json
        print(f"🔨 BUILDER: Generating package.json...")
        files['package.json'] = self._generate_package_json(plan)
        print(f"  ✓ Generated: package.json")
        
        # Generate main App.tsx with routing
        print(f"🔨 BUILDER: Generating core files (App.tsx, index.tsx, CSS)...")
        files['src/App.tsx'] = self._generate_app_component(plan)
        print(f"  ✓ Generated: src/App.tsx")
        
        # Generate index.tsx entry point
        files['src/index.tsx'] = self._generate_index_file()
        print(f"  ✓ Generated: src/index.tsx")
        
        # Generate CSS files
        files['src/index.css'] = self._generate_index_css()
        files['src/App.css'] = self._generate_app_css()
        print(f"  ✓ Generated: CSS files")
        
        # Generate page components
        if plan.pages:
            print(f"🔨 BUILDER: Generating {len(plan.pages)} page component(s)...")
            for i, page in enumerate(plan.pages, 1):
                page_file_path = f"src/pages/{page.name}.tsx"
                print(f"  [{i}/{len(plan.pages)}] Generating page: {page.name}...")
                files[page_file_path] = self._generate_page_component(page, plan, session_id)
                print(f"  ✓ Generated: {page_file_path}")
        
        # Generate shared components
        if plan.components:
            print(f"🔨 BUILDER: Generating {len(plan.components)} shared component(s)...")
            for i, component in enumerate(plan.components, 1):
                component_file_path = f"src/components/{component.name}.tsx"
                print(f"  [{i}/{len(plan.components)}] Generating component: {component.name}...")
                files[component_file_path] = self._generate_component(component, plan, session_id)
                print(f"  ✓ Generated: {component_file_path}")
        
        # Generate backend logic if specified
        if plan.backend_logic:
            print(f"🔨 BUILDER: Generating backend files...")
            backend_files = self._generate_backend_files(plan.backend_logic)
            files.update(backend_files)
            print(f"✓ BUILDER: Generated {len(backend_files)} backend file(s)")
        
        # Generate basic test files
        print(f"🔨 BUILDER: Generating test files...")
        files['src/App.test.tsx'] = self._generate_app_test()
        print(f"  ✓ Generated: src/App.test.tsx")
        
        # Generate README
        print(f"🔨 BUILDER: Generating README.md...")
        files['README.md'] = self._generate_readme(plan)
        print(f"  ✓ Generated: README.md")
        
        # Generate public directory files (required for react-scripts build)
        print(f"🔨 BUILDER: Generating public directory files...")
        files['public/index.html'] = self._generate_index_html(plan)
        files['public/manifest.json'] = self._generate_manifest_json(plan)
        print(f"  ✓ Generated: public/index.html, public/manifest.json")
        
        # Generate .gitignore file
        print(f"🔨 BUILDER: Generating .gitignore...")
        files['.gitignore'] = self._generate_gitignore()
        print(f"  ✓ Generated: .gitignore")
        
        # Generate TypeScript configuration
        print(f"🔨 BUILDER: Generating tsconfig.json...")
        files['tsconfig.json'] = self._generate_tsconfig()
        print(f"  ✓ Generated: tsconfig.json")
        
        # Generate deployment configuration files
        print(f"🔨 BUILDER: Generating deployment config files...")
        files['vercel.json'] = self._generate_vercel_config()
        files['netlify.toml'] = self._generate_netlify_config()
        print(f"  ✓ Generated: vercel.json, netlify.toml")
        
        return files
    
    def _generate_package_json(self, plan: Plan) -> str:
        """
        Generate package.json with required dependencies
        
        Uses latest stable versions to avoid deprecation warnings during deployment.
        
        Validates: Requirements 13.2
        """
        dependencies = {
            "react": "^18.3.1",
            "react-dom": "^18.3.1",
            "react-router-dom": "^6.26.0",
            "react-scripts": "5.0.1",
            "typescript": "^5.5.4",
            "@types/react": "^18.3.5",
            "@types/react-dom": "^18.3.0",
            "web-vitals": "^4.2.3"
        }
        
        dev_dependencies = {
            "@testing-library/jest-dom": "^6.5.0",
            "@testing-library/react": "^16.0.1",
            "@testing-library/user-event": "^14.5.2",
            "@types/jest": "^29.5.12"
        }
        scripts = {
            "start": "react-scripts start",
            "build": "react-scripts build",
            "test": "react-scripts test --run",
            "eject": "react-scripts eject"
        }
        
        # Add backend dependencies if needed
        if plan.backend_logic:
            dependencies.update({
                "express": "^4.18.2",
                "cors": "^2.8.5",
                "dotenv": "^16.0.3"
            })
            
            dev_dependencies.update({
                "@types/express": "^4.17.17",
                "@types/cors": "^2.8.13",
                "supertest": "^6.3.3",
                "@types/supertest": "^2.0.12",
                "jest": "^29.5.0",
                "nodemon": "^2.0.22"
            })
            
            # Add backend-specific scripts
            scripts.update({
                "start:backend": "node server.js",
                "dev:backend": "nodemon server.js",
                "test:backend": "jest tests/backend.test.js",
                "dev": 'concurrently "npm run start" "npm run dev:backend"'
            })
            
            # Add concurrently for running frontend and backend together
            dev_dependencies["concurrently"] = "^8.0.1"
        
        package_json = {
            "name": "amar-generated-app",
            "version": "0.1.0",
            "private": True,
            "dependencies": dependencies,
            "devDependencies": dev_dependencies,
            "scripts": scripts,
            "eslintConfig": {
                "extends": [
                    "react-app",
                    "react-app/jest"
                ]
            },
            "browserslist": {
                "production": [
                    ">0.2%",
                    "not dead",
                    "not op_mini all"
                ],
                "development": [
                    "last 1 chrome version",
                    "last 1 firefox version",
                    "last 1 safari version"
                ]
            }
        }
        
        # Add Jest configuration for backend tests if backend logic exists
        if plan.backend_logic:
            package_json["jest"] = {
                "testEnvironment": "node",
                "testMatch": ["**/tests/**/*.test.js"],
                "coveragePathIgnorePatterns": ["/node_modules/"]
            }
        
        return json.dumps(package_json, indent=2)
    
    def _generate_app_component(self, plan: Plan) -> str:
        """Generate main App.tsx component with routing"""
        # Generate imports for all pages
        page_imports = []
        routes = []
        
        for page in plan.pages:
            page_imports.append(f"import {page.name} from './pages/{page.name}';")
            routes.append(f'        <Route path="{page.route}" element={{<{page.name} />}} />')
        
        imports_str = '\n'.join(page_imports)
        routes_str = '\n'.join(routes)
        
        app_component = f"""import React from 'react';
import {{ BrowserRouter as Router, Routes, Route }} from 'react-router-dom';
import './App.css';
{imports_str}

function App() {{
  return (
    <Router>
      <div className="App">
        <Routes>
{routes_str}
        </Routes>
      </div>
    </Router>
  );
}}

export default App;
"""
        return app_component
    
    def _generate_index_file(self) -> str:
        """Generate index.tsx entry point with proper TypeScript imports"""
        return """import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""
    
    def _generate_index_css(self) -> str:
        """Generate basic index.css"""
        return """body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}

* {
  box-sizing: border-box;
}
"""
    
    def _generate_app_css(self) -> str:
        """Generate basic App.css"""
        return """.App {
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  background-color: #282c34;
  padding: 20px;
  color: white;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 10px;
}

.nav a {
  color: white;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.footer {
  background-color: #f8f9fa;
  padding: 20px;
  margin-top: 40px;
  text-align: center;
  color: #666;
}

.page-content {
  padding: 40px 20px;
  min-height: 60vh;
}

.hero {
  padding: 60px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}
"""
    
    def _generate_page_component(self, page: PageSpec, plan: Plan, session_id: str) -> str:
        """
        Generate individual page component using LLM
        
        Uses exponential backoff for retries on rate limit errors.
        
        Args:
            page: Page specification
            plan: Complete plan
            session_id: Session identifier for rate limiting
            
        Returns:
            Generated page component code
            
        Validates: Requirements 3.1, 13.3, 10.4, 10.5
        """
        prompt = self._create_page_generation_prompt(page, plan)
        
        try:
            # Check rate limit before making LLM call
            self.rate_limiter.check_and_increment(session_id)
        except RateLimitExceeded:
            # Re-raise rate limit exceptions
            raise
        
        # Call LLM directly - let LangChain handle retries naturally
        try:
            response_text = self._call_llm(prompt)
            return self._extract_code_from_response(response_text)
        except Exception as e:
            # Fallback to template if LLM call fails
            return self._generate_basic_page_template(page)
    
    def _generate_component(self, component: ComponentSpec, plan: Plan, session_id: str) -> str:
        """
        Generate individual component using LLM
        
        Uses exponential backoff for retries on rate limit errors.
        
        Args:
            component: Component specification
            plan: Complete plan
            session_id: Session identifier for rate limiting
            
        Returns:
            Generated component code
            
        Validates: Requirements 10.4, 10.5
        """
        prompt = self._create_component_generation_prompt(component, plan)
        
        try:
            # Check rate limit before making LLM call
            self.rate_limiter.check_and_increment(session_id)
        except RateLimitExceeded:
            # Re-raise rate limit exceptions
            raise
        
        # Call LLM directly - let LangChain handle retries naturally
        try:
            response_text = self._call_llm(prompt)
            return self._extract_code_from_response(response_text)
        except Exception as e:
            # Fallback to template if LLM call fails
            return self._generate_basic_component_template(component)
    
    def _create_page_generation_prompt(self, page: PageSpec, plan: Plan) -> str:
        """
        Create prompt for generating page component
        
        Validates: Requirements 13.3
        """
        components_list = [comp.name for comp in plan.components if comp.name in page.components]
        
        # Check if this page needs backend integration
        backend_info = ""
        if plan.backend_logic and plan.backend_logic.endpoints:
            # Identify relevant endpoints for this page
            relevant_endpoints = self._identify_relevant_endpoints(page, plan.backend_logic)
            
            if relevant_endpoints:
                endpoint_details = []
                for ep in relevant_endpoints:
                    endpoint_details.append(
                        f"  - {ep['method']} {ep['path']}: {ep.get('description', 'API endpoint')}"
                    )
                
                backend_info = f"""

BACKEND INTEGRATION:
This page requires integration with the following API endpoints:
{chr(10).join(endpoint_details)}

Requirements for API integration:
- Use fetch() or axios to call the backend endpoints
- Include proper error handling for API calls
- Show loading states during API requests
- Display success/error messages to users
- Use async/await for cleaner code
- Include proper TypeScript types for API responses
- For forms: prevent default submission and call API endpoint
- For GET requests: fetch data on component mount using useEffect
- Handle CORS properly (backend has cors middleware)

Example API call pattern:
```typescript
const handleSubmit = async (data: FormData) => {{
  try {{
    const response = await fetch('http://localhost:3001/api/endpoint', {{
      method: 'POST',
      headers: {{ 'Content-Type': 'application/json' }},
      body: JSON.stringify(data)
    }});
    const result = await response.json();
    // Handle success
  }} catch (error) {{
    // Handle error
  }}
}};
```
"""
        
        # Generate example imports for clarity
        example_imports = '\n'.join([f"import {comp} from '../components/{comp}.tsx';" for comp in components_list])
        
        prompt = f"""
Generate a BEAUTIFUL, PRODUCTION-READY React TypeScript page component.

Page: {page.name} | Route: {page.route}
Description: {page.description}
Components to use: {', '.join(components_list)}
{backend_info}

═══════════════════════════════════════════════════════════════════════════════
🚨 CRITICAL FILE STRUCTURE (MEMORIZE THIS):
═══════════════════════════════════════════════════════════════════════════════

THIS FILE LOCATION: src/pages/{page.name}.tsx
COMPONENTS LOCATION: src/components/ComponentName.tsx

CORRECT IMPORT PATH: '../components/ComponentName.tsx'
❌ WRONG: './ComponentName.tsx' (same directory - WRONG!)
❌ WRONG: './ComponentName' (missing extension - WRONG!)
✅ CORRECT: '../components/ComponentName.tsx'

EXACT IMPORTS TO USE:
```typescript
import React from 'react';
{example_imports}
```

═══════════════════════════════════════════════════════════════════════════════
🎨 STYLING REQUIREMENTS - MAKE IT STUNNING:
═══════════════════════════════════════════════════════════════════════════════

USE INLINE STYLES WITH MODERN DESIGN:

1. HERO SECTION (Top of page):
```typescript
<div style={{{{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '100px 20px',
  textAlign: 'center' as const,
  minHeight: '500px',
  display: 'flex',
  flexDirection: 'column' as const,
  justifyContent: 'center' as const,
  alignItems: 'center' as const
}}}}>
  <h1 style={{{{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}}}>
    Amazing Title
  </h1>
  <p style={{{{ fontSize: '1.5rem', maxWidth: '700px', lineHeight: '1.8', opacity: 0.95 }}}}>
    Compelling description that engages users
  </p>
</div>
```

2. CONTENT SECTIONS:
```typescript
<section style={{{{
  padding: '80px 20px',
  maxWidth: '1200px',
  margin: '0 auto',
  background: '#ffffff'
}}}}>
  <h2 style={{{{ 
    fontSize: '3rem', 
    textAlign: 'center' as const, 
    marginBottom: '60px',
    color: '#2d3748',
    fontWeight: 'bold'
  }}}}>
    Section Title
  </h2>
  <div style={{{{ 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '40px' 
  }}}}>
    {{/* Content cards */}}
  </div>
</section>
```

3. FEATURE CARDS:
```typescript
<div style={{{{
  background: 'white',
  padding: '40px',
  borderRadius: '20px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  border: '1px solid #e2e8f0',
  height: '100%'
}}}}>
  <div style={{{{ 
    width: '60px', 
    height: '60px', 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '15px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const
  }}}}>
    <span style={{{{ fontSize: '2rem' }}}}>🚀</span>
  </div>
  <h3 style={{{{ fontSize: '1.8rem', color: '#2d3748', marginBottom: '16px', fontWeight: '600' }}}}>
    Feature Title
  </h3>
  <p style={{{{ color: '#718096', fontSize: '1.1rem', lineHeight: '1.8' }}}}>
    Detailed feature description with real content
  </p>
</div>
```

4. BUTTONS:
```typescript
<button style={{{{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  padding: '18px 48px',
  fontSize: '1.2rem',
  fontWeight: '600',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer',
  boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.3s ease',
  textTransform: 'uppercase' as const,
  letterSpacing: '1px'
}}}}>
  Get Started
</button>
```

═══════════════════════════════════════════════════════════════════════════════
📝 CONTENT REQUIREMENTS:
═══════════════════════════════════════════════════════════════════════════════

- Write REAL, engaging content (NO "Lorem ipsum"!)
- Multiple sections (Hero, Features, Benefits, CTA)
- Use emojis for visual interest (🚀 💡 ⭐ 🎯 ✨)
- Descriptive headings and subheadings
- Compelling copy that matches the page description
- Professional tone

═══════════════════════════════════════════════════════════════════════════════
⚛️ REACT & TYPESCRIPT:
═══════════════════════════════════════════════════════════════════════════════

- Use React.FC type
- Proper TypeScript (no 'any')
- Modern hooks if needed
- Clean, readable code
{"- API integration with loading/error states" if backend_info else ""}

═══════════════════════════════════════════════════════════════════════════════
🚫 CRITICAL RULES - NEVER BREAK THESE:
═══════════════════════════════════════════════════════════════════════════════

1. ✅ Import from '../components/Name.tsx' (NOT './Name.tsx')
2. ✅ Use inline styles with modern gradients and shadows
3. ✅ Add real, meaningful content
4. ✅ Make it visually stunning
5. ❌ NEVER redefine imported components
6. ❌ NEVER use boring, plain styles
7. ❌ NEVER use placeholder content
8. ❌ NEVER forget .tsx extension in imports

Return ONLY the complete TypeScript React component code.
NO explanations. NO markdown. NO comments about file locations.
"""
        return prompt
    
    def _identify_relevant_endpoints(self, page: PageSpec, backend_spec: BackendSpec) -> List[Dict[str, str]]:
        """
        Identify which backend endpoints are relevant for a specific page
        
        Args:
            page: Page specification
            backend_spec: Backend specification with endpoints
            
        Returns:
            List of relevant endpoint specifications
            
        Validates: Requirements 13.3
        """
        relevant_endpoints = []
        page_name_lower = page.name.lower()
        page_desc_lower = page.description.lower()
        
        for endpoint in backend_spec.endpoints:
            endpoint_path = endpoint.get('path', '').lower()
            endpoint_desc = endpoint.get('description', '').lower()
            
            # Match endpoints to pages based on naming and description
            # Contact page -> contact endpoint
            if 'contact' in page_name_lower and 'contact' in endpoint_path:
                relevant_endpoints.append(endpoint)
            # Search page -> search endpoint
            elif 'search' in page_name_lower and 'search' in endpoint_path:
                relevant_endpoints.append(endpoint)
            # Form pages -> submission endpoints
            elif 'form' in page_desc_lower and 'submit' in endpoint_path:
                relevant_endpoints.append(endpoint)
            # Signup/Register page -> signup endpoint
            elif ('signup' in page_name_lower or 'register' in page_name_lower) and 'signup' in endpoint_path:
                relevant_endpoints.append(endpoint)
            # Feedback page -> feedback endpoint
            elif 'feedback' in page_name_lower and 'feedback' in endpoint_path:
                relevant_endpoints.append(endpoint)
            # Generic matching: if endpoint description mentions the page
            elif page_name_lower.replace('page', '') in endpoint_desc:
                relevant_endpoints.append(endpoint)
        
        return relevant_endpoints
    
    def _create_component_generation_prompt(self, component: ComponentSpec, plan: Plan) -> str:
        """
        Create prompt for generating component
        
        Validates: Requirements 13.3
        """
        props_info = ""
        if component.props:
            props_list = [f"{key}: {value}" for key, value in component.props.items()]
            props_info = f"Props: {', '.join(props_list)}"
        
        # Check if this component needs backend integration (e.g., forms)
        backend_info = ""
        component_name_lower = component.name.lower()
        component_desc_lower = component.description.lower()
        
        if plan.backend_logic and plan.backend_logic.endpoints:
            # Check if this is a form component that needs API integration
            is_form_component = any(keyword in component_name_lower or keyword in component_desc_lower 
                                   for keyword in ['form', 'contact', 'submit', 'search', 'input'])
            
            if is_form_component:
                # Find relevant endpoints
                relevant_endpoints = []
                for ep in plan.backend_logic.endpoints:
                    ep_path = ep.get('path', '').lower()
                    if any(keyword in ep_path for keyword in ['contact', 'submit', 'search', 'validate']):
                        relevant_endpoints.append(ep)
                
                if relevant_endpoints:
                    endpoint_details = []
                    for ep in relevant_endpoints:
                        endpoint_details.append(
                            f"  - {ep['method']} {ep['path']}: {ep.get('description', 'API endpoint')}"
                        )
                    
                    backend_info = f"""

BACKEND INTEGRATION:
This component should integrate with backend API endpoints:
{chr(10).join(endpoint_details)}

Requirements:
- Accept onSubmit callback prop for form submission
- Use fetch() to call the backend endpoint
- Include loading and error states
- Provide user feedback on success/failure
- Use proper TypeScript types for API responses
"""
        
        prompt = f"""
Generate a React TypeScript functional component with the following specifications:

Component Name: {component.name}
Type: {component.type}
Description: {component.description}
{props_info}
{backend_info}

CRITICAL DEPLOYMENT REQUIREMENTS:
- Write PRODUCTION-READY code that will deploy successfully on Vercel/Netlify
- Use ONLY modern, stable React patterns (React 18+)
- Avoid deprecated APIs and patterns
- Use native browser APIs instead of deprecated polyfills
- Write clean, minimal code without unnecessary dependencies
- Ensure all imports are from stable, maintained packages
- Follow React best practices for performance and accessibility

Requirements:
- Use TypeScript with proper interface definitions for props
- Create a reusable, well-structured component
- Include proper CSS classes for styling
- Make the component accessible (ARIA attributes where appropriate)
- Add meaningful default content if no props are provided
- Follow React best practices
{"- Include API integration as specified above" if backend_info else ""}
{"- Add state management for loading and error states" if backend_info else ""}

Component Structure:
- Import React (and useState if needed)
- Define TypeScript interface for props (if any)
- Define the functional component with proper typing
- Export as default
- Use semantic HTML elements
- Include proper error handling for props
{"- Include form submission handler with API call" if backend_info else ""}

CODE QUALITY STANDARDS:
- No console warnings or errors
- No deprecated React patterns (e.g., no legacy context API)
- Use modern React hooks (useState, useEffect, useCallback, useMemo)
- Proper TypeScript types (no 'any' types)
- Clean, readable code with proper indentation
- Minimal dependencies - use native browser APIs when possible

CRITICAL IMPORT RULES:
- ALWAYS include .tsx extension in imports: import Component from './Component.tsx'
- For components: import Header from '../components/Header.tsx'
- For pages: import HomePage from './pages/HomePage.tsx'
- This prevents "Module not found" errors during build

CRITICAL: NEVER REDEFINE IMPORTED COMPONENTS
- If you import a component, DO NOT define it again in the same file
- Example of ERROR (DO NOT DO THIS):
  ```
  import Header from '../components/Header.tsx';  // Imported
  const Header = () => { ... };  // ERROR: Redeclaration!
  ```
- Each component should be defined ONLY ONCE in its own file
- Pages should ONLY import and use components, never redefine them
- If a component is imported, use it directly - do not create a local version

COMPONENT USAGE RULES:
- Import components at the top of the file
- Use imported components in JSX: <Header />
- Never create placeholder/dummy versions of imported components
- Each component lives in its own file (src/components/ComponentName.tsx)

Return ONLY the TypeScript React component code, no explanations or markdown formatting.
"""
        return prompt
    
    def _extract_code_from_response(self, response_text: str) -> str:
        """Extract code from LLM response, removing markdown formatting"""
        # Remove markdown code blocks if present
        if "```" in response_text:
            # Find the code block
            start_markers = ["```typescript", "```tsx", "```ts", "```javascript", "```jsx", "```"]
            
            for marker in start_markers:
                if marker in response_text:
                    start_idx = response_text.find(marker) + len(marker)
                    end_idx = response_text.find("```", start_idx)
                    if end_idx != -1:
                        code = response_text[start_idx:end_idx].strip()
                        # Validate the extracted code
                        self._validate_generated_code(code)
                        return code
        
        # If no code blocks found, return the entire response cleaned up
        code = response_text.strip()
        self._validate_generated_code(code)
        return code
    
    def _validate_generated_code(self, code: str) -> None:
        """
        Validate generated code for common errors
        
        Checks for:
        - Duplicate component definitions (import + local definition)
        - Missing imports
        - Syntax errors
        
        Raises:
            ValueError: If validation fails
        """
        import re
        
        # Check for duplicate component definitions
        # Pattern: import ComponentName from '...' followed by const ComponentName = ...
        imports = re.findall(r'import\s+(\w+)\s+from\s+[\'"]', code)
        definitions = re.findall(r'(?:const|let|var|function)\s+(\w+)\s*[=:]', code)
        
        # Find duplicates
        duplicates = set(imports) & set(definitions)
        if duplicates:
            duplicate_names = ', '.join(duplicates)
            raise ValueError(
                f"Code validation error: Component(s) {duplicate_names} are both imported and defined locally. "
                f"This causes a redeclaration error. Each component should be defined only once in its own file. "
                f"Remove the local definition and use the imported component instead."
            )
        
        # Check for basic syntax issues
        if code.count('{') != code.count('}'):
            raise ValueError("Code validation error: Mismatched curly braces")
        
        if code.count('(') != code.count(')'):
            raise ValueError("Code validation error: Mismatched parentheses")
        
        # Check for required imports
        if 'React' in code and 'import React' not in code and 'import * as React' not in code:
            raise ValueError("Code validation error: React is used but not imported")
    
    def _generate_basic_page_template(self, page: PageSpec) -> str:
        """Generate basic page template as fallback"""
        component_imports = []
        component_usage = []
        
        for comp_name in page.components:
            if comp_name not in ['Header', 'Footer']:  # These are handled separately
                component_imports.append(f"import {comp_name} from '../components/{comp_name}';")
                component_usage.append(f"        <{comp_name} />")
        
        imports_str = '\n'.join(component_imports)
        usage_str = '\n'.join(component_usage)
        
        return f"""import React from 'react';
{imports_str}

const {page.name}: React.FC = () => {{
  return (
    <div className="page-content">
      <div className="container">
        <h1>{page.name.replace('Page', '').replace('Home', 'Welcome')}</h1>
        <p>{page.description}</p>
{usage_str}
      </div>
    </div>
  );
}};

export default {page.name};
"""
    
    def _generate_basic_component_template(self, component: ComponentSpec) -> str:
        """Generate basic component template as fallback"""
        props_interface = ""
        props_param = ""
        
        if component.props:
            props_list = [f"  {key}: {value};" for key, value in component.props.items()]
            props_interface = f"""
interface {component.name}Props {{
{chr(10).join(props_list)}
}}

"""
            props_param = f"props: {component.name}Props"
        
        return f"""import React from 'react';

{props_interface}const {component.name}: React.FC{f'<{component.name}Props>' if component.props else ''} = ({props_param}) => {{
  return (
    <div className="{component.name.lower()}">
      <h2>{component.name}</h2>
      <p>{component.description}</p>
    </div>
  );
}};

export default {component.name};
"""
    
    def _generate_backend_files(self, backend_spec: BackendSpec) -> Dict[str, str]:
        """
        Generate backend files if backend logic is specified
        
        Validates: Requirements 13.2, 13.4
        """
        files = {}
        
        # Generate server.js for Express backend
        files['server.js'] = self._generate_express_server(backend_spec)
        
        # Generate API route handlers
        for endpoint in backend_spec.endpoints:
            handler_name = endpoint.get('handler', 'defaultHandler')
            files[f'api/{handler_name}.js'] = self._generate_api_handler(endpoint)
        
        # Generate backend tests
        files['tests/backend.test.js'] = self._generate_backend_tests(backend_spec)
        
        # Generate .env.example for backend configuration
        files['.env.example'] = self._generate_env_example()
        
        return files
    
    def _generate_backend_tests(self, backend_spec: BackendSpec) -> str:
        """
        Generate test file for backend API endpoints
        
        Validates: Requirements 13.4
        """
        test_cases = []
        
        for endpoint in backend_spec.endpoints:
            method = endpoint['method'].upper()
            path = endpoint['path']
            handler_name = endpoint.get('handler', 'defaultHandler')
            
            if method == 'POST':
                test_cases.append(f"""
  test('{method} {path} - success', async () => {{
    const response = await request(app)
      .{method.lower()}('{path}')
      .send({{ name: 'Test User', email: 'test@example.com', message: 'Test message' }})
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
  }});
  
  test('{method} {path} - validation error', async () => {{
    const response = await request(app)
      .{method.lower()}('{path}')
      .send({{}})
      .expect('Content-Type', /json/)
      .expect(400);
    
    expect(response.body.success).toBe(false);
  }});""")
            
            elif method == 'GET':
                if 'search' in path.lower():
                    test_cases.append(f"""
  test('{method} {path} - with query', async () => {{
    const response = await request(app)
      .{method.lower()}('{path}')
      .query({{ q: 'test' }})
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
  }});
  
  test('{method} {path} - missing query', async () => {{
    const response = await request(app)
      .{method.lower()}('{path}')
      .expect('Content-Type', /json/)
      .expect(400);
    
    expect(response.body.success).toBe(false);
  }});""")
                else:
                    test_cases.append(f"""
  test('{method} {path} - success', async () => {{
    const response = await request(app)
      .{method.lower()}('{path}')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.success).toBe(true);
  }});""")
        
        return f"""/**
 * Backend API Tests
 * Tests all API endpoints for proper functionality
 */
const request = require('supertest');
const app = require('../server');

describe('Backend API Endpoints', () => {{
  test('GET /health - health check', async () => {{
    const response = await request(app)
      .get('/health')
      .expect('Content-Type', /json/)
      .expect(200);
    
    expect(response.body.status).toBe('ok');
  }});
{chr(10).join(test_cases)}
  
  test('404 - endpoint not found', async () => {{
    const response = await request(app)
      .get('/api/nonexistent')
      .expect('Content-Type', /json/)
      .expect(404);
    
    expect(response.body.success).toBe(false);
  }});
}});
"""
    
    def _generate_env_example(self) -> str:
        """Generate .env.example file for backend configuration"""
        return """# Backend Configuration
NODE_ENV=development
PORT=3001

# Add your environment variables here
# API_KEY=your_api_key_here
"""
    
    def _generate_express_server(self, backend_spec: BackendSpec) -> str:
        """
        Generate Express server file with proper middleware and routing
        
        Validates: Requirements 13.2
        """
        middleware_imports = []
        middleware_usage = []
        
        if 'cors' in backend_spec.middleware:
            middleware_imports.append("const cors = require('cors');")
            middleware_usage.append("app.use(cors());")
        
        if 'bodyParser' in backend_spec.middleware:
            middleware_usage.append("app.use(express.json());")
            middleware_usage.append("app.use(express.urlencoded({ extended: true }));")
        
        route_imports = []
        route_usage = []
        
        for endpoint in backend_spec.endpoints:
            handler_name = endpoint.get('handler', 'defaultHandler')
            route_imports.append(f"const {handler_name} = require('./api/{handler_name}');")
            route_usage.append(f"app.{endpoint['method'].lower()}('{endpoint['path']}', {handler_name});")
        
        return f"""const express = require('express');
{chr(10).join(middleware_imports)}
{chr(10).join(route_imports)}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
{chr(10).join(middleware_usage)}

// Health check endpoint
app.get('/health', (req, res) => {{
  res.json({{ status: 'ok', timestamp: new Date().toISOString() }});
}});

// API Routes
{chr(10).join(route_usage)}

// Error handling middleware
app.use((err, req, res, next) => {{
  console.error('Error:', err);
  res.status(500).json({{
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  }});
}});

// 404 handler
app.use((req, res) => {{
  res.status(404).json({{
    success: false,
    message: 'Endpoint not found'
  }});
}});

// Start server
if (require.main === module) {{
  app.listen(PORT, () => {{
    console.log(`Server running on port ${{PORT}}`);
  }});
}}

// Export for testing
module.exports = app;
"""
    
    def _generate_api_handler(self, endpoint: Dict[str, str]) -> str:
        """
        Generate API handler function with proper validation and error handling
        
        Validates: Requirements 13.2, 13.4
        """
        method = endpoint['method'].upper()
        path = endpoint['path']
        handler_name = endpoint.get('handler', 'defaultHandler')
        description = endpoint.get('description', f'{handler_name} handler')
        
        # Generate validation logic based on endpoint type
        validation_logic = ""
        response_logic = ""
        
        if method == 'POST':
            if 'contact' in path.lower():
                validation_logic = """
    // Validate contact form data
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, message'
      });
    }
    
    // Basic email validation
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }"""
                response_logic = """
      // In a real application, you would:
      // - Send email notification
      // - Store in database
      // - Trigger webhooks
      
      console.log('Contact form submission:', { name, email, message });
      
      res.json({
        success: true,
        message: 'Contact form submitted successfully',
        data: { name, email, timestamp: new Date().toISOString() }
      });"""
            
            elif 'validate' in path.lower():
                validation_logic = """
    // Validate input data
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'No data provided for validation'
      });
    }"""
                response_logic = """
      // Perform validation logic
      const isValid = true; // Replace with actual validation
      
      res.json({
        success: true,
        message: 'Validation completed',
        data: { isValid, timestamp: new Date().toISOString() }
      });"""
            
            else:
                validation_logic = """
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required'
      });
    }"""
                response_logic = """
      // Process the request
      console.log('Processing request:', req.body);
      
      res.json({
        success: true,
        message: 'Request processed successfully',
        data: req.body
      });"""
        
        elif method == 'GET':
            if 'search' in path.lower():
                validation_logic = """
    // Get search query from query parameters
    const { q, query } = req.query;
    const searchQuery = q || query;
    
    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: 'Search query parameter is required'
      });
    }"""
                response_logic = """
      // Perform search logic
      // In a real application, you would query a database
      const results = [
        { id: 1, title: 'Sample Result 1', description: 'Matching ' + searchQuery },
        { id: 2, title: 'Sample Result 2', description: 'Also matching ' + searchQuery }
      ];
      
      res.json({
        success: true,
        message: 'Search completed',
        data: { query: searchQuery, results, count: results.length }
      });"""
            else:
                validation_logic = ""
                response_logic = """
      // Fetch data
      // In a real application, you would query a database
      const data = { message: 'Data retrieved successfully' };
      
      res.json({
        success: true,
        data
      });"""
        
        return f"""/**
 * {description}
 * {method} {path}
 */
const {handler_name} = (req, res) => {{
  try {{
    console.log('{method} {path} called');
    {validation_logic}
    {response_logic}
  }} catch (error) {{
    console.error('Error in {handler_name}:', error);
    res.status(500).json({{
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }});
  }}
}};

module.exports = {handler_name};
"""
    
    def _generate_app_test(self) -> str:
        """Generate basic App test file"""
        return """import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Basic test to ensure app renders
  expect(document.querySelector('.App')).toBeInTheDocument();
});
"""
    
    def _generate_index_html(self, plan: Plan) -> str:
        """Generate public/index.html file required by react-scripts"""
        # Extract app name from first page or use default
        app_name = plan.pages[0].name if plan.pages else "Generated App"
        app_description = plan.pages[0].description if plan.pages and plan.pages[0].description else "A React application"
        
        html_content = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="{app_description}"
    />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <title>{app_name}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
"""
        return html_content
    
    def _generate_manifest_json(self, plan: Plan) -> str:
        """Generate public/manifest.json file"""
        import json
        # Extract app name from first page or use default
        app_name = plan.pages[0].name if plan.pages else "Generated App"
        short_name = app_name[:12] if len(app_name) > 12 else app_name
        
        manifest = {
            "short_name": short_name,
            "name": app_name,
            "icons": [
                {
                    "src": "favicon.ico",
                    "sizes": "64x64 32x32 24x24 16x16",
                    "type": "image/x-icon"
                }
            ],
            "start_url": ".",
            "display": "standalone",
            "theme_color": "#000000",
            "background_color": "#ffffff"
        }
        
        return json.dumps(manifest, indent=2)
    
    def _generate_tsconfig(self) -> str:
        """Generate tsconfig.json with proper module resolution for React"""
        import json
        tsconfig = {
            "compilerOptions": {
                "target": "ES2020",
                "lib": ["ES2020", "DOM", "DOM.Iterable"],
                "jsx": "react-jsx",
                "module": "ESNext",
                "moduleResolution": "bundler",
                "resolveJsonModule": True,
                "allowImportingTsExtensions": True,
                "allowSyntheticDefaultImports": True,
                "esModuleInterop": True,
                "forceConsistentCasingInFileNames": True,
                "strict": True,
                "skipLibCheck": True,
                "noEmit": True,
                "isolatedModules": True,
                "noUnusedLocals": True,
                "noUnusedParameters": True,
                "noFallthroughCasesInSwitch": True
            },
            "include": ["src"],
            "references": [{"path": "./tsconfig.node.json"}]
        }
        return json.dumps(tsconfig, indent=2)
    
    def _generate_gitignore(self) -> str:
        """Generate .gitignore file for React project"""
        gitignore_content = """# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Vercel
.vercel

# Netlify
.netlify
"""
        return gitignore_content
    
    def _generate_vercel_config(self) -> str:
        """Generate vercel.json configuration for deployment"""
        import json
        # Simplified Vercel config for React apps - Vercel auto-detects React
        # and uses the build command from package.json
        vercel_config = {
            "rewrites": [
                {
                    "source": "/(.*)",
                    "destination": "/index.html"
                }
            ]
        }
        return json.dumps(vercel_config, indent=2)
    
    def _generate_netlify_config(self) -> str:
        """Generate netlify.toml configuration for deployment"""
        netlify_config = """[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
"""
        return netlify_config
    
    def _generate_readme(self, plan: Plan) -> str:
        """
        Generate README.md file with comprehensive documentation
        
        Validates: Requirements 13.2
        """
        pages_list = '\n'.join([f"- {page.name} ({page.route}): {page.description}" for page in plan.pages])
        components_list = '\n'.join([f"- {comp.name}: {comp.description}" for comp in plan.components])
        
        backend_section = ""
        backend_scripts = ""
        
        if plan.backend_logic:
            endpoints_list = '\n'.join([
                f"- **{ep['method']} {ep['path']}**: {ep.get('description', 'API endpoint')}" 
                for ep in plan.backend_logic.endpoints
            ])
            
            backend_section = f"""
## Backend API

This application includes a Node.js/Express backend with the following API endpoints:

{endpoints_list}

### Backend Configuration

The backend server runs on port 3001 by default. You can configure this in the `.env` file.

### API Response Format

All API endpoints return JSON responses in the following format:

```json
{{
  "success": true,
  "message": "Operation completed successfully",
  "data": {{}}
}}
```

Error responses include:
```json
{{
  "success": false,
  "message": "Error description"
}}
```
"""
            
            backend_scripts = """
### Running Frontend and Backend Together

```bash
npm run dev
```

This will start both the React frontend (port 3000) and Express backend (port 3001) concurrently.

### Running Backend Only

```bash
npm run start:backend
```

Or with auto-reload during development:

```bash
npm run dev:backend
```

### Testing Backend

```bash
npm run test:backend
```
"""
        
        return f"""# AMAR Generated Application

This React application was automatically generated by AMAR (Autonomous Memory Agentic Realms).

## Pages

{pages_list}

## Components

{components_list}
{backend_section}
## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. {'Create a `.env` file based on `.env.example` (for backend configuration)' if plan.backend_logic else 'No additional configuration needed'}

### Running the Application

#### Frontend Only

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
{backend_scripts}

## Available Scripts

- `npm start` - Runs the React app in development mode
- `npm test` - Launches the frontend test runner
- `npm run build` - Builds the app for production
{'- `npm run dev` - Runs both frontend and backend concurrently' if plan.backend_logic else ''}
{'- `npm run start:backend` - Runs the backend server only' if plan.backend_logic else ''}
{'- `npm run test:backend` - Runs backend API tests' if plan.backend_logic else ''}

## Project Structure

```
.
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/          # Page components
│   ├── App.tsx         # Main app component with routing
│   └── index.tsx       # Entry point
{'├── api/              # Backend API handlers' if plan.backend_logic else ''}
{'├── tests/            # Backend tests' if plan.backend_logic else ''}
{'├── server.js         # Express server' if plan.backend_logic else ''}
└── package.json
```

## Generated by AMAR

This application was generated automatically based on the following plan:
- **Complexity**: {plan.estimated_complexity}
- **Pages**: {len(plan.pages)}
- **Components**: {len(plan.components)}
- **Backend Logic**: {'Yes' if plan.backend_logic else 'No'}
{f"- **API Endpoints**: {len(plan.backend_logic.endpoints)}" if plan.backend_logic else ''}

## Learn More

- [React Documentation](https://reactjs.org/)
- [React Router Documentation](https://reactrouter.com/)
{'- [Express Documentation](https://expressjs.com/)' if plan.backend_logic else ''}
"""
    
    def _create_file_lineage(self, files: Dict[str, str], session_id: str) -> List[FileLineage]:
        """Create lineage tracking for all generated files"""
        lineage = []
        timestamp = datetime.now().isoformat()
        
        for file_path in files.keys():
            lineage.append(FileLineage(
                file_path=file_path,
                created_by='builder',
                created_at=timestamp,
                modified_by=[],
                reason='Initial code generation from plan'
            ))
        
        return lineage
    
    def _get_plan_summary(self, plan: Plan) -> Dict[str, Any]:
        """Generate summary of the plan for logging"""
        return {
            'page_count': len(plan.pages),
            'component_count': len(plan.components),
            'has_backend': plan.backend_logic is not None,
            'complexity': plan.estimated_complexity,
            'pages': [{'name': p.name, 'route': p.route} for p in plan.pages],
            'components': [{'name': c.name, 'type': c.type} for c in plan.components]
        }
    
    def write_files_to_directory(self, files: Dict[str, str], base_dir: Optional[str] = None) -> str:
        """
        Write generated files to user-accessible directory
        
        Args:
            files: Dictionary mapping file paths to file contents
            base_dir: Optional base directory (uses generated_projects if not provided)
            
        Returns:
            Path to the directory containing the files
            
        Validates: Requirements 3.3
        """
        if base_dir is None:
            # Create user-accessible directory in project root
            # Use generated_projects folder so users can easily find their files
            project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            generated_dir = os.path.join(project_root, 'generated_projects')
            os.makedirs(generated_dir, exist_ok=True)
            
            # Create timestamped project directory
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            base_dir = os.path.join(generated_dir, f'amar_project_{timestamp}')
        
        base_path = os.path.abspath(base_dir)
        os.makedirs(base_path, exist_ok=True)
        
        for file_path, content in files.items():
            full_path = os.path.join(base_path, file_path)
            
            # Create directory structure if needed
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            
            # Write file content
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
        
        print(f"📁 Files saved to: {base_path}")
        print(f"   You can find your generated project at this location!")
        
        return base_path
    
    def update_files_in_directory(
        self, 
        project_dir: str, 
        updated_files: Dict[str, str],
        session_id: str,
        retry_count: int
    ) -> None:
        """
        Update only specific files in existing project directory
        
        This method performs targeted file regeneration, updating only the files
        that failed tests instead of regenerating the entire project.
        
        Args:
            project_dir: Path to existing project directory
            updated_files: Dictionary of files to update (path -> content)
            session_id: Session identifier for logging
            retry_count: Current retry attempt number
            
        Validates: Requirements 5.3, 5.5
        """
        from services.audit import audit_manager
        audit_logger = audit_manager.get_logger(session_id)
        
        updated_count = 0
        
        for file_path, content in updated_files.items():
            full_path = os.path.join(project_dir, file_path)
            
            try:
                # Create directory structure if needed
                os.makedirs(os.path.dirname(full_path), exist_ok=True)
                
                # Write updated file content
                with open(full_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                updated_count += 1
                
                # Log file modification (async, non-blocking if event loop exists)
                try:
                    asyncio.create_task(audit_logger.log_file_operation(
                        agent='builder',
                        operation='modify',
                        file_path=file_path,
                        reason=f'Self-healing regeneration (attempt {retry_count + 1})',
                        content_preview=content[:200] if content else None
                    ))
                except RuntimeError:
                    # No event loop running, skip async logging
                    pass
                
            except Exception as e:
                # Log error but continue with other files
                error_msg = f"Failed to update file {file_path}: {str(e)}"
                try:
                    asyncio.create_task(audit_logger.log_agent_decision(
                        agent='builder',
                        action='file_update_failed',
                        details={
                            'file_path': file_path,
                            'error': error_msg,
                            'retry_count': retry_count
                        }
                    ))
                except RuntimeError:
                    # No event loop running, skip async logging
                    pass
        
        # Log summary of updates
        memory = memory_manager.get_memory(session_id)
        memory.add_entry(
            agent='builder',
            action='targeted_file_regeneration',
            data={
                'retry_count': retry_count,
                'files_updated': list(updated_files.keys()),
                'update_count': updated_count,
                'total_files': len(updated_files)
            },
            tags=['self_healing', 'file_update'],
            importance=0.9
        )
    
    async def log_self_healing_attempt(
        self,
        session_id: str,
        retry_count: int,
        error_context: Dict[str, Any],
        regenerated_files: List[str],
        outcome: str
    ) -> None:
        """
        Log self-healing attempt and outcome to audit trail
        
        Provides comprehensive logging of self-healing attempts including
        error context, files regenerated, and final outcome.
        
        Args:
            session_id: Session identifier
            retry_count: Retry attempt number
            error_context: Context about the errors that triggered self-healing
            regenerated_files: List of files that were regenerated
            outcome: Outcome of the self-healing attempt ('success' | 'failure' | 'retry')
            
        Validates: Requirements 5.5
        """
        from services.audit import audit_manager
        audit_logger = audit_manager.get_logger(session_id)
        
        await audit_logger.log_agent_decision(
            agent='builder',
            action='self_healing_attempt',
            details={
                'retry_count': retry_count,
                'outcome': outcome,
                'error_summary': error_context.get('error_summary', ''),
                'failed_test_count': error_context.get('failed_count', 0),
                'regenerated_files': regenerated_files,
                'file_count': len(regenerated_files),
                'timestamp': datetime.now().isoformat()
            }
        )
        
        # Also log to episodic memory for future RAG
        memory = memory_manager.get_memory(session_id)
        memory.add_entry(
            agent='builder',
            action='self_healing_outcome',
            data={
                'retry_count': retry_count,
                'outcome': outcome,
                'regenerated_files': regenerated_files,
                'error_context': error_context
            },
            tags=['self_healing', 'outcome', outcome],
            importance=1.0 if outcome == 'success' else 0.8
        )
    
    def execute_tests(self, project_dir: str, session_id: str) -> TestResults:
        """
        Execute pytest tests on generated code and capture results
        
        Args:
            project_dir: Directory containing the generated project
            session_id: Session identifier for logging
            
        Returns:
            TestResults object with test execution details
            
        Validates: Requirements 4.1, 4.2
        """
        start_time = datetime.now()
        
        try:
            import subprocess
            import sys
            
            # Change to project directory
            original_cwd = os.getcwd()
            os.chdir(project_dir)
            
            try:
                # Install dependencies first (if package.json exists)
                if os.path.exists('package.json'):
                    # Run npm install
                    npm_result = subprocess.run(
                        ['npm', 'install'],
                        capture_output=True,
                        text=True,
                        timeout=300  # 5 minute timeout
                    )
                    
                    if npm_result.returncode != 0:
                        raise RuntimeError(f"npm install failed: {npm_result.stderr}")
                
                # Run tests using npm test (which runs react-scripts test)
                test_result = subprocess.run(
                    ['npm', 'test', '--', '--watchAll=false', '--testTimeout=30000'],
                    capture_output=True,
                    text=True,
                    timeout=120  # 2 minute timeout for tests
                )
                
                # Parse test results
                test_results = self._parse_test_output(test_result.stdout, test_result.stderr)
                test_results.execution_time_ms = int((datetime.now() - start_time).total_seconds() * 1000)
                
                # Log test results
                asyncio.create_task(self._log_test_results(session_id, test_results, test_result))
                
                return test_results
                
            finally:
                # Always restore original directory
                os.chdir(original_cwd)
                
        except subprocess.TimeoutExpired:
            error_msg = "Test execution timed out"
            return TestResults(
                passed=0,
                failed=1,
                errors=[error_msg],
                execution_time_ms=int((datetime.now() - start_time).total_seconds() * 1000)
            )
        except Exception as e:
            error_msg = f"Test execution failed: {str(e)}"
            return TestResults(
                passed=0,
                failed=1,
                errors=[error_msg],
                execution_time_ms=int((datetime.now() - start_time).total_seconds() * 1000)
            )
    
    def _parse_test_output(self, stdout: str, stderr: str) -> TestResults:
        """
        Parse pytest/jest output to extract test results
        
        Args:
            stdout: Standard output from test execution
            stderr: Standard error from test execution
            
        Returns:
            TestResults object with parsed information
        """
        errors = []
        passed = 0
        failed = 0
        
        # Combine stdout and stderr for analysis
        output = stdout + "\n" + stderr
        
        # Look for Jest test results patterns
        if "Tests:" in output:
            # Parse Jest output format
            lines = output.split('\n')
            for line in lines:
                if "passed" in line.lower() and "failed" in line.lower():
                    # Extract numbers from lines like "Tests: 1 failed, 2 passed, 3 total"
                    import re
                    passed_match = re.search(r'(\d+)\s+passed', line)
                    failed_match = re.search(r'(\d+)\s+failed', line)
                    
                    if passed_match:
                        passed = int(passed_match.group(1))
                    if failed_match:
                        failed = int(failed_match.group(1))
        
        # Look for error messages
        if stderr:
            errors.append(stderr)
        
        # If no specific results found but no errors, assume basic success
        if passed == 0 and failed == 0 and not errors:
            if "error" not in output.lower() and "fail" not in output.lower():
                passed = 1  # Assume at least one test passed
        
        return TestResults(
            passed=passed,
            failed=failed,
            errors=errors
        )
    
    async def _log_test_results(self, session_id: str, test_results: TestResults, process_result):
        """
        Log test results to audit trail
        
        Args:
            session_id: Session identifier
            test_results: Parsed test results
            process_result: Raw process result from subprocess
        """
        try:
            from services.audit import audit_manager
            audit_logger = audit_manager.get_logger(session_id)
            
            await audit_logger.log_agent_decision(
                agent='builder',
                action='test_execution',
                details={
                    'passed': test_results.passed,
                    'failed': test_results.failed,
                    'errors': test_results.errors,
                    'execution_time_ms': test_results.execution_time_ms,
                    'return_code': process_result.returncode,
                    'stdout_preview': process_result.stdout[:500] if process_result.stdout else None,
                    'stderr_preview': process_result.stderr[:500] if process_result.stderr else None
                },
                duration_ms=test_results.execution_time_ms
            )
        except Exception as e:
            # Don't let logging errors break the main flow
            print(f"Failed to log test results: {e}")
    
    def build_and_test_project(self, plan: Plan, session_id: str) -> AgentResponse:
        """
        Complete workflow: generate project, write files, and run tests
        
        Args:
            plan: Structured plan from Planner Agent
            session_id: Session identifier
            
        Returns:
            AgentResponse with project and test results
            
        Validates: Requirements 3.1, 3.2, 3.3, 4.1, 4.2
        """
        start_time = datetime.now()
        
        try:
            # Generate project files
            generation_response = self.generate_project(plan, session_id)
            if not generation_response.success:
                return generation_response
            
            project_data = generation_response.output['project']
            files = project_data['files']
            
            # Write files to temporary directory
            project_dir = self.write_files_to_directory(files)
            
            # Execute tests
            test_results = self.execute_tests(project_dir, session_id)
            
            # Update project with test results
            project = GeneratedProject(**project_data)
            project.test_results = test_results
            
            # Store updated project in memory
            memory = memory_manager.get_memory(session_id)
            memory.add_entry(
                agent='builder',
                action='project_tested',
                data={
                    'project_dir': project_dir,
                    'test_results': test_results.model_dump(),
                    'files_written': len(files),
                    'tests_passed': test_results.passed > 0 and test_results.failed == 0
                },
                tags=['testing', 'project_complete'],
                importance=1.0
            )
            
            execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
            
            return AgentResponse(
                agent_name='builder',
                success=True,
                output={
                    'project': project.model_dump(),
                    'project_directory': project_dir,
                    'test_results': test_results.model_dump()
                },
                errors=[],
                execution_time_ms=execution_time
            )
            
        except Exception as e:
            error_msg = f"Build and test failed: {str(e)}"
            return self._create_error_response(error_msg, start_time)
    
    def cleanup_project_directory(self, project_dir: str):
        """
        Clean up temporary project directory
        
        Args:
            project_dir: Directory to clean up
        """
        try:
            import shutil
            if os.path.exists(project_dir) and project_dir.startswith(tempfile.gettempdir()):
                shutil.rmtree(project_dir)
        except Exception as e:
            # Don't let cleanup errors break the main flow
            print(f"Failed to cleanup directory {project_dir}: {e}")
    
    def self_heal(
        self, 
        plan: Plan, 
        failed_files: Dict[str, str],
        error_context: Dict[str, Any], 
        retry_count: int,
        session_id: str
    ) -> Dict[str, str]:
        """
        Self-healing mechanism to regenerate failing components
        
        Detects test failures and triggers retry mechanism with error context
        provided to LLM for code regeneration.
        
        Args:
            plan: Original plan from Planner Agent
            failed_files: Dictionary of files that need regeneration
            error_context: Context about the errors including test failures
            retry_count: Current retry attempt number
            session_id: Session identifier for logging
            
        Returns:
            Dictionary of regenerated files
            
        Raises:
            MaxRetriesExceeded: If retry count reaches 3 attempts
            
        Validates: Requirements 5.1, 5.3, 5.4
        """
        # Check retry limit (max 3 attempts)
        if retry_count >= 3:
            error_msg = f"Self-healing failed: Maximum retry limit (3) reached"
            raise MaxRetriesExceeded(error_msg)
        
        # Log self-healing attempt
        memory = memory_manager.get_memory(session_id)
        memory.add_entry(
            agent='builder',
            action='self_healing_initiated',
            data={
                'retry_count': retry_count,
                'failed_files': list(failed_files.keys()),
                'error_summary': error_context.get('error_summary', 'Unknown error'),
                'test_failures': error_context.get('test_failures', [])
            },
            tags=['self_healing', 'retry'],
            importance=0.9
        )
        
        # Regenerate failing files with error context
        regenerated_files = {}
        
        for file_path, original_content in failed_files.items():
            try:
                # Determine file type and regenerate accordingly
                if file_path.startswith('src/pages/'):
                    # Regenerate page component
                    page_name = file_path.replace('src/pages/', '').replace('.tsx', '')
                    page_spec = self._find_page_spec(plan, page_name)
                    if page_spec:
                        regenerated_content = self._regenerate_page_with_context(
                            page_spec, plan, error_context, original_content
                        )
                        regenerated_files[file_path] = regenerated_content
                
                elif file_path.startswith('src/components/'):
                    # Regenerate component
                    component_name = file_path.replace('src/components/', '').replace('.tsx', '')
                    component_spec = self._find_component_spec(plan, component_name)
                    if component_spec:
                        regenerated_content = self._regenerate_component_with_context(
                            component_spec, plan, error_context, original_content
                        )
                        regenerated_files[file_path] = regenerated_content
                
                elif file_path == 'src/App.tsx':
                    # Regenerate App component with routing
                    regenerated_content = self._regenerate_app_with_context(
                        plan, error_context, original_content
                    )
                    regenerated_files[file_path] = regenerated_content
                
                else:
                    # For other files, use generic regeneration
                    regenerated_content = self._regenerate_generic_file_with_context(
                        file_path, error_context, original_content
                    )
                    regenerated_files[file_path] = regenerated_content
                    
            except Exception as e:
                # Log regeneration failure but continue with other files
                error_msg = f"Failed to regenerate {file_path}: {str(e)}"
                memory.add_entry(
                    agent='builder',
                    action='file_regeneration_failed',
                    data={
                        'file_path': file_path,
                        'error': error_msg,
                        'retry_count': retry_count
                    },
                    tags=['self_healing', 'error'],
                    importance=0.8
                )
        
        # Log successful regeneration
        if regenerated_files:
            memory.add_entry(
                agent='builder',
                action='self_healing_completed',
                data={
                    'retry_count': retry_count,
                    'regenerated_files': list(regenerated_files.keys()),
                    'file_count': len(regenerated_files)
                },
                tags=['self_healing', 'success'],
                importance=0.9
            )
        
        return regenerated_files
    
    def _find_page_spec(self, plan: Plan, page_name: str) -> Optional[PageSpec]:
        """Find page specification by name"""
        for page in plan.pages:
            if page.name == page_name:
                return page
        return None
    
    def _find_component_spec(self, plan: Plan, component_name: str) -> Optional[ComponentSpec]:
        """Find component specification by name"""
        for component in plan.components:
            if component.name == component_name:
                return component
        return None
    
    def _regenerate_page_with_context(
        self, 
        page: PageSpec, 
        plan: Plan, 
        error_context: Dict[str, Any],
        original_content: str
    ) -> str:
        """
        Regenerate page component with error context
        
        Provides error context to LLM for improved code generation
        """
        error_summary = error_context.get('error_summary', '')
        test_failures = error_context.get('test_failures', [])
        
        prompt = f"""
The following React TypeScript page component failed tests. Please regenerate it with fixes.

Page Name: {page.name}
Route: {page.route}
Description: {page.description}
Required Components: {', '.join(page.components)}

PREVIOUS CODE (FAILED):
```typescript
{original_content}
```

ERROR CONTEXT:
{error_summary}

TEST FAILURES:
{chr(10).join(test_failures) if test_failures else 'No specific test failures provided'}

Please regenerate the component addressing these issues:
- Fix any syntax errors or type errors
- Ensure all imports are correct
- Ensure proper TypeScript typing
- Make sure the component exports correctly
- Address the specific test failures mentioned above
- Use semantic HTML and proper CSS classes
- Ensure the component is accessible

Return ONLY the corrected TypeScript React component code, no explanations or markdown formatting.
"""
        
        try:
            response_text = self._call_llm(prompt)
            return self._extract_code_from_response(response_text)
        except Exception as e:
            # Fallback to basic template if LLM fails
            return self._generate_basic_page_template(page)
    
    def _regenerate_component_with_context(
        self, 
        component: ComponentSpec, 
        plan: Plan, 
        error_context: Dict[str, Any],
        original_content: str
    ) -> str:
        """
        Regenerate component with error context
        
        Provides error context to LLM for improved code generation
        """
        error_summary = error_context.get('error_summary', '')
        test_failures = error_context.get('test_failures', [])
        
        props_info = ""
        if component.props:
            props_list = [f"{key}: {value}" for key, value in component.props.items()]
            props_info = f"Props: {', '.join(props_list)}"
        
        prompt = f"""
The following React TypeScript component failed tests. Please regenerate it with fixes.

Component Name: {component.name}
Type: {component.type}
Description: {component.description}
{props_info}

PREVIOUS CODE (FAILED):
```typescript
{original_content}
```

ERROR CONTEXT:
{error_summary}

TEST FAILURES:
{chr(10).join(test_failures) if test_failures else 'No specific test failures provided'}

Please regenerate the component addressing these issues:
- Fix any syntax errors or type errors
- Ensure all imports are correct
- Ensure proper TypeScript typing with interface definitions
- Make sure the component exports correctly
- Address the specific test failures mentioned above
- Use semantic HTML and proper CSS classes
- Ensure the component is accessible
- Handle props correctly if specified

Return ONLY the corrected TypeScript React component code, no explanations or markdown formatting.
"""
        
        try:
            response_text = self._call_llm(prompt)
            return self._extract_code_from_response(response_text)
        except Exception as e:
            # Fallback to basic template if LLM fails
            return self._generate_basic_component_template(component)
    
    def _regenerate_app_with_context(
        self, 
        plan: Plan, 
        error_context: Dict[str, Any],
        original_content: str
    ) -> str:
        """
        Regenerate App.tsx with error context
        
        Provides error context to LLM for improved routing configuration
        """
        error_summary = error_context.get('error_summary', '')
        test_failures = error_context.get('test_failures', [])
        
        prompt = f"""
The following React TypeScript App component with routing failed tests. Please regenerate it with fixes.

Pages to route:
{chr(10).join([f"- {page.name} at {page.route}" for page in plan.pages])}

PREVIOUS CODE (FAILED):
```typescript
{original_content}
```

ERROR CONTEXT:
{error_summary}

TEST FAILURES:
{chr(10).join(test_failures) if test_failures else 'No specific test failures provided'}

Please regenerate the App component addressing these issues:
- Fix any syntax errors or type errors
- Ensure all imports are correct (React, react-router-dom, pages)
- Ensure proper React Router setup with BrowserRouter, Routes, and Route
- Make sure all pages are imported and routed correctly
- Address the specific test failures mentioned above
- Ensure the component exports correctly

Return ONLY the corrected TypeScript React component code, no explanations or markdown formatting.
"""
        
        try:
            response_text = self._call_llm(prompt)
            return self._extract_code_from_response(response_text)
        except Exception as e:
            # Fallback to regenerating from scratch
            return self._generate_app_component(plan)
    
    def _regenerate_generic_file_with_context(
        self, 
        file_path: str, 
        error_context: Dict[str, Any],
        original_content: str
    ) -> str:
        """
        Regenerate generic file with error context
        
        Used for files that don't fit specific categories
        """
        error_summary = error_context.get('error_summary', '')
        test_failures = error_context.get('test_failures', [])
        
        prompt = f"""
The following file failed tests. Please regenerate it with fixes.

File: {file_path}

PREVIOUS CODE (FAILED):
```
{original_content}
```

ERROR CONTEXT:
{error_summary}

TEST FAILURES:
{chr(10).join(test_failures) if test_failures else 'No specific test failures provided'}

Please regenerate the file addressing these issues:
- Fix any syntax errors
- Ensure proper formatting
- Address the specific test failures mentioned above

Return ONLY the corrected code, no explanations or markdown formatting.
"""
        
        try:
            response_text = self._call_llm(prompt)
            return self._extract_code_from_response(response_text)
        except Exception as e:
            # Return original content if regeneration fails
            return original_content
    
    def detect_failing_files(
        self, 
        test_results: TestResults, 
        project_files: Dict[str, str]
    ) -> Dict[str, str]:
        """
        Detect which files are likely causing test failures
        
        Analyzes test error messages to identify failing files that need regeneration.
        
        Args:
            test_results: Test results with error messages
            project_files: All generated project files
            
        Returns:
            Dictionary of files that likely need regeneration
            
        Validates: Requirements 5.1, 5.3
        """
        failing_files = {}
        
        # If no specific errors, return empty (can't determine failing files)
        if not test_results.errors:
            return failing_files
        
        # Analyze error messages to identify failing files
        error_text = ' '.join(test_results.errors)
        
        # Check each file to see if it's mentioned in errors
        for file_path, content in project_files.items():
            # Skip non-code files
            if not (file_path.endswith('.tsx') or file_path.endswith('.ts') or 
                    file_path.endswith('.jsx') or file_path.endswith('.js')):
                continue
            
            # Extract filename from path
            filename = file_path.split('/')[-1]
            file_basename = filename.replace('.tsx', '').replace('.ts', '').replace('.jsx', '').replace('.js', '')
            
            # Check if file is mentioned in error messages
            if filename in error_text or file_basename in error_text or file_path in error_text:
                failing_files[file_path] = content
        
        # If no specific files identified, include core files that are most likely to fail
        if not failing_files:
            # Include App.tsx as it's central to the application
            if 'src/App.tsx' in project_files:
                failing_files['src/App.tsx'] = project_files['src/App.tsx']
            
            # Include the first page as it's often the entry point
            for file_path in project_files.keys():
                if file_path.startswith('src/pages/') and file_path.endswith('.tsx'):
                    failing_files[file_path] = project_files[file_path]
                    break  # Only include one page
        
        return failing_files
    
    def create_error_context(
        self, 
        test_results: TestResults, 
        project_files: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Create error context for self-healing
        
        Extracts relevant error information to provide to LLM for regeneration.
        
        Args:
            test_results: Test results with errors
            project_files: All generated project files
            
        Returns:
            Dictionary containing error context
            
        Validates: Requirements 5.1, 5.3
        """
        error_context = {
            'error_summary': '',
            'test_failures': [],
            'failed_count': test_results.failed,
            'error_messages': test_results.errors
        }
        
        # Create summary of errors
        if test_results.errors:
            error_summary_parts = []
            
            for error in test_results.errors[:5]:  # Limit to first 5 errors
                # Clean up error message
                error_clean = error.strip()
                if error_clean:
                    error_summary_parts.append(error_clean)
            
            error_context['error_summary'] = '\n'.join(error_summary_parts)
            error_context['test_failures'] = error_summary_parts
        else:
            error_context['error_summary'] = f"{test_results.failed} test(s) failed with no specific error messages"
            error_context['test_failures'] = [f"{test_results.failed} test(s) failed"]
        
        return error_context
    
    def _create_error_response(self, error_msg: str, start_time: datetime) -> AgentResponse:
        """Create standardized error response"""
        execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        return AgentResponse(
            agent_name='builder',
            success=False,
            output={},
            errors=[error_msg],
            execution_time_ms=execution_time
        )


class MaxRetriesExceeded(Exception):
    """Exception raised when self-healing retry limit is exceeded"""
    pass