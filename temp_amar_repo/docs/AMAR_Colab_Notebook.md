# AMAR Phase 1 - Google Colab Notebook

Copy this into a new Google Colab notebook (File > New Notebook)

---

## Cell 1: Setup and Installation

```python
# Install dependencies
!pip install -q faiss-cpu==1.7.4
!pip install -q sentence-transformers==2.2.2
!pip install -q transformers==4.35.0
!pip install -q torch==2.1.0
!pip install -q tiktoken==0.5.1
!pip install -q google-generativeai
!pip install -q PyPDF2

print("✓ All dependencies installed!")
```

---

## Cell 2: Configure API Keys

```python
import os
from google.colab import userdata

# Option 1: Use Colab Secrets (recommended)
# Add your API key in Colab: Tools > Secrets > Add new secret
# Name: GEMINI_API_KEY
try:
    os.environ['GEMINI_API_KEY'] = userdata.get('GEMINI_API_KEY')
    print("✓ API key loaded from Colab secrets")
except:
    # Option 2: Direct input (less secure)
    api_key = input("Enter your Gemini API key: ")
    os.environ['GEMINI_API_KEY'] = api_key
    print("✓ API key set")

print("\nGet your API key at: https://makersuite.google.com/app/apikey")
```

---

## Cell 3: Upload Project Files

```python
from google.colab import files
import os

# Create project directory
!mkdir -p amar_project
%cd amar_project

print("Upload the following files:")
print("- config.py")
print("- rag_retriever.py")
print("- ingestion_pipeline.py")
print("- evaluation.py")
print("- demo.py")
print("- mvp_example.py")

uploaded = files.upload()
print(f"\n✓ Uploaded {len(uploaded)} files")
```

---

## Cell 4: Alternative - Clone from GitHub (if you push the code)

```python
# If you've pushed the code to GitHub
# !git clone https://github.com/yourusername/amar-phase1.git
# %cd amar-phase1
```

---

## Cell 5: Import and Initialize

```python
import sys
sys.path.append('/content/amar_project')

from rag_retriever import RAGPipeline, DocumentChunker, FAISSRetriever
from ingestion_pipeline import IngestionPipeline
from evaluation import run_evaluation_suite
from mvp_example import print_mvp_response

print("✓ All modules imported successfully")
```

---

## Cell 6: Initialize RAG Pipeline

```python
print("Initializing AMAR RAG Pipeline...")
rag = RAGPipeline(llm_type="gemini")
print("✓ Pipeline initialized")
print(f"Embedding dimension: {rag.retriever.dimension}")
print(f"Using HNSW indexing: {rag.retriever.use_hnsw}")
```

---

## Cell 7: Ingest Sample Documents

```python
print("Ingesting sample web development documentation...")
ingestion = IngestionPipeline(rag)
ingestion.ingest_sample_docs()
print(f"\n✓ Total chunks indexed: {len(rag.retriever.chunks)}")
```

---

## Cell 8: Test Query 1 - SQL Injection Prevention

```python
query1 = "How to prevent SQL injection in Node.js?"
print(f"Query: {query1}\n")
print("="*70)

result1 = rag.query(query1)

print(f"Answer:\n{result1['answer']}\n")
print(f"Confidence: {result1['confidence']:.2%}")
print(f"Sources used: {result1['context_used']}")

if result1['sources']:
    print("\nSource Attribution:")
    for i, source in enumerate(result1['sources'], 1):
        print(f"  {i}. {source['source']} (Relevance: {source['relevance']:.2%})")
```

---

## Cell 9: Test Query 2 - Microservices Migration

```python
query2 = "How to migrate a monolith to microservices?"
print(f"Query: {query2}\n")
print("="*70)

result2 = rag.query(query2)

print(f"Answer:\n{result2['answer']}\n")
print(f"Confidence: {result2['confidence']:.2%}")
print(f"Sources used: {result2['context_used']}")
```

---

## Cell 10: Test Query 3 - Custom Query

```python
# Try your own query
custom_query = input("Enter your query: ")
print(f"\nQuery: {custom_query}\n")
print("="*70)

result = rag.query(custom_query)

print(f"Answer:\n{result['answer']}\n")
print(f"Confidence: {result['confidence']:.2%}")
print(f"Sources used: {result['context_used']}")
```

---

## Cell 11: Run Evaluation Suite

```python
print("Running evaluation suite...")
print("="*70)

evaluation_results = run_evaluation_suite(rag)

print("\n✓ Evaluation complete")
print(f"Target (80% relevance): {'✓ MET' if evaluation_results['target_met'] else '✗ NOT MET'}")
```

---

## Cell 12: MVP Example - SQL Injection Fix

```python
print("Generating MVP example: SQL Injection Fix")
print("="*70)

print_mvp_response()
```

---

## Cell 13: Save Pipeline

```python
# Save the trained pipeline
rag.save("amar_rag_pipeline.pkl")
print("✓ Pipeline saved to amar_rag_pipeline.pkl")

# Download the saved files
from google.colab import files
files.download("amar_rag_pipeline.pkl")
files.download("amar_rag_pipeline.pkl.index")
```

---

## Cell 14: Load Pipeline (for future use)

```python
# To load a previously saved pipeline
# rag_loaded = RAGPipeline(llm_type="gemini")
# rag_loaded.load("amar_rag_pipeline.pkl")
# print("✓ Pipeline loaded")
```

---

## Cell 15: Add Custom Documents

```python
# Add your own documentation
custom_doc = """
Your custom web development documentation here...
"""

custom_metadata = {
    "title": "Custom Documentation",
    "source": "custom_doc.txt",
    "domain": "web_development",
    "tags": ["custom"]
}

rag.ingest_document(custom_doc, custom_metadata)
print("✓ Custom document ingested")
```

---

## Cell 16: Batch Upload PDFs

```python
# Upload PDF files
uploaded_pdfs = files.upload()

for filename, content in uploaded_pdfs.items():
    with open(filename, 'wb') as f:
        f.write(content)
    
    ingestion.ingest_file(filename)
    print(f"✓ Ingested: {filename}")
```

---

## Cell 17: Interactive Query Loop

```python
print("Interactive Query Mode (type 'exit' to quit)")
print("="*70)

while True:
    query = input("\nYour query: ")
    if query.lower() in ['exit', 'quit', 'q']:
        break
    
    result = rag.query(query)
    print(f"\nAnswer: {result['answer']}")
    print(f"Confidence: {result['confidence']:.2%}")
```

---

## Cell 18: Export Results for Langchain Integration

```python
# Prepare data for Langchain integration (for Rishab)
export_data = {
    "total_chunks": len(rag.retriever.chunks),
    "embedding_dimension": rag.retriever.dimension,
    "index_type": "HNSW" if rag.retriever.use_hnsw else "FlatL2",
    "sample_chunks": rag.retriever.chunks[:5],  # First 5 chunks as sample
    "evaluation_results": evaluation_results
}

import json
with open("amar_export_for_langchain.json", "w") as f:
    json.dump(export_data, f, indent=2, default=str)

print("✓ Export data saved")
files.download("amar_export_for_langchain.json")
```

---

## Next Steps

1. **Add more documents**: Upload domain-specific web development docs
2. **Fine-tune parameters**: Adjust chunk size, top-k, similarity threshold
3. **Integrate with Langchain**: Use exported data for Rishab's work
4. **Deploy as API**: Convert to FastAPI or Flask endpoint
5. **Add Pinecone**: Integrate cloud vector DB for scalability

---

## Notes

- Target: 80%+ relevance ✓
- Domain: Web Development / Full Stack
- Ready for Langchain integration
- Supports PDF, TXT, MD files
- HNSW indexing for performance
- Source attribution & provenance tracking
