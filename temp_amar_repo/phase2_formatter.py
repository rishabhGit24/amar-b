"""
Phase 2 Output Formatter
Formats RAG output for optimal AI agent consumption in Phase 2
"""
import json
from typing import Dict

class Phase2Formatter:
    """Format RAG output for Phase 2 AI agent consumption"""
    
    @staticmethod
    def format_for_agent(result: Dict) -> Dict:
        """
        Format RAG result into structured output optimized for AI agents
        
        Args:
            result: RAG query result with answer, sources, confidence
            
        Returns:
            Structured dict with sections parsed and formatted for AI consumption
        """
        answer = result.get('answer', '')
        
        # Parse sections from the answer
        sections = Phase2Formatter._parse_sections(answer)
        
        # Create structured output
        formatted = {
            "metadata": {
                "confidence": result.get('confidence', 0.0),
                "sources_count": result.get('context_used', 0),
                "source_type": result.get('source_type', 'knowledge_base'),
                "fallback": result.get('fallback', False)
            },
            "content": {
                "overview": sections.get('overview', ''),
                "technical_approach": sections.get('technical_approach', ''),
                "architecture_design": sections.get('architecture_design', ''),
                "implementation_steps": sections.get('implementation_steps', []),
                "ui_ux_guidelines": sections.get('ui_ux_guidelines', ''),
                "key_technologies": sections.get('key_technologies', []),
                "best_practices": sections.get('best_practices', []),
                "code_structure": sections.get('code_structure', ''),
                "additional_resources": sections.get('additional_resources', [])
            },
            "sources": result.get('sources', []),
            "raw_answer": answer
        }
        
        return formatted
    
    @staticmethod
    def _parse_sections(text: str) -> Dict:
        """Parse markdown sections from the answer"""
        sections = {}
        current_section = None
        current_content = []
        
        lines = text.split('\n')
        
        for line in lines:
            # Check for section headers
            if line.startswith('## '):
                # Save previous section
                if current_section:
                    sections[current_section] = '\n'.join(current_content).strip()
                
                # Start new section
                section_name = line[3:].strip().lower().replace(' ', '_').replace('&', 'and')
                current_section = section_name
                current_content = []
            elif current_section:
                current_content.append(line)
        
        # Save last section
        if current_section:
            sections[current_section] = '\n'.join(current_content).strip()
        
        # Parse lists from sections
        if 'implementation_steps' in sections:
            sections['implementation_steps'] = Phase2Formatter._parse_list(
                sections['implementation_steps']
            )
        
        if 'key_technologies' in sections:
            sections['key_technologies'] = Phase2Formatter._parse_list(
                sections['key_technologies']
            )
        
        if 'best_practices' in sections:
            sections['best_practices'] = Phase2Formatter._parse_list(
                sections['best_practices']
            )
        
        if 'additional_resources' in sections:
            sections['additional_resources'] = Phase2Formatter._parse_list(
                sections['additional_resources']
            )
        
        return sections
    
    @staticmethod
    def _parse_list(text: str) -> list:
        """Parse numbered or bulleted lists"""
        items = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            # Match numbered lists (1. 2. etc) or bullet points (- * •)
            if line and (
                line[0].isdigit() or 
                line.startswith('-') or 
                line.startswith('*') or 
                line.startswith('•')
            ):
                # Remove list markers
                cleaned = line.lstrip('0123456789.-*• ').strip()
                if cleaned:
                    items.append(cleaned)
        
        return items
    
    @staticmethod
    def to_json(formatted_result: Dict, indent: int = 2) -> str:
        """Convert formatted result to JSON string"""
        return json.dumps(formatted_result, indent=indent, ensure_ascii=False)
    
    @staticmethod
    def to_markdown(formatted_result: Dict) -> str:
        """Convert formatted result to clean markdown"""
        content = formatted_result['content']
        metadata = formatted_result['metadata']
        
        md = f"""# Technical Specification
        
**Confidence:** {metadata['confidence']:.1%} | **Sources:** {metadata['sources_count']} | **Type:** {metadata['source_type']}

---

## Overview
{content['overview']}

## Technical Approach
{content['technical_approach']}

## Architecture & Design
{content['architecture_design']}

## Implementation Steps
"""
        
        for i, step in enumerate(content['implementation_steps'], 1):
            md += f"{i}. {step}\n"
        
        md += f"""
## UI/UX Guidelines
{content['ui_ux_guidelines']}

## Key Technologies
"""
        
        for tech in content['key_technologies']:
            md += f"- {tech}\n"
        
        md += f"""
## Best Practices
"""
        
        for practice in content['best_practices']:
            md += f"- {practice}\n"
        
        md += f"""
## Code Structure
{content['code_structure']}
"""
        
        if content['additional_resources']:
            md += "\n## Additional Resources\n"
            for resource in content['additional_resources']:
                md += f"- {resource}\n"
        
        return md
    
    @staticmethod
    def create_agent_prompt(formatted_result: Dict, user_query: str) -> str:
        """
        Create an optimized prompt for Phase 2 AI agent
        
        Args:
            formatted_result: Formatted RAG output
            user_query: Original user query
            
        Returns:
            Structured prompt for AI agent to build the application
        """
        content = formatted_result['content']
        metadata = formatted_result['metadata']
        
        prompt = f"""# Build Request: {user_query}

## Context
You are an expert software developer tasked with building this application.
The following technical specification has been retrieved from our knowledge base with {metadata['confidence']:.1%} confidence.

## Technical Specification

### Overview
{content['overview']}

### Technical Approach
{content['technical_approach']}

### Architecture & Design
{content['architecture_design']}

### Implementation Steps
"""
        
        for i, step in enumerate(content['implementation_steps'], 1):
            prompt += f"{i}. {step}\n"
        
        prompt += f"""
### UI/UX Requirements
{content['ui_ux_guidelines']}

**IMPORTANT UI/UX Guidelines:**
- Create a modern, clean, and intuitive interface
- Use contemporary design patterns (Material Design, Tailwind, or similar)
- Ensure responsive design for all screen sizes
- Implement smooth animations and transitions
- Use proper color schemes with good contrast
- Make navigation intuitive and accessible
- Follow WCAG accessibility guidelines
- Optimize for performance and fast load times

### Technology Stack
"""
        
        for tech in content['key_technologies']:
            prompt += f"- {tech}\n"
        
        prompt += f"""
### Best Practices to Follow
"""
        
        for practice in content['best_practices']:
            prompt += f"- {practice}\n"
        
        prompt += f"""
### Recommended Code Structure
{content['code_structure']}

## Your Task
Build a complete, production-ready application following the above specification.
Ensure the code is:
- Clean, well-documented, and maintainable
- Following best practices and design patterns
- Secure and performant
- User-friendly with excellent UI/UX
- Fully functional and tested

Begin implementation now.
"""
        
        return prompt


# Example usage
if __name__ == "__main__":
    # Example RAG result
    example_result = {
        "answer": """## Overview
This is a test overview.

## Technical Approach
Use React and Node.js for full-stack development.

## Implementation Steps
1. Set up project structure
2. Install dependencies
3. Create components
4. Build API endpoints

## Key Technologies
- React 18
- Node.js 20
- MongoDB
- Express.js

## Best Practices
- Use TypeScript for type safety
- Implement proper error handling
- Write unit tests
""",
        "confidence": 0.92,
        "context_used": 5,
        "source_type": "knowledge_base"
    }
    
    formatter = Phase2Formatter()
    formatted = formatter.format_for_agent(example_result)
    
    print("=== Formatted JSON ===")
    print(formatter.to_json(formatted))
    
    print("\n=== Agent Prompt ===")
    print(formatter.create_agent_prompt(formatted, "Build a web app"))
