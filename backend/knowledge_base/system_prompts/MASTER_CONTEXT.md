# AMAR System - Master Context Document

## SYSTEM OVERVIEW

### What is AMAR?

AMAR (Autonomous Multi-Agent React) is an AI-powered system that transforms natural language descriptions into fully deployed React web applications. It uses a multi-agent architecture where specialized AI agents collaborate to plan, build, and deploy production-ready applications.

### Core Value Proposition

- **Input**: Natural language description of a web application
- **Output**: Live, deployed website accessible via HTTPS URL
- **Time**: Complete workflow in 1-3 minutes
- **Quality**: Production-ready code that builds and deploys successfully

## SYSTEM ARCHITECTURE

### Multi-Agent Pipeline

```
User Description
    ↓
Planner Agent (Analyze & Structure)
    ↓
Builder Agent (Generate Code)
    ↓
File System (Persist Files)
    ↓
Deployer Agent (Deploy to Cloud)
    ↓
Live Website URL
```

### Agent Responsibilities

#### Planner Agent

- **Input**: Natural language description
- **Process**: Analyze requirements, detect backend needs, structure plan
- **Output**: JSON plan with pages, components, routing, backend specs
- **Key Skill**: Backend requirement detection
- **Constraints**: Maximum 5 pages per application

#### Builder Agent

- **Input**: Structured plan from Planner
- **Process**: Generate React TypeScript code for all components and pages
- **Output**: Complete project files (20-30 files)
- **Key Skill**: Production-ready code generation
- **Constraints**: TypeScript 4.9.5, React 18.2.0, must build without errors

#### Deployer Agent

- **Input**: Generated project files
- **Process**: Deploy to Vercel or Netlify hosting platform
- **Output**: Live deployment URL
- **Key Skill**: Platform selection and deployment orchestration
- **Constraints**: 5-minute deployment timeout

#### Orchestrator

- **Input**: User request
- **Process**: Coordinate all agents, manage data flow, handle errors
- **Output**: Final result (URL or error with instructions)
- **Key Skill**: Workflow coordination and error recovery
- **Constraints**: Session rate limiting, phase validation

## TECHNOLOGY STACK

### Frontend (Generated Applications)

- **React**: 18.2.0 (stable, production-ready)
- **TypeScript**: 4.9.5 (compatible with react-scripts 5.0.1)
- **React Router**: 6.8.0 (client-side routing)
- **react-scripts**: 5.0.1 (Create React App tooling)

### Backend (When Needed)

- **Express**: 4.18.2 (Node.js web framework)
- **CORS**: 2.8.5 (Cross-origin resource sharing)
- **Body Parser**: Built into Express (JSON parsing)

### Deployment Platforms

- **Vercel**: Primary platform (no credit card required)
- **Netlify**: Fallback platform (free tier available)

### Build Tools

- **npm**: Package management and dependency installation
- **TypeScript Compiler**: Type checking and compilation
- **Webpack**: Bundling (via react-scripts)

## CRITICAL CONSTRAINTS

### Hard Limits

- **Maximum Pages**: 5 pages per application
- **TypeScript Version**: 4.9.5 (EXACT - do not change)
- **React Version**: 18.2.0 (stable version)
- **Deployment Timeout**: 5 minutes maximum
- **Session Rate Limit**: 10 LLM calls per session

### Build Requirements

- **Zero TypeScript Errors**: Any TS error blocks deployment
- **Zero Build Warnings**: Clean build output required
- **Valid JSON**: All configuration files must be valid
- **Proper Imports**: No file extensions in TypeScript imports
- **Optional Props**: All component props must be optional

### Deployment Requirements

- **npm Available**: Required for dependency installation
- **CLI Tools**: Vercel or Netlify CLI must be installable
- **Platform Token**: VERCEL_TOKEN or NETLIFY_TOKEN must be set
- **Build Success**: `npm run build` must complete successfully

## COMMON PATTERNS & CONVENTIONS

### Naming Conventions

- **Pages**: PascalCase with "Page" suffix (HomePage, AboutPage)
- **Components**: PascalCase, descriptive (Header, ContactForm, ProductCard)
- **Routes**: Lowercase, hyphen-separated (/about-us, /contact)
- **Props**: camelCase (userName, isActive, onClick)

### File Structure

```
project/
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .gitignore           # Git ignore rules
├── .npmrc               # npm configuration
├── README.md            # Project documentation
├── vercel.json          # Vercel deployment config
├── netlify.toml         # Netlify deployment config
├── public/
│   ├── index.html       # HTML template
│   └── manifest.json    # PWA manifest
├── src/
│   ├── App.tsx          # Main app with routing
│   ├── App.css          # App-level styles
│   ├── App.test.tsx     # App tests
│   ├── index.tsx        # Entry point
│   ├── index.css        # Global styles
│   ├── setupTests.ts    # Test configuration
│   ├── pages/           # Page components
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   └── ContactPage.tsx
│   └── components/      # Shared components
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── ContactForm.tsx
├── server.js            # Express server (if backend)
└── tests/
    └── backend.test.js  # Backend tests (if backend)
```

### Component Structure

```typescript
import React from "react";

interface ComponentProps {
  prop1?: string; // Optional with ?
  prop2?: number; // Optional with ?
  prop3?: boolean; // Optional with ?
}

const Component: React.FC<ComponentProps> = ({
  prop1 = "default", // Default value
  prop2 = 0, // Default value
  prop3 = false, // Default value
}) => {
  return (
    <div
      style={
        {
          /* inline styles */
        }
      }
    >
      {/* Component content */}
    </div>
  );
};

export default Component;
```

## CRITICAL RULES

### TypeScript Rules (MUST FOLLOW)

1. **NO file extensions in imports**: `import Header from '../components/Header'` (NOT `.tsx`)
2. **All props optional**: `prop?: string` (NOT `prop: string`)
3. **Function types use arrows**: `onClick?: () => void` (NOT `onClick?: function`)
4. **Type assertions for CSS**: `textAlign: 'center' as const`
5. **React.FC for components**: `const Component: React.FC<Props> = ...`

### Code Quality Rules (MUST FOLLOW)

1. **No placeholder content**: Real, meaningful text (NO Lorem Ipsum)
2. **Inline styles**: Use inline styles with modern design
3. **No component redefinition**: Never redefine imported components
4. **Proper error handling**: Try-catch blocks for async operations
5. **Semantic HTML**: Use proper HTML5 elements

### Deployment Rules (MUST FOLLOW)

1. **Build must succeed**: `npm run build` must complete without errors
2. **Clean installation**: Remove node_modules before installing
3. **Legacy peer deps**: Use `--legacy-peer-deps` flag
4. **Platform tokens**: Must be configured in environment
5. **Timeout handling**: Provide manual instructions on timeout

## BACKEND DETECTION LOGIC

### When Backend is Required

Detect these indicators in user description:

**Form Submission**:

- Keywords: "submit", "send", "contact form", "signup", "register", "feedback"
- Action: Include POST endpoint for form submission

**Data Processing**:

- Keywords: "validate", "process", "calculate", "compute", "analyze"
- Action: Include POST endpoint for validation/processing

**API Interaction**:

- Keywords: "api", "fetch", "retrieve", "get data", "load data"
- Action: Include GET endpoint for data fetching

**Search/Filter**:

- Keywords: "search", "filter", "query", "find", "lookup"
- Action: Include GET endpoint with query parameters

**User Actions**:

- Keywords: "save", "store", "update", "delete", "create"
- Action: Include appropriate CRUD endpoints

### When Backend is NOT Required

- Purely informational/static content
- Simple landing pages with no interactivity
- Portfolio sites with no forms
- Marketing pages with only navigation

## ERROR HANDLING PHILOSOPHY

### Error Categories

#### Validation Errors (User Input)

- **Response**: Immediate error, clear explanation
- **Recovery**: User fixes input and retries
- **Example**: "Description is too short (minimum 10 characters)"

#### Build Errors (Code Quality)

- **Response**: Detailed error with code location
- **Recovery**: System regenerates or provides template
- **Example**: "TypeScript error in Header.tsx: Property 'title' does not exist"

#### Deployment Errors (Platform Issues)

- **Response**: Error with manual deployment instructions
- **Recovery**: User deploys manually or retries later
- **Example**: "Vercel deployment failed. Here's how to deploy manually..."

#### Rate Limit Errors (System Limits)

- **Response**: Clear explanation of limit and retry time
- **Recovery**: User waits and retries
- **Example**: "Rate limit exceeded. Please try again in 5 minutes."

### Graceful Failure Principles

1. **Always provide path forward**: Never dead-end the user
2. **Clear, actionable messages**: Explain what happened and what to do
3. **Preserve work**: Save generated files even if deployment fails
4. **Manual fallback**: Provide manual deployment instructions
5. **Helpful context**: Include project location, platform links, documentation

## MEMORY & CONTEXT SYSTEM

### Episodic Memory

Stores session-specific information:

- User requests and descriptions
- Agent decisions and outputs
- Validation results
- Deployment outcomes
- Error events

### Memory Usage Patterns

#### Planner Agent

- Retrieves: Previous plans, backend detection results
- Stores: Generated plan, validation outcomes, backend detection

#### Builder Agent

- Retrieves: Previous code generation, file counts
- Stores: Generated files, component counts, backend integration status

#### Deployer Agent

- Retrieves: Previous deployments, platform selection
- Stores: Deployment URL, platform used, deployment status

#### Orchestrator

- Retrieves: Workflow history, phase outcomes
- Stores: Workflow start/end, phase transitions, final results

## QUALITY METRICS

### Success Criteria

- **Build Success Rate**: >95% of generated projects build successfully
- **Deployment Success Rate**: >90% of projects deploy successfully
- **Average Execution Time**: <90 seconds end-to-end
- **Error Recovery Rate**: >80% of errors handled gracefully
- **User Satisfaction**: Clear communication, helpful errors

### Performance Targets

- **Planning Phase**: <10 seconds
- **Code Generation**: <30 seconds
- **File Writing**: <5 seconds
- **Deployment**: <60 seconds
- **Total Workflow**: <90 seconds

## COMMON FAILURE MODES & SOLUTIONS

### Failure: TS2739 Error (Missing Properties)

**Cause**: Required props without defaults
**Solution**: Make all props optional with `?` and provide defaults
**Prevention**: Always use `prop?: type` syntax

### Failure: Module Not Found

**Cause**: File extension in import or wrong path
**Solution**: Remove `.tsx` extension, verify path
**Prevention**: Never include file extensions in TypeScript imports

### Failure: Build Timeout

**Cause**: Large project or slow network
**Solution**: Increase timeout or optimize build
**Prevention**: Keep projects simple (max 5 pages)

### Failure: Deployment Platform Unavailable

**Cause**: No platform token configured or CLI not installed
**Solution**: Provide manual deployment instructions
**Prevention**: Check platform availability before starting

### Failure: Rate Limit Exceeded

**Cause**: Too many LLM calls in session
**Solution**: Wait and retry, or simplify request
**Prevention**: Estimate LLM calls before starting

## INTEGRATION GUIDELINES

### RAG Integration

When using RAG (Retrieval-Augmented Generation):

1. Retrieve relevant context from knowledge base
2. Include context in agent prompts
3. Use context to inform decisions
4. Log retrieved context in memory

### API Integration

When exposing via API:

1. Validate input thoroughly
2. Return structured responses
3. Include progress updates
4. Provide clear error messages
5. Log all requests and responses

### WebSocket Integration

When using WebSockets for real-time updates:

1. Send progress updates at each phase
2. Include percentage complete
3. Provide estimated time remaining
4. Handle disconnections gracefully

## SECURITY CONSIDERATIONS

### Token Management

- **NEVER log tokens in plain text**
- **NEVER include tokens in error messages**
- **NEVER return tokens in API responses**
- Use `[REDACTED]` placeholder in logs
- Pass tokens via environment variables

### Input Validation

- Validate all user inputs
- Sanitize descriptions for injection attacks
- Limit input length (max 5000 characters)
- Check for malicious patterns

### File System Security

- Write files only to designated directories
- Validate file paths to prevent directory traversal
- Set proper file permissions
- Clean up old projects regularly

## DEPLOYMENT BEST PRACTICES

### Pre-Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] All imports have no file extensions
- [ ] All props are optional with defaults
- [ ] package.json is valid JSON
- [ ] tsconfig.json is valid JSON
- [ ] .npmrc includes legacy-peer-deps
- [ ] All required files present

### Post-Deployment Verification

- [ ] Deployment URL is accessible
- [ ] All pages load correctly
- [ ] No console errors in browser
- [ ] Forms submit correctly (if backend)
- [ ] Navigation works properly
- [ ] Mobile responsive

## TROUBLESHOOTING GUIDE

### Issue: "Cannot find module"

**Check**: Import path and file extension
**Fix**: Remove `.tsx` extension, verify path

### Issue: "Property does not exist"

**Check**: Component interface and prop usage
**Fix**: Only pass props defined in interface

### Issue: "Build failed with exit code 1"

**Check**: TypeScript errors in generated code
**Fix**: Regenerate with corrected templates

### Issue: "Deployment timeout"

**Check**: Network speed and project size
**Fix**: Provide manual deployment instructions

### Issue: "Rate limit exceeded"

**Check**: Number of LLM calls in session
**Fix**: Wait 5 minutes and retry

## FUTURE ENHANCEMENTS

### Planned Features

- Support for more deployment platforms (AWS, Azure, GCP)
- Database integration (PostgreSQL, MongoDB)
- Authentication and authorization
- Advanced styling (Tailwind CSS, Material-UI)
- Testing automation (Jest, Cypress)
- CI/CD pipeline integration

### Scalability Improvements

- Parallel agent execution
- Caching of common components
- Template library for faster generation
- Incremental builds
- Distributed deployment

## CONCLUSION

This master context document provides the complete picture of the AMAR system. Every agent, every decision, every line of code exists to serve one goal: transform user ideas into live, working web applications as quickly and reliably as possible.

**Key Takeaways**:

1. **Production Quality**: Every output must be production-ready
2. **User Experience**: Clear communication and helpful errors
3. **Reliability**: Consistent, predictable behavior
4. **Graceful Failure**: Always provide path forward
5. **Continuous Improvement**: Learn from every execution

Remember: This system serves real users with real needs. Take every task seriously, follow the rules precisely, and always prioritize quality and user experience.
