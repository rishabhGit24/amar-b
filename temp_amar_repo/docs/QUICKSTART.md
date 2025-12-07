# AMAR Phase 1 - Quick Start Guide

## Overview
AMAR (Autonomous Memory Agentic Realm) Phase 1 is a RAG-based system for building web applications from scratch using AI-powered document retrieval and generation.

## Quick Start (Local)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set API Key
```bash
export GEMINI_API_KEY="your-api-key-here"
```

Or create a `.env` file:
```
GEMINI_API_KEY=your-api-key-here
```

### 3. Run Demo
```bash
python demo.py
```

### 4. Run MVP Example
```bash
python mvp_example.py
```

## Quick Start (Google Colab)

1. Open Google Colab: https://colab.research.google.com
2. Create new notebook
3. Copy cells from `AMAR_Colab_Notebook.md`
4. Run cells sequentially

## Project Structure

```
amar-phase1/
├── config.py                 # Configuration settings
├── rag_retriever.py          # Core RAG pipeline
├── ingestion_pipeline.py     # Document ingestion
├── evaluation.py             # Evaluation metrics
├── demo.py                   # Demo script
├── mvp_example.py            # MVP SQL injection fix
├── document_schema.json      # Metadata schema
├── requirements.txt          # Dependencies
├── AMAR_Colab_Notebook.md   # Colab notebook template
└── README.md                 # Project overview
```

## Key Features

✓ FAISS vector search with HNSW indexing
✓ 500-token chunking with overlap
✓ SentenceTransformer embeddings (384-dim)
✓ Gemini 2.5 Flash LLM integration
✓ Top-5 retrieval with similarity threshold
✓ Source attribution & provenance
✓ 80%+ relevance target
✓ Web development domain focus

## Usage Examples

### Basic Query
```python
from rag_retriever import RAGPipeline

rag = RAGPipeline(llm_type="gemini")
result = rag.query("How to prevent SQL injection?")
print(result['answer'])
```

### Add Custom Documents
```python
from ingestion_pipeline import IngestionPipeline

ingestion = IngestionPipeline(rag)
ingestion.ingest_file("my_docs.pdf")
```

### Save/Load Pipeline
```python
# Save
rag.save("my_pipeline.pkl")

# Load
rag.load("my_pipeline.pkl")
```

## Configuration

Edit `config.py` to customize:
- Embedding model
- Chunk size and overlap
- Top-K results
- Similarity threshold
- HNSW parameters

## Evaluation

Run evaluation suite:
```python
from evaluation import run_evaluation_suite

results = run_evaluation_suite(rag)
print(f"Average relevance: {results['average_relevance']:.2%}")
```

## MVP Example Output

The MVP demonstrates:
- SQL injection vulnerability fix
- Diff/patch format
- Unit tests with Jest
- Security improvements
- Required reviewers
- Deployment checklist

## Next Steps

1. **Phase 1 Complete**: Build & deploy from scratch ✓
2. **Phase 2**: Migration → Building → Deploying
3. **Langchain Integration**: Export for Rishab's work
4. **CLI Tool**: Convert to command-line interface
5. **API Deployment**: FastAPI or Flask endpoint
6. **Pinecone Integration**: Cloud vector DB
7. **Multi-Agent System**: Orchestrate multiple agents

## Troubleshooting

### Import Errors
```bash
pip install --upgrade -r requirements.txt
```

### API Key Issues
```python
import os
print(os.getenv('GEMINI_API_KEY'))  # Should not be None
```

### FAISS Issues
```bash
pip uninstall faiss-cpu faiss-gpu
pip install faiss-cpu==1.7.4
```

## Support

For issues or questions:
1. Check configuration in `config.py`
2. Verify API key is set
3. Run evaluation suite to check performance
4. Review sample outputs in demo

## License

MIT License - See LICENSE file
