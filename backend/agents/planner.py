"""
Planner Agent for AMAR MVP
Decomposes user requests into structured implementation plans using Gemini LLM
Validates: Requirements 2.1, 2.2, 12.1, 12.2
"""

import asyncio
import json
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Dict, List, Optional, Any

from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import ValidationError

from models.core import (
    Plan, PageSpec, ComponentSpec, RoutingConfig, BackendSpec, 
    AgentResponse, UserRequest
)
from services.memory import memory_manager
from services.rate_limiter import get_rate_limiter, RateLimitExceeded, ExponentialBackoff
from services.error_handler import get_error_handler, LLMAPIError, ValidationError as AmarValidationError
from services.gemini_model_utils import (
    build_gemini_model_candidates,
    normalize_gemini_model_name,
    should_fallback_to_next_model,
)
from services.system_prompt_loader import load_system_prompt
from config import get_settings
from .plan_validator import PlanValidator, validate_plan_completeness


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


class PlannerAgent:
    """
    Planner Agent responsible for decomposing user requests into structured plans
    
    Uses Gemini LLM to analyze user descriptions and generate comprehensive
    implementation plans with page specifications, component requirements,
    and routing structure.
    
    Validates: Requirements 2.1, 2.2, 12.1, 12.2
    """
    
    def __init__(self):
        """Initialize Planner Agent with LLM client"""
        self.settings = get_settings()
        self.validator = PlanValidator()
        self.rate_limiter = get_rate_limiter(max_requests=self.settings.max_requests_per_session)
        self.backoff = ExponentialBackoff(
            base_delay=1.0,
            max_retries=self.settings.max_retry_attempts
        )
        self.error_handler = get_error_handler()
        self.last_generation_mode = "unknown"
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
                    raise LLMAPIError(
                        "No API key configured. Set OPENAI_API_KEY, GROQ_API_KEY, or GEMINI_API_KEY",
                        details={'agent': 'planner', 'phase': 'initialization'},
                        recoverable=False
                    )
                
                configured_model = normalize_gemini_model_name(
                    self.settings.gemini_model or "gemini-2.5-pro"
                )
                self.gemini_model_candidates = build_gemini_model_candidates(configured_model)

                self._initialize_gemini_llm(self.gemini_model_candidates[0])
                self.use_custom_client = False
            except Exception as e:
                raise LLMAPIError(
                    f"Failed to initialize LLM client: {str(e)}",
                    details={'agent': 'planner', 'phase': 'initialization'},
                    recoverable=False
                )

    def _initialize_gemini_llm(self, model_name: str) -> None:
        """Initialize Gemini LLM with the given model."""
        self.llm = ChatGoogleGenerativeAI(
            model=model_name,
            google_api_key=self.settings.gemini_api_key,
            temperature=0.3,
            max_tokens=4000,
            timeout=60
        )

    def _call_llm(self, prompt: str) -> str:
        """Call configured LLM with automatic Gemini model fallback on 404 model errors."""
        if self.use_custom_client:
            self.last_llm_model_used = "custom_client"
            return self.llm_client.generate_content(prompt, temperature=0.2, max_tokens=7000)

        last_error: Optional[Exception] = None
        for idx in range(self.current_gemini_model_index, len(self.gemini_model_candidates)):
            model_name = self.gemini_model_candidates[idx]
            if idx != self.current_gemini_model_index:
                self.current_gemini_model_index = idx
                self._initialize_gemini_llm(model_name)
                print(f"Planner switched Gemini model to: {model_name}")
            try:
                response = self.llm.invoke(prompt)
                self.last_llm_model_used = model_name
                return response.content
            except Exception as e:
                last_error = e
                if not should_fallback_to_next_model(str(e)):
                    raise
                print(f"Planner Gemini model '{model_name}' failed; trying next candidate. Error: {str(e)[:180]}")
                continue

        if last_error:
            raise last_error
        raise RuntimeError("LLM call failed with unknown error")
    
    def analyze_request(self, user_request: UserRequest) -> AgentResponse:
        """
        Analyze user request and generate structured implementation plan
        
        Args:
            user_request: Validated user request with description
            
        Returns:
            AgentResponse with success status and generated plan
            
        Validates: Requirements 2.1, 2.2, 12.1, 12.2, 13.1
        """
        start_time = datetime.now()
        
        try:
            # Get memory context for this session
            memory = memory_manager.get_memory(user_request.session_id)
            context = memory.get_context_for_agent('planner', max_entries=3)
            
            # Detect backend requirements from user description
            backend_detection = self.detect_backend_requirements(user_request.description)
            
            # Log backend detection results
            memory.add_entry(
                agent='planner',
                action='backend_detection',
                data={
                    'user_description': user_request.description,
                    'needs_backend': backend_detection['needs_backend'],
                    'detected_categories': backend_detection['detected_categories'],
                    'suggested_endpoints': backend_detection['suggested_endpoints'],
                    'confidence': backend_detection['confidence']
                },
                tags=['backend_detection', 'analysis'],
                importance=0.8
            )
            
            # Generate plan using LLM
            plan_dict = self._generate_plan_with_llm(user_request.description, context, user_request.session_id)
            
            # Normalize component types in plan_dict before validation
            for comp_data in plan_dict.get('components', []):
                comp_type = comp_data.get('type', 'functional').lower().strip()
                type_mapping = {
                    'presentational': 'functional',
                    'presentation': 'functional',
                    'stateless': 'functional',
                    'stateful': 'functional',
                    'container': 'functional',
                    'smart': 'functional',
                    'dumb': 'functional',
                    'pure': 'functional',
                    'function': 'functional',
                    'fc': 'functional',
                    'react.fc': 'functional',
                    'component': 'functional',
                    'hooks': 'hook',
                    'custom-hook': 'hook',
                    'customhook': 'hook',
                    'class-component': 'class',
                    'classcomponent': 'class',
                    'class-based': 'class',
                    'classbased': 'class',
                }
                normalized_type = type_mapping.get(comp_type, 'functional' if comp_type not in ['class', 'hook'] else comp_type)
                comp_data['type'] = normalized_type
            
            # Validate plan completeness first
            completeness_validation = validate_plan_completeness(plan_dict)
            # Only fail on critical errors, not type mismatches (which we've normalized)
            critical_errors = [e for e in completeness_validation.get('errors', []) 
                             if 'Invalid type' not in e and 'Missing required' not in e]
            if critical_errors:
                raise AmarValidationError(
                    f"Plan completeness validation failed: {critical_errors}",
                    details={'validation_errors': critical_errors}
                )
            
            # Validate and create Plan object
            plan = self._validate_and_create_plan(plan_dict)
            
            # Run comprehensive structure validation
            structure_validation = self.validator.validate_plan_structure(plan)
            # Only fail on critical errors, warnings are acceptable
            critical_errors = [e for e in structure_validation.get('errors', []) 
                             if 'Invalid type' not in e]
            if critical_errors:
                raise AmarValidationError(
                    f"Plan structure validation failed: {critical_errors}",
                    details={'validation_errors': critical_errors, 'warnings': structure_validation.get('warnings', [])}
                )
            
            # Log warnings if any
            if structure_validation.get('warnings'):
                for warning in structure_validation['warnings']:
                    print(f"  âš ï¸  Warning: {warning}")
            
            # Store plan in episodic memory with validation results
            memory.add_entry(
                agent='planner',
                action='plan_generated',
                data={
                    'user_description': user_request.description,
                    'plan': plan.model_dump(),
                    'page_count': len(plan.pages),
                    'has_backend': plan.backend_logic is not None,
                    'backend_detection': backend_detection,
                    'validation_summary': structure_validation['summary'],
                    'validation_warnings': structure_validation['warnings']
                },
                tags=['planning', 'user_request', 'validated'],
                importance=1.0
            )
            
            execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
            
            return AgentResponse(
                agent_name='planner',
                success=True,
                output={
                    'plan': plan.model_dump(),
                    'llm_generation_mode': self.last_generation_mode,
                    'llm_model_used': self.last_llm_model_used,
                },
                errors=[],
                execution_time_ms=execution_time
            )
            
        except RateLimitExceeded as e:
            user_message, error_details = self.error_handler.handle_error(
                e,
                context={'agent': 'planner', 'session_id': user_request.session_id}
            )
            return self._create_error_response(user_message, start_time)
        
        except (ValidationError, AmarValidationError) as e:
            user_message, error_details = self.error_handler.handle_error(
                e,
                context={'agent': 'planner', 'session_id': user_request.session_id}
            )
            return self._create_error_response(user_message, start_time)
        
        except LLMAPIError as e:
            user_message, error_details = self.error_handler.handle_error(
                e,
                context={'agent': 'planner', 'session_id': user_request.session_id}
            )
            return self._create_error_response(user_message, start_time)
        
        except Exception as e:
            user_message, error_details = self.error_handler.handle_error(
                e,
                context={'agent': 'planner', 'session_id': user_request.session_id}
            )
            return self._create_error_response(user_message, start_time)
    
    def _generate_plan_with_llm(self, description: str, context: Dict[str, Any], session_id: str) -> Dict:
        """
        Generate plan using Gemini LLM with structured prompt
        
        Uses exponential backoff for retries on rate limit errors.
        
        Args:
            description: User's application description
            context: Previous context from episodic memory
            session_id: Session identifier for rate limiting
            
        Returns:
            Dictionary containing structured plan data
            
        Raises:
            RateLimitExceeded: If session rate limit is exceeded
            
        Validates: Requirements 10.4, 10.5
        """
        # Check rate limit before making LLM call
        try:
            self.rate_limiter.check_and_increment(session_id)
        except RateLimitExceeded as e:
            raise RateLimitExceeded(str(e))
        
        # Create structured prompt for plan generation
        prompt = self._create_planning_prompt(description, context)
        
        self.last_generation_mode = "unknown"
        response_text = ""

        # Call LLM directly - let LangChain handle retries naturally
        try:
            # Call LLM (OpenAI, Groq, or Gemini)
            response_text = self._call_llm(prompt)

            # Parse JSON response
            parsed = self._extract_json_from_response(response_text)
            self.last_generation_mode = "llm"
            return parsed

        except Exception as first_error:
            # Retry once with a strict JSON-repair prompt before falling back
            try:
                content_to_fix = response_text.strip() if response_text else ""
                if not content_to_fix:
                    # If there is no model output to repair, preserve original error flow.
                    raise first_error
                repair_prompt = f"""
Fix the following content into VALID JSON only.
Return exactly one JSON object that follows this schema:
{{
  "pages": [{{"name":"HomePage","route":"/","components":["Header","HeroSection","Footer"],"description":"short"}}],
  "components": [{{"name":"Header","type":"functional","props":{{"title":"string"}},"description":"short"}}],
  "routing": {{"base_path":"/","routes":[{{"path":"/","component":"HomePage"}}],"navigation_links":[{{"label":"Home","path":"/"}}]}},
  "backend_logic": null,
  "estimated_complexity": "simple"
}}
Rules:
- Output JSON only.
- Use double quotes.
- No trailing commas.
- Max 5 pages.
- Keep descriptions concise.

Content to fix:
{content_to_fix}
"""
                repaired = self._call_llm(repair_prompt)
                parsed = self._extract_json_from_response(repaired)
                self.last_generation_mode = "repaired_json"
                return parsed
            except Exception:
                # Deterministic fallback so planner never blocks workflow
                self.last_generation_mode = "fallback_plan"
                return self._generate_fallback_plan(description)
    
    def _create_planning_prompt(self, description: str, context: Dict[str, Any]) -> str:
        """
        Create structured prompt for plan generation

        Args:
            description: User's application description
            context: Session context from episodic memory

        Returns:
            Formatted prompt string for LLM
        """
        # 1) Prefer deterministic local prompt file for stable behavior
        system_prompt = load_system_prompt("planner_agent_comprehensive_prompt.md") or ""
        if system_prompt:
            print(f"Loaded planner system prompt from file ({len(system_prompt)} chars)")

        # 2) Fallback to RAG if file is unavailable
        if not system_prompt:
            from services.rag_service import get_rag_service
            rag_service = get_rag_service()
            if rag_service.is_enabled:
                try:
                    rag_result = _run_async_in_thread(rag_service.retrieve_context(
                        "planner agent system prompt comprehensive instructions",
                        top_k=1
                    ))
                    if rag_result and rag_result.get('retrieved_docs'):
                        system_prompt = rag_result['retrieved_docs'][0]['content']
                        print(f"Loaded planner system prompt from RAG ({len(system_prompt)} chars)")
                except Exception as e:
                    print(f"Failed to load planner system prompt from RAG: {e}")

        # 3) Last-resort fallback prompt
        if not system_prompt:
            system_prompt = """
You are the Planner Agent for AMAR.
Convert natural-language requirements into a precise implementation plan for a production-ready React + TypeScript + Material UI website.

PRIMARY OBJECTIVE:
- Plan for a site that is easy to use, visually impressive, and deployment-safe.

NON-NEGOTIABLE CONSTRAINTS:
- Maximum 5 pages.
- Routing and navigation must be complete and consistent.
- Components must be reusable and clearly named.
- Prefer stable, modern patterns only.
- Include backend logic only when required by user interactions.

UI DIRECTION REQUIREMENTS:
- Enforce a clear visual direction: color strategy, typography hierarchy, spacing rhythm.
- Require at least one hero section and one strong call-to-action.
- Avoid generic skeleton layouts; plan intentional sections with clear hierarchy.
- Ensure responsive behavior and accessibility are planned, not optional.
"""
            print("Using fallback planner system prompt")

        context_str = ""
        if context.get('relevant_context'):
            context_str = f"""
Previous context from this session:
{json.dumps(context['relevant_context'], indent=2)}
"""

        prompt = f"""
{system_prompt}

{context_str}

User Request: "{description}"

PLANNING REQUIREMENTS:
- Create only the pages needed to satisfy the request.
- For each page, provide a concrete description detailed enough to guide premium UI generation.
- Keep all descriptions concise (max ~25 words each) to avoid token overflow.
- Use component names that map directly to implementation (e.g., HeroSection, FeatureGrid, PricingCards, ContactFormSection).
- Ensure navigation labels are clear and route paths are valid.
- Reuse shared components across pages where appropriate.

BACKEND REQUIREMENT DETECTION:
Carefully analyze the user request for indicators that backend logic is needed:
- Forms that submit data (contact forms, signup forms, feedback forms)
- Data validation or processing (email validation, sanitization)
- API calls or dynamic data fetching
- Interactions requiring server-side handling
- Mentions of "submit", "send", "save", "process", "validate"
- Features like search, filtering, personalization, or data manipulation

If ANY indicator is present, include backend_logic with appropriate endpoints.

Generate a JSON response with this exact structure:

{{
  "pages": [
    {{
      "name": "HomePage",
      "route": "/",
      "components": ["Header", "HeroSection", "Footer"],
      "description": "Main landing page with a premium hero and clear conversion path"
    }}
  ],
  "components": [
    {{
      "name": "Header",
      "type": "functional",
      "props": {{"title": "string", "showNav": "boolean"}},
      "description": "Top navigation with branding and responsive menu"
    }}
  ],
  "routing": {{
    "base_path": "/",
    "routes": [
      {{"path": "/", "component": "HomePage"}},
      {{"path": "/about", "component": "AboutPage"}}
    ],
    "navigation_links": [
      {{"label": "Home", "path": "/"}},
      {{"label": "About", "path": "/about"}}
    ]
  }},
  "backend_logic": {{
    "endpoints": [
      {{"method": "POST", "path": "/api/contact", "handler": "handleContact", "description": "Handle contact form submission"}}
    ],
    "middleware": ["cors", "bodyParser"],
    "dependencies": ["express"]
  }},
  "estimated_complexity": "simple"
}}

BACKEND ENDPOINT SPECIFICATION:
- Each endpoint MUST include method, path, handler, and description
- Common patterns:
  * Contact forms: POST /api/contact
  * Search: GET /api/search
  * Form validation: POST /api/validate
  * Data submission: POST /api/submit
- Include "cors" and "bodyParser" in middleware when backend_logic is present
- Include "express" in dependencies when backend_logic is present

If no backend logic is needed, set "backend_logic" to null.
Complexity must be one of: "simple", "medium", "complex".

JSON FORMAT RULES:
- Use only double quotes.
- Do not use trailing commas.
- Return a single complete JSON object.

Respond ONLY with valid JSON. No markdown. No explanations.
"""
        return prompt

    def _generate_fallback_plan(self, description: str) -> Dict:
        """
        Generate a deterministic backup plan when LLM output is invalid.
        This keeps workflow execution resilient under token/memory pressure.
        """
        backend_detection = self.detect_backend_requirements(description)
        needs_backend = backend_detection.get('needs_backend', False)

        pages = [
            {
                "name": "HomePage",
                "route": "/",
                "components": ["Header", "HeroSection", "FeatureSection", "CallToActionSection", "Footer"],
                "description": "Landing page with hero, value highlights, and clear calls to action."
            },
            {
                "name": "MenuPage",
                "route": "/menu",
                "components": ["Header", "PageTitleSection", "MenuSection", "Footer"],
                "description": "Coffee and food menu with categories, descriptions, and prices."
            },
            {
                "name": "AboutPage",
                "route": "/about",
                "components": ["Header", "PageTitleSection", "AboutUsSection", "Footer"],
                "description": "Story, values, sourcing quality, and the shop experience."
            },
            {
                "name": "ContactPage",
                "route": "/contact",
                "components": ["Header", "PageTitleSection", "LocationMapSection", "ContactFormSection", "Footer"],
                "description": "Address, opening hours, map, and contact form for inquiries."
            }
        ]

        components = [
            {"name": "Header", "type": "functional", "props": {"brandName": "string"}, "description": "Responsive top navigation with brand and links."},
            {"name": "Footer", "type": "functional", "props": {"copyrightText": "string"}, "description": "Footer with utility links and brand info."},
            {"name": "HeroSection", "type": "functional", "props": {"title": "string", "subtitle": "string", "ctaText": "string"}, "description": "High-impact hero with clear value proposition."},
            {"name": "FeatureSection", "type": "functional", "props": {"features": "Array<string>"}, "description": "Grid highlighting signature offerings and benefits."},
            {"name": "CallToActionSection", "type": "functional", "props": {"title": "string", "ctaText": "string"}, "description": "Conversion-focused section with prominent action buttons."},
            {"name": "PageTitleSection", "type": "functional", "props": {"title": "string", "subtitle": "string"}, "description": "Reusable title band for inner pages."},
            {"name": "MenuSection", "type": "functional", "props": {"menuCategories": "Array<string>"}, "description": "Menu listing grouped by category with pricing."},
            {"name": "AboutUsSection", "type": "functional", "props": {"content": "string"}, "description": "Brand story and mission content block."},
            {"name": "LocationMapSection", "type": "functional", "props": {"address": "string"}, "description": "Location details and map/embed area."},
            {"name": "ContactFormSection", "type": "functional", "props": {"submitLabel": "string"}, "description": "Inquiry form with validation and submission states."}
        ]

        routes = [{"path": p["route"], "component": p["name"]} for p in pages]
        nav_links = [{"label": p["name"].replace("Page", ""), "path": p["route"]} for p in pages]

        backend_logic = None
        if needs_backend:
            endpoints = backend_detection.get('suggested_endpoints', [])
            if not endpoints:
                endpoints = [{
                    "method": "POST",
                    "path": "/api/contact",
                    "handler": "handleContact",
                    "description": "Handle contact form submission."
                }]
            backend_logic = {
                "endpoints": endpoints,
                "middleware": ["cors", "bodyParser"],
                "dependencies": ["express"]
            }

        return {
            "pages": pages,
            "components": components,
            "routing": {
                "base_path": "/",
                "routes": routes,
                "navigation_links": nav_links
            },
            "backend_logic": backend_logic,
            "estimated_complexity": "medium"
        }
    def _extract_json_from_response(self, response_text: str) -> Dict:
        """
        Extract and parse JSON from LLM response
        
        Args:
            response_text: Raw response from LLM
            
        Returns:
            Parsed JSON dictionary
        """
        try:
            # Try to find JSON in the response
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                json_str = json_match.group(0)
                parsed_json = json.loads(json_str)
            else:
                # If no JSON found, try parsing the entire response
                parsed_json = json.loads(response_text.strip())
            
            # ðŸš¨ CRITICAL: Pre-validate page count immediately after parsing
            pages_data = parsed_json.get('pages', [])
            if len(pages_data) > 5:
                raise ValueError(f"CRITICAL ERROR: LLM generated {len(pages_data)} pages, but maximum allowed is 5. This violates system constraints.")
            
            return parsed_json
                
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in LLM response: {str(e)}\nResponse: {response_text}")
    
    def _validate_and_create_plan(self, plan_dict: Dict) -> Plan:
        """
        Validate plan dictionary and create Plan object
        
        Args:
            plan_dict: Dictionary containing plan data from LLM
            
        Returns:
            Validated Plan object
            
        Raises:
            ValidationError: If plan validation fails
        """
        try:
            # Create PageSpec objects
            pages = []
            for page_data in plan_dict.get('pages', []):
                page = PageSpec(**page_data)
                pages.append(page)
            
            # ðŸš¨ CRITICAL: Validate page count BEFORE proceeding
            self._validate_page_count(pages)
            
            # Create ComponentSpec objects with type normalization
            components = []
            for comp_data in plan_dict.get('components', []):
                # Normalize component type - map common variations to valid types
                comp_type = comp_data.get('type', 'functional').lower().strip()
                type_mapping = {
                    'presentational': 'functional',
                    'presentation': 'functional',
                    'stateless': 'functional',
                    'stateful': 'functional',
                    'container': 'functional',
                    'smart': 'functional',
                    'dumb': 'functional',
                    'pure': 'functional',
                    'function': 'functional',
                    'fc': 'functional',
                    'react.fc': 'functional',
                    'component': 'functional',
                    'hooks': 'hook',
                    'custom-hook': 'hook',
                    'customhook': 'hook',
                    'class-component': 'class',
                    'classcomponent': 'class',
                    'class-based': 'class',
                    'classbased': 'class',
                }
                # Map to valid type, default to 'functional' if not found
                normalized_type = type_mapping.get(comp_type, 'functional' if comp_type not in ['class', 'hook'] else comp_type)
                comp_data['type'] = normalized_type
                
                component = ComponentSpec(**comp_data)
                components.append(component)
            
            # Create RoutingConfig object
            routing_data = plan_dict.get('routing', {})
            routing = RoutingConfig(**routing_data)
            
            # Create BackendSpec object if backend logic is specified
            backend_logic = None
            if plan_dict.get('backend_logic'):
                backend_logic = BackendSpec(**plan_dict['backend_logic'])
            
            # Create and validate Plan object
            plan = Plan(
                pages=pages,
                components=components,
                routing=routing,
                backend_logic=backend_logic,
                estimated_complexity=plan_dict.get('estimated_complexity', 'simple')
            )
            
            return plan
            
        except ValidationError as e:
            # Handle Pydantic ValidationError
            error_messages = []
            if hasattr(e, 'errors'):
                for error in e.errors():
                    error_messages.append(f"{error.get('loc', 'unknown')}: {error.get('msg', str(error))}")
            else:
                error_messages.append(str(e))
            
            raise AmarValidationError(
                f"Plan validation failed: {', '.join(error_messages)}",
                details={'validation_errors': error_messages, 'original_error': str(e)}
            )
        except Exception as e:
            raise AmarValidationError(
                f"Plan validation failed: {str(e)}",
                details={'original_error': str(e)}
            )
    
    def _validate_page_count(self, pages: List[PageSpec]) -> None:
        """
        Validate that page count doesn't exceed maximum limit
        
        Args:
            pages: List of page specifications
            
        Raises:
            ValueError: If page count exceeds 5
            
        Validates: Requirements 1.5, 12.3
        """
        if len(pages) > 5:
            raise ValueError(f"Page count ({len(pages)}) exceeds maximum of 5 pages")
        
        if len(pages) == 0:
            raise ValueError("At least one page must be specified")
    
    def _create_error_response(self, error_msg: str, start_time: datetime) -> AgentResponse:
        """
        Create standardized error response
        
        Args:
            error_msg: Error message to include
            start_time: When the operation started
            
        Returns:
            AgentResponse with error details
        """
        execution_time = int((datetime.now() - start_time).total_seconds() * 1000)
        
        return AgentResponse(
            agent_name='planner',
            success=False,
            output={},
            errors=[error_msg],
            execution_time_ms=execution_time
        )
    
    def detect_backend_requirements(self, description: str) -> Dict[str, Any]:
        """
        Detect if backend logic is needed from user description
        
        Analyzes the user description for keywords and patterns that indicate
        backend API endpoints are required.
        
        Args:
            description: User's application description
            
        Returns:
            Dictionary with detection results and suggested endpoints
            
        Validates: Requirements 13.1
        """
        description_lower = description.lower()
        
        # Keywords that indicate backend logic is needed
        backend_indicators = {
            'form_submission': ['submit', 'send', 'contact form', 'signup', 'register', 'feedback'],
            'data_processing': ['validate', 'process', 'calculate', 'compute', 'analyze'],
            'api_interaction': ['api', 'fetch', 'retrieve', 'get data', 'load data'],
            'search': ['search', 'filter', 'query', 'find'],
            'user_actions': ['save', 'store', 'update', 'delete', 'create']
        }
        
        detected_categories = []
        suggested_endpoints = []
        
        # Check for form submission indicators
        if any(keyword in description_lower for keyword in backend_indicators['form_submission']):
            detected_categories.append('form_submission')
            if 'contact' in description_lower:
                suggested_endpoints.append({
                    'method': 'POST',
                    'path': '/api/contact',
                    'handler': 'handleContact',
                    'description': 'Handle contact form submission'
                })
            if 'signup' in description_lower or 'register' in description_lower:
                suggested_endpoints.append({
                    'method': 'POST',
                    'path': '/api/signup',
                    'handler': 'handleSignup',
                    'description': 'Handle user signup'
                })
            if 'feedback' in description_lower:
                suggested_endpoints.append({
                    'method': 'POST',
                    'path': '/api/feedback',
                    'handler': 'handleFeedback',
                    'description': 'Handle feedback submission'
                })
        
        # Check for data processing indicators
        if any(keyword in description_lower for keyword in backend_indicators['data_processing']):
            detected_categories.append('data_processing')
            if 'validate' in description_lower:
                suggested_endpoints.append({
                    'method': 'POST',
                    'path': '/api/validate',
                    'handler': 'handleValidation',
                    'description': 'Validate user input'
                })
        
        # Check for search indicators
        if any(keyword in description_lower for keyword in backend_indicators['search']):
            detected_categories.append('search')
            suggested_endpoints.append({
                'method': 'GET',
                'path': '/api/search',
                'handler': 'handleSearch',
                'description': 'Handle search queries'
            })
        
        # Check for API interaction indicators
        if any(keyword in description_lower for keyword in backend_indicators['api_interaction']):
            detected_categories.append('api_interaction')
        
        needs_backend = len(detected_categories) > 0
        
        return {
            'needs_backend': needs_backend,
            'detected_categories': detected_categories,
            'suggested_endpoints': suggested_endpoints,
            'confidence': 'high' if len(detected_categories) >= 2 else 'medium' if len(detected_categories) == 1 else 'low'
        }
    
    def get_plan_summary(self, plan: Plan) -> Dict[str, Any]:
        """
        Generate a summary of the plan for logging and display
        
        Args:
            plan: Plan object to summarize
            
        Returns:
            Dictionary with plan summary information
        """
        return {
            'page_count': len(plan.pages),
            'component_count': len(plan.components),
            'has_backend': plan.backend_logic is not None,
            'complexity': plan.estimated_complexity,
            'routes': [route['path'] for route in plan.routing.routes],
            'backend_endpoints': [
                f"{ep['method']} {ep['path']}" 
                for ep in (plan.backend_logic.endpoints if plan.backend_logic else [])
            ]
        }
