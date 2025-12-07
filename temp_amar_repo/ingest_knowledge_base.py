"""
Ingest Knowledge Base into RAG System
Loads all knowledge base documents and indexes them
"""
from rag_retriever import RAGPipeline
from ingestion_pipeline import IngestionPipeline
from pathlib import Path
import time

print("="*70)
print("AMAR - Knowledge Base Ingestion")
print("="*70)

# Initialize RAG pipeline
print("\n[1/4] Initializing RAG Pipeline...")
rag = RAGPipeline(llm_type="gemini")

# Initialize ingestion pipeline
ingestion = IngestionPipeline(rag)

# Knowledge base directory
kb_dir = Path("knowledge_base")

# Find all markdown files
print("\n[2/4] Scanning knowledge base...")
md_files = list(kb_dir.rglob("*.md"))
print(f"Found {len(md_files)} documents")

# Ingest each file
print("\n[3/4] Ingesting documents...")
start_time = time.time()

for i, file_path in enumerate(md_files, 1):
    try:
        # Determine category from path
        category = file_path.parent.name
        
        # Custom metadata
        metadata_override = {
            "domain": "web_development",
            "category": category,
            "tags": [category, "knowledge_base", "best_practices"]
        }
        
        ingestion.ingest_file(str(file_path), metadata_override)
        print(f"  [{i}/{len(md_files)}] ✓ {file_path.name}")
        
    except Exception as e:
        print(f"  [{i}/{len(md_files)}] ✗ {file_path.name}: {e}")

elapsed_time = time.time() - start_time

# Save the pipeline
print("\n[4/4] Saving RAG pipeline...")
rag.save("amar_knowledge_base.pkl")

# Summary
print("\n" + "="*70)
print("INGESTION COMPLETE")
print("="*70)
print(f"Documents ingested: {len(md_files)}")
print(f"Total chunks: {len(rag.retriever.chunks)}")
print(f"Time taken: {elapsed_time:.2f} seconds")
print(f"Saved to: amar_knowledge_base.pkl")
print("\nKnowledge base is ready for queries!")
print("="*70)

# Ready to use
print("\n" + "="*70)
print("✅ KNOWLEDGE BASE READY!")
print("="*70)
print("\nYou can now query the knowledge base about:")
print("  • MERN vs MEAN stack comparison")
print("  • Issue reporting app architecture")
print("  • Modern UI/UX best practices")
print("  • Deployment strategies")
print("  • Technology recommendations")
print("  • And more!")
print("\nTo start querying:")
print("  python query_knowledge_base.py")
print("="*70)
