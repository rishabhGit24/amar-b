"""
Planner Agent for AMAR MVP
Decomposes user requests into structured implementation plans using Gemini LLM
Validates: Requirements 2.1, 2.2, 12.1, 12.2
"""

import json
import re
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
from config import get_settings
from .plan_validator import PlanValidator, validate_plan_completeness


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
                
                # Use configured model or fallback to gemini-2.5-flash
                model_name = self.settings.gemini_model or "gemini-2.5-flash"
                # Use LangChain's default retry mechanism
                self.llm = ChatGoogleGenerativeAI(
                    model=model_name,
                    google_api_key=self.settings.gemini_api_key,
                    temperature=0.3,
                    max_tokens=4000,
                    timeout=60
                )
                self.use_custom_client = False
            except Exception as e:
                raise LLMAPIError(
                    f"Failed to initialize LLM client: {str(e)}",
                    details={'agent': 'planner', 'phase': 'initialization'},
                    recoverable=False
                )
    
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
            
            # Validate plan completeness first
            completeness_validation = validate_plan_completeness(plan_dict)
            if not completeness_validation['valid']:
                raise ValidationError(f"Plan completeness validation failed: {completeness_validation['errors']}")
            
            # Validate and create Plan object
            plan = self._validate_and_create_plan(plan_dict)
            
            # Run comprehensive structure validation
            structure_validation = self.validator.validate_plan_structure(plan)
            if not structure_validation['valid']:
                raise ValidationError(f"Plan structure validation failed: {structure_validation['errors']}")
            
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
                output={'plan': plan.model_dump()},
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
        
        # Call LLM directly - let LangChain handle retries naturally
        try:
            # Call LLM (OpenAI, Groq, or Gemini)
            if self.use_custom_client:
                response_text = self.llm_client.generate_content(prompt, temperature=0.3, max_tokens=4000)
            else:
                response = self.llm.invoke(prompt)
                response_text = response.content
            
            # Parse JSON response
            plan_json = self._extract_json_from_response(response_text)
            
            return plan_json
            
        except Exception as e:
            # If LLM call fails, raise error immediately
            raise LLMAPIError(
                f"LLM plan generation failed: {str(e)}",
                details={
                    'agent': 'planner',
                    'error_type': type(e).__name__
                },
                recoverable=False
            )
    
    def _create_planning_prompt(self, description: str, context: Dict[str, Any]) -> str:
        """
        Create structured prompt for plan generation
        
        Args:
            description: User's application description
            context: Session context from episodic memory
            
        Returns:
            Formatted prompt string for LLM
        """
        context_str = ""
        if context.get('relevant_context'):
            context_str = f"""
Previous context from this session:
{json.dumps(context['relevant_context'], indent=2)}
"""
        
        prompt = f"""
You are a web application planner. Analyze the user's request and create a detailed implementation plan for a React application.

{context_str}

User Request: "{description}"

IMPORTANT CONSTRAINTS:
- Maximum 5 pages allowed
- Generate React components with TypeScript
- Include routing configuration
- Detect if backend API endpoints are needed
- Make reasonable assumptions for ambiguous requirements

BACKEND REQUIREMENT DETECTION:
Carefully analyze the user request for these indicators that backend logic is needed:
- Forms that submit data (contact forms, signup forms, feedback forms)
- Data validation or processing (email validation, input sanitization)
- API calls or data fetching
- User interactions that require server-side logic
- Any mention of "submit", "send", "save", "process", "validate"
- Features like search, filtering, or data manipulation

If ANY of these indicators are present, include backend_logic with appropriate endpoints.

Generate a JSON response with this exact structure:

{{
    "pages": [
        {{
            "name": "HomePage",
            "route": "/",
            "components": ["Header", "Hero", "Footer"],
            "description": "Main landing page with hero section"
        }}
    ],
    "components": [
        {{
            "name": "Header",
            "type": "functional",
            "props": {{"title": "string", "showNav": "boolean"}},
            "description": "Navigation header component"
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
- Each endpoint MUST have: method (GET/POST/PUT/DELETE), path, handler name, and description
- Common patterns:
  * Contact forms: POST /api/contact
  * Search: GET /api/search
  * Form validation: POST /api/validate
  * Data submission: POST /api/submit
- Include "cors" and "bodyParser" in middleware for API endpoints
- Include "express" in dependencies for backend logic

If no backend logic is needed (purely static content), set "backend_logic" to null.
Complexity should be "simple", "medium", or "complex".

Respond ONLY with valid JSON. No additional text or explanation.
"""
        return prompt
    
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
                return json.loads(json_str)
            else:
                # If no JSON found, try parsing the entire response
                return json.loads(response_text.strip())
                
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
            
            # Create ComponentSpec objects
            components = []
            for comp_data in plan_dict.get('components', []):
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
            
        except Exception as e:
            raise ValidationError(f"Plan validation failed: {str(e)}")
    
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