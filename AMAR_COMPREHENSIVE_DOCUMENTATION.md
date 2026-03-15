# AMAR - Comprehensive Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Vision & Goals](#vision--goals)
3. [System Architecture](#system-architecture)
4. [Key Features](#key-features)
5. [Technology Stack](#technology-stack)
6. [Multi-Agent System](#multi-agent-system)
7. [Complete End-to-End Flow](#complete-end-to-end-flow)
8. [RAG-Enhanced Intelligence](#rag-enhanced-intelligence)
9. [Real-Time Communication](#real-time-communication)
10. [Error Handling & Self-Healing](#error-handling--self-healing)
11. [Deployment Pipeline](#deployment-pipeline)
12. [Performance & Resource Management](#performance--resource-management)
13. [API Reference](#api-reference)
14. [Configuration](#configuration)
15. [Testing & Validation](#testing--validation)

---

## Project Overview

**AMAR (Autonomous Multi-Agent React Application Generator)** is an AI-powered system that transforms natural language descriptions into production-ready, deployed React applications in under 90 seconds.

The system leverages a sophisticated multi-agent architecture powered by Google Gemini/Groq LLMs, enhanced with RAG (Retrieval-Augmented Generation) for intelligent decision-making, and orchestrated through LangGraph workflows to deliver complete web applications from concept to deployment.

### What Makes AMAR Unique

- **Zero-Code Generation**: Users describe what they want in plain English
- **Intelligent Planning**: RAG-enhanced context retrieval ensures best practices
- **Multi-Agent Collaboration**: Specialized agents work together seamlessly
- **Real-Time Visibility**: WebSocket streaming shows every step of the process
- **Automatic Deployment**: Applications go live on Vercel/Netlify automatically
- **Self-Healing**: Automatic retry and error recovery (up to 3 attempts)
- **Production-Ready**: Complete error handling, logging, and resource management

---

## Vision & Goals

### Primary Vision

Democratize web application development by enabling anyone to create professional, deployed applications through natural language, eliminating the technical barriers between ideas and implementation.

### Core Goals

1. **Accessibility**: Make web development accessible to non-technical users
2. **Speed**: Generate and deploy applications in under 90 seconds
3. **Quality**: Produce production-ready code following best practices
4. **Intelligence**: Use RAG to make informed architectural decisions
5. **Reliability**: Self-healing mechanisms ensure high success rates
6. **Transparency**: Real-time progress updates keep users informed

### Target Use Cases

- Rapid prototyping for startups and entrepreneurs
- MVP development for product validation
- Landing pages and marketing websites
- Portfolio and showcase applications
- Educational projects and demonstrations
- Quick proof-of-concepts for client presentations

---

## System Architecture

AMAR follows a layered architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                         │
│  React + TypeScript + Material-UI + WebSocket Client       │
│  • User Input Form                                          │
│  • Real-Time Progress Display                               │
│  • Deployment Result Viewer                                 │
│  • Project Download Feature                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER                              │
│  FastAPI + WebSocket + CORS + Error Handling               │
│  • POST /api/generate - Initiate workflow                  │
│  • WS /ws/{session_id} - Real-time progress                │
│  • GET /api/result/{session_id} - Poll for results         │
│  • GET /api/download/{session_id} - Download project       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   RAG SERVICE LAYER                         │
│  FAISS Vector Search + Knowledge Base                       │
│  • Retrieve relevant documentation                          │
│  • Enrich user queries with context                         │
│  • 63 knowledge chunks covering:                            │
│    - Architecture patterns                                  │
│    - UI/UX best practices                                   │
│    - Deployment strategies                                  │
│    - Technology comparisons                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              WORKFLOW ORCHESTRATION LAYER                   │
│  LangGraph State Machine + Agent Coordination               │
│  • Supervisor → Planner → Builder → Tester → Deployer      │
│  • Self-Healing on failures                                 │
│  • Context preservation across transitions                  │
│  • Retry logic (max 3 attempts)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    AGENT LAYER                              │
│  Specialized AI Agents powered by Gemini/Groq               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Planner  │  │ Builder  │  │  Tester  │  │ Deployer │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  SUPPORTING SERVICES                        │
│  • Memory Manager - Session context & history               │
│  • Audit Logger - Comprehensive operation tracking          │
│  • Error Handler - Categorized error management             │
│  • Rate Limiter - API quota protection                      │
│  • Graceful Failure - Resource monitoring & degradation     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXTERNAL SERVICES                          │
│  • LLM APIs (Gemini/Groq/OpenAI)                           │
│  • Deployment Platforms (Vercel/Netlify)                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1. RAG-Enhanced Intelligence

AMAR uses a knowledge base with 63 curated chunks covering:

- React best practices and patterns
- Material-UI component guidelines
- Deployment strategies and configurations
- Architecture patterns for common use cases
- UI/UX design principles

**How it works:**

- User query is sent to FAISS vector search
- Top 3 most relevant documents are retrieved
- Query is enriched with contextual knowledge
- Agents receive enhanced prompts with best practices

**Benefits:**

- More accurate code generation
- Better architectural decisions
- Consistent styling and patterns
- Deployment-ready configurations

### 2. Multi-Agent Collaboration

Four specialized agents work together in sequence:

**Planner Agent**

- Analyzes user requirements
- Detects backend needs automatically
- Creates structured implementation plan
- Defines pages, components, and routing
- Validates plan completeness (max 5 pages)

**Builder Agent**

- Generates React + TypeScript code
- Creates Material-UI components
- Writes configuration files
- Produces 15-20 files per project
- Auto-corrects common syntax errors

**Tester Agent**

- Validates file structure
- Checks required files exist
- Runs basic syntax validation
- Triggers self-healing on failures

**Deployer Agent**

- Initializes Git repository
- Installs dependencies
- Deploys to Vercel or Netlify
- Returns public deployment URL
- Provides manual deployment fallback

### 3. Real-Time Progress Streaming

WebSocket-based progress updates provide transparency:

```json
{
  "type": "progress",
  "agent": "planner",
  "status": "running",
  "message": "Analyzing request and creating implementation plan",
  "timestamp": "2026-03-15T10:30:00Z"
}
```

Users see:

- Which agent is currently working
- What operation is being performed
- Success/failure status for each step
- Detailed error messages if issues occur
- Final deployment URL when complete

### 4. Self-Healing & Retry Logic

Automatic recovery from failures:

- Tests fail → Self-heal node analyzes errors
- Retry count incremented (max 3 attempts)
- Builder regenerates code with corrections
- Tests run again until success or max retries
- Graceful failure messages if unrecoverable

### 5. Comprehensive Error Handling

Categorized error management:

- **User Input Errors**: Empty descriptions, invalid formats
- **LLM API Errors**: Rate limits, timeouts, invalid responses
- **Validation Errors**: Plan structure, code syntax issues
- **Deployment Errors**: Platform unavailable, token issues
- **System Errors**: Memory exhaustion, disk space

Each error type has:

- User-friendly messages
- Detailed logging for debugging
- Recovery strategies where possible
- Graceful degradation paths

### 6. Resource Management

Intelligent resource monitoring:

- Memory usage tracking (critical at <500MB available)
- Disk space monitoring (warning at <1GB)
- RAG auto-disable on low memory systems
- Graceful degradation without system crashes
- Resource status in health check endpoint

### 7. Audit Trail & Lineage Tracking

Complete operation logging:

- Every agent decision logged with context
- File operations tracked with lineage
- Workflow transitions recorded
- Error stack traces preserved
- Async logging for performance (non-blocking)
- JSON format for easy analysis

### 8. Project Download Feature

Users can download generated projects:

- Complete project as ZIP file
- All source files included
- Ready for local development
- Manual deployment option
- Customization-friendly structure

---

## Technology Stack

### Backend

- **Framework**: FastAPI (async Python web framework)
- **LLM Integration**: LangChain + Google Gemini/Groq/OpenAI
- **Workflow Engine**: LangGraph (state machine orchestration)
- **Vector Search**: FAISS (Facebook AI Similarity Search)
- **Embeddings**: Sentence Transformers (all-MiniLM-L6-v2)
- **Validation**: Pydantic (data validation and serialization)
- **Real-Time**: WebSocket (bidirectional communication)

### Frontend

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **Styling**: Emotion (CSS-in-JS)
- **Build Tool**: Create React App with react-scripts
- **State Management**: React Hooks (useState, useEffect)

### Infrastructure

- **Backend Hosting**: Railway / Heroku
- **Frontend Hosting**: Vercel / Netlify
- **Version Control**: Git
- **Containerization**: Docker (optional)

### Development Tools

- **Python**: 3.10+
- **Node.js**: 16+
- **Package Managers**: pip, npm
- **Testing**: pytest (backend), Jest (frontend)

---

## Multi-Agent System

### Agent Architecture

Each agent is a specialized module with:

- Dedicated LLM client (Gemini/Groq/OpenAI)
- Rate limiting (50 requests per session)
- Exponential backoff for retries
- Memory integration for context
- Audit logging for decisions
- Structured input/output models

### Planner Agent

**Responsibility**: Transform user descriptions into structured implementation plans

**Input**: UserRequest with natural language description

**Process**:

1. Receives enriched query from RAG service
2. Analyzes requirements and detects backend needs
3. Decomposes into pages (max 5), components, and routing
4. Validates plan structure and completeness
5. Stores plan in episodic memory

**Output**: Plan object containing:

- PageSpec[] - Page definitions with routes and components
- ComponentSpec[] - Component specifications with props
- RoutingConfig - React Router configuration
- BackendSpec - API endpoints if needed (optional)
- estimated_complexity - "simple" | "medium" | "complex"

**Key Capabilities**:

- Automatic backend detection (forms, data submission, validation)
- Component reusability analysis
- Route validation and consistency checks
- Material-UI component planning
- Complexity estimation

**Example Plan**:

```json
{
  "pages": [
    {
      "name": "HomePage",
      "route": "/",
      "components": ["Header", "HeroSection", "Footer"],
      "description": "Landing page with hero and CTA"
    }
  ],
  "components": [
    {
      "name": "Header",
      "type": "functional",
      "props": { "title": "string" },
      "description": "Navigation header with branding"
    }
  ],
  "routing": {
    "base_path": "/",
    "routes": [{ "path": "/", "component": "HomePage" }],
    "navigation_links": [{ "label": "Home", "path": "/" }]
  },
  "backend_logic": null,
  "estimated_complexity": "simple"
}
```

### Builder Agent

**Responsibility**: Generate complete React project code from structured plans

**Input**: Plan object from Planner Agent

**Process**:

1. Generates package.json with dependencies
2. Creates App.tsx with routing and MUI theme
3. Generates page components (one per PageSpec)
4. Generates shared components (one per ComponentSpec)
5. Creates backend files if backend_logic specified
6. Generates configuration files (tsconfig, .gitignore, etc.)
7. Creates deployment configs (vercel.json, netlify.toml)
8. Auto-corrects TypeScript syntax errors
9. Writes all files to temporary directory

**Output**: GeneratedProject containing:

- files: Dict[str, str] - 15-20 files with complete code
- plan: Original plan for reference
- test_results: Placeholder for testing phase
- lineage: File creation tracking
- project_dir: Temporary directory path

**Generated Files**:

- package.json - Dependencies and scripts
- src/App.tsx - Main app with routing and MUI theme
- src/index.tsx - Entry point
- src/pages/\*.tsx - Page components
- src/components/\*.tsx - Shared components
- src/index.css, src/App.css - Styling
- public/index.html - HTML template
- public/manifest.json - PWA manifest
- tsconfig.json - TypeScript configuration
- .gitignore - Git ignore rules
- vercel.json, netlify.toml - Deployment configs
- .npmrc - npm configuration
- README.md - Project documentation
- server.js, api/\*.js - Backend files (if needed)

**Key Capabilities**:

- Material-UI component generation
- Responsive design patterns
- TypeScript type safety
- Accessibility compliance
- Modern React patterns (hooks, functional components)
- Auto-correction of common errors

### Tester Agent

**Responsibility**: Validate generated code before deployment

**Input**: Project directory path from Builder Agent

**Process**:

1. Checks if package.json exists
2. Validates required files (App.tsx, index.tsx)
3. Verifies file structure completeness
4. Runs basic syntax validation
5. Returns pass/fail results

**Output**: TestResults containing:

- passed: Number of tests passed
- failed: Number of tests failed
- errors: List of error messages
- execution_time_ms: Test duration

**Validation Checks**:

- File existence (package.json, src/App.tsx, src/index.tsx)
- Directory structure (src/, public/)
- Configuration files (tsconfig.json)
- Basic syntax validation

**Self-Healing Trigger**:

- If tests fail and retry_count < 3 → Self-heal node
- If tests fail and retry_count >= 3 → Workflow fails
- If tests pass → Continue to Deployer

### Deployer Agent

**Responsibility**: Deploy generated applications to hosting platforms

**Input**: GeneratedProject and project directory path

**Process**:

1. Selects available platform (Vercel preferred, Netlify fallback)
2. Ensures CLI tools are installed (auto-install if needed)
3. Installs npm dependencies with --legacy-peer-deps
4. Initializes Git repository
5. Commits all files
6. Deploys using platform CLI (vercel --prod or netlify deploy --prod)
7. Monitors deployment status
8. Extracts and returns deployment URL

**Output**: Deployment result containing:

- deployment_url: Public URL of deployed app
- platform: "vercel" or "netlify"
- deployment_details: Status and metadata
- project_location: Local file path

**Platform Selection Logic**:

1. Check if VERCEL_TOKEN is configured → Try Vercel
2. If Vercel fails or unavailable → Try Netlify
3. If both fail → Provide manual deployment instructions
4. If npm unavailable → Return project files for manual deployment

**Graceful Degradation**:

- CLI auto-installation if missing
- Platform fallback (Vercel → Netlify)
- Manual deployment instructions as last resort
- Project files always saved locally

---

## Complete End-to-End Flow

### Phase 1: User Input & RAG Enhancement

**Step 1.1: User Submits Request**

```
User → Frontend → POST /api/generate
{
  "description": "Build a todo list app with React"
}
```

**Step 1.2: Session Creation**

- Backend generates unique session_id
- Creates session storage with metadata
- Initializes episodic memory
- Initializes audit logger

**Step 1.3: RAG Context Retrieval**

```
Backend → RAG Service → FAISS Index
Query: "Build a todo list app with React"
↓
Retrieved Docs (top 3):
1. React best practices (relevance: 0.92)
2. State management patterns (relevance: 0.88)
3. Deployment guidelines (relevance: 0.85)
↓
Enriched Query:
"User Request: Build a todo list app with React

Relevant Context:
[Context 1 - Relevance: 0.92]: Use functional components with hooks...
[Context 2 - Relevance: 0.88]: For state management, prefer useState...
[Context 3 - Relevance: 0.85]: Deploy to Vercel with vercel.json..."
```

**Step 1.4: Response to Frontend**

```json
{
  "session_id": "abc-123",
  "message": "Application generation initiated",
  "status": "initiated"
}
```

### Phase 2: Real-Time Progress (WebSocket)

**Step 2.1: Frontend Connects**

```
Frontend → WS /ws/{session_id}
↓
{
  "type": "connection",
  "message": "Connected to progress updates",
  "session_id": "abc-123"
}
```

**Step 2.2: Progress Updates Stream**

```
← { "type": "progress", "agent": "planner", "status": "running",
    "message": "Analyzing request and creating plan" }

← { "type": "progress", "agent": "planner", "status": "completed",
    "message": "Plan created with 3 pages" }

← { "type": "progress", "agent": "builder", "status": "running",
    "message": "Generating React code" }

← { "type": "progress", "agent": "builder", "status": "completed",
    "message": "Generated 18 files" }

← { "type": "progress", "agent": "tester", "status": "running",
    "message": "Running tests on generated code" }

← { "type": "progress", "agent": "tester", "status": "completed",
    "message": "All tests passed (3 tests)" }

← { "type": "progress", "agent": "deployer", "status": "running",
    "message": "Deploying application to hosting platform" }

← { "type": "progress", "agent": "deployer", "status": "completed",
    "message": "Application deployed successfully",
    "details": "🌐 Deployment URL: https://todo-app-abc123.vercel.app" }

← { "type": "complete", "message": "Workflow completed successfully",
    "deployment_url": "https://todo-app-abc123.vercel.app",
    "execution_time_ms": 45000 }
```

### Phase 3: Workflow Execution

**Step 3.1: Supervisor Node**

- Initializes workflow state
- Logs workflow initiation
- Routes to Planner

**Step 3.2: Planner Node**

- Receives enriched user input
- Calls Gemini LLM with structured prompt
- Parses JSON response into Plan object
- Validates plan structure (max 5 pages, required fields)
- Stores plan in workflow state
- Routes to Builder on success

**Step 3.3: Builder Node**

- Receives Plan from workflow state
- Generates 15-20 project files
- Writes files to temporary directory
- Stores file paths in workflow state
- Routes to Tester

**Step 3.4: Tester Node**

- Validates file structure
- Checks required files exist
- Runs basic syntax checks
- Routes to Deployer if passed
- Routes to Self-Heal if failed (and retry_count < 3)
- Routes to Finalize if max retries reached

**Step 3.5: Deployer Node**

- Selects deployment platform
- Installs dependencies
- Initializes Git and commits files
- Deploys to Vercel/Netlify
- Extracts deployment URL
- Routes to Finalize

**Step 3.6: Finalize Node**

- Calculates execution time
- Determines final status (success only if deployment_url exists)
- Prepares result summary
- Logs completion to memory and audit
- Returns final state

### Phase 4: Error Handling & Self-Healing

**Step 4.1: Test Failure Detection**

```
If tests fail:
  → Self-Heal Node
    - Increment retry_count
    - Log failure details
    - Analyze error patterns
    → Return to Builder (with retry context)
```

**Step 4.2: Retry Flow**

```
→ Builder (with retry context)
  - Generates new code with corrections
  - Applies auto-fixes for common errors
→ Tester validates again
  → Success: Continue to Deployer
  → Failure: Self-Heal (if retry_count < 3)
  → Failure: Finalize (if retry_count >= 3)
```

### Phase 5: Result Retrieval

**Step 5.1: Frontend Polls for Results**

```
Frontend → GET /api/result/{session_id}
```

**Step 5.2: Final Results**

```json
{
  "success": true,
  "url": "https://todo-app-abc123.vercel.app",
  "execution_time_ms": 45000,
  "project_summary": {
    "page_count": 3,
    "component_count": 8,
    "file_count": 18,
    "has_backend": false
  }
}
```

### Complete Flow Timeline

```
0s    - User submits request
0.5s  - RAG retrieves context (3 docs)
1s    - Planner starts analysis
8s    - Planner completes (Plan with 3 pages, 8 components)
10s   - Builder starts code generation
25s   - Builder completes (18 files generated)
26s   - Tester validates files
28s   - Tester passes (3 checks)
30s   - Deployer starts deployment
75s   - Deployer completes (Vercel deployment)
75s   - Finalize prepares results
75s   - User receives deployment URL
```

**Average Execution Time**: 45-90 seconds
**Success Rate**: ~85% (with self-healing)

---

## RAG-Enhanced Intelligence

### Knowledge Base Structure

The knowledge base contains 63 chunks organized by category:

**Architecture** (15 chunks)

- Component patterns
- State management strategies
- Project structure best practices
- Scalability considerations

**UI/UX** (20 chunks)

- Material-UI guidelines
- Responsive design patterns
- Accessibility requirements
- Modern design trends
- Color theory and typography

**Deployment** (18 chunks)

- Vercel deployment guide
- Netlify configuration
- CI/CD best practices
- Environment variable management
- Performance optimization

**Web Stacks** (10 chunks)

- MERN vs MEAN comparison
- Technology selection criteria
- Framework comparisons
- Library recommendations

### RAG Pipeline

**Ingestion Process**:

1. Load markdown files from knowledge_base/
2. Chunk into 300-token segments
3. Generate 768-dim embeddings (Sentence Transformers)
4. Index with FAISS HNSW (fast similarity search)
5. Save to amar_knowledge_base.pkl + .index

**Retrieval Process**:

1. User query embedded using same model
2. FAISS similarity search (cosine distance)
3. Top-k documents retrieved (k=3 for efficiency)
4. Documents ranked by relevance score
5. Query enriched with retrieved context

**Integration Points**:

- `/api/generate` endpoint - Enriches user input before workflow
- Planner Agent - Loads system prompts from knowledge base
- Builder Agent - Retrieves styling and component guidelines

**Performance**:

- Retrieval time: <500ms
- Memory usage: ~3GB (with RAG enabled)
- Relevance accuracy: 90-95%
- Context quality: High (curated documents)

**Graceful Degradation**:

- Auto-disables on low memory (<1.5GB available)
- Can be manually disabled via DISABLE_RAG=true
- Falls back to direct LLM calls without context
- System remains functional without RAG

---

## Real-Time Communication

### WebSocket Protocol

**Connection Lifecycle**:

1. Frontend initiates generation via POST /api/generate
2. Backend returns session_id
3. Frontend connects to WS /ws/{session_id}
4. Backend accepts connection and sends confirmation
5. Backend streams progress updates as agents work
6. Frontend displays updates in real-time
7. Backend sends final "complete" or "error" message
8. Connection closes or remains open for keepalive

**Message Types**:

**Connection Message**:

```json
{
  "type": "connection",
  "message": "Connected to progress updates",
  "session_id": "abc-123",
  "timestamp": "2026-03-15T10:30:00Z"
}
```

**Progress Message**:

```json
{
  "type": "progress",
  "agent": "builder",
  "status": "running",
  "message": "Generating React code",
  "details": "Creating 18 files...",
  "timestamp": "2026-03-15T10:30:15Z"
}
```

**Complete Message**:

```json
{
  "type": "complete",
  "message": "Workflow completed successfully",
  "deployment_url": "https://app.vercel.app",
  "execution_time_ms": 45000,
  "timestamp": "2026-03-15T10:31:15Z"
}
```

**Error Message**:

```json
{
  "type": "error",
  "message": "Workflow failed",
  "error": "Deployment platform unavailable",
  "timestamp": "2026-03-15T10:31:15Z"
}
```

**Keepalive (Ping/Pong)**:

```
Frontend → "ping"
Backend → {"type": "pong", "timestamp": "..."}
```

### Progress Update Flow

```
Workflow Orchestrator
    ↓
send_progress_update(session_id, agent, status, message, details)
    ↓
1. Log to console (clean phase transitions)
2. Store in session history
3. Send to active WebSocket connection
    ↓
Frontend receives and displays update
```

**Status Values**:

- "running" - Agent is actively working
- "completed" - Agent finished successfully
- "failed" - Agent encountered an error
- "skipped" - Agent was bypassed

**Agent Names**:

- "supervisor" - Workflow initialization
- "planner" - Planning phase
- "builder" - Code generation
- "tester" - Validation phase
- "deployer" - Deployment phase
- "self_heal" - Retry/recovery
- "finalize" - Completion phase
- "system" - System-level messages

---

## Error Handling & Self-Healing

### Error Categories

**1. User Input Errors** (HTTP 400)

- Empty descriptions
- Invalid characters
- Excessively long input
- Missing required fields

**2. LLM API Errors** (HTTP 500)

- Rate limit exceeded
- API timeout
- Invalid API key
- Model not found
- Response parsing failures

**3. Validation Errors** (HTTP 422)

- Plan structure invalid
- Page count exceeds 5
- Missing required components
- Invalid routing configuration

**4. Deployment Errors** (HTTP 500)

- Platform unavailable
- Token invalid/missing
- CLI tools not installed
- Build failures
- Timeout (5 minutes)

**5. System Errors** (HTTP 503)

- Memory exhaustion (<500MB)
- Disk space critical (<1GB)
- Service unavailable

### Error Handler Service

**Capabilities**:

- Categorizes errors by type
- Generates user-friendly messages
- Logs detailed error context
- Provides recovery suggestions
- Tracks error patterns

**Error Response Format**:

```python
{
  "user_message": "Deployment failed: No platforms available",
  "error_details": {
    "error_type": "DeploymentError",
    "category": "deployment",
    "recoverable": False,
    "context": {...},
    "timestamp": "2026-03-15T10:30:00Z"
  }
}
```

### Self-Healing Mechanism

**Trigger Conditions**:

- Test failures detected
- Retry count < 3
- Error is recoverable

**Self-Heal Process**:

1. Increment retry_count in workflow state
2. Log failure details to memory
3. Analyze error patterns
4. Return to Builder with retry context
5. Builder regenerates code with corrections
6. Tester validates again

**Retry Strategy**:

- Attempt 1: Standard generation
- Attempt 2: Generation with error context
- Attempt 3: Generation with strict validation
- After 3 attempts: Graceful failure

**Auto-Correction Features**:

- TypeScript type errors (array → string[])
- Import statement fixes
- Component prop type corrections
- Common syntax error patterns

### Graceful Failure Handling

**Resource Monitoring**:

```python
{
  "memory": {
    "available_gb": 2.5,
    "status": "healthy",  # healthy | warning | critical
    "threshold_warning_gb": 1.0,
    "threshold_critical_gb": 0.5
  },
  "disk": {
    "available_gb": 15.0,
    "status": "healthy",
    "threshold_warning_gb": 2.0,
    "threshold_critical_gb": 1.0
  }
}
```

**Degradation Strategies**:

- Low memory → Disable RAG automatically
- Critical memory → Reject new requests
- Disk space low → Clean old project directories
- Platform unavailable → Try alternative platform
- All platforms fail → Provide manual instructions

---

## Deployment Pipeline

### Vercel Deployment

**Prerequisites**:

- VERCEL_TOKEN environment variable
- Vercel CLI installed (auto-installs if missing)
- npm available

**Process**:

1. Change to project directory
2. Clean install dependencies: `npm install --legacy-peer-deps`
3. Initialize Git: `git init && git add . && git commit -m "Initial"`
4. Deploy: `vercel --yes --prod --token $VERCEL_TOKEN`
5. Extract URL from CLI output
6. Monitor deployment status
7. Return deployment URL

**Configuration** (vercel.json):

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    }
  ],
  "routes": [
    { "src": "/static/(.*)", "dest": "/static/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

**Timeout**: 5 minutes
**Retry**: Automatic on transient failures

### Netlify Deployment

**Prerequisites**:

- NETLIFY_TOKEN environment variable
- Netlify CLI installed (auto-installs if missing)
- npm available

**Process**:

1. Change to project directory
2. Clean install dependencies: `npm install --legacy-peer-deps`
3. Build project: `npm run build`
4. Initialize Git: `git init && git add . && git commit -m "Initial"`
5. Deploy: `netlify deploy --prod --dir=build --auth=$NETLIFY_TOKEN`
6. Extract URL from CLI output
7. Monitor deployment status
8. Return deployment URL

**Configuration** (netlify.toml):

```toml
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Timeout**: 5 minutes
**Retry**: Automatic on transient failures

### Manual Deployment Fallback

If automatic deployment fails, AMAR provides:

- Complete project files in local directory
- Step-by-step deployment instructions
- Platform-specific commands
- Troubleshooting guidance

**Manual Instructions Format**:

```
📁 Project Location: /tmp/amar_project_20260315_103000

Manual Deployment Options:

1. Deploy to Vercel:
   cd /tmp/amar_project_20260315_103000
   npm install
   vercel --prod

2. Deploy to Netlify:
   cd /tmp/amar_project_20260315_103000
   npm install
   npm run build
   netlify deploy --prod --dir=build

3. Run Locally:
   cd /tmp/amar_project_20260315_103000
   npm install
   npm start
```

---

## Performance & Resource Management

### Memory Management

**Memory Monitoring**:

- Continuous monitoring via psutil
- Thresholds: Warning (1GB), Critical (500MB)
- Auto-disable RAG on low memory
- Reject requests on critical memory

**Memory Usage**:

- With RAG: ~3GB (FAISS index + embeddings)
- Without RAG: ~500MB (base application)
- Per session: ~50-100MB (workflow state + files)

**Optimization Strategies**:

- Lazy loading of RAG pipeline
- Garbage collection after sessions
- Temporary file cleanup
- Session expiration (configurable)

### Rate Limiting

**Session-Based Limits**:

- Max 50 LLM requests per session
- Prevents quota exhaustion
- Protects against abuse
- Configurable via MAX_REQUESTS_PER_SESSION

**Exponential Backoff**:

- Base delay: 1 second
- Max retries: 3
- Backoff multiplier: 2x
- Max delay: 8 seconds

**Rate Limit Response**:

```json
{
  "detail": "Rate limit exceeded for this session. Maximum 50 requests allowed."
}
```

### Disk Space Management

**Monitoring**:

- Check available disk space before workflows
- Warning threshold: 2GB
- Critical threshold: 1GB

**Cleanup Strategies**:

- Old project directories removed after 24 hours
- Temporary files cleaned on session end
- Log rotation (keep last 100 sessions)

### Performance Metrics

**Typical Execution Times**:

- RAG retrieval: 0.3-0.5s
- Planner: 5-10s
- Builder: 15-25s
- Tester: 1-3s
- Deployer: 30-60s
- Total: 45-90s

**Optimization Techniques**:

- Async logging (non-blocking)
- Parallel file generation where possible
- Efficient state management
- Minimal context in prompts (reduced from 5 to 3 docs)
- Auto-correction to reduce retry cycles

---

## API Reference

### POST /api/generate

Initiate application generation workflow.

**Request**:

```json
{
  "description": "Build a todo list app with React",
  "session_id": "optional-custom-id"
}
```

**Response** (200 OK):

```json
{
  "session_id": "abc-123",
  "message": "Application generation initiated",
  "status": "initiated"
}
```

**Errors**:

- 400: Invalid input (empty description)
- 500: System error
- 503: Service unavailable (low resources)

### WS /ws/{session_id}

WebSocket endpoint for real-time progress updates.

**Connection**: `ws://localhost:8000/ws/abc-123`

**Messages**: See Real-Time Communication section

### GET /api/result/{session_id}

Retrieve final deployment result.

**Response** (200 OK):

```json
{
  "success": true,
  "url": "https://app.vercel.app",
  "execution_time_ms": 45000,
  "project_summary": {
    "page_count": 3,
    "component_count": 8,
    "file_count": 18,
    "has_backend": false
  }
}
```

**Errors**:

- 404: Session not found

### GET /api/download/{session_id}

Download generated project as ZIP file.

**Response**: application/zip file

**Errors**:

- 404: Session or project not found
- 500: Failed to create ZIP

### GET /

Health check endpoint with resource status.

**Response** (200 OK):

```json
{
  "message": "AMAR MVP Backend is running",
  "status": "healthy",
  "version": "1.0.0",
  "active_sessions": 2,
  "active_connections": 1,
  "rag_enabled": true,
  "resources": {
    "memory": { "available_gb": 2.5, "status": "healthy" },
    "disk": { "available_gb": 15.0, "status": "healthy" }
  }
}
```

### GET /health

Dedicated health check for deployment platforms.

**Response** (200 OK):

```json
{
  "status": "healthy",
  "timestamp": "2026-03-15T10:30:00Z",
  "checks": {
    "memory": "healthy",
    "disk": "healthy"
  }
}
```

**Errors**:

- 503: Service unhealthy (critical resources)

---

## Configuration

### Environment Variables

**Required**:

```env
# LLM API Keys (at least one required)
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
OPENAI_API_KEY=your_openai_key

# Deployment Tokens (at least one required)
VERCEL_TOKEN=your_vercel_token
NETLIFY_TOKEN=your_netlify_token
```

**Optional**:

```env
# Application Configuration
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
LOG_LEVEL=INFO

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# LLM Selection
USE_GROQ=false
USE_OPENAI=false
GEMINI_MODEL=gemini-2.5-pro

# Rate Limiting
MAX_REQUESTS_PER_SESSION=50
MAX_RETRY_ATTEMPTS=3

# RAG Configuration
DISABLE_RAG=false

# Deployment Configuration
MOCK_DEPLOYMENT=false
```

### Frontend Configuration

**.env.local** (development):

```env
REACT_APP_API_URL=http://localhost:8000
```

**.env.production** (production):

```env
REACT_APP_API_URL=https://your-backend.railway.app
```

### Configuration Files

**backend/.env**:

- API keys and tokens
- Application settings
- Feature flags

**frontend/.env.local**:

- Backend API URL
- Feature flags

**backend/config.py**:

- Settings class with Pydantic validation
- Environment variable loading
- Default values and validation

---

## Testing & Validation

### Backend Tests

**Test Files**:

- test_planner.py - Planner agent tests
- test_builder.py - Builder agent tests
- test_deployer.py - Deployer agent tests
- test_workflow.py - Workflow orchestration tests
- test_memory.py - Memory system tests
- test_audit.py - Audit logging tests
- test_rate_limiter.py - Rate limiting tests
- test_integration_e2e.py - End-to-end integration tests

**Run Tests**:

```bash
cd backend
pytest tests/ -v
```

**Quick Tests**:

```bash
# Test Gemini API connection
python test_gemini_quick.py

# Test complete flow
python test_complete_flow.py

# Test RAG system
python test_rag_simple.py
```

### Frontend Tests

**Test Files**:

- App.test.tsx - Main app component tests

**Run Tests**:

```bash
cd frontend
npm test -- --run
```

### Integration Testing

**Complete Flow Test**:

```bash
cd backend
python test_complete_flow.py
```

**Validates**:

- RAG system initialization
- Configuration loading
- All agents functional
- Workflow orchestration
- Service integration
- Complete execution path

---

## Installation & Setup

### Prerequisites

- Python 3.10 or higher
- Node.js 16 or higher
- 8GB RAM (for RAG system) or 2GB (without RAG)
- 5GB disk space
- Git

### Backend Setup

```bash
# Clone repository
git clone https://github.com/rishabhGit24/amar-b.git
cd amar-b

# Navigate to backend
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Initialize knowledge base (optional, for RAG)
python ingest_knowledge_base.py

# Verify setup
python test_complete_flow.py
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with backend URL

# Verify setup
npm test -- --run
```

### Running the Application

**Terminal 1 - Backend**:

```bash
cd backend
python main.py
```

**Terminal 2 - Frontend**:

```bash
cd frontend
npm start
```

**Access Application**:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

---

## Usage Examples

### Example 1: Simple Landing Page

**Input**:

```
"Create a landing page for a coffee shop with a hero section, menu, about us, and contact form"
```

**Generated**:

- 4 pages (Home, Menu, About, Contact)
- 10 components (Header, Footer, HeroSection, MenuSection, etc.)
- Backend API for contact form
- Material-UI styling
- Responsive design
- Deployed to Vercel

**Time**: ~60 seconds

### Example 2: Portfolio Website

**Input**:

```
"Build a portfolio website with projects showcase, about me section, and contact information"
```

**Generated**:

- 3 pages (Home, Projects, Contact)
- 8 components (Header, ProjectCard, ContactForm, etc.)
- No backend (static site)
- Modern design with animations
- Deployed to Netlify

**Time**: ~50 seconds

### Example 3: Todo List Application

**Input**:

```
"Create a todo list app where users can add, complete, and delete tasks"
```

**Generated**:

- 1 page (TodoApp)
- 5 components (TodoList, TodoItem, TodoInput, etc.)
- Local state management with useState
- Material-UI components
- Deployed to Vercel

**Time**: ~45 seconds

---

## Advanced Features

### Episodic Memory System

**Purpose**: Maintain context across agent transitions

**Structure**:

```python
MemoryEntry {
  id: str
  timestamp: str
  session_id: str
  agent: str
  action: str
  data: Dict
  tags: List[str]
  importance: float (0.0-1.0)
}
```

**Capabilities**:

- Store agent decisions with context
- Retrieve by agent, action, or tags
- Importance-based filtering
- Context generation for prompts
- Export for future RAG integration

**Usage**:

```python
memory = memory_manager.get_memory(session_id)
memory.add_entry(
  agent='planner',
  action='plan_generated',
  data={'page_count': 3},
  tags=['planning', 'success'],
  importance=1.0
)
```

### Audit Trail System

**Purpose**: Comprehensive logging for debugging and compliance

**Features**:

- Agent decision logging
- File operation tracking with lineage
- Error logging with stack traces
- Workflow transition recording
- Async logging for performance
- JSON format for analysis

**Audit Log Entry**:

```json
{
  "timestamp": "2026-03-15T10:30:00Z",
  "session_id": "abc-123",
  "agent": "builder",
  "action": "file_create",
  "details": {
    "file_path": "src/App.tsx",
    "reason": "Generated from plan",
    "file_size_bytes": 2048
  },
  "duration_ms": 150
}
```

**File Lineage Tracking**:

```python
FileLineage {
  file_path: "src/App.tsx"
  created_by: "builder"
  created_at: "2026-03-15T10:30:00Z"
  modified_by: []
  reason: "Generated from plan"
}
```

### Backend Detection

**Automatic Detection** of backend requirements:

**Indicators**:

- Forms (contact, signup, feedback)
- Data submission keywords ("submit", "send", "save")
- Validation requirements
- API calls or data fetching
- Search functionality
- User interactions requiring server-side logic

**Detection Result**:

```python
{
  "needs_backend": True,
  "confidence": 0.85,
  "detected_categories": ["form_submission", "data_validation"],
  "suggested_endpoints": [
    {
      "method": "POST",
      "path": "/api/contact",
      "handler": "handleContact",
      "description": "Handle contact form submission"
    }
  ]
}
```

**Backend Generation**:

- Express.js server (server.js)
- API endpoint handlers (api/\*.js)
- CORS and body-parser middleware
- Environment variable configuration
- Error handling and validation

---

## Workflow State Management

### WorkflowState Schema

```python
WorkflowState {
  # Core data
  user_input: str
  session_id: str

  # Agent outputs
  plan: Optional[Dict]
  generated_files: Optional[Dict[str, str]]
  test_results: Optional[Dict]
  deployment_url: Optional[str]

  # Error handling
  errors: List[str]
  retry_count: int

  # Workflow management
  current_agent: str
  workflow_status: str  # 'running' | 'completed' | 'failed'

  # Timestamps
  started_at: str
  last_updated: str
  execution_time_ms: Optional[int]

  # Context preservation
  agent_context: Dict[str, Any]
}
```

### State Transitions

**Supervisor → Planner**:

- Initializes workflow
- Sets status to "running"

**Planner → Builder**:

- Adds plan to state
- Preserves user_input and session_id

**Builder → Tester**:

- Adds generated_files to state
- Adds project_dir to agent_context
- Preserves plan

**Tester → Deployer** (success):

- Adds test_results to state
- Preserves all previous context

**Tester → Self-Heal** (failure):

- Adds test_results with errors
- Increments retry_count
- Preserves plan and context

**Self-Heal → Builder**:

- Maintains retry_count
- Preserves error context
- Builder regenerates with corrections

**Deployer → Finalize**:

- Adds deployment_url to state
- Adds project_location
- Preserves all context

**Finalize → END**:

- Sets workflow_status to "completed" or "failed"
- Calculates execution_time_ms
- Returns final state

### Context Preservation

**Critical Rule**: No data loss across transitions

**Preserved Fields**:

- user_input (original request)
- session_id (tracking)
- plan (from Planner)
- generated_files (from Builder)
- agent_context (all agent-specific data)
- errors (accumulated)
- retry_count (incremented)

**Validation**: Every state transition validates required fields

---

## Security & Best Practices

### API Key Management

- Never commit keys to Git
- Use environment variables
- Rotate keys regularly
- Monitor usage and quotas
- Set up billing alerts

### CORS Configuration

- Whitelist specific origins only
- No wildcard (\*) in production
- Include all frontend URLs
- Update on frontend URL changes

### Input Validation

- Pydantic models for all inputs
- Description length limits
- Character validation
- SQL injection prevention
- XSS protection

### Rate Limiting

- Session-based limits
- Per-agent request tracking
- Exponential backoff on failures
- Quota monitoring

### Resource Protection

- Memory monitoring
- Disk space checks
- Request rejection on critical resources
- Graceful degradation

---

## Troubleshooting

### Common Issues

**1. "No API key configured"**

- Solution: Set GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY in .env

**2. "Rate limit exceeded"**

- Solution: Wait for rate limit reset or increase MAX_REQUESTS_PER_SESSION

**3. "Deployment platform unavailable"**

- Solution: Set VERCEL_TOKEN or NETLIFY_TOKEN in .env

**4. "Memory exhaustion"**

- Solution: Set DISABLE_RAG=true or increase system RAM

**5. "npm not found"**

- Solution: Install Node.js and npm, or use manual deployment

**6. "Tests failed after 3 retries"**

- Solution: Check generated files manually, review error logs

**7. "WebSocket connection failed"**

- Solution: Check CORS configuration, verify backend is running

### Debug Mode

Enable detailed logging:

```env
LOG_LEVEL=DEBUG
```

View logs:

```bash
# Backend logs
tail -f backend/logs/audit_*.jsonl

# Frontend console
# Open browser DevTools → Console
```

---

## Future Enhancements

### Planned Features

1. **Enhanced Testing**: Full Jest/Cypress test generation
2. **Database Integration**: MongoDB/PostgreSQL support
3. **Authentication**: Auth0/Firebase integration
4. **API Generation**: GraphQL/REST API scaffolding
5. **Advanced UI**: Drag-and-drop interface builder
6. **Version Control**: Git integration with branches
7. **Collaboration**: Multi-user sessions
8. **Templates**: Pre-built templates for common apps
9. **Custom Styling**: Brand color and theme customization
10. **Analytics**: Usage tracking and insights

### Scalability Roadmap

- Kubernetes deployment for auto-scaling
- Redis for session management
- PostgreSQL for persistent storage
- CDN integration for static assets
- Load balancing for high traffic
- Microservices architecture

---

## Contributing

Contributions are welcome! Areas for improvement:

- Additional knowledge base documents
- New deployment platform integrations
- Enhanced testing strategies
- UI/UX improvements
- Performance optimizations
- Bug fixes and error handling

---

## License

MIT License - See LICENSE file for details

---

## Acknowledgments

- **Google Gemini API** - LLM for code generation
- **Groq** - Fast LLM inference
- **LangChain & LangGraph** - Agent orchestration
- **FAISS** - Vector similarity search
- **Vercel & Netlify** - Deployment platforms
- **Material-UI** - React component library

---

**Built with ❤️ by autonomous AI agents**

_Last Updated: March 15, 2026_
