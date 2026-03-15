"""
Builder Agent for AMAR MVP
Generates React code based on plans from Planner Agent using Gemini LLM
Validates: Requirements 3.1, 3.2, 12.4
"""

import asyncio
import json
import os
import re
import shutil
import tempfile
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Dict, List, Optional, Any

from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import ValidationError

from models.core import (
    Plan, GeneratedProject, TestResults, AgentResponse, 
    FileLineage, AuditLogEntry, PageSpec, ComponentSpec, BackendSpec
)
from services.gemini_model_utils import (
    build_gemini_model_candidates,
    normalize_gemini_model_name,
    should_fallback_to_next_model,
)
from services.memory import memory_manager
from services.rate_limiter import get_rate_limiter, RateLimitExceeded, ExponentialBackoff
from services.system_prompt_loader import load_system_prompt
from config import get_settings


def _run_async_in_thread(coro):
    """
    Helper function to run async code from a sync context, even when an event loop is running.
    Uses a thread pool executor to run the coroutine in a new event loop.
    """
    def run_in_new_loop():
        new_loop = asyncio.new_event_loop()
        asyncio.set_event_loop(new_loop)
        try:
            return new_loop.run_until_complete(coro)
        finally:
            new_loop.close()
    
    try:
        # Check if we're in an async context
        asyncio.get_running_loop()
        # We're in an async context, run in a thread with new event loop
        with ThreadPoolExecutor() as executor:
            future = executor.submit(run_in_new_loop)
            return future.result()
    except RuntimeError:
        # No running loop, safe to use asyncio.run()
        return asyncio.run(coro)


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
        self.llm_calls_attempted = 0
        self.llm_calls_succeeded = 0
        self.template_fallback_count = 0
        self.last_llm_model_used: Optional[str] = None
        self.use_custom_client = False
        self.gemini_model_candidates: List[str] = []
        self.current_gemini_model_index = 0
        
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
                
                configured_model = normalize_gemini_model_name(
                    self.settings.gemini_model or "gemini-2.5-pro"
                )
                self.gemini_model_candidates = build_gemini_model_candidates(configured_model)

                self._initialize_gemini_llm(self.gemini_model_candidates[0])
                self.use_custom_client = False
            except Exception as e:
                raise RuntimeError(f"Failed to initialize LLM client: {str(e)}")

    def _initialize_gemini_llm(self, model_name: str) -> None:
        """Initialize Gemini LLM with the given model."""
        self.llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=self.settings.gemini_api_key,
            temperature=0.1,
            max_tokens=8000,
            timeout=90
        )
    
    def _call_llm(self, prompt: str, temperature: float = 0.1, max_tokens: int = 8000) -> str:
        """Helper method to call LLM (OpenAI, Groq, or Gemini)"""
        self.llm_calls_attempted += 1
        if self.use_custom_client:
            self.last_llm_model_used = "custom_client"
            result = self.llm_client.generate_content(prompt, temperature=temperature, max_tokens=max_tokens)
            self.llm_calls_succeeded += 1
            return result

        last_error: Optional[Exception] = None
        for idx in range(self.current_gemini_model_index, len(self.gemini_model_candidates)):
            model_name = self.gemini_model_candidates[idx]
            if idx != self.current_gemini_model_index:
                self.current_gemini_model_index = idx
                self._initialize_gemini_llm(model_name)
                print(f"Builder switched Gemini model to: {model_name}")
            try:
                response = self.llm.invoke(prompt)
                self.last_llm_model_used = model_name
                self.llm_calls_succeeded += 1
                return response.content
            except Exception as e:
                last_error = e
                if not should_fallback_to_next_model(str(e)):
                    raise
                print(f"Builder Gemini model '{model_name}' failed; trying next candidate. Error: {str(e)[:180]}")
                continue

        if last_error:
            raise last_error
        raise RuntimeError("LLM call failed with unknown error")
    
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
        self.llm_calls_attempted = 0
        self.llm_calls_succeeded = 0
        self.template_fallback_count = 0
        self.last_llm_model_used = None
        
        try:
            # Log builder agent start
            print(f"ðŸ”¨ BUILDER: Starting code generation for {len(plan.pages)} page(s) and {len(plan.components)} component(s)")
            
            # Get memory context for this session
            memory = memory_manager.get_memory(session_id)
            context = memory.get_context_for_agent('builder', max_entries=3)
            
            # Generate project files using LLM
            print(f"ðŸ”¨ BUILDER: Generating project files...")
            generated_files = self._generate_project_files(plan, context, session_id)
            print(f"âœ“ BUILDER: Generated {len(generated_files)} files successfully")
            
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
            
            print(f"âœ“ BUILDER: Code generation completed in {execution_time}ms")
            print(f"âœ“ BUILDER: Total files generated: {len(generated_files)}")
            
            return AgentResponse(
                agent_name='builder',
                success=True,
                output={
                    'project': project.model_dump(),
                    'llm_stats': {
                        'attempted': self.llm_calls_attempted,
                        'succeeded': self.llm_calls_succeeded,
                        'template_fallback_count': self.template_fallback_count,
                        'last_model_used': self.last_llm_model_used,
                    }
                },
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
        print(f"ðŸ”¨ BUILDER: Generating package.json...")
        files['package.json'] = self._generate_package_json(plan)
        print(f"  âœ“ Generated: package.json")
        
        # Generate main App.tsx with routing
        print(f"ðŸ”¨ BUILDER: Generating core files (App.tsx, index.tsx, CSS)...")
        files['src/App.tsx'] = self._generate_app_component(plan)
        print(f"  âœ“ Generated: src/App.tsx")
        
        # Generate index.tsx entry point
        files['src/index.tsx'] = self._generate_index_file()
        print(f"  âœ“ Generated: src/index.tsx")
        
        # Generate CSS files
        files['src/index.css'] = self._generate_index_css()
        files['src/App.css'] = self._generate_app_css()
        print(f"  âœ“ Generated: CSS files")
        
        # Generate page components
        if plan.pages:
            print(f"ðŸ”¨ BUILDER: Generating {len(plan.pages)} page component(s)...")
            for i, page in enumerate(plan.pages, 1):
                page_file_path = f"src/pages/{page.name}.tsx"
                print(f"  [{i}/{len(plan.pages)}] Generating page: {page.name}...")
                files[page_file_path] = self._generate_page_component(page, plan, session_id)
                print(f"  âœ“ Generated: {page_file_path}")
        
        # Generate shared components
        if plan.components:
            print(f"ðŸ”¨ BUILDER: Generating {len(plan.components)} shared component(s)...")
            for i, component in enumerate(plan.components, 1):
                component_file_path = f"src/components/{component.name}.tsx"
                print(f"  [{i}/{len(plan.components)}] Generating component: {component.name}...")
                files[component_file_path] = self._generate_component(component, plan, session_id)
                print(f"  âœ“ Generated: {component_file_path}")
        
        # Generate backend logic if specified
        if plan.backend_logic:
            print(f"ðŸ”¨ BUILDER: Generating backend files...")
            backend_files = self._generate_backend_files(plan.backend_logic)
            files.update(backend_files)
            print(f"âœ“ BUILDER: Generated {len(backend_files)} backend file(s)")
        
        # Generate basic test files (optional - skip if it causes issues)
        try:
            print(f"ðŸ”¨ BUILDER: Generating test files...")
            files['src/App.test.tsx'] = self._generate_app_test()
            files['src/setupTests.ts'] = self._generate_setup_tests()
            print(f"  âœ“ Generated: src/App.test.tsx, src/setupTests.ts")
        except Exception as e:
            print(f"  âš ï¸  Warning: Test file generation skipped: {e}")
            # Generate minimal test file as fallback
            files['src/App.test.tsx'] = """import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
});
"""
        
        # Generate README
        print(f"ðŸ”¨ BUILDER: Generating README.md...")
        files['README.md'] = self._generate_readme(plan)
        print(f"  âœ“ Generated: README.md")
        
        # Generate public directory files (required for react-scripts build)
        print(f"ðŸ”¨ BUILDER: Generating public directory files...")
        files['public/index.html'] = self._generate_index_html(plan)
        files['public/manifest.json'] = self._generate_manifest_json(plan)
        print(f"  âœ“ Generated: public/index.html, public/manifest.json")
        
        # Generate .gitignore file
        print(f"ðŸ”¨ BUILDER: Generating .gitignore...")
        files['.gitignore'] = self._generate_gitignore()
        print(f"  âœ“ Generated: .gitignore")
        
        # Generate TypeScript configuration
        print(f"ðŸ”¨ BUILDER: Generating tsconfig.json...")
        files['tsconfig.json'] = self._generate_tsconfig()
        print(f"  âœ“ Generated: tsconfig.json")
        
        # Generate deployment configuration files
        print(f"ðŸ”¨ BUILDER: Generating deployment config files...")
        files['vercel.json'] = self._generate_vercel_config()
        files['netlify.toml'] = self._generate_netlify_config()
        files['.npmrc'] = self._generate_npmrc()
        print(f"  âœ“ Generated: vercel.json, netlify.toml, .npmrc")
        
        # CRITICAL: Apply auto-correction to ALL TypeScript/TSX files before returning
        # This ensures array type errors are fixed even if they weren't caught earlier
        print(f"ðŸ”¨ BUILDER: Applying code corrections to all TypeScript files...")
        corrected_count = 0
        for file_path, file_content in files.items():
            if file_path.endswith(('.tsx', '.ts')) and isinstance(file_content, str):
                original_content = file_content
                # Check if file contains 'array' type before correction
                import re
                has_array_type = bool(re.search(r':\s*array\s*;', original_content, re.IGNORECASE))
                if has_array_type:
                    print(f"  âš ï¸  Found 'array' type in {file_path}, applying correction...")
                
                corrected_content = self._auto_correct_code_errors(file_content)
                if original_content != corrected_content:
                    files[file_path] = corrected_content
                    corrected_count += 1
                    print(f"  âœ“ Auto-corrected: {file_path}")
                elif has_array_type:
                    # If we detected array but correction didn't change anything, try more aggressive fix
                    corrected_content = re.sub(
                        r':\s*array\s*;',
                        ': string[];',
                        corrected_content,
                        flags=re.IGNORECASE | re.MULTILINE
                    )
                    if corrected_content != original_content:
                        files[file_path] = corrected_content
                        corrected_count += 1
                        print(f"  âœ“ Auto-corrected (aggressive): {file_path}")
        
        if corrected_count > 0:
            print(f"  âœ“ Applied corrections to {corrected_count} file(s)")
        else:
            print(f"  âœ“ All TypeScript files validated (no corrections needed)")
        
        return files
    
    def _generate_package_json(self, plan: Plan) -> str:
        """
        Generate package.json with required dependencies
        
        Uses latest stable versions to avoid deprecation warnings during deployment.
        
        Validates: Requirements 13.2
        """
        dependencies = {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.8.0",
            "react-scripts": "5.0.1",
            "typescript": "4.9.5",
            "@types/react": "^18.0.28",
            "@types/react-dom": "^18.0.11",
            "@mui/material": "^5.14.0",
            "@mui/icons-material": "^5.14.0",
            "@emotion/react": "^11.11.1",
            "@emotion/styled": "^11.11.0",
            "web-vitals": "^3.5.0",
            "ajv": "^8.12.0"  # Explicitly add ajv for compatibility with react-scripts 5.0.1
        }
        
        dev_dependencies = {
            "@testing-library/jest-dom": "^6.1.5",
            "@testing-library/react": "^14.1.2",
            "@testing-library/user-event": "^14.5.1",
            "@types/jest": "^29.5.8"
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
        """Generate main App.tsx component with MUI ThemeProvider and routing"""
        # Generate imports for all pages
        page_imports = []
        routes = []
        
        for page in plan.pages:
            page_imports.append(f"import {page.name} from './pages/{page.name}';")
            routes.append(f'          <Route path="{page.route}" element={{<{page.name} />}} />')
        
        imports_str = '\n'.join(page_imports)
        routes_str = '\n'.join(routes)
        
        app_component = f"""import React from 'react';
import {{ BrowserRouter as Router, Routes, Route }} from 'react-router-dom';
import {{ createTheme, ThemeProvider }} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
{imports_str}

const theme = createTheme({{
  palette: {{
    mode: 'light',
    primary: {{
      main: '#667eea',
      light: '#a5b4fc',
      dark: '#4c51bf',
    }},
    secondary: {{
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    }},
    background: {{
      default: '#f8fafc',
      paper: '#ffffff',
    }},
  }},
  typography: {{
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {{ fontSize: '3.5rem', fontWeight: 700 }},
    h2: {{ fontSize: '2.5rem', fontWeight: 600 }},
    button: {{ textTransform: 'none', fontWeight: 600 }},
  }},
  shape: {{ borderRadius: 12 }},
}});

function App() {{
  return (
    <ThemeProvider theme={{theme}}>
      <CssBaseline />
      <Router>
        <Routes>
{routes_str}
        </Routes>
      </Router>
    </ThemeProvider>
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
import App from './App';

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
        Generate individual page component using LLM with MUI validation
        
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
            generated_code = self._extract_code_from_response(response_text)
            
            # Validate MUI compliance (safe fallback if validator is unavailable)
            mui_validator = getattr(self, '_validate_mui_compliance', None)
            if callable(mui_validator) and mui_validator(generated_code, 'page'):
                return generated_code
            else:
                regen = getattr(self, '_regenerate_with_stricter_prompt', None)
                if callable(regen):
                    return regen(generated_code, 'page', page, plan, session_id)
                self.template_fallback_count += 1
                return self._generate_basic_page_template(page)
                
        except Exception as e:
            print(f" Page generation failed: {e}, using MUI fallback template")
            # Fallback to MUI template if LLM call fails
            self.template_fallback_count += 1
            return self._generate_basic_page_template(page)
    
    def _generate_component(self, component: ComponentSpec, plan: Plan, session_id: str) -> str:
        """
        Generate individual component using LLM with MUI validation
        
        Uses exponential backoff for retries on rate limit errors.
        
        Args:
            component: Component specification
            plan: Complete plan
            session_id: Session identifier for rate limiting
            
        Returns:
            Generated component code
            
        Validates: Requirements 10.4, 10.5
        """
        try:
            prompt = self._create_component_generation_prompt(component, plan)
        except Exception as e:
            # If prompt generation fails, use fallback template
            print(f"  âš ï¸  Warning: Prompt generation failed, using MUI template: {e}")
            self.template_fallback_count += 1
            return self._generate_basic_component_template(component)
        
        try:
            # Check rate limit before making LLM call
            self.rate_limiter.check_and_increment(session_id)
        except RateLimitExceeded:
            # Re-raise rate limit exceptions
            raise
        
        # Call LLM directly - let LangChain handle retries naturally
        try:
            response_text = self._call_llm(prompt)
            generated_code = self._extract_code_from_response(response_text)
            
            # Validate MUI compliance (safe fallback if validator is unavailable)
            mui_validator = getattr(self, '_validate_mui_compliance', None)
            if callable(mui_validator) and mui_validator(generated_code, 'component'):
                return generated_code
            else:
                regen = getattr(self, '_regenerate_with_stricter_prompt', None)
                if callable(regen):
                    return regen(generated_code, 'component', component, plan, session_id)
                self.template_fallback_count += 1
                return self._generate_basic_component_template(component)
                
        except Exception as e:
            # Fallback to MUI template if LLM call fails
            print(f"  âš ï¸  Warning: LLM call failed, using MUI template: {e}")
            self.template_fallback_count += 1
            return self._generate_basic_component_template(component)
    
    def _create_page_generation_prompt(self, page: PageSpec, plan: Plan) -> str:
        """
        Create prompt for generating page component using RAG-enhanced system prompt
        
        Validates: Requirements 13.3
        """
        # Prefer deterministic local builder prompt; fallback to RAG.
        system_prompt = load_system_prompt("builder_agent_comprehensive_prompt.md") or ""
        if system_prompt:
            print(f"Loaded builder system prompt from file ({len(system_prompt)} chars)")
        else:
            from services.rag_service import get_rag_service
            rag_service = get_rag_service()
            if rag_service.is_enabled:
                try:
                    rag_result = _run_async_in_thread(rag_service.retrieve_context(
                        "builder agent system prompt comprehensive instructions styling requirements",
                        top_k=1
                    ))
                    if rag_result and rag_result.get('retrieved_docs'):
                        system_prompt = rag_result['retrieved_docs'][0]['content']
                        print(f"Loaded builder system prompt from RAG ({len(system_prompt)} chars)")
                except Exception as e:
                    print(f"Failed to load builder system prompt from RAG: {e}")
        
        # Validate page attributes
        if not page:
            raise ValueError("Page specification is None")
        if not page.name:
            raise ValueError("Page name is required")
        
        components_list = [comp.name for comp in plan.components if comp and comp.name and comp.name in (page.components or [])]
        
        # Check if this page needs backend integration
        backend_info = ""
        if plan.backend_logic and hasattr(plan.backend_logic, 'endpoints') and plan.backend_logic.endpoints:
            # Identify relevant endpoints for this page
            relevant_endpoints = self._identify_relevant_endpoints(page, plan.backend_logic)
            
            if relevant_endpoints:
                endpoint_details = []
                for ep in relevant_endpoints:
                    # Skip None endpoints
                    if ep is None:
                        continue
                    # Handle both dict and object endpoints
                    if isinstance(ep, dict):
                        method = ep.get('method', 'GET')
                        path = ep.get('path', '')
                        desc = ep.get('description', 'API endpoint')
                    else:
                        method = getattr(ep, 'method', 'GET') or 'GET'
                        path = getattr(ep, 'path', '') or ''
                        desc = getattr(ep, 'description', 'API endpoint') or 'API endpoint'
                    
                    endpoint_details.append(f"  - {method} {path}: {desc}")
                
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
        
        # Generate example imports for clarity (NO extensions for TypeScript 4.9.5)
        example_imports = '\n'.join([f"import {comp} from '../components/{comp}';" for comp in components_list])
        
        # Use concise prompt contract to keep generations deterministic and token-efficient
        prompt = f"""
{system_prompt}

PAGE GENERATION TASK
- Generate ONE complete TSX page file for: {page.name}
- Route: {page.route}
- Purpose: {page.description}
- Must compose these shared components when relevant: {', '.join(components_list) if components_list else 'none'}

MANDATORY IMPORTS:
```typescript
import React from 'react';
import {{ Box, Container, Typography, Button, Card, CardContent, Grid, Stack }} from '@mui/material';
import {{ ArrowForward, Star, Speed, Security }} from '@mui/icons-material';
{example_imports}
```

MANDATORY COMPONENT REPLACEMENTS:
 FORBIDDEN: <div>, <h1>, <p>, <button>, <form>, <input>
 REQUIRED: <Box>, <Typography variant="h1">, <Typography variant="body1">, <Button>, <TextField>

MANDATORY STRUCTURE:
1. Hero section with clear value proposition and CTA.
2. Content sections that satisfy the page purpose.
3. Responsive layout and accessibility-safe interactions.
4. Professional copy; no placeholders.

PROPS INTERFACE MATCHING (CRITICAL):
- For every imported component usage, only pass props that are explicitly defined for that component in the plan.
- If a prop is not explicitly defined in the component spec, do NOT pass it.
- Safe fallback: render the component without props (example: <ComponentName />).
- Never invent ad-hoc props during page generation.

EXAMPLE HERO SECTION:
```typescript
<Box sx={{{{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  py: 12,
  textAlign: 'center'
}}}}>
  <Container maxWidth="lg">
    <Typography variant="h1" sx={{{{ mb: 3, fontWeight: 700 }}}}>
      Revolutionary Platform
    </Typography>
    <Typography variant="h5" sx={{{{ mb: 4, opacity: 0.9, maxWidth: '600px', mx: 'auto' }}}}>
      Transform your business with our cutting-edge solution that delivers exceptional results
    </Typography>
    <Button 
      variant="contained" 
      size="large" 
      endIcon={{<ArrowForward />}}
      sx={{{{ px: 4, py: 1.5, fontSize: '1.1rem', bgcolor: 'secondary.main' }}}}
    >
      Get Started Today
    </Button>
  </Container>
</Box>
```

{backend_info}

VALIDATION CHECKLIST:
- [ ] All imports from @mui/material or @mui/icons-material
- [ ] No plain HTML elements (div, h1, p, button, etc.)
- [ ] Rich content with useful business detail
- [ ] Colorful, professional design with gradients
- [ ] sx prop used for styling
- [ ] Proper TypeScript interfaces
- [ ] No template literals/backticks in code

Generate ONLY the complete page component code. No explanations."""
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
        if not backend_spec or not hasattr(backend_spec, 'endpoints') or not backend_spec.endpoints:
            return relevant_endpoints
        
        page_name_lower = (page.name or "").lower()
        page_desc_lower = (page.description or "").lower()
        
        for endpoint in backend_spec.endpoints:
            # Skip None endpoints
            if endpoint is None:
                continue
            
            # Handle both dict and object endpoints
            if isinstance(endpoint, dict) and endpoint:
                endpoint_path = endpoint.get('path', '').lower() if endpoint.get('path') else ''
                endpoint_desc = endpoint.get('description', '').lower() if endpoint.get('description') else ''
            else:
                endpoint_path = (getattr(endpoint, 'path', '') or '').lower()
                endpoint_desc = (getattr(endpoint, 'description', '') or '').lower()
            
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
        Create a strict, production-grade prompt for generating one React component.

        Validates: Requirements 13.3
        """
        if not component:
            raise ValueError("Component specification is None")
        if not component.name:
            raise ValueError("Component name is required")

        props_info = ""
        if component.props:
            props_list = [f"{key}?: {value}" for key, value in component.props.items()]
            props_info = f"Props (all optional): {', '.join(props_list)}"
        else:
            props_info = "Props: children?: React.ReactNode"

        backend_info = ""
        component_name_lower = (component.name or "").lower()
        component_desc_lower = (component.description or "").lower()

        try:
            has_backend = bool(
                plan
                and plan.backend_logic
                and hasattr(plan.backend_logic, 'endpoints')
                and plan.backend_logic.endpoints
            )
        except (AttributeError, TypeError):
            has_backend = False

        if has_backend:
            is_form_component = any(
                keyword in component_name_lower or keyword in component_desc_lower
                for keyword in ['form', 'contact', 'submit', 'search', 'input', 'newsletter']
            )
            if is_form_component:
                backend_info = """
BACKEND INTEGRATION REQUIREMENTS:
- Use controlled form state with useState
- Submit data via fetch with async/await
- Include loading, success, and error UI states
- Use Alert and helper text for user feedback
- Keep API URL in a constant and type response data
"""

        system_prompt = load_system_prompt("builder_agent_comprehensive_prompt.md") or ""

        prompt = f"""
{system_prompt}

You are a senior React + TypeScript + Material UI engineer.
Generate a single reusable component that is production-ready, visually polished, and safe for direct deployment.

NON-NEGOTIABLE RULES:
1. Use ONLY Material UI primitives for layout and UI (Box, Container, Stack, Grid, Paper, Card, Typography, Button, TextField, etc.).
2. Do NOT use raw HTML layout tags for structure (no div/header/section/footer/main/nav/article).
3. Use TypeScript with strict typing; do not use any.
4. All component props must be optional and have sensible defaults.
5. Component must render correctly even when called as <{component.name} />.
6. Styling must use sx and include a distinctive, modern visual direction (color system, spacing rhythm, elevation, and responsive behavior).
7. Accessibility is required: semantic MUI structure, aria-label where needed, visible focus states, sufficient color contrast.

COMPONENT SPEC:
- Name: {component.name}
- Type: {component.type}
- Description: {component.description}
- {props_info}
{backend_info}

OUTPUT CONTRACT:
- Return ONLY valid TSX code for this component file.
- Include imports.
- Export default {component.name}.
- No markdown fences.
- No explanation text.
- Do NOT use JavaScript template literals (no backticks). Use normal quoted strings only.

QUALITY CHECKLIST (must pass):
- Build-safe TypeScript syntax
- Responsive on mobile and desktop
- Clear visual hierarchy
- Professional copy (not placeholder gibberish)
- No TODO/FIXME markers
- Props passed from parent must exist in child component interface
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
                        # Auto-correct common errors before validation
                        code = self._auto_correct_code_errors(code)
                        # Validate the extracted code
                        self._validate_generated_code(code)
                        return code
        
        # If no code blocks found, return the entire response cleaned up
        code = response_text.strip()
        # Auto-correct common errors before validation
        code = self._auto_correct_code_errors(code)
        self._validate_generated_code(code)
        return code
    
    def _auto_correct_code_errors(self, code: str) -> str:
        """
        Automatically correct common TypeScript errors in generated code
        
        Fixes:
        - array type  string[] (or appropriate type)
        - function type  () => void (arrow function syntax)
        - Missing semicolons in interfaces
        - Other common syntax issues
        
        Args:
            code: Generated code string
            
        Returns:
            Corrected code string
        """
        import re
        
        # CRITICAL FIX 1: Replace 'function' type with appropriate arrow function syntax
        # Pattern: propName?: function; or propName?: function (causes SyntaxError)
        # This fixes: SyntaxError: Unexpected token 'function'
        
        # Context-aware replacements - use appropriate signatures based on prop name
        
        # Form submission handlers - need data parameter
        code = re.sub(
            r'(onSubmit)\s*\?:\s*function\s*;?',
            r'\1?: (data: any) => void | Promise<void>;',
            code,
            flags=re.MULTILINE | re.IGNORECASE
        )
        
        # Change handlers - need value parameter
        code = re.sub(
            r'(onChange|onInput|onSelect)\s*\?:\s*function\s*;?',
            r'\1?: (value: any) => void;',
            code,
            flags=re.MULTILINE | re.IGNORECASE
        )
        
        # Event handlers - need event parameter
        code = re.sub(
            r'(onClick|onMouseEnter|onMouseLeave|onFocus|onBlur|onKeyPress|onKeyDown|onKeyUp)\s*\?:\s*function\s*;?',
            r'\1?: (event: any) => void;',
            code,
            flags=re.MULTILINE | re.IGNORECASE
        )
        
        # Generic callback handlers that might need parameters - use flexible signature
        code = re.sub(
            r'(on[A-Z]\w+|handle[A-Z]\w+|callback)\s*\?:\s*function\s*;?',
            r'\1?: (...args: any[]) => void;',
            code,
            flags=re.MULTILINE
        )
        
        # Remaining function types (non-callback patterns) - simple signature
        code = re.sub(
            r'(\w+)\s*\?:\s*function\s*;?',
            r'\1?: (...args: any[]) => any;',
            code,
            flags=re.MULTILINE
        )
        
        # Fix function in non-optional props too
        code = re.sub(
            r'(onSubmit)\s*:\s*function\s*;?',
            r'\1: (data: any) => void | Promise<void>;',
            code,
            flags=re.MULTILINE | re.IGNORECASE
        )
        
        code = re.sub(
            r'(onChange|onInput|onSelect)\s*:\s*function\s*;?',
            r'\1: (value: any) => void;',
            code,
            flags=re.MULTILINE | re.IGNORECASE
        )
        
        code = re.sub(
            r'(onClick|onMouseEnter|onMouseLeave|onFocus|onBlur)\s*:\s*function\s*;?',
            r'\1: (event: any) => void;',
            code,
            flags=re.MULTILINE | re.IGNORECASE
        )
        
        code = re.sub(
            r'(\w+)\s*:\s*function\s*;?',
            r'\1: (...args: any[]) => any;',
            code,
            flags=re.MULTILINE
        )
        
        # Also fix Function (capital F) - too generic but valid
        # Replace with flexible arrow syntax
        code = re.sub(
            r'(onSubmit)\s*\?:\s*Function\s*;?',
            r'\1?: (data: any) => void | Promise<void>;',
            code,
            flags=re.MULTILINE | re.IGNORECASE
        )
        
        code = re.sub(
            r'(on[A-Z]\w+|handle[A-Z]\w+)\s*\?:\s*Function\s*;?',
            r'\1?: (...args: any[]) => void;',
            code,
            flags=re.MULTILINE
        )
        
        code = re.sub(
            r'(\w+)\s*\?:\s*Function\s*;?',
            r'\1?: (...args: any[]) => any;',
            code,
            flags=re.MULTILINE
        )
        
        code = re.sub(
            r'(\w+)\s*:\s*Function\s*;?',
            r'\1: (...args: any[]) => any;',
            code,
            flags=re.MULTILINE
        )
        
        # CRITICAL FIX 2: Replace 'array' type with 'string[]' (most common case)
        # Pattern: propName?: array; or propName?: array (with or without semicolon, with or without spaces)
        # This fixes TS2552: Cannot find name 'array'
        # More robust pattern that catches all variations
        code = re.sub(
            r'(\w+)\s*\?:\s*array\s*;?',
            r'\1?: string[];',
            code,
            flags=re.MULTILINE
        )
        
        # Fix array in non-optional props too (propName: array)
        code = re.sub(
            r'(\w+)\s*:\s*array\s*;?',
            r'\1: string[];',
            code,
            flags=re.MULTILINE
        )
        
        # Also fix Array without type parameter (less common but possible)
        # Pattern: propName?: Array;  propName?: Array<string>;
        code = re.sub(
            r'(\w+)\s*\?:\s*Array\s*;',
            r'\1?: Array<string>;',
            code,
            flags=re.MULTILINE
        )
        
        # Fix Array in non-optional props
        code = re.sub(
            r'(\w+)\s*:\s*Array\s*;',
            r'\1: Array<string>;',
            code,
            flags=re.MULTILINE
        )
        
        # Final check: if any 'array' (case-insensitive) remains as a type, replace it
        # This is a catch-all for any edge cases
        code = re.sub(
            r':\s*array\s*;',
            ': string[];',
            code,
            flags=re.IGNORECASE | re.MULTILINE
        )

        # Fix common JSX numeric prop mistakes generated by LLMs
        # Example: <Grid container spacing=4>  ->  <Grid container spacing={4}>
        numeric_jsx_props = (
            "spacing|rowSpacing|columnSpacing|xs|sm|md|lg|xl|elevation|order|gap|"
            "p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|zIndex|top|right|bottom|left"
        )
        code = re.sub(
            rf'(\b(?:{numeric_jsx_props}))=(\d+)(?=[\s>/])',
            r'\1={\2}',
            code
        )
        
        return code
    
    def _validate_generated_code(self, code: str) -> None:
        """
        Validate generated code for common errors
        
        Checks for:
        - Invalid 'array' type usage (TS2552 error)
        - Duplicate component definitions (import + local definition)
        - Missing imports
        - Syntax errors
        
        Raises:
            ValueError: If validation fails
        """
        import re
        
        # CRITICAL: Check for 'array' type usage (causes TS2552 build error)
        # More comprehensive pattern to catch all variations
        array_type_pattern = r'\w+\s*\??:\s*array\s*;?'
        array_matches = re.findall(array_type_pattern, code, re.IGNORECASE | re.MULTILINE)
        if array_matches:
            # This should have been auto-corrected, but if it wasn't, apply correction now
            print(f"  âš ï¸  Warning: Found 'array' type usage in code. Applying auto-correction...")
            code = self._auto_correct_code_errors(code)
            # Re-check after correction
            array_matches_after = re.findall(array_type_pattern, code, re.IGNORECASE | re.MULTILINE)
            if array_matches_after:
                print(f"  âš ï¸  Warning: Some 'array' types may still remain. Please review the code.")
        
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

        # Detect broken template literal syntax (common LLM failure in TSX)
        if code.count('`') % 2 != 0:
            raise ValueError("Code validation error: Unterminated template literal")
        
        # Check for required imports
        if 'React' in code and 'import React' not in code and 'import * as React' not in code:
            raise ValueError("Code validation error: React is used but not imported")
    
    def _generate_basic_page_template(self, page: PageSpec) -> str:
        """Generate MUI-based page template as fallback"""
        # Validate page attributes
        if not page:
            raise ValueError("Page specification is None")
        if not page.name:
            raise ValueError("Page name is required")
        
        page_name = page.name or "Page"
        component_imports = []
        component_usage = []
        
        for comp_name in (page.components or []):
            if comp_name not in ['Header', 'Footer']:  # These are handled separately
                component_imports.append(f"import {comp_name} from '../components/{comp_name}';")
                component_usage.append(f"          <{comp_name} />")
        
        imports_str = '\n'.join(component_imports)
        usage_str = '\n'.join(component_usage)
        
        return f"""import React from 'react';
import {{ Box, Container, Typography, Button, Card, CardContent, Grid, Stack }} from '@mui/material';
import {{ ArrowForward, Star, Speed, Security }} from '@mui/icons-material';
{imports_str}

const {page_name}: React.FC = () => {{
  return (
    <Box>
      {{/* Hero Section */}}
      <Box sx={{{{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 12,
        textAlign: 'center'
      }}}}>
        <Container maxWidth="lg">
          <Typography variant="h1" sx={{{{ mb: 3, fontWeight: 700 }}}}>
            {page.name.replace('Page', '').replace('Home', 'Welcome to Our Platform')}
          </Typography>
          <Typography variant="h5" sx={{{{ mb: 4, opacity: 0.9, maxWidth: '700px', mx: 'auto' }}}}>
            {page.description}
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            endIcon={{<ArrowForward />}}
            sx={{{{ px: 4, py: 1.5, fontSize: '1.1rem', bgcolor: 'secondary.main' }}}}
          >
            Get Started Today
          </Button>
        </Container>
      </Box>

      {{/* Components Section */}}
      <Container maxWidth="lg" sx={{{{ py: 6 }}}}>
{usage_str}
      </Container>

      {{/* Features Section */}}
      <Container maxWidth="lg" sx={{{{ py: 8 }}}}>
        <Typography variant="h2" align="center" sx={{{{ mb: 6, color: 'primary.main' }}}}>
          Highlights
        </Typography>
        <Grid container spacing={4}>
          {{[
            {{ 
              icon: <Star sx={{{{ fontSize: '3rem' }}}} />, 
              title: 'Fresh Daily Preparation', 
              desc: 'Every item is prepared with attention to consistency, flavor, and presentation for a complete dining experience.' 
            }},
            {{ 
              icon: <Speed sx={{{{ fontSize: '3rem' }}}} />, 
              title: 'Fast and Friendly Service', 
              desc: 'Orders and reservations are handled quickly so guests can enjoy smooth, reliable service during peak hours.' 
            }},
            {{ 
              icon: <Security sx={{{{ fontSize: '3rem' }}}} />, 
              title: 'Trusted Local Favorite', 
              desc: 'Built around quality ingredients and neighborhood hospitality that keeps guests returning week after week.' 
            }}
          ].map((feature, index) => (
            <Grid item xs={{12}} md={{4}} key={{index}}>
              <Card sx={{{{ height: '100%', textAlign: 'center', p: 3, boxShadow: 3, borderRadius: 3 }}}}>
                <CardContent>
                  <Box sx={{{{ color: 'primary.main', mb: 2 }}}}>
                    {{feature.icon}}
                  </Box>
                  <Typography variant="h5" sx={{{{ mb: 2, fontWeight: 600 }}}}>
                    {{feature.title}}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{{{ lineHeight: 1.6 }}}}>
                    {{feature.desc}}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}}
        </Grid>
      </Container>

      {{/* Call to Action Section */}}
      <Box sx={{{{
        bgcolor: 'primary.main',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}}}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{{{ mb: 3, fontWeight: 600 }}}}>
            Ready to Visit?
          </Typography>
          <Typography variant="h6" sx={{{{ mb: 4, opacity: 0.9 }}}}>
            Plan your next meal, reserve a table, or browse the menu for today’s specials.
          </Typography>
          <Stack direction={{{{ xs: 'column', sm: 'row' }}}} spacing={{2}} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              sx={{{{ bgcolor: 'secondary.main', px: 4, py: 1.5 }}}}
            >
              Explore Menu
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{{{ borderColor: 'white', color: 'white', px: 4, py: 1.5 }}}}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}};

export default {page_name};
"""
    
    def _normalize_prop_type(self, prop_type: str) -> str:
        """
        Normalize prop type to valid TypeScript syntax
        
        Fixes common issues:
        - 'function' -> '() => void'
        - 'Function' -> '() => void'
        - 'callback' -> '() => void'
        """
        prop_type_lower = prop_type.lower().strip()
        
        # Fix function types - 'function' is NOT valid TypeScript syntax
        if prop_type_lower == 'function' or prop_type_lower == 'callback':
            return "() => void"
        elif 'function' in prop_type_lower and '=>' not in prop_type:
            # If it says function but doesn't have arrow syntax, convert it
            return "() => void"
        
        return prop_type
    
    def _get_default_value(self, prop_type: str) -> str:
        """Get default value for a prop type"""
        prop_type_lower = prop_type.lower()
        if 'string' in prop_type_lower:
            return "''"
        elif 'number' in prop_type_lower or 'int' in prop_type_lower:
            return "0"
        elif 'boolean' in prop_type_lower or 'bool' in prop_type_lower:
            return "false"
        elif 'array' in prop_type_lower or '[]' in prop_type:
            return "[]"
        elif 'object' in prop_type_lower or 'dict' in prop_type_lower:
            return "{}"
        elif 'function' in prop_type_lower or 'callback' in prop_type_lower or '=>' in prop_type:
            return "undefined"  # Functions default to undefined
        elif 'function' in prop_type_lower or 'callback' in prop_type_lower or '=>' in prop_type:
            return "undefined"  # Functions default to undefined
        else:
            return "undefined"
    
    def _fix_function_types_in_component(self, code: str, component_name: str) -> str:
        """
        Auto-fix invalid function type syntax in component code
        
        Fixes: 'function' -> '() => void' (function is NOT valid TypeScript syntax)
        
        Args:
            code: Component code to fix
            component_name: Name of the component
            
        Returns:
            Fixed code with valid function types
        """
        # Pattern to match interface definitions
        interface_pattern = rf'interface\s+{component_name}Props\s*\{{([^}}]+)\}}'
        
        def fix_function_types(match):
            interface_body = match.group(1)
            # Fix: prop?: function; -> prop?: () => void;
            # Fix: prop?: Function; -> prop?: () => void;
            fixed_body = re.sub(
                r'(\w+\?)\s*:\s*(function|Function)(\s*;|\s*$)',
                r'\1: () => void;',
                interface_body,
                flags=re.IGNORECASE
            )
            # Also fix without optional: prop: function; -> prop?: () => void;
            fixed_body = re.sub(
                r'(\w+)(\?)?\s*:\s*(function|Function)(\s*;|\s*$)',
                r'\1?: () => void;',
                fixed_body,
                flags=re.IGNORECASE
            )
            return f"interface {component_name}Props {{{fixed_body}}}"
        
        code = re.sub(interface_pattern, fix_function_types, code, flags=re.DOTALL)
        return code
    
    def _fix_required_props_in_component(self, code: str, component_name: str) -> str:
        """
        Auto-fix required props in component code to make them optional
        
        This prevents TS2739 errors: "Type '{}' is missing properties from type 'ComponentProps'"
        
        Args:
            code: Component code to fix
            component_name: Name of the component
            
        Returns:
            Fixed code with all props made optional
        """
        
        # Pattern to match interface definitions like: interface ComponentProps { prop: type; }
        interface_pattern = rf'interface\s+{component_name}Props\s*\{{([^}}]+)\}}'
        
        def make_props_optional(match):
            interface_body = match.group(1)
            # Find all prop definitions (prop: type; or prop?: type;)
            prop_pattern = r'(\s+)(\w+)(\??)\s*:\s*([^;]+);'
            
            def fix_prop(prop_match):
                indent = prop_match.group(1)
                prop_name = prop_match.group(2)
                is_optional = prop_match.group(3)
                prop_type = prop_match.group(4).strip()
                
                # If already optional, return as is
                if is_optional:
                    return f"{indent}{prop_name}?: {prop_type};"
                # Make it optional
                return f"{indent}{prop_name}?: {prop_type};"
            
            fixed_body = re.sub(prop_pattern, fix_prop, interface_body)
            return f"interface {component_name}Props {{{fixed_body}}}"
        
        # Fix interface definition
        code = re.sub(interface_pattern, make_props_optional, code, flags=re.DOTALL)
        
        # Fix function parameters to add default values
        # Pattern: const Component: React.FC<Props> = (props) => {
        # or: const Component: React.FC<Props> = ({ prop1, prop2 }) => {
        func_pattern = rf'const\s+{component_name}\s*:\s*React\.FC<{component_name}Props>\s*=\s*\(([^)]+)\)\s*=>'
        
        def fix_function_params(match):
            params = match.group(1).strip()
            
            # If already has destructuring with defaults, return as is
            if '=' in params:
                return match.group(0)
            
            # If it's just "props" or empty, we need to extract props from interface
            if params == 'props' or params == '' or params == '{}':
                # Try to extract prop names from interface
                interface_match = re.search(interface_pattern, code, re.DOTALL)
                if interface_match:
                    interface_body = interface_match.group(1)
                    prop_names = re.findall(r'(\w+)\??\s*:', interface_body)
                    if prop_names:
                        default_values = []
                        for prop_name in prop_names:
                            # Try to infer type from interface (simplified)
                            prop_type_match = re.search(rf'{prop_name}\??\s*:\s*([^;]+)', interface_body)
                            if prop_type_match:
                                prop_type = prop_type_match.group(1).strip()
                                default_val = self._get_default_value(prop_type)
                                default_values.append(f"{prop_name} = {default_val}")
                        
                        if default_values:
                            new_params = f"{{ {', '.join(default_values)} }}"
                            return match.group(0).replace(params, new_params)
            
            # If it's destructuring without defaults: { prop1, prop2 }
            elif params.startswith('{') and params.endswith('}'):
                props_content = params[1:-1].strip()
                if props_content and '=' not in props_content:
                    prop_names = [p.strip() for p in props_content.split(',') if p.strip()]
                    default_values = []
                    for prop_name in prop_names:
                        # Try to infer type from interface
                        interface_match = re.search(interface_pattern, code, re.DOTALL)
                        if interface_match:
                            interface_body = interface_match.group(1)
                            prop_type_match = re.search(rf'{prop_name}\??\s*:\s*([^;]+)', interface_body)
                            if prop_type_match:
                                prop_type = prop_type_match.group(1).strip()
                                default_val = self._get_default_value(prop_type)
                                default_values.append(f"{prop_name} = {default_val}")
                    
                    if default_values:
                        new_params = f"{{ {', '.join(default_values)} }}"
                        return match.group(0).replace(params, new_params)
            
            return match.group(0)
        
        code = re.sub(func_pattern, fix_function_params, code, flags=re.DOTALL)
        
        return code
    
    def _validate_and_fix_component_props(self, code: str, file_path: str) -> str:
        """
        Validate component code and auto-fix required props and function type issues
        
        Args:
            code: Component code to validate
            file_path: Path to the component file
            
        Returns:
            Fixed code with all props made optional and valid function types
        """
        # Only process component files
        if not file_path.endswith('.tsx') or '/components/' not in file_path:
            return code
        
        # Extract component name from file path
        component_name = os.path.basename(file_path).replace('.tsx', '')
        
        # Check if code has invalid function types (function or Function)
        if re.search(r':\s*(function|Function)\s*;', code, re.IGNORECASE):
            print(f"  âš ï¸  Found invalid function type syntax in {component_name}")
            print(f"  ðŸ”§ Auto-fixing function types...")
            code = self._fix_function_types_in_component(code, component_name)
            print(f"   Fixed function types in {component_name}")
        
        # Check if code has required props (interface without ?)
        interface_pattern = rf'interface\s+{component_name}Props\s*\{{([^}}]+)\}}'
        interface_match = re.search(interface_pattern, code, re.DOTALL)
        
        if interface_match:
            interface_body = interface_match.group(1)
            # Check if any props are required (no ? mark)
            required_props = re.findall(r'(\w+)(?!\?)\s*:\s*[^;]+;', interface_body)
            
            if required_props:
                print(f"  âš ï¸  Found required props in {component_name}: {required_props}")
                print(f"  ðŸ”§ Auto-fixing to make props optional...")
                code = self._fix_required_props_in_component(code, component_name)
                print(f"   Fixed required props in {component_name}")
        
        return code
    
    def _generate_basic_component_template(self, component: ComponentSpec) -> str:
        """Generate MUI-based component template as fallback with OPTIONAL props"""
        # Validate component attributes with safe defaults
        if not component:
            component_name = "Component"
            component_desc = "A React component"
        else:
            component_name = component.name or "Component"
            component_desc = component.description or "A React component"
        
        props_interface = ""
        props_param = ""
        
        has_props = bool(component and component.props)
        
        if component and component.props:
            # CRITICAL: Make ALL props optional with ? mark and include children
            props_list = [f"  {key}?: {value};" for key, value in component.props.items()]
            props_list.append("  children?: React.ReactNode;")
            props_interface = f"""
interface {component_name}Props {{
{chr(10).join(props_list)}
}}

"""
            # CRITICAL: Add default values for all props so component works without props
            default_values = []
            for key, value in component.props.items():
                default_val = self._get_default_value(value)
                default_values.append(f"{key} = {default_val}")
            default_values.append("children")
            props_param = f"{{ {', '.join(default_values)} }}"
        else:
            props_interface = f"""
interface {component_name}Props {{
  children?: React.ReactNode;
}}

"""
            props_param = "{ children }"
        
        return f"""import React from 'react';
import {{ Box, Typography, Card, CardContent, Button }} from '@mui/material';
import {{ Star }} from '@mui/icons-material';

{props_interface}const {component_name}: React.FC<{component_name}Props> = ({props_param}) => {{
  return (
    <Card sx={{{{ p: 3, borderRadius: 3, boxShadow: 2, textAlign: 'center' }}}}>
      <CardContent>
        <Box sx={{{{ color: 'primary.main', mb: 2, fontSize: '2.5rem' }}}}>
          <Star />
        </Box>
        <Typography variant="h4" sx={{{{ mb: 2, fontWeight: 600, color: 'primary.main' }}}}>
          {component_name}
        </Typography>
        <Typography variant="body1" sx={{{{ mb: 3, color: 'text.secondary', lineHeight: 1.6 }}}}>
          {component_desc}
        </Typography>
        {{children && (
          <Box sx={{{{ mt: 3 }}}}>
            {{children}}
          </Box>
        )}}
        <Button 
          variant="contained" 
          sx={{{{ mt: 2, px: 3, py: 1 }}}}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}};

export default {component_name};
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
        if backend_spec.endpoints:
            for endpoint in backend_spec.endpoints:
                if endpoint is None:
                    continue
                # Handle both dict and object endpoints
                if isinstance(endpoint, dict):
                    handler_name = endpoint.get('handler', 'defaultHandler')
                else:
                    handler_name = getattr(endpoint, 'handler', 'defaultHandler') or 'defaultHandler'
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
        
        if not backend_spec.endpoints:
            return self._generate_backend_tests_empty()
        
        for endpoint in backend_spec.endpoints:
            if endpoint is None:
                continue
            # Handle both dict and object endpoints
            if isinstance(endpoint, dict):
                method = endpoint.get('method', 'GET')
                path = endpoint.get('path', '')
                handler_name = endpoint.get('handler', 'defaultHandler')
            else:
                method = getattr(endpoint, 'method', 'GET') or 'GET'
                path = getattr(endpoint, 'path', '') or ''
                handler_name = getattr(endpoint, 'handler', 'defaultHandler') or 'defaultHandler'
            
            method_upper = (method or 'GET').upper()
            if method_upper == 'POST':
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
            
            elif method_upper == 'GET':
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
    
    def _generate_npmrc(self) -> str:
        """
        Generate .npmrc file for consistent dependency resolution
        
        This ensures proper dependency resolution and prevents module not found errors
        like 'ajv/dist/compile/codegen' by ensuring compatible versions are installed.
        """
        return """# npm configuration for consistent dependency resolution
# Use legacy peer deps to handle TypeScript 4.9.5 with react-scripts 5.0.1
legacy-peer-deps=true
# Ensure proper dependency resolution
prefer-offline=false
# Use npm registry
registry=https://registry.npmjs.org/
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
        
        if backend_spec.endpoints:
            for endpoint in backend_spec.endpoints:
                if endpoint is None:
                    continue
                # Handle both dict and object endpoints
                if isinstance(endpoint, dict):
                    handler_name = endpoint.get('handler', 'defaultHandler')
                    method = endpoint.get('method', 'GET')
                    path = endpoint.get('path', '')
                else:
                    handler_name = getattr(endpoint, 'handler', 'defaultHandler') or 'defaultHandler'
                    method = getattr(endpoint, 'method', 'GET') or 'GET'
                    path = getattr(endpoint, 'path', '') or ''
                
                route_imports.append(f"const {handler_name} = require('./api/{handler_name}');")
                route_usage.append(f"app.{method.lower()}('{path}', {handler_name});")
        
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
        # Handle both dict and object endpoints
        if endpoint is None:
            raise ValueError("Endpoint cannot be None")
        
        if isinstance(endpoint, dict):
            method = endpoint.get('method', 'GET')
            path = endpoint.get('path', '')
            handler_name = endpoint.get('handler', 'defaultHandler')
            description = endpoint.get('description', f'{handler_name} handler')
        else:
            method = getattr(endpoint, 'method', 'GET') or 'GET'
            path = getattr(endpoint, 'path', '') or ''
            handler_name = getattr(endpoint, 'handler', 'defaultHandler') or 'defaultHandler'
            description = getattr(endpoint, 'description', f'{handler_name} handler') or f'{handler_name} handler'
        
        method_upper = (method or 'GET').upper()
        
        # Generate validation logic based on endpoint type
        validation_logic = ""
        response_logic = ""
        
        if method_upper == 'POST':
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
        
        elif method_upper == 'GET':
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
        """
        Generate basic App test file
        
        CRITICAL: Must import @testing-library/jest-dom to get TypeScript types
        for matchers like toBeInTheDocument(). Also setupTests.ts will be loaded automatically.
        """
        return """import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Basic test to ensure app renders
  const appElement = document.querySelector('.App');
  expect(appElement).toBeInTheDocument();
});
"""
    
    def _generate_setup_tests(self) -> str:
        """
        Generate setupTests.ts file for jest-dom configuration
        
        CRITICAL: This file is automatically loaded by react-scripts before tests run.
        It sets up jest-dom matchers globally so toBeInTheDocument() works in all tests.
        This file MUST exist for TypeScript to recognize jest-dom matchers.
        """
        return """// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
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
        # TypeScript 4.9.5 compatible configuration for react-scripts 5.0.1
        tsconfig = {
            "compilerOptions": {
                "target": "es5",
                "lib": [
                    "dom",
                    "dom.iterable",
                    "es6"
                ],
                "allowJs": True,
                "skipLibCheck": True,
                "esModuleInterop": True,
                "allowSyntheticDefaultImports": True,
                "strict": True,
                "forceConsistentCasingInFileNames": True,
                "noFallthroughCasesInSwitch": True,
                "module": "esnext",
                "moduleResolution": "node",
                "resolveJsonModule": True,
                "isolatedModules": True,
                "noEmit": True,
                "jsx": "react-jsx"
            },
            "include": [
                "src"
            ]
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
        
        if plan.backend_logic and plan.backend_logic.endpoints:
            endpoints_list_items = []
            for ep in plan.backend_logic.endpoints:
                if ep is None:
                    continue
                if isinstance(ep, dict):
                    method = ep.get('method', 'GET')
                    path = ep.get('path', '')
                    desc = ep.get('description', 'API endpoint')
                else:
                    method = getattr(ep, 'method', 'GET') or 'GET'
                    path = getattr(ep, 'path', '') or ''
                    desc = getattr(ep, 'description', 'API endpoint') or 'API endpoint'
                endpoints_list_items.append(f"- **{method} {path}**: {desc}")
            endpoints_list = '\n'.join(endpoints_list_items)
            
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
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/     # Reusable React components
â”‚   â”œâ”€â”€ pages/          # Page components
â”‚   â”œâ”€â”€ App.tsx         # Main app component with routing
â”‚   â””â”€â”€ index.tsx       # Entry point
{'â”œâ”€â”€ api/              # Backend API handlers' if plan.backend_logic else ''}
{'â”œâ”€â”€ tests/            # Backend tests' if plan.backend_logic else ''}
{'â”œâ”€â”€ server.js         # Express server' if plan.backend_logic else ''}
â””â”€â”€ package.json
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
            
        print(f"ðŸ“ Files saved to: {base_path}")
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
                # CRITICAL: Validate and fix component props before writing
                # This prevents TS2739 errors during deployment
                if file_path.endswith('.tsx') and '/components/' in file_path:
                    content = self._validate_and_fix_component_props(content, file_path)
                
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
                    print("ðŸ” BUILDER: Installing dependencies...")
                    # Clean install to avoid dependency conflicts
                    if os.path.exists('node_modules'):
                        print("ðŸ” BUILDER: Cleaning existing node_modules...")
                        subprocess.run(['rm', '-rf', 'node_modules'], capture_output=True, timeout=60)
                    if os.path.exists('package-lock.json'):
                        subprocess.run(['rm', '-f', 'package-lock.json'], capture_output=True, timeout=60)
                    
                    # Use --legacy-peer-deps to handle TypeScript version compatibility
                    # .npmrc file should already have legacy-peer-deps=true, but we keep it here for safety
                    npm_result = subprocess.run(
                        ['npm', 'install', '--legacy-peer-deps'],
                        capture_output=True,
                        text=True,
                        timeout=300  # 5 minute timeout
                    )
                    
                    if npm_result.returncode != 0:
                        error_msg = f"npm install failed: {npm_result.stderr}"
                        print(f" BUILDER: {error_msg}")
                        raise RuntimeError(error_msg)
                    print("âœ“ BUILDER: Dependencies installed successfully")
                
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
            # Do not let logging errors break the main flow
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
            # Do not let cleanup errors break the main flow
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

Please regenerate the PAGE addressing these issues:
- Fix any syntax errors or type errors
- CRITICAL: Fix TypeScript prop mismatches - only pass props that exist in component interfaces
- If you see "Property 'X' does not exist on type 'ComponentProps'", remove that prop or use correct component
- Use correct component for correct purpose (MenuItem for items, MenuSection for sections, MenuCategory for categories)
- If unsure about component props, use components WITHOUT props: <ComponentName />
- Components work standalone with default values
- Ensure all imports are correct (NO .tsx extensions)
- Ensure proper TypeScript typing
- Make sure the page exports correctly
- Address the specific test failures mentioned above
- Use semantic HTML and proper CSS classes
- Ensure the page is accessible

Return ONLY the corrected TypeScript React PAGE code, no explanations or markdown formatting.
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
            props_info = f"Props (ALL MUST BE OPTIONAL): {', '.join(props_list)} - Make all props optional with default values so component works as <{component.name} />"
        
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
        
        Used for files that do not fit specific categories
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
        
        # If no specific errors, return empty (cannot determine failing files)
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
    def _validate_mui_compliance(self, code: str, file_type: str) -> bool:
        """
        Validate that generated code uses Material-UI components and meets quality standards
        
        Args:
            code: Generated code to validate
            file_type: Type of file ('page', 'component', 'app')
            
        Returns:
            bool: True if code meets MUI compliance standards
        """
        if not code:
            return False
        
        # Check for MUI imports
        has_mui_imports = any(import_line in code for import_line in [
            'from \'@mui/material\'',
            'from "@mui/material"',
            'from \'@mui/icons-material\'',
            'from "@mui/icons-material"'
        ])
        
        if not has_mui_imports:
            print(f" MUI Validation Failed: No MUI imports found")
            return False
        
        # Check for forbidden plain HTML elements
        forbidden_elements = ['<div', '<h1', '<h2', '<h3', '<h4', '<h5', '<h6', '<p>', '<button', '<form', '<input', '<nav', '<header', '<footer', '<section', '<article']
        forbidden_found = [elem for elem in forbidden_elements if elem in code]
        
        if forbidden_found:
            print(f" MUI Validation Failed: Found forbidden HTML elements: {forbidden_found}")
            return False
        
        # Check for required MUI components
        required_mui_components = ['<Box', '<Typography', '<Container']
        mui_components_found = [comp for comp in required_mui_components if comp in code]
        
        if len(mui_components_found) < 2:
            print(f" MUI Validation Failed: Insufficient MUI components found: {mui_components_found}")
            return False
        
        # Check for ThemeProvider in App.tsx
        if file_type == 'app':
            if 'ThemeProvider' not in code or 'createTheme' not in code:
                print(f" MUI Validation Failed: App.tsx missing ThemeProvider setup")
                return False
        
        # Check content length (should be substantial, not minimal)
        if file_type == 'page':
            # Count words in JSX content (rough estimate)
            jsx_content = code.split('return (')[1] if 'return (' in code else code
            word_count = len(jsx_content.split())
            if word_count < 200:  # Minimum word count for pages
                print(f" MUI Validation Failed: Page content too minimal ({word_count} words)")
                return False
        
        # Check for sx prop usage (indicates proper MUI styling)
        if 'sx={{' not in code and 'sx={' not in code:
            print(f" MUI Validation Failed: No sx prop styling found")
            return False
        
        print(f" MUI Validation Passed: {file_type} meets all compliance standards")
        return True
    
    def _regenerate_with_stricter_prompt(self, original_code: str, file_type: str, spec: any, plan: Plan, session_id: str) -> str:
        """
        Regenerate code with stricter MUI enforcement when validation fails
        
        Args:
            original_code: The non-compliant code
            file_type: Type of file being regenerated
            spec: Page or Component specification
            plan: Full plan object
            session_id: Session identifier
            
        Returns:
            str: Regenerated code that should be MUI compliant
        """
        print(f"ðŸ”„ Regenerating {file_type} with stricter MUI enforcement...")
        
        stricter_prompt = f"""
 EMERGENCY: PREVIOUS CODE FAILED MUI VALIDATION

The previous code was REJECTED for not using Material-UI components.
You MUST fix this immediately or the project will fail.

CRITICAL FAILURES DETECTED:
- Plain HTML elements found (div, h1, p, button, etc.)
- Missing MUI imports
- Insufficient MUI component usage
- Missing sx prop styling

MANDATORY FIXES:
1. Import ONLY from @mui/material and @mui/icons-material
2. Use ONLY MUI components: Box, Typography, Button, Card, Container, Grid
3. NO plain HTML elements allowed
4. Use sx prop for ALL styling
5. Include rich, professional content (300+ words)
6. Do NOT use template literals/backticks (`). Use quoted strings only.

EXAMPLE CORRECT STRUCTURE:
```typescript
import React from 'react';
import {{ Box, Container, Typography, Button, Card, CardContent }} from '@mui/material';
import {{ Star }} from '@mui/icons-material';

const Component = () => {{
  return (
    <Container maxWidth="lg">
      <Box sx={{{{ py: 8, textAlign: 'center' }}}}>
        <Typography variant="h1" sx={{{{ mb: 3, fontWeight: 700, color: 'primary.main' }}}}>
          Professional Title
        </Typography>
        <Typography variant="body1" sx={{{{ mb: 4, lineHeight: 1.6 }}}}>
          Rich, engaging content that provides real value...
        </Typography>
        <Button variant="contained" sx={{{{ px: 4, py: 1.5 }}}}>
          Call to Action
        </Button>
      </Box>
    </Container>
  );
}};
```

NOW REGENERATE THE {file_type.upper()} WITH PERFECT MUI COMPLIANCE.
"""
        
        try:
            if file_type == 'page':
                regenerated_code = self._call_llm(stricter_prompt + f"\nPage: {spec.name}\nDescription: {spec.description}", temperature=0.1)
            elif file_type == 'component':
                regenerated_code = self._call_llm(stricter_prompt + f"\nComponent: {spec.name}\nDescription: {spec.description}", temperature=0.1)
            else:
                regenerated_code = self._call_llm(stricter_prompt, temperature=0.1)
            
            # Clean and validate regenerated code
            regenerated_code = self._extract_code_from_response(regenerated_code)
            
            if self._validate_mui_compliance(regenerated_code, file_type):
                print(f" Regeneration successful: {file_type} now MUI compliant")
                return regenerated_code
            else:
                print(f" Regeneration failed: {file_type} still not MUI compliant, using fallback")
                # Use fallback template as last resort
                if file_type == 'page':
                    return self._generate_basic_page_template(spec)
                elif file_type == 'component':
                    return self._generate_basic_component_template(spec)
                else:
                    return original_code
                    
        except Exception as e:
            print(f" Regeneration error: {e}, using fallback")
            if file_type == 'page':
                return self._generate_basic_page_template(spec)
            elif file_type == 'component':
                return self._generate_basic_component_template(spec)
            else:
                return original_code


class MaxRetriesExceeded(Exception):
    """Exception raised when self-healing retry limit is exceeded"""
    pass
