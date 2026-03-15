# AMAR System - Master Context

## Product Objective
AMAR (Autonomous Multi-Agent React) turns a natural-language app request into a deployed React app URL.

Input: user description
Output: live URL or manual deployment package
Target time: 45-90 seconds

## Pipeline
1. Planner: convert request into strict JSON plan.
2. Builder: generate build-safe React + TypeScript + Material UI project files.
3. Tester: run structural and syntax checks; trigger self-heal on failure.
4. Deployer: deploy to Vercel/Netlify; return URL.
5. Orchestrator: manage workflow state, retries, progress, and errors.

## Non-Negotiable Constraints
- Max 5 pages.
- React 18 + TypeScript 4.9.5 + react-scripts 5.0.1.
- Material UI required in generated UI.
- Build must pass (`npm run build`).
- If deployment fails, preserve files and return manual steps.

## Core Quality Gates
- Planner output is valid JSON and schema-compliant.
- Routing is complete and matches pages.
- Backend logic only when user intent requires it (forms, submission, search, server processing).
- Components are reusable and typed; props optional with defaults.
- No placeholder gibberish; content must be practical and user-facing.

## Error Handling Philosophy
- Fail early on invalid user input.
- Fail soft on downstream issues with clear recovery guidance.
- Never lose generated artifacts.
- Always provide a path forward.

## Security Baselines
- Never expose API tokens.
- Do not log secrets in plaintext.
- Validate input and file paths.

## Success Definition
AMAR succeeds when user receives either:
1. A reachable production URL, or
2. A complete local project + clear manual deployment instructions.
