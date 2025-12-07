# RAG-FAISS Integration Quickstart

## For the RAG-FAISS Developer

Hi! This document explains how your RAG-FAISS system will integrate with AMAR MVP.

## Current Architecture

```
┌─────────────────┐
│  React Frontend │
│  (User Input)   │
└────────┬────────┘
         │ POST /api/generate
         ▼
┌─────────────────────────────────────┐
│  Backend API (main.py)              │
│  ┌───────────────────────────────┐  │
│  │ RAG Service                   │  │ ← YOUR INTEGRATION POINT
│  │ (retrieve_context)            │  │
│  │                               │  │
│  │ Status: PLACEHOLDER           │  │
│  │ Behavior: Pass-through        │  │
│  └───────────────────────────────┘  │
└────────┬────────────────────────────┘
         │ Enriched Query
         ▼
┌─────────────────┐
│  LangGraph      │
│  Workflow       │
└─────────────────┘
```

## What's Already Done

### 1. RAG Service Skeleton (`backend/services/rag_service.py`)

```python
class RAGService:
    def __init__(self, knowledge_base_path: Optional[str] = None):
        self.knowledge_base_path = knowledge_base_path
        self.is_enabled = False  # Set to True when ready

    async def retrieve_context(
        self,
        user_query: str,
        top_k: int = 5,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        # YOUR CODE GOES HERE
        # Currently returns original query unchanged
        pass
```

### 2. Backend Integration (`backend/main.py`)

The backend already calls your RAG service:

```python
@app.post("/api/generate")
async def generate_application(request: UserRequest):
    # RAG-FAISS Integration Point
    rag_service = get_rag_service()
    rag_result = await rag_service.retrieve_context(
        user_query=request.description.strip(),
        top_k=5
    )

    # Use enriched query for workflow
    enriched_description = rag_result["enriched_query"]

    # Pass to LangGraph
    execute_workflow_background(session_id, enriched_description)
```

### 3. Control Endpoints

```bash
# Enable RAG
POST /api/rag/enable
Body: {"knowledge_base_path": "/path/to/kb"}

# Disable RAG
POST /api/rag/disable

# Check status
GET /
Response: {"rag_enabled": true/false}
```

## What You Need to Implement

### Step 1: Implement `_search_faiss_index` Method

```python
async def _search_faiss_index(
    self,
    query: str,
    top_k: int,
    filters: Optional[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Search FAISS index for relevant documents.

    TODO: Replace this with your FAISS implementation
    """
    # 1. Convert query to embeddings
    query_embedding = self._get_embedding(query)

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

```python
def _get_embedding(self, text: str) -> np.ndarray:
    """
    Generate embedding for text.

    Use your preferred embedding model:
    - OpenAI embeddings
    - Sentence Transformers
    - Custom model
    """
    # Example with Sentence Transformers:
    # from sentence_transformers import SentenceTransformer
    # model = SentenceTransformer('all-MiniLM-L6-v2')
    # embedding = model.encode(text)
    # return embedding
    pass
```

### Step 3: Load FAISS Index

```python
def _load_knowledge_base(self, kb_path: str):
    """
    Load FAISS index and document store.
    """
    import faiss
    import json

    # Load FAISS index
    self.faiss_index = faiss.read_index(f"{kb_path}/index.faiss")

    # Load document store
    with open(f"{kb_path}/documents.json", "r") as f:
        self.document_store = json.load(f)

    # Load embedding model
    # self.embedding_model = load_your_model()
```

### Step 4: Enable RAG

Once implemented, enable it:

```python
# In __init__ or via API
def enable_rag(self, knowledge_base_path: str):
    self.knowledge_base_path = knowledge_base_path
    self._load_knowledge_base(knowledge_base_path)
    self.is_enabled = True
```

## Expected Knowledge Base Structure

```
knowledge_base/
├── index.faiss              # FAISS index file
├── documents.json           # Document store
└── config.json             # Optional config
```

### documents.json Format

```json
{
  "documents": [
    {
      "id": "doc_001",
      "content": "Landing pages should have clear CTAs...",
      "metadata": {
        "source": "web_design_guide",
        "category": "ui_design",
        "tags": ["landing_page", "cta"]
      }
    }
  ]
}
```

## Example Flow

### Input

User types: "Build a landing page for a coffee shop"

### Your RAG System Should:

1. Convert query to embedding
2. Search FAISS index
3. Retrieve top 5 relevant docs about:
   - Landing page design
   - Coffee shop websites
   - Menu sections
   - Contact forms
   - etc.

### Output (Enriched Query)

```
User Request: Build a landing page for a coffee shop

Relevant Context from Knowledge Base:
[Context 1]: Landing pages should have clear call-to-action buttons...
[Context 2]: Coffee shop websites typically include menu sections...
[Context 3]: Hero sections work well for food businesses...
[Context 4]: Contact forms should include location and hours...
[Context 5]: Image galleries showcase products effectively...

Please use the above context to generate an appropriate application plan.
```

### Result

LangGraph receives enriched query and generates better application!

## Testing Your Integration

### Test 1: Verify RAG is Disabled (Default)

```bash
curl http://localhost:8000/
# Should show: "rag_enabled": false
```

### Test 2: Enable RAG

```bash
curl -X POST http://localhost:8000/api/rag/enable \
  -H "Content-Type: application/json" \
  -d '{"knowledge_base_path": "/path/to/your/kb"}'
```

### Test 3: Generate with RAG

```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"description": "Build a todo app"}'
```

Check logs to see if your RAG system enriched the query.

### Test 4: Verify Enrichment

Add logging in your `retrieve_context` method:

```python
async def retrieve_context(self, user_query: str, ...):
    logger.info(f"Original query: {user_query}")

    # Your retrieval logic
    retrieved_docs = await self._search_faiss_index(...)

    enriched = self._enrich_query(user_query, retrieved_docs)
    logger.info(f"Enriched query: {enriched}")

    return {"enriched_query": enriched, ...}
```

## Dependencies You'll Need

```bash
pip install faiss-cpu  # or faiss-gpu
pip install sentence-transformers  # if using
pip install numpy
```

## Integration Checklist

- [ ] Implement `_search_faiss_index` method
- [ ] Implement `_get_embedding` method
- [ ] Implement `_load_knowledge_base` method
- [ ] Create FAISS index from knowledge base
- [ ] Test retrieval with sample queries
- [ ] Enable RAG via API
- [ ] Verify enrichment in logs
- [ ] Test end-to-end with frontend

## Questions?

The integration point is designed to be plug-and-play. You just need to:

1. Implement the three methods above
2. Create your FAISS index
3. Enable RAG via API

Everything else is already wired up!

## Files to Focus On

1. `backend/services/rag_service.py` - Your main implementation file
2. `backend/services/RAG_INTEGRATION.md` - Detailed documentation
3. `backend/main.py` - See how it's called (lines ~120-135)

## Current Status

✅ Backend integration complete
✅ API endpoints ready
✅ Frontend ready (no changes needed)
⏳ Waiting for your FAISS implementation

Once you implement the three methods above, the entire system will automatically use RAG enrichment for all user queries!

Good luck! 🚀
