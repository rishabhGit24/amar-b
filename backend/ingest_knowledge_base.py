"""
Ingest Knowledge Base into RAG System
Run this once to build the FAISS index
"""
from services.rag_retriever import RAGPipeline
from pathlib import Path
import time

print("="*70)
print("AMAR - Knowledge Base Ingestion")
print("="*70)

# Initialize RAG pipeline
print("\n[1/3] Initializing RAG Pipeline...")
rag = RAGPipeline()

# Knowledge base directory
kb_dir = Path("knowledge_base")

# Find all markdown files
print("\n[2/3] Scanning knowledge base...")
md_files = list(kb_dir.rglob("*.md"))
print(f"Found {len(md_files)} documents")

# Ingest each file
print("\n[3/3] Ingesting documents...")
start_time = time.time()

for i, file_path in enumerate(md_files, 1):
    try:
        # Read file
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Determine category from path
        category = file_path.parent.name
        
        # Create metadata
        metadata = {
            "source": str(file_path),
            "domain": "web_development",
            "category": category,
            "filename": file_path.name
        }
        
        rag.ingest_document(content, metadata)
        print(f"  [{i}/{len(md_files)}] ✓ {file_path.name}")
        
    except Exception as e:
        print(f"  [{i}/{len(md_files)}] ✗ {file_path.name}: {e}")

elapsed_time = time.time() - start_time

# Save the pipeline
print("\nSaving RAG pipeline...")
rag.save("amar_knowledge_base.pkl")

# Summary
print("\n" + "="*70)
print("INGESTION COMPLETE")
print("="*70)
print(f"Documents ingested: {len(md_files)}")
print(f"Total chunks: {len(rag.retriever.chunks)}")
print(f"Time taken: {elapsed_time:.2f} seconds")
print(f"Saved to: amar_knowledge_base.pkl")
print("\n✅ Knowledge base is ready!")
print("="*70)
