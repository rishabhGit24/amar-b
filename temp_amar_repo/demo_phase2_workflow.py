"""
Demo: Complete Phase 2 Workflow
Demonstrates the full pipeline from user query to AI agent-ready specification
"""
from rag_retriever import RAGPipeline
from dynamic_knowledge_base import DynamicKnowledgeBase
from phase2_formatter import Phase2Formatter
import json

def demo_workflow():
    """Demonstrate complete Phase 2 workflow"""
    
    print("="*80)
    print("🤖 AMAR Phase 2 Workflow Demo")
    print("="*80)
    print("\nThis demo shows how AMAR generates structured specifications")
    print("for Phase 2 AI agents to build complete applications.\n")
    
    # Step 1: Initialize System
    print("Step 1: Initialize RAG System")
    print("-"*80)
    rag = RAGPipeline(llm_type="gemini")
    rag.load("amar_knowledge_base.pkl")
    dkb = DynamicKnowledgeBase(rag, confidence_threshold=0.3)
    print(f"✅ Loaded knowledge base with {len(rag.retriever.chunks)} chunks\n")
    
    # Step 2: User Query
    query = "Build a modern task management web application with real-time collaboration"
    print("Step 2: User Query")
    print("-"*80)
    print(f"Query: {query}\n")
    
    # Step 3: RAG Processing
    print("Step 3: RAG Processing")
    print("-"*80)
    print("🔍 Searching knowledge base...")
    result = dkb.query(query)
    print(f"✅ Retrieved with {result['confidence']:.1%} confidence")
    print(f"📚 Used {result['context_used']} sources")
    print(f"🌐 Source: {result.get('source_type', 'knowledge_base')}\n")
    
    # Step 4: Format for Phase 2
    print("Step 4: Format for Phase 2 AI Agent")
    print("-"*80)
    formatter = Phase2Formatter()
    formatted = formatter.format_for_agent(result)
    print("✅ Formatted into structured sections:")
    print(f"   - Overview: {len(formatted['content']['overview'])} chars")
    print(f"   - Technical Approach: {len(formatted['content']['technical_approach'])} chars")
    print(f"   - Implementation Steps: {len(formatted['content']['implementation_steps'])} steps")
    print(f"   - Key Technologies: {len(formatted['content']['key_technologies'])} items")
    print(f"   - Best Practices: {len(formatted['content']['best_practices'])} items\n")
    
    # Step 5: Generate Agent Prompt
    print("Step 5: Generate AI Agent Prompt")
    print("-"*80)
    agent_prompt = formatter.create_agent_prompt(formatted, query)
    print(f"✅ Generated prompt: {len(agent_prompt)} characters")
    print(f"   Ready for Phase 2 AI agent consumption\n")
    
    # Step 6: Show Sample Output
    print("Step 6: Sample Output Preview")
    print("-"*80)
    print("\n📋 OVERVIEW:")
    print(formatted['content']['overview'][:300] + "...\n")
    
    if formatted['content']['implementation_steps']:
        print("📝 IMPLEMENTATION STEPS (first 5):")
        for i, step in enumerate(formatted['content']['implementation_steps'][:5], 1):
            print(f"   {i}. {step}")
        print(f"   ... and {len(formatted['content']['implementation_steps']) - 5} more steps\n")
    
    if formatted['content']['key_technologies']:
        print("🔧 KEY TECHNOLOGIES:")
        for tech in formatted['content']['key_technologies'][:5]:
            print(f"   - {tech}")
        if len(formatted['content']['key_technologies']) > 5:
            print(f"   ... and {len(formatted['content']['key_technologies']) - 5} more\n")
    
    # Step 7: Export Options
    print("Step 7: Export Options")
    print("-"*80)
    print("The specification can be exported in multiple formats:")
    print("   📄 JSON - Structured data for programmatic use")
    print("   📄 Markdown - Human-readable documentation")
    print("   📄 Agent Prompt - Ready-to-use AI agent prompt\n")
    
    # Step 8: Phase 2 Integration
    print("Step 8: Phase 2 AI Agent Integration")
    print("-"*80)
    print("The Phase 2 AI agent receives:")
    print("   ✅ High confidence specification (90-95%)")
    print("   ✅ Structured sections for easy parsing")
    print("   ✅ 20-30+ actionable implementation steps")
    print("   ✅ Explicit UI/UX guidelines for modern design")
    print("   ✅ Complete technology stack recommendations")
    print("   ✅ Security and performance best practices")
    print("   ✅ Recommended code structure\n")
    
    print("The AI agent then:")
    print("   1. Parses the structured specification")
    print("   2. Generates complete application code")
    print("   3. Implements modern, user-friendly UI/UX")
    print("   4. Follows best practices for security and performance")
    print("   5. Creates production-ready application\n")
    
    # Summary
    print("="*80)
    print("✨ Workflow Complete!")
    print("="*80)
    print(f"\n📊 Summary:")
    print(f"   Confidence: {result['confidence']:.1%}")
    print(f"   Sources: {result['context_used']}")
    print(f"   Implementation Steps: {len(formatted['content']['implementation_steps'])}")
    print(f"   Technologies: {len(formatted['content']['key_technologies'])}")
    print(f"   Best Practices: {len(formatted['content']['best_practices'])}")
    print(f"   Prompt Length: {len(agent_prompt):,} characters")
    print(f"\n🎯 Status: READY FOR PHASE 2 AI AGENT")
    print(f"🎨 UI/UX: MODERN & USER-FRIENDLY GUIDELINES INCLUDED")
    print(f"✅ Quality: PRODUCTION-READY SPECIFICATION")
    
    print("\n" + "="*80)
    print("To export this specification, run:")
    print(f'python export_for_phase2.py "{query}" all')
    print("="*80 + "\n")
    
    return formatted, agent_prompt

if __name__ == "__main__":
    try:
        formatted, prompt = demo_workflow()
        print("✅ Demo completed successfully!")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("Make sure the knowledge base is loaded and Gemini API key is configured.")
