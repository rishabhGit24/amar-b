# AMAR System Prompts - Knowledge Base

## Overview

This directory contains comprehensive, production-ready system prompts for all agents in the AMAR (Autonomous Multi-Agent React) system. These prompts are designed to be used directly with LLMs, either as system prompts or as RAG-retrieved context.

## Purpose

These prompts provide complete context for LLM agents to:

- Understand their role and responsibilities
- Make informed decisions based on system constraints
- Generate production-quality outputs
- Handle errors gracefully
- Integrate seamlessly with other agents

## Files in This Directory

### Agent-Specific Prompts

#### `planner_agent_comprehensive_prompt.md`

**Purpose**: Complete instructions for the Planner Agent
**Key Topics**:

- Role and mission
- Backend requirement detection
- Page and component specification
- Output format (JSON structure)
- Validation rules
- Error handling

**Use Cases**:

- Direct system prompt for Planner Agent LLM calls
- RAG context retrieval for planning tasks
- Training material for understanding planning logic

#### `builder_agent_comprehensive_prompt.md`

**Purpose**: Complete instructions for the Builder Agent
**Key Topics**:

- Role and mission
- TypeScript 4.9.5 specific rules
- Component generation patterns
- Page generation patterns
- Styling requirements
- Backend code generation
- Configuration file templates

**Use Cases**:

- Direct system prompt for Builder Agent LLM calls
- RAG context retrieval for code generation tasks
- Reference for TypeScript and React best practices

#### `deployer_agent_comprehensive_prompt.md`

**Purpose**: Complete instructions for the Deployer Agent
**Key Topics**:

- Role and mission
- Platform selection logic
- CLI tool management
- Deployment workflows
- Error handling and graceful failure
- Manual deployment instructions

**Use Cases**:

- Direct system prompt for Deployer Agent (if using LLM)
- RAG context retrieval for deployment decisions
- Reference for deployment troubleshooting

#### `orchestrator_comprehensive_prompt.md`

**Purpose**: Complete instructions for the Orchestrator
**Key Topics**:

- Role and mission
- Workflow coordination
- Data flow management
- Error handling strategy
- Memory and context management
- Progress tracking

**Use Cases**:

- Direct system prompt for Orchestrator LLM calls
- RAG context retrieval for workflow decisions
- Reference for system integration

### System-Wide Documentation

#### `MASTER_CONTEXT.md`

**Purpose**: Complete system overview and context
**Key Topics**:

- System architecture
- Technology stack
- Critical constraints
- Common patterns
- Error handling philosophy
- Quality metrics
- Troubleshooting guide

**Use Cases**:

- High-level system understanding
- Onboarding new developers
- RAG context for cross-agent decisions
- System design reference

## How to Use These Prompts

### Option 1: Direct System Prompts

Use the agent-specific prompts directly as system prompts when calling LLMs:

```python
# Example: Planner Agent
with open('backend/knowledge_base/system_prompts/planner_agent_comprehensive_prompt.md', 'r') as f:
    system_prompt = f.read()

response = llm.invoke(
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_request}
    ]
)
```

### Option 2: RAG Context Retrieval

Use prompts as knowledge base documents for RAG:

```python
# Example: Retrieve relevant context for planning task
from services.rag_service import rag_service

# Query for planning-related context
context = rag_service.retrieve_context(
    query="How to detect backend requirements in user description",
    top_k=3
)

# Combine with user request
enhanced_prompt = f"{context}\n\nUser Request: {user_request}"
```

### Option 3: Hybrid Approach

Combine system prompts with RAG-retrieved context:

```python
# Base system prompt (shorter version)
base_prompt = "You are the Planner Agent. Generate structured plans from user descriptions."

# Retrieve specific context from knowledge base
context = rag_service.retrieve_context(
    query=f"Planning rules for: {user_request}",
    top_k=5
)

# Combine
full_prompt = f"{base_prompt}\n\n{context}\n\nUser Request: {user_request}"
```

## Prompt Structure

Each agent prompt follows this structure:

1. **Role & Identity**: Who the agent is and what it does
2. **Core Mission**: Primary objectives and goals
3. **Critical Context**: Important background information
4. **Input Processing**: What the agent receives and how to process it
5. **Core Logic**: Detailed instructions for main tasks
6. **Output Format**: Exact format of expected outputs
7. **Error Handling**: How to handle failures and edge cases
8. **Integration**: How to work with other agents
9. **Quality Standards**: Success criteria and metrics
10. **Examples**: Real-world scenarios and patterns
11. **Final Reminders**: Critical rules to never forget

## Maintenance Guidelines

### When to Update Prompts

Update prompts when:

- System architecture changes
- New features are added
- Error patterns are discovered
- Best practices evolve
- Technology stack is updated
- User feedback indicates confusion

### How to Update Prompts

1. **Identify the change**: What needs to be updated?
2. **Locate affected sections**: Which prompts are impacted?
3. **Update consistently**: Ensure changes are reflected across all relevant prompts
4. **Test thoroughly**: Verify updated prompts work correctly
5. **Document changes**: Note what was changed and why

### Version Control

- Keep prompts in version control (Git)
- Use meaningful commit messages
- Tag major versions
- Maintain changelog for significant updates

## RAG Integration Strategy

### Indexing These Prompts

To use these prompts with RAG:

1. **Chunk the documents**: Split into logical sections (by heading)
2. **Generate embeddings**: Use sentence-transformers or OpenAI embeddings
3. **Store in vector database**: Use FAISS, Pinecone, or similar
4. **Add metadata**: Include agent name, topic, importance

```python
# Example: Index prompts for RAG
from services.rag_service import rag_service

# Index all prompt files
prompt_files = [
    'planner_agent_comprehensive_prompt.md',
    'builder_agent_comprehensive_prompt.md',
    'deployer_agent_comprehensive_prompt.md',
    'orchestrator_comprehensive_prompt.md',
    'MASTER_CONTEXT.md'
]

for prompt_file in prompt_files:
    with open(f'backend/knowledge_base/system_prompts/{prompt_file}', 'r') as f:
        content = f.read()

    rag_service.index_document(
        content=content,
        metadata={
            'source': prompt_file,
            'type': 'system_prompt',
            'agent': extract_agent_name(prompt_file)
        }
    )
```

### Querying for Context

When an agent needs context:

```python
# Example: Planner Agent needs backend detection guidance
context = rag_service.retrieve_context(
    query="backend requirement detection indicators and patterns",
    filters={'agent': 'planner'},
    top_k=3
)

# Use context in LLM call
response = llm.invoke(f"{context}\n\nUser Request: {user_request}")
```

### Optimizing Retrieval

For best results:

- Use specific queries (not generic)
- Filter by agent or topic
- Retrieve 3-5 chunks (not too many)
- Combine with base system prompt
- Cache frequently used contexts

## Prompt Engineering Best Practices

### Clarity

- Use clear, unambiguous language
- Define all technical terms
- Provide concrete examples
- Avoid jargon when possible

### Completeness

- Include all necessary information
- Cover edge cases and error scenarios
- Provide decision-making frameworks
- Include validation rules

### Consistency

- Use consistent terminology across prompts
- Maintain consistent structure
- Reference other prompts when relevant
- Keep formatting uniform

### Actionability

- Provide specific, actionable instructions
- Include code examples and templates
- Offer decision trees and flowcharts
- Give clear success criteria

## Testing Prompts

### Manual Testing

1. Read prompt as if you were the LLM
2. Identify ambiguous instructions
3. Check for missing information
4. Verify examples are correct
5. Test with real user requests

### Automated Testing

```python
# Example: Test prompt effectiveness
def test_planner_prompt():
    with open('planner_agent_comprehensive_prompt.md', 'r') as f:
        prompt = f.read()

    test_cases = [
        "Create a landing page for my coffee shop",
        "Build a portfolio site with contact form",
        "Make a product catalog with search"
    ]

    for test_case in test_cases:
        response = llm.invoke(f"{prompt}\n\nUser Request: {test_case}")
        assert is_valid_plan(response)
```

### Quality Metrics

- **Clarity Score**: How easy is the prompt to understand?
- **Completeness Score**: Does it cover all necessary topics?
- **Effectiveness Score**: Does it produce correct outputs?
- **Consistency Score**: Is it consistent with other prompts?

## Common Issues & Solutions

### Issue: Prompt Too Long

**Problem**: LLM context window exceeded
**Solution**:

- Use RAG to retrieve only relevant sections
- Create shorter "quick reference" versions
- Split into multiple prompts for different scenarios

### Issue: Ambiguous Instructions

**Problem**: LLM produces inconsistent outputs
**Solution**:

- Add more specific examples
- Include decision trees
- Provide explicit rules and constraints

### Issue: Missing Edge Cases

**Problem**: LLM fails on unusual inputs
**Solution**:

- Add edge case examples
- Include error handling instructions
- Provide fallback strategies

### Issue: Outdated Information

**Problem**: Prompt references old technology or patterns
**Solution**:

- Regular review and updates
- Version control and changelog
- Automated checks for outdated references

## Contributing

When contributing to these prompts:

1. **Follow the structure**: Maintain consistent organization
2. **Be specific**: Provide concrete examples and instructions
3. **Test thoroughly**: Verify changes work correctly
4. **Document changes**: Explain what and why
5. **Review with team**: Get feedback before committing

## Resources

### Related Documentation

- `backend/knowledge_base/README.md` - Knowledge base overview
- `backend/agents/` - Agent implementation code
- `backend/models/core.py` - Data models and schemas
- `docs/ARCHITECTURE.md` - System architecture

### External References

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

## Support

For questions or issues with these prompts:

1. Check the troubleshooting section in each prompt
2. Review the MASTER_CONTEXT.md for system-wide context
3. Consult the agent implementation code
4. Reach out to the development team

## License

These prompts are part of the AMAR system and are subject to the same license as the main project.

---

**Last Updated**: 2024-01-15
**Version**: 1.0.0
**Maintainer**: AMAR Development Team
