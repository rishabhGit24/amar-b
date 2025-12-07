"""
Ingest Knowledge Base into RAG System
Run this once to build the FAISS index
"""
import os
# Disable multiprocessing to avoid segmentation faults on macOS
os.environ['TOKENIZERS_PARALLELISM'] = 'false'
os.environ['OMP_NUM_THREADS'] = '1'

from services.rag_retriever import RAGPipeline
from pathlib import Path
import time

print("="*70)
print("AMAR - Knowledge Base Ingestion")
print("="*70)

# Initialize RAG pipeline
print("\n[1/4] Initializing RAG Pipeline...")
rag = RAGPipeline()

# Knowledge base directory - check both backend and temp_amar_repo
backend_dir = Path(__file__).parent
kb_dir = backend_dir / "knowledge_base"

# If not found, try temp_amar_repo
if not kb_dir.exists():
    temp_repo_kb = backend_dir.parent / "temp_amar_repo" / "knowledge_base"
    if temp_repo_kb.exists():
        kb_dir = temp_repo_kb
        print(f"Using knowledge base from temp_amar_repo: {kb_dir}")

# Find all markdown files
print(f"\n[2/4] Scanning knowledge base at {kb_dir}...")
if not kb_dir.exists():
    print(f"❌ Knowledge base directory not found: {kb_dir}")
    print("Please ensure knowledge_base directory exists with .md files")
    exit(1)

md_files = list(kb_dir.rglob("*.md"))
print(f"Found {len(md_files)} documents")

if len(md_files) == 0:
    print("❌ No markdown files found in knowledge base")
    exit(1)

# Ingest each file
print("\n[3/4] Ingesting documents...")
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

# Save the pipeline to backend directory
output_path = backend_dir / "amar_knowledge_base.pkl"
print(f"\n[4/4] Saving RAG pipeline to {output_path}...")
rag.save(str(output_path))

# Summary
print("\n" + "="*70)
print("INGESTION COMPLETE")
print("="*70)
print(f"Documents ingested: {len(md_files)}")
print(f"Total chunks: {len(rag.retriever.chunks)}")
print(f"Time taken: {elapsed_time:.2f} seconds")
print(f"Saved to: {output_path}")
print(f"Index file: {output_path}.index")
print("\n✅ Knowledge base is ready!")
print("="*70)
