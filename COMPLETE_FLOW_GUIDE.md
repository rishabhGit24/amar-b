# AMAR Complete Flow Guide

## Quick Overview

**User Input → RAG Enhancement → Planner → Builder → Tester → Deployer → Deployed App**

## Step-by-Step Flow

### 1. User Submits Request

```
POST /api/generate
{
  "description": "Build a todo list app"
}
```

### 2. RAG Enhancement

- Retrieves relevant docs from knowledge base
- Enriches query with React best practices
- Adds deployment guidelines

### 3. Workflow Execution

**Supervisor** → Initializes workflow

**Planner** → Creates structured plan

- Decomposes into pages/components
- Defines data models
- Plans routing

**Builder** → Generates React code

- Creates components
- Generates package.json
- Writes all files

**Tester** → Validates code

- Checks file structure
- Runs basic tests
- If fails → Self-Heal (retry up to 3x)

**Deployer** → Deploys to hosting

- Initializes Git
- Deploys to Vercel/Netlify
- Returns deployment URL

**Finalize** → Prepares results

### 4. Real-Time Progress (WebSocket)

```
WS /ws/{session_id}

Updates:
- "Planner: Creating plan..."
- "Builder: Generating code..."
- "Deployer: Deploying..."
- "Complete: https://app.vercel.app"
```

### 5. Get Results

```
GET /api/result/{session_id}

Response:
{
  "success": true,
  "url": "https://todo-app.vercel.app",
  "execution_time_ms": 45000
}
```

## Test the Complete Flow

```bash
cd backend
python test_complete_flow.py
```

This validates:
✓ RAG system
✓ Configuration
✓ All agents
✓ Workflow orchestrator
✓ Services
✓ Complete execution

## Start the System

```bash
# Backend
cd backend
python main.py

# Frontend (new terminal)
cd frontend
npm start
```

Visit http://localhost:3000 and test!
