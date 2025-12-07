# Requirements Document

## Introduction

AMAR (Autonomous Memory Agentic Realms) is a multi-agent web application that autonomously plans, designs, builds, tests, and deploys production-grade frontend applications from high-level user input. The MVP focuses on generating React-based websites (up to 5 pages) with optional backend logic (no database), deploying them to free hosting platforms, and providing comprehensive audit trails for accountability.

## Glossary

- **AMAR System**: The complete multi-agent web application including frontend UI, backend orchestrator, and agent workflow
- **User**: The person who inputs a high-level application request through the web interface
- **Planner Agent**: LangGraph node responsible for decomposing user requests into structured implementation plans
- **Builder Agent**: LangGraph node responsible for code generation, testing, and self-healing
- **Deployer Agent**: LangGraph node responsible for deploying generated code to hosting platforms
- **LangGraph Orchestrator**: The state machine that manages agent workflow, routing, and error handling
- **Episodic Memory**: Session-scoped storage of project context, decisions, and outputs
- **Audit Log**: JSON-formatted record of agent decisions, file changes, and errors
- **Lineage Tracking**: Per-file record of which agent created or modified each file and why
- **Self-Healing**: Automatic retry mechanism when Builder Agent encounters test failures or errors
- **Generated Project**: The React application code produced by the Builder Agent
- **Deployment URL**: The publicly accessible URL where the generated project is hosted

## Requirements

### Requirement 1

**User Story:** As a user, I want to input a high-level application description through a web interface, so that the system can understand what I want to build.

#### Acceptance Criteria

1. WHEN a user accesses the AMAR System web interface THEN the system SHALL display an input field for application description
2. WHEN a user submits an application description THEN the system SHALL validate that the input is non-empty
3. WHEN a user submits a valid description THEN the system SHALL initiate the LangGraph Orchestrator workflow
4. WHEN the workflow is initiated THEN the system SHALL display real-time progress indicators showing current agent activity
5. WHEN the user input exceeds 5 pages of content THEN the system SHALL reject the request and inform the user of the 5-page limit

### Requirement 2

**User Story:** As a user, I want the Planner Agent to decompose my request into a structured plan, so that the system knows exactly what to build.

#### Acceptance Criteria

1. WHEN the Planner Agent receives a user request THEN the system SHALL analyze the request using Gemini LLM
2. WHEN the Planner Agent processes the request THEN the system SHALL generate a structured plan containing page specifications, component requirements, and routing structure
3. WHEN the plan is generated THEN the system SHALL store the plan in Episodic Memory for the current session
4. WHEN the plan is complete THEN the system SHALL pass the plan to the Builder Agent via LangGraph state
5. WHEN the Planner Agent encounters an ambiguous request THEN the system SHALL make reasonable assumptions and document them in the plan

### Requirement 3

**User Story:** As a user, I want the Builder Agent to generate React code based on the plan, so that my application is implemented correctly.

#### Acceptance Criteria

1. WHEN the Builder Agent receives a plan from the Planner Agent THEN the system SHALL generate React component code using Gemini LLM
2. WHEN generating code THEN the system SHALL create all necessary files including components, pages, routing configuration, and package.json
3. WHEN code generation is complete THEN the system SHALL write all files to a temporary project directory
4. WHEN files are created THEN the system SHALL log each file creation with agent attribution in the Audit Log
5. WHEN the Builder Agent completes code generation THEN the system SHALL pass the project directory path to the testing phase

### Requirement 4

**User Story:** As a user, I want the Builder Agent to test the generated code, so that I receive a working application.

#### Acceptance Criteria

1. WHEN the Builder Agent completes code generation THEN the system SHALL execute pytest tests on the generated code
2. WHEN tests are executed THEN the system SHALL capture test results including pass/fail status and error messages
3. WHEN all tests pass THEN the system SHALL proceed to the Deployer Agent
4. WHEN any test fails THEN the system SHALL trigger the Self-Healing mechanism
5. WHEN test results are available THEN the system SHALL log the results in the Audit Log

### Requirement 5

**User Story:** As a user, I want the system to automatically fix errors in generated code, so that I don't have to manually debug issues.

#### Acceptance Criteria

1. WHEN a test failure occurs THEN the system SHALL invoke the Self-Healing mechanism within the Builder Agent
2. WHEN Self-Healing is triggered THEN the system SHALL provide error context and failed test information to Gemini LLM
3. WHEN the Builder Agent retries code generation THEN the system SHALL regenerate only the failing components
4. WHEN the retry count reaches 3 attempts THEN the system SHALL halt execution and report the failure to the user
5. WHEN Self-Healing succeeds THEN the system SHALL log the fix in the Audit Log and proceed to deployment

### Requirement 6

**User Story:** As a user, I want the Deployer Agent to publish my application to a hosting platform, so that I can access it via a public URL.

#### Acceptance Criteria

1. WHEN the Deployer Agent receives a tested project THEN the system SHALL select an available free hosting platform (Vercel or Netlify)
2. WHEN deploying to a platform THEN the system SHALL use the platform API to upload project files
3. WHEN deployment is initiated THEN the system SHALL monitor deployment status until completion
4. WHEN deployment succeeds THEN the system SHALL retrieve the deployment URL from the platform
5. WHEN deployment fails THEN the system SHALL log the error and report failure to the user

### Requirement 7

**User Story:** As a user, I want to receive the deployed application URL, so that I can view and share my generated application.

#### Acceptance Criteria

1. WHEN deployment completes successfully THEN the system SHALL display the deployment URL in the web interface
2. WHEN the URL is displayed THEN the system SHALL provide a clickable link that opens the deployed application in a new tab
3. WHEN the workflow completes THEN the system SHALL display a summary of the generated project including page count and component count
4. WHEN the URL is generated THEN the system SHALL store the URL in Episodic Memory for the session
5. WHEN the user requests the URL THEN the system SHALL respond within 10 seconds of deployment completion

### Requirement 8

**User Story:** As a system administrator, I want comprehensive audit logs of all agent actions, so that I can trace decisions and ensure accountability.

#### Acceptance Criteria

1. WHEN any agent makes a decision THEN the system SHALL log the decision with timestamp, agent name, and reasoning in JSON format
2. WHEN any file is created or modified THEN the system SHALL record lineage information including which agent made the change and why
3. WHEN an error occurs THEN the system SHALL log the error with full context including stack trace and agent state
4. WHEN the workflow completes THEN the system SHALL generate a complete audit trail JSON file
5. WHEN logging operations take longer than 100ms THEN the system SHALL perform logging asynchronously to avoid blocking agent execution

### Requirement 9

**User Story:** As a user, I want to see real-time progress of agent activities, so that I understand what the system is doing.

#### Acceptance Criteria

1. WHEN an agent begins processing THEN the system SHALL display the agent name and current task in the web interface
2. WHEN an agent transitions to another agent THEN the system SHALL update the progress indicator to reflect the new agent
3. WHEN the Builder Agent is generating code THEN the system SHALL display which files are being created
4. WHEN Self-Healing is triggered THEN the system SHALL display retry attempt number and error summary
5. WHEN the workflow completes THEN the system SHALL display total execution time from input to deployment URL

### Requirement 10

**User Story:** As a user, I want the system to handle rate limits gracefully, so that I don't overwhelm free-tier API quotas.

#### Acceptance Criteria

1. WHEN making LLM API calls THEN the system SHALL track the number of requests per session
2. WHEN the session request count exceeds 50 requests THEN the system SHALL reject new requests and inform the user
3. WHEN making deployment API calls THEN the system SHALL respect platform rate limits
4. WHEN a rate limit is encountered THEN the system SHALL wait and retry with exponential backoff
5. WHEN rate limit retries exceed 3 attempts THEN the system SHALL fail gracefully and report the issue to the user

### Requirement 11

**User Story:** As a developer, I want the system architecture to support future RAG integration, so that episodic memory can be enhanced without major refactoring.

#### Acceptance Criteria

1. WHEN storing data in Episodic Memory THEN the system SHALL use a structured format compatible with vector embeddings
2. WHEN the memory module is designed THEN the system SHALL provide clear interfaces for future RAG retrieval integration
3. WHEN agent prompts are constructed THEN the system SHALL include a placeholder for retrieved context from RAG
4. WHEN the system is deployed THEN the system SHALL allow configuration of memory backend without code changes
5. WHEN future RAG is integrated THEN the system SHALL support FAISS and Pinecone as vector storage options

### Requirement 12

**User Story:** As a user, I want the system to support React applications with up to 5 pages, so that I can build small to medium-sized websites.

#### Acceptance Criteria

1. WHEN the Planner Agent analyzes a request THEN the system SHALL identify the number of pages required
2. WHEN the page count is 5 or fewer THEN the system SHALL proceed with planning
3. WHEN the page count exceeds 5 THEN the system SHALL reject the request with a clear error message
4. WHEN generating a multi-page application THEN the system SHALL create proper React Router configuration
5. WHEN pages are generated THEN the system SHALL ensure navigation links between all pages are functional

### Requirement 13

**User Story:** As a user, I want the system to generate applications with optional backend logic, so that I can build interactive features without database persistence.

#### Acceptance Criteria

1. WHEN the user request includes backend logic requirements THEN the Planner Agent SHALL identify API endpoints needed
2. WHEN backend logic is required THEN the Builder Agent SHALL generate API route handlers using React framework capabilities
3. WHEN backend code is generated THEN the system SHALL ensure frontend components correctly call the backend endpoints
4. WHEN backend logic is included THEN the system SHALL test both frontend and backend functionality
5. WHEN no database is required THEN the system SHALL use in-memory state management for backend data

### Requirement 14

**User Story:** As a system operator, I want the LangGraph Orchestrator to manage agent workflow reliably, so that the system handles complex routing and error scenarios.

#### Acceptance Criteria

1. WHEN the workflow starts THEN the LangGraph Orchestrator SHALL initialize state with user input and empty results
2. WHEN an agent completes successfully THEN the LangGraph Orchestrator SHALL route to the next appropriate agent based on workflow logic
3. WHEN an agent reports an error THEN the LangGraph Orchestrator SHALL route to the appropriate error handling node
4. WHEN the workflow reaches a terminal state THEN the LangGraph Orchestrator SHALL finalize results and return output to the user
5. WHEN state is passed between agents THEN the LangGraph Orchestrator SHALL preserve all context including previous agent outputs and decisions
