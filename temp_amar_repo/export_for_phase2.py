"""
Export RAG Query Results for Phase 2 AI Agent
Generates structured, actionable specifications for AI agents to build applications
"""
from rag_retriever import RAGPipeline
from dynamic_knowledge_base import DynamicKnowledgeBase
from phase2_formatter import Phase2Formatter
import json
import sys
from pathlib import Path

def export_query_for_phase2(query: str, output_format: str = "json"):
    """
    Query the knowledge base and export in Phase 2 format
    
    Args:
        query: User's build request
        output_format: 'json', 'markdown', or 'prompt'
    """
    print("="*70)
    print("🤖 AMAR Phase 2 Export Tool")
    print("="*70)
    
    # Load RAG pipeline
    print("\n🔄 Loading knowledge base...")
    rag = RAGPipeline(llm_type="gemini")
    rag.load("amar_knowledge_base.pkl")
    print(f"✅ Loaded {len(rag.retriever.chunks)} chunks\n")
    
    # Initialize dynamic KB
    dkb = DynamicKnowledgeBase(rag, confidence_threshold=0.3)
    
    # Query
    print(f"📝 Query: {query}\n")
    print("🔍 Processing...")
    result = dkb.query(query)
    
    print(f"✅ Retrieved with {result['confidence']:.1%} confidence\n")
    
    # Format for Phase 2
    formatter = Phase2Formatter()
    formatted = formatter.format_for_agent(result)
    
    # Export based on format
    output_dir = Path("phase2_exports")
    output_dir.mkdir(exist_ok=True)
    
    timestamp = Path(f"export_{hash(query) % 10000:04d}")
    
    if output_format == "json":
        output_file = output_dir / f"{timestamp}.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(formatter.to_json(formatted))
        print(f"📄 JSON exported to: {output_file}")
        
    elif output_format == "markdown":
        output_file = output_dir / f"{timestamp}.md"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(formatter.to_markdown(formatted))
        print(f"📄 Markdown exported to: {output_file}")
        
    elif output_format == "prompt":
        output_file = output_dir / f"{timestamp}_prompt.txt"
        agent_prompt = formatter.create_agent_prompt(formatted, query)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(agent_prompt)
        print(f"📄 Agent prompt exported to: {output_file}")
        
    elif output_format == "all":
        # Export all formats
        json_file = output_dir / f"{timestamp}.json"
        md_file = output_dir / f"{timestamp}.md"
        prompt_file = output_dir / f"{timestamp}_prompt.txt"
        
        with open(json_file, 'w', encoding='utf-8') as f:
            f.write(formatter.to_json(formatted))
        
        with open(md_file, 'w', encoding='utf-8') as f:
            f.write(formatter.to_markdown(formatted))
        
        agent_prompt = formatter.create_agent_prompt(formatted, query)
        with open(prompt_file, 'w', encoding='utf-8') as f:
            f.write(agent_prompt)
        
        print(f"📄 All formats exported to: {output_dir}/")
        print(f"   - JSON: {json_file.name}")
        print(f"   - Markdown: {md_file.name}")
        print(f"   - Prompt: {prompt_file.name}")
    
    # Also print to console
    print("\n" + "="*70)
    print("🤖 Phase 2 AI Agent Prompt:")
    print("="*70)
    print(formatter.create_agent_prompt(formatted, query))
    print("="*70)
    
    # Save expanded knowledge base if web search was used
    if result.get('source_type') == 'web_search':
        print("\n💾 Saving expanded knowledge base...")
        dkb.rag.save("amar_knowledge_base.pkl")
        print("✅ Knowledge base updated with new information")
    
    return formatted

def main():
    """Main CLI interface"""
    if len(sys.argv) < 2:
        print("Usage: python export_for_phase2.py <query> [format]")
        print("\nFormats:")
        print("  json     - Export as JSON (default)")
        print("  markdown - Export as Markdown")
        print("  prompt   - Export as AI agent prompt")
        print("  all      - Export all formats")
        print("\nExample:")
        print('  python export_for_phase2.py "Build a task management app" all')
        sys.exit(1)
    
    query = sys.argv[1]
    output_format = sys.argv[2] if len(sys.argv) > 2 else "json"
    
    if output_format not in ["json", "markdown", "prompt", "all"]:
        print(f"❌ Invalid format: {output_format}")
        print("Valid formats: json, markdown, prompt, all")
        sys.exit(1)
    
    export_query_for_phase2(query, output_format)

if __name__ == "__main__":
    main()
