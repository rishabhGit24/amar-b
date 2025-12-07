# AMAR Phase 1 - Architecture Documentation

## System Overview

AMAR Phase 1 implements a Retrieval-Augmented Generation (RAG) pipeline optimized for web development assistance. The system autonomously retrieves relevant documentation and generates accurate, context-aware responses.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     AMAR Phase 1 System                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Document Ingestion Layer                   │
├─────────────────────────────────────────────────────────────┤
│  • PDF/TXT/MD Loader                                        │
│  • Text Normalization                                        │
│  • Metadata Extraction                                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Chunking & Processing                     │
├─────────────────────────────────────────────────────────────┤
│  • 500-token chunks with 50-token overlap                   │
│  • Tiktoken tokenizer (cl100k_base)                         │
│  • Chunk metadata generation                                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Embedding Generation                      │
├─────────────────────────────────────────────────────────────┤
│  • SentenceTransformer (all-MiniLM-L6-v2)                   │
│  • 384-dimensional embeddings                                │
│  • Batch processing with progress tracking                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vector Indexing (FAISS)                   │
├─────────────────────────────────────────────────────────────┤
│  • HNSW (Hierarchical Navigable Small World)                │
│  • M=32 connections per layer                                │
│  • efConstruction=200                                        │
│  • L2 distance metric                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Retrieval Layer                         │
├─────────────────────────────────────────────────────────────┤
│  • Query embedding                                           │
│  • Top-K similarity search (K=5)                            │
│  • Similarity threshold filtering (0.7)                      │
│  • Source attribution                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Generation Layer (LLM)                   │
├─────────────────────────────────────────────────────────────┤
│  • Gemini 2.5 Flash (primary)                               │
│  • Llama-2-7B (alternative)                                  │
│  • Gemma2 (alternative)                                      │
│  • Context-aware prompting                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Response Assembly                       │
├─────────────────────────────────────────────────────────────┤
│  • Answer generation                                         │
│  • Confidence scoring                                        │
│  • Source provenance                                         │
│  • Fallback handling                                         │
└─────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Document Chunker
**Purpose**: Split documents into manageable, semantically meaningful chunks

**Key Features**:
- Token-based chunking (500 tokens)
- Overlapping windows (50 tokens)
- Preserves context across boundaries
- Metadata tracking per chunk

**Algorithm**:
```python
chunks = []
start = 0
while start < len(tokens):
    end = min(start + chunk_size, len(tokens))
    chunk = tokens[start:end]
    chunks.append(chunk)
    start += (chunk_size - overlap)
```

### 2. FAISS Retriever
**Purpose**: Efficient similarity search over document embeddings

**Index Type**: IndexHNSWFlat
- Combines HNSW graph with flat storage
- O(log N) search complexity
- High recall with fast retrieval

**Parameters**:
- M=32: Connections per layer (balance speed/accuracy)
- efConstruction=200: Build-time search depth
- efSearch=default: Query-time search depth

**Distance Metric**: L2 (Euclidean)
- Converted to similarity: `1 / (1 + distance)`

### 3. Embedding Model
**Model**: sentence-transformers/all-MiniLM-L6-v2

**Specifications**:
- Dimension: 384
- Max sequence length: 256 tokens
- Training: Contrastive learning on 1B+ pairs
- Performance: 0.68 avg on STS benchmark

**Why MiniLM**:
- Fast inference (~5ms per sentence)
- Good semantic understanding
- Lightweight (80MB model)
- Balanced accuracy/speed

### 4. RAG Pipeline
**Purpose**: Orchestrate retrieval and generation

**Flow**:
1. Query → Embed query
2. Search → Retrieve top-K chunks
3. Filter → Apply similarity threshold
4. Context → Build context from chunks
5. Prompt → Create LLM prompt
6. Generate → Get LLM response
7. Assemble → Package with metadata

**Prompt Template**:
```
Based on the following documentation context, answer the question accurately.

Context:
[Source 1 - Relevance: 0.92]
{chunk_text_1}

[Source 2 - Relevance: 0.87]
{chunk_text_2}

Question: {user_query}

Answer:
```

### 5. Evaluation System
**Metrics**:
- Retrieval relevance (semantic similarity)
- Answer quality (keyword matching)
- Confidence scoring
- Pass rate (80% threshold)

**Test Cases**:
- SQL injection prevention
- Microservices migration
- Security best practices
- Stack migration

## Data Flow

### Ingestion Flow
```
Document → Load → Normalize → Chunk → Embed → Index → Store
```

### Query Flow
```
Query → Embed → Search → Filter → Rank → Generate → Return
```

### Fallback Flow
```
No Results → Fallback Message → Log → Return
```

## Metadata Schema

### Document Metadata
```json
{
  "doc_id": "uuid",
  "title": "string",
  "source": "filepath",
  "domain": "web_development",
  "doc_type": "pdf|txt|md",
  "created_at": "timestamp",
  "tags": ["array"]
}
```

### Chunk Metadata
```json
{
  "chunk_id": "uuid",
  "doc_id": "parent_uuid",
  "chunk_index": 0,
  "text": "chunk_content",
  "token_count": 500,
  "start_char": 0,
  "end_char": 2000,
  "embedding_vector": [384 floats],
  "source": "filepath"
}
```

## Performance Characteristics

### Indexing
- Speed: ~1000 chunks/second
- Memory: ~1.5KB per chunk (metadata + vector)
- Disk: ~2KB per chunk (with index)

### Retrieval
- Latency: <50ms for top-5 search
- Throughput: ~200 queries/second
- Accuracy: 80%+ relevance

### Generation
- Latency: 1-3 seconds (Gemini API)
- Token limit: 8K context window
- Cost: ~$0.001 per query

## Scalability

### Current Limits
- Documents: ~10K documents
- Chunks: ~100K chunks
- Index size: ~150MB
- Memory: ~500MB RAM

### Scaling Strategies
1. **Horizontal**: Shard index across multiple instances
2. **Vertical**: Upgrade to larger FAISS index types
3. **Cloud**: Migrate to Pinecone for managed scaling
4. **Caching**: Add Redis for frequent queries

## Integration Points

### Langchain Integration
Export format for Rishab's work:
```json
{
  "total_chunks": 150,
  "embedding_dimension": 384,
  "index_type": "HNSW",
  "sample_chunks": [...],
  "evaluation_results": {...}
}
```

### API Endpoints (Future)
```
POST /ingest - Upload documents
POST /query - Ask questions
GET /status - System health
GET /metrics - Performance stats
```

## Security Considerations

1. **Input Validation**: Sanitize all user inputs
2. **API Keys**: Store in environment variables
3. **Rate Limiting**: Prevent abuse
4. **Access Control**: Authenticate API requests
5. **Data Privacy**: Encrypt sensitive documents

## Future Enhancements

### Phase 2 Features
- Migration analysis
- Code transformation
- Stack comparison
- Deployment automation

### Technical Improvements
- Multi-modal embeddings (code + text)
- Fine-tuned domain models
- Active learning from feedback
- Distributed indexing
- Real-time updates

## References

- FAISS: https://github.com/facebookresearch/faiss
- SentenceTransformers: https://www.sbert.net/
- HNSW: https://arxiv.org/abs/1603.09320
- RAG: https://arxiv.org/abs/2005.11401
