# RAG-FAISS Integration Guide

## Overview

This document explains how to integrate the RAG-FAISS system into AMAR MVP. The RAG-FAISS system retrieves relevant context from a knowledge base before passing user queries to the LangGraph workflow.

## Architecture

```
User Input (Frontend)
    ↓
Backend API (/api/generate)
    ↓
RAG Service (retrieve_context) ← Integration Point
    ↓
Enriched Query
    ↓
LangGraph Workflow
    ↓
Generated Application
```

## Integration Point

The main integration point is in `backend/services/rag_service.py`, specifically the `RAGService` class.

### Current State

- **Status**: Placeholder implementation
- **Behavior**: Passes through original user query without enrichment
- **Knowledge Base**: None (will be WWW initially, then custom KB)

### When RAG-FAISS is Ready

1. **Enable the RAG Service**:

   ```python
   from services.rag_service import get_rag_service

   rag_service = get_rag_service()
   rag_service.enable_rag(knowledge_base_path="/path/to/kb")
   ```

2. **Or via API**:
   ```bash
   curl -X POST http://localhost:8000/api/rag/enable \
     -H "Content-Type: application/json" \
     -d '{"knowledge_base_path": "/path/to/kb"}'
   ```

## Implementation Steps for RAG-FAISS Developer

### Step 1: Implement FAISS Search

Replace the placeholder `_search_faiss_index` method in `rag_service.py`:

```python
async def _search_faiss_index(
    self,
    query: str,
    top_k: int,
    filters: Optional[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Search FAISS index for relevant documents.
    """
    # 1. Convert query to embeddings
    query_embedding = await self._get_embedding(query)

    # 2. Search FAISS index
    distances, indices = self.faiss_index.search(query_embedding, top_k)

    # 3. Retrieve documents
    retrieved_docs = []
    for idx, distance in zip(indices[0], distances[0]):
        doc = self.document_store[idx]
        retrieved_docs.append({
            "content": doc["content"],
            "metadata": doc["metadata"],
            "score": float(distance)
        })

    return retrieved_docs
```

### Step 2: Add Embedding Generation

Add a method to generate embeddings:

```python
async def _get_embedding(self, text: str) -> np.ndarray:
    """
    Generate embedding for text using your embedding model.
    """
    # Use your preferred embedding model (e.g., OpenAI, Sentence Transformers)
    # Example with Sentence Transformers:
    # embedding = self.embedding_model.encode(text)
    # return embedding
    pass
```

### Step 3: Initialize FAISS Index

Add initialization logic in `__init__`:

```python
def __init__(self, knowledge_base_path: Optional[str] = None):
    self.knowledge_base_path = knowledge_base_path
    self.is_enabled = False
    self.faiss_index = None
    self.document_store = None
    self.embedding_model = None

    if knowledge_base_path:
        self._load_knowledge_base(knowledge_base_path)
```

### Step 4: Load Knowledge Base

Implement knowledge base loading:

```python
def _load_knowledge_base(self, kb_path: str):
    """
    Load FAISS index and document store from knowledge base path.
    """
    import faiss

    # Load FAISS index
    self.faiss_index = faiss.read_index(f"{kb_path}/index.faiss")

    # Load document store
    with open(f"{kb_path}/documents.json", "r") as f:
        self.document_store = json.load(f)

    # Load embedding model
    # self.embedding_model = load_your_embedding_model()
```

## Query Enrichment Flow

1. **User submits query**: "Build a landing page for a coffee shop"

2. **RAG retrieves context**:

   - Converts query to embedding
   - Searches FAISS index
   - Retrieves top 5 relevant documents about landing pages, coffee shops, etc.

3. **Query is enriched**:

   ```
   User Request: Build a landing page for a coffee shop

   Relevant Context from Knowledge Base:
   [Context 1]: Landing pages should have clear CTAs...
   [Context 2]: Coffee shop websites typically include menu sections...
   [Context 3]: Best practices for hero sections...

   Please use the above context to generate an appropriate application plan.
   ```

4. **Enriched query goes to LangGraph**: Planner Agent receives enriched context

## Configuration

### Environment Variables

Add to `.env`:

```bash
# RAG-FAISS Configuration
RAG_ENABLED=false
RAG_KNOWLEDGE_BASE_PATH=/path/to/kb
RAG_TOP_K=5
RAG_EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2
```

### Runtime Configuration

```python
# In main.py startup
from services.rag_service import initialize_rag_service
import os

@app.on_event("startup")
async def startup_event():
    if os.getenv("RAG_ENABLED", "false").lower() == "true":
        kb_path = os.getenv("RAG_KNOWLEDGE_BASE_PATH")
        initialize_rag_service(kb_path, enabled=True)
```

## Testing the Integration

### Test 1: RAG Disabled (Current State)

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Build a todo app"}'
```

Expected: Query passes through unchanged

### Test 2: RAG Enabled

```bash
# Enable RAG
curl -X POST http://localhost:8000/api/rag/enable \
  -d '{"knowledge_base_path": "/path/to/kb"}'

# Generate with RAG
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Build a todo app"}'
```

Expected: Query is enriched with relevant context

### Test 3: Check RAG Status

```bash
curl http://localhost:8000/
```

Expected response includes `"rag_enabled": true`

## Knowledge Base Structure

### Expected Directory Structure

```
knowledge_base/
├── index.faiss          # FAISS index file
├── documents.json       # Document store with metadata
└── config.json          # Configuration (embedding model, etc.)
```

### Document Format

```json
{
  "documents": [
    {
      "id": "doc_001",
      "content": "Landing pages should have clear call-to-action buttons...",
      "metadata": {
        "source": "web_design_best_practices",
        "category": "ui_design",
        "tags": ["landing_page", "cta", "conversion"]
      }
    }
  ]
}
```

## Migration Path

### Phase 1: Current (No RAG)

- User query → LangGraph directly
- RAG service exists but disabled

### Phase 2: WWW Knowledge Base

- Enable RAG with web-scraped knowledge base
- User query → RAG enrichment → LangGraph

### Phase 3: Custom Knowledge Base

- Replace WWW KB with custom curated knowledge base
- Same integration, just different KB path

## API Reference

### RAGService Methods

#### `retrieve_context(user_query, top_k, filters)`

Main method called by the API to retrieve context.

**Parameters**:

- `user_query` (str): User's application description
- `top_k` (int): Number of documents to retrieve (default: 5)
- `filters` (dict): Optional filters for retrieval

**Returns**:

```python
{
    "enriched_query": str,      # Original + context
    "retrieved_docs": List[Dict],  # Retrieved documents
    "metadata": {
        "rag_enabled": bool,
        "num_docs_retrieved": int,
        "top_k": int
    }
}
```

#### `enable_rag(knowledge_base_path)`

Enable RAG system with specified knowledge base.

#### `disable_rag()`

Disable RAG system (fallback to direct processing).

## Troubleshooting

### RAG Not Enriching Queries

1. Check if RAG is enabled:

   ```python
   rag_service = get_rag_service()
   print(rag_service.is_enabled)  # Should be True
   ```

2. Check knowledge base path:

   ```python
   print(rag_service.knowledge_base_path)
   ```

3. Check logs:
   ```bash
   tail -f logs/backend.log | grep RAG
   ```

### FAISS Index Errors

- Ensure FAISS is installed: `pip install faiss-cpu` or `faiss-gpu`
- Verify index file exists and is readable
- Check embedding dimensions match

## Contact

For questions about RAG-FAISS integration, contact the RAG-FAISS developer.

## Future Enhancements

1. **Caching**: Cache embeddings for common queries
2. **Hybrid Search**: Combine FAISS with keyword search
3. **Re-ranking**: Add re-ranking layer for better relevance
4. **Feedback Loop**: Learn from successful generations
5. **Multi-modal**: Support image/diagram retrieval
