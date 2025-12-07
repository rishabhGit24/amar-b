# Design Document

## Overview

AMAR MVP is a multi-agent web application that transforms high-level user descriptions into deployed React applications. The system uses LangGraph for agent orchestration, Gemini LLM for intelligence, and free-tier hosting platforms for deployment. The architecture emphasizes autonomous operation, comprehensive audit trails, and self-healing capabilities.

The system consists of three main layers:

1. **Frontend Layer**: Web UI for user input and progress visualization
2. **Orchestration Layer**: LangGraph-based agent workflow management
3. **Agent Layer**: Three specialized agents (Planner, Builder, Deployer) that collaborate to generate and deploy applications

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Frontend                          │
│  (React UI - User Input, Progress Display, URL Output)      │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/WebSocket
┌────────────────────▼────────────────────────────────────────┐
│                   Backend API Server                         │
│              (FastAPI/Flask - Python)                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│              LangGraph Orchestrator                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ Planner  │───▶│ Builder  │───▶│ Deployer │             │
│  │  Agent   │    │  Agent   │    │  Agent   │             │
│  └──────────┘    └────┬─────┘    └──────────┘             │
│                       │                                      │
│                       │ Self-Healing Loop                    │
│                       └──────────┐                          │
│                                  │                          │
│                       ┌──────────▼─────┐                   │
│                       │  Test & Retry  │                   │
│                       └────────────────┘                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌──▼─────┐ ┌───▼──────────┐
│ Gemini LLM   │ │ Memory │ │ Audit Logger │
│   API        │ │ Store  │ │  (JSON)      │
└──────────────┘ └────────┘ └──────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────┐         ┌────────▼─────┐
│ Vercel API   │         │ Netlify API  │
└──────────────┘         └──────────────┘
```

### LangGraph Workflow

Based on the provided architecture diagram, the LangGraph workflow follows this structure:

```
START
  │
  ▼
┌─────────────┐
│ Supervisor  │ (Entry point - receives user input)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Planner   │ (Decomposes request into structured plan)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Coder    │ (Generates React code)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Tester    │ (Runs pytest, validates code)
└──────┬──────┘
       │
       ├─── Tests Pass ───▶ Deployer
       │
       └─── Tests Fail ───▶ Self-Heal (back to Coder with error context)
                            │
                            └─── Retry Count < 3 ───▶ Coder
                            │
                            └─── Retry Count >= 3 ───▶ FAIL (report to user)
```

### Technology Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Python FastAPI
- **Agent Orchestration**: LangGraph
- **LLM**: Google Gemini API (free tier)
- **Testing**: pytest
- **Deployment**: Vercel CLI / Netlify CLI
- **Memory**: In-memory Python dict (session-scoped)
- **Logging**: Python logging module with JSON formatter
- **Communication**: WebSocket for real-time progress updates

## Components and Interfaces

### 1. Web Frontend Component

**Responsibilities:**

- Render user input form
- Display real-time agent progress
- Show deployment URL and project summary

**Key Interfaces:**

```typescript
interface UserRequest {
  description: string;
  timestamp: string;
}

interface ProgressUpdate {
  agent: "planner" | "builder" | "deployer";
  status: "running" | "completed" | "failed";
  message: string;
  details?: string;
}

interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
  executionTime: number;
  projectSummary: {
    pageCount: number;
    componentCount: number;
    fileCount: number;
  };
}
```

### 2. Backend API Server Component

**Responsibilities:**

- Receive user requests via HTTP POST
- Initialize LangGraph workflow
- Stream progress updates via WebSocket
- Return final deployment results

**Key Endpoints:**

```python
POST /api/generate
  Request: { "description": string }
  Response: { "sessionId": string }

WebSocket /ws/{sessionId}
  Messages: ProgressUpdate events

GET /api/result/{sessionId}
  Response: DeploymentResult
```

### 3. LangGraph Orchestrator Component

**Responsibilities:**

- Manage agent state transitions
- Route between agents based on outcomes
- Handle error propagation and retry logic
- Maintain workflow state

**State Schema:**

```python
class WorkflowState(TypedDict):
    user_input: str
    session_id: str
    plan: Optional[Dict]
    generated_files: Optional[Dict[str, str]]
    test_results: Optional[Dict]
    deployment_url: Optional[str]
    errors: List[str]
    retry_count: int
    current_agent: str
```

### 4. Planner Agent Component

**Responsibilities:**

- Parse user description using Gemini LLM
- Identify page requirements, components, and routing
- Generate structured implementation plan
- Validate plan doesn't exceed 5 pages

**Input:** User description string
**Output:** Structured plan dictionary

```python
class Plan(TypedDict):
    pages: List[PageSpec]
    components: List[ComponentSpec]
    routing: RoutingConfig
    backend_logic: Optional[BackendSpec]

class PageSpec(TypedDict):
    name: str
    route: str
    components: List[str]
    description: str
```

### 5. Builder Agent Component

**Responsibilities:**

- Generate React component code from plan
- Create project structure (package.json, routing, etc.)
- Write files to temporary directory
- Execute pytest tests
- Trigger self-healing on test failures

**Input:** Plan from Planner Agent
**Output:** Dictionary of file paths to file contents

**Self-Healing Logic:**

```python
def self_heal(error_context: Dict, retry_count: int) -> Dict:
    if retry_count >= 3:
        raise MaxRetriesExceeded()

    # Provide error context to LLM
    prompt = f"""
    Previous code generation failed with errors:
    {error_context['errors']}

    Failed tests:
    {error_context['test_failures']}

    Please regenerate the failing components with fixes.
    """

    # Regenerate only failing files
    fixed_files = generate_code_with_llm(prompt)
    return fixed_files
```

### 6. Deployer Agent Component

**Responsibilities:**

- Select available deployment platform (Vercel or Netlify)
- Upload project files via platform API
- Monitor deployment status
- Retrieve and return deployment URL

**Platform Selection Logic:**

```python
def select_platform() -> str:
    # Try Vercel first (no credit card required)
    if vercel_available():
        return 'vercel'
    # Fallback to Netlify
    elif netlify_available():
        return 'netlify'
    else:
        raise NoDeploymentPlatformAvailable()
```

### 7. Episodic Memory Component

**Responsibilities:**

- Store session-scoped project context
- Provide structured format for future RAG integration
- Enable quick retrieval of agent decisions and outputs

**Memory Structure:**

```python
class EpisodicMemory:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.entries: List[MemoryEntry] = []

    def add_entry(self, agent: str, action: str, data: Dict):
        entry = {
            'timestamp': datetime.now().isoformat(),
            'agent': agent,
            'action': action,
            'data': data,
            # Future: embedding field for RAG
            'embedding': None
        }
        self.entries.append(entry)
```

### 8. Audit Logger Component

**Responsibilities:**

- Log all agent decisions with timestamps
- Track file lineage (which agent created/modified each file)
- Record errors with full context
- Generate final audit trail JSON

**Log Entry Format:**

```python
class AuditLogEntry(TypedDict):
    timestamp: str
    session_id: str
    agent: str
    action: str
    details: Dict
    duration_ms: Optional[int]
```

**Lineage Tracking:**

```python
class FileLineage(TypedDict):
    file_path: str
    created_by: str
    created_at: str
    modified_by: List[str]
    reason: str
```

## Data Models

### User Request Model

```python
class UserRequest(BaseModel):
    description: str
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.now)

    @validator('description')
    def validate_description(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Description cannot be empty')
        return v
```

### Project Model

```python
class GeneratedProject(BaseModel):
    session_id: str
    files: Dict[str, str]  # filepath -> content
    plan: Plan
    test_results: TestResults
    deployment_url: Optional[str]
    audit_log: List[AuditLogEntry]
    lineage: List[FileLineage]
```

### Agent Response Model

```python
class AgentResponse(BaseModel):
    agent_name: str
    success: bool
    output: Dict
    errors: List[str] = []
    execution_time_ms: int
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Non-empty input validation

_For any_ user input submitted through the web interface, if the input is empty or whitespace-only, the system should reject it before initiating the workflow.
**Validates: Requirements 1.2**

### Property 2: Page limit enforcement

_For any_ user request that specifies more than 5 pages, the Planner Agent should reject the request and return an error message.
**Validates: Requirements 1.5, 12.3**

### Property 3: Plan structure completeness

_For any_ valid user request, the Planner Agent output should contain all required fields: pages list, components list, routing configuration, and backend specification (if applicable).
**Validates: Requirements 2.2**

### Property 4: File generation completeness

_For any_ plan generated by the Planner Agent, the Builder Agent should generate files for all specified pages and components.
**Validates: Requirements 3.2**

### Property 5: Audit log entry creation

_For any_ file created or modified by any agent, an audit log entry should be created with timestamp, agent name, and file path.
**Validates: Requirements 8.2**

### Property 6: Self-healing retry limit

_For any_ test failure, the self-healing mechanism should retry at most 3 times before reporting failure to the user.
**Validates: Requirements 5.4**

### Property 7: Successful deployment URL generation

_For any_ project that passes all tests, the Deployer Agent should return a valid HTTP/HTTPS URL.
**Validates: Requirements 6.4**

### Property 8: State preservation across agents

_For any_ agent transition in the LangGraph workflow, all previous agent outputs and context should be preserved in the workflow state.
**Validates: Requirements 14.5**

### Property 9: Rate limit enforcement

_For any_ session, if the LLM API request count exceeds 50, subsequent requests should be rejected with a rate limit error.
**Validates: Requirements 10.2**

### Property 10: Progress update emission

_For any_ agent that begins processing, a progress update should be emitted to the WebSocket within 1 second of agent activation.
**Validates: Requirements 9.1**

### Property 11: Execution time reporting

_For any_ completed workflow (success or failure), the system should report total execution time from input submission to final output.
**Validates: Requirements 9.5**

### Property 12: Multi-page routing generation

_For any_ plan with multiple pages, the Builder Agent should generate React Router configuration that includes routes for all pages.
**Validates: Requirements 12.4**

### Property 13: Backend endpoint integration

_For any_ plan that includes backend logic, the generated frontend code should include API calls to all specified backend endpoints.
**Validates: Requirements 13.3**

### Property 14: Memory structure RAG compatibility

_For any_ entry stored in Episodic Memory, the data structure should include fields compatible with future vector embedding (timestamp, agent, action, data, embedding placeholder).
**Validates: Requirements 11.1**

### Property 15: Asynchronous logging performance

_For any_ logging operation that takes longer than 100ms, the operation should be performed asynchronously without blocking agent execution.
**Validates: Requirements 8.5**

## Error Handling

### Error Categories

1. **User Input Errors**

   - Empty description
   - Page count exceeds 5
   - Invalid characters or formatting
   - **Handling**: Return 400 error with clear message, do not initiate workflow

2. **LLM API Errors**

   - Rate limit exceeded
   - API timeout
   - Invalid API key
   - **Handling**: Log error, retry with exponential backoff (max 3 attempts), report to user if all retries fail

3. **Code Generation Errors**

   - Syntax errors in generated code
   - Missing dependencies
   - Test failures
   - **Handling**: Trigger self-healing mechanism, retry with error context (max 3 attempts)

4. **Deployment Errors**

   - Platform API unavailable
   - Authentication failure
   - Deployment timeout
   - **Handling**: Try alternate platform if available, log error, report to user

5. **System Errors**
   - Out of memory
   - Disk space exhausted
   - Network connectivity issues
   - **Handling**: Log critical error, gracefully shutdown workflow, return 500 error to user

### Error Propagation in LangGraph

```python
def handle_agent_error(state: WorkflowState, error: Exception) -> WorkflowState:
    """
    Central error handler for LangGraph workflow
    """
    state['errors'].append({
        'agent': state['current_agent'],
        'error_type': type(error).__name__,
        'message': str(error),
        'timestamp': datetime.now().isoformat()
    })

    # Determine routing based on error type
    if isinstance(error, TestFailureError) and state['retry_count'] < 3:
        state['retry_count'] += 1
        return 'self_heal'  # Route back to Builder
    elif isinstance(error, RateLimitError):
        return 'wait_and_retry'
    else:
        return 'fail'  # Terminal state
```

### Retry Strategy

- **LLM API Calls**: Exponential backoff (1s, 2s, 4s)
- **Deployment API Calls**: Exponential backoff (2s, 4s, 8s)
- **Code Generation**: Immediate retry with error context (max 3 attempts)
- **Test Execution**: No retry (tests are deterministic)

## Testing Strategy

### Unit Testing

Unit tests will verify specific functionality of individual components:

1. **Input Validation Tests**

   - Test empty string rejection
   - Test whitespace-only string rejection
   - Test valid input acceptance

2. **Planner Agent Tests**

   - Test plan structure generation
   - Test page count validation
   - Test backend logic detection

3. **Builder Agent Tests**

   - Test file generation from plan
   - Test package.json creation
   - Test routing configuration generation

4. **Deployer Agent Tests**

   - Test platform selection logic
   - Test URL extraction from deployment response
   - Test error handling for failed deployments

5. **Audit Logger Tests**
   - Test log entry creation
   - Test JSON serialization
   - Test lineage tracking

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using the **Hypothesis** library for Python:

1. **Property Test: Non-empty input validation (Property 1)**

   - Generate random strings including empty, whitespace, and valid inputs
   - Verify empty/whitespace inputs are rejected

2. **Property Test: Page limit enforcement (Property 2)**

   - Generate random plans with varying page counts
   - Verify plans with >5 pages are rejected

3. **Property Test: Plan structure completeness (Property 3)**

   - Generate random user descriptions
   - Verify all Planner outputs contain required fields

4. **Property Test: File generation completeness (Property 4)**

   - Generate random plans
   - Verify Builder generates files for all specified components

5. **Property Test: Audit log entry creation (Property 5)**

   - Generate random file operations
   - Verify each operation creates an audit log entry

6. **Property Test: Self-healing retry limit (Property 6)**

   - Generate random test failures
   - Verify retry count never exceeds 3

7. **Property Test: State preservation (Property 8)**

   - Generate random workflow states
   - Verify state data is preserved across agent transitions

8. **Property Test: Rate limit enforcement (Property 9)**

   - Generate random request sequences
   - Verify requests are rejected after 50 calls

9. **Property Test: Memory structure RAG compatibility (Property 14)**
   - Generate random memory entries
   - Verify all entries contain required fields for future RAG integration

### Integration Testing

Integration tests will verify end-to-end workflows:

1. **Simple Single-Page App Test**

   - Input: "Build a landing page about AI"
   - Verify: Deployment URL returned, 1 page generated

2. **Multi-Page App Test**

   - Input: "Build a 3-page website about climate change"
   - Verify: Deployment URL returned, 3 pages with routing

3. **Backend Logic Test**

   - Input: "Build a contact form that validates email"
   - Verify: Frontend form + backend validation endpoint generated

4. **Self-Healing Test**

   - Inject test failure in Builder Agent
   - Verify: Self-healing triggers, code regenerated, tests pass

5. **Rate Limit Test**
   - Make 51 requests in same session
   - Verify: 51st request rejected with rate limit error

### Testing Configuration

- **Minimum iterations for property tests**: 100
- **Test timeout**: 30 seconds per test
- **Coverage target**: 80% code coverage
- **Test framework**: pytest with Hypothesis plugin
- **Mocking**: Minimal - only mock external APIs (Gemini, Vercel, Netlify)

### Test Tagging

All property-based tests will be tagged with comments referencing the design document:

```python
def test_non_empty_input_validation():
    """
    Feature: amar-mvp, Property 1: Non-empty input validation
    Validates: Requirements 1.2
    """
    @given(st.text())
    def property_test(input_text):
        if input_text.strip() == "":
            with pytest.raises(ValidationError):
                validate_user_input(input_text)
        else:
            validate_user_input(input_text)  # Should not raise

    property_test()
```

## Performance Considerations

### Target Metrics

- **End-to-end execution time**: < 5 minutes for simple apps
- **LLM API latency**: < 10 seconds per call
- **Deployment time**: < 2 minutes
- **WebSocket update frequency**: Every 2-5 seconds
- **Logging overhead**: < 100ms per operation

### Optimization Strategies

1. **Parallel File Generation**: Generate independent components concurrently
2. **Streaming LLM Responses**: Use streaming API to show progress
3. **Async Logging**: Perform all logging operations asynchronously
4. **Caching**: Cache common component templates (future enhancement)
5. **Lazy Loading**: Load agent modules only when needed

## Security Considerations

### API Key Management

- Store Gemini API key in environment variables
- Never log API keys
- Rotate keys regularly
- Use separate keys for dev/prod

### Generated Code Safety

- Sanitize user input before passing to LLM
- Scan generated code for common vulnerabilities (XSS, injection)
- Limit file system access to temporary directories
- Clean up temporary files after deployment

### Rate Limiting

- Per-session request limits (50 requests)
- Per-IP rate limiting (future enhancement)
- Deployment quota monitoring

## Deployment Architecture

### Backend Deployment

- **Platform**: Heroku free tier or Railway
- **Environment**: Python 3.10+
- **Dependencies**: FastAPI, LangGraph, Hypothesis, pytest
- **Configuration**: Environment variables for API keys

### Frontend Deployment

- **Platform**: Vercel or Netlify
- **Build**: React production build
- **Environment**: Node 18+

### Monitoring

- **Logging**: Structured JSON logs to stdout
- **Metrics**: Request count, execution time, error rate
- **Alerts**: Email notification on critical errors (future enhancement)

## Future Enhancements (Post-MVP)

1. **RAG Integration**

   - Add FAISS/Pinecone vector storage
   - Implement embedding generation for memory entries
   - Add retrieval logic to agent prompts

2. **Multi-Framework Support**

   - Add Vue.js and Angular code generation
   - Support Next.js and Gatsby

3. **Database Support**

   - Add SQLite/PostgreSQL integration
   - Generate database schemas and migrations

4. **HITL Checkpoints**

   - Add user approval gates before deployment
   - Allow user to modify generated code

5. **Advanced Self-Healing**

   - Learn from past errors using episodic memory
   - Implement multi-LLM fallback strategy

6. **Enhanced Governance**
   - Add compliance reporting
   - Implement role-based access control
   - Add audit trail visualization dashboard
