# AMAR Project Structure

## 📁 Root Directory

```
AMAR/
├── 📄 Core Python Files
│   ├── rag_retriever.py              # Core RAG pipeline with FAISS
│   ├── dynamic_knowledge_base.py     # Interactive query system with web search
│   ├── phase2_formatter.py           # Format output for Phase 2 AI agents
│   ├── export_for_phase2.py          # Export specifications for AI agents
│   ├── ingest_knowledge_base.py      # Ingest documents into knowledge base
│   ├── ingestion_pipeline.py         # Document loading utilities
│   ├── evaluation.py                 # Quality metrics and evaluation
│   ├── config.py                     # Configuration settings
│   └── demo_phase2_workflow.py       # Demo of complete Phase 2 workflow
│
├── 📄 Configuration Files
│   ├── .env                          # API keys (create from example)
│   ├── requirements.txt              # Python dependencies
│   └── README.md                     # Main documentation
│
├── 📄 Knowledge Base Files
│   ├── amar_knowledge_base.pkl       # Serialized knowledge base
│   └── amar_knowledge_base.pkl.index # FAISS index
│
├── 📁 knowledge_base/                # Source documents
│   ├── architecture/                 # Architecture patterns
│   ├── best_practices/               # Best practices guides
│   ├── deployment/                   # Deployment guides
│   ├── ui_ux/                        # UI/UX guidelines
│   └── web_stacks/                   # Technology comparisons
│
├── 📁 knowledge_cache/               # Web search results cache
│   └── web_search_*.md               # Cached web searches
│
├── 📁 phase2_exports/                # Exported specifications
│   ├── export_*.json                 # JSON format
│   ├── export_*.md                   # Markdown format
│   └── export_*_prompt.txt           # AI agent prompts
│
├── 📁 docs/                          # Documentation
│   ├── 00_START_HERE.md              # Quick start guide
│   ├── BEGINNER.md                   # Beginner's guide
│   ├── QUICKSTART.md                 # Setup instructions
│   ├── ARCHITECTURE.md               # Technical architecture
│   ├── KNOWLEDGE_BASE_GUIDE.md       # KB usage guide
│   ├── PHASE2_QUICK_START.md         # Phase 2 quick start
│   ├── PHASE2_INTEGRATION_GUIDE.md   # Phase 2 full guide
│   ├── PHASE2_CHEAT_SHEET.md         # Quick reference
│   ├── FINAL_PHASE2_SUMMARY.md       # Complete summary
│   ├── CONFIDENCE_FIX_SUMMARY.md     # Confidence details
│   ├── TROUBLESHOOTING.md            # Common issues
│   └── ... (more docs)
│
└── 📁 tests/                         # Test scripts
    └── test_*.py                     # Various test files
```

## 🎯 Main Entry Points

### For Phase 2 AI Agent Integration

```bash
python export_for_phase2.py "Your build request" all
```

### For Interactive Exploration

```bash
python dynamic_knowledge_base.py
```

### For Demo

```bash
python demo_phase2_workflow.py
```

### For Initial Setup

```bash
python ingest_knowledge_base.py
```

## 📚 Documentation Guide

### Getting Started

1. **README.md** - Start here for overview
2. **docs/00_START_HERE.md** - Quick start
3. **docs/BEGINNER.md** - Complete beginner's guide
4. **docs/QUICKSTART.md** - Detailed setup

### Phase 2 Integration

1. **docs/PHASE2_QUICK_START.md** - Get started in 3 steps
2. **docs/PHASE2_INTEGRATION_GUIDE.md** - Complete guide
3. **docs/PHASE2_CHEAT_SHEET.md** - Quick reference
4. **docs/FINAL_PHASE2_SUMMARY.md** - Full summary

### Technical Details

- **docs/ARCHITECTURE.md** - System architecture
- **docs/KNOWLEDGE_BASE_GUIDE.md** - KB usage
- **docs/CONFIDENCE_FIX_SUMMARY.md** - Confidence details

### Reference

- **docs/TROUBLESHOOTING.md** - Common issues
- **docs/INDEX.md** - Documentation index

## 🔧 Core Components

### RAG Pipeline (`rag_retriever.py`)

- Document chunking and embedding
- FAISS HNSW indexing
- Cross-encoder reranking
- LLM answer generation
- Confidence calculation

### Dynamic Knowledge Base (`dynamic_knowledge_base.py`)

- Interactive query system
- Web search integration
- Automatic knowledge expansion
- Knowledge base management

### Phase 2 Formatter (`phase2_formatter.py`)

- Structured output formatting
- JSON, Markdown, Prompt exports
- Section parsing and organization

### Export Tool (`export_for_phase2.py`)

- Command-line export interface
- Multiple format generation
- File management

## 📊 Data Flow

```
User Query
    ↓
dynamic_knowledge_base.py
    ↓
rag_retriever.py (search KB)
    ↓
[If low confidence] → Web Search → Synthesize → Save
    ↓
phase2_formatter.py (format output)
    ↓
export_for_phase2.py (export files)
    ↓
phase2_exports/ (JSON, MD, Prompt)
    ↓
Phase 2 AI Agent
```

## 🎨 File Naming Conventions

- **Python files**: `lowercase_with_underscores.py`
- **Markdown docs**: `UPPERCASE_WITH_UNDERSCORES.md`
- **Exports**: `export_XXXX.{json,md,txt}`
- **Cache**: `web_search_HASH.md`

## 📦 Dependencies

See `requirements.txt` for full list:

- faiss-cpu
- sentence-transformers
- google-generativeai
- beautifulsoup4
- requests
- numpy
- tiktoken

## Quick Commands

```bash
# Setup
pip install -r requirements.txt
python ingest_knowledge_base.py

# Interactive mode
python dynamic_knowledge_base.py

# Export for Phase 2
python export_for_phase2.py "Build an app" all

# Demo
python demo_phase2_workflow.py

# Evaluation
python evaluation.py
```

## 📝 Notes

- Knowledge base is stored in `.pkl` files
- Web searches are cached in `knowledge_cache/`
- Exports go to `phase2_exports/`
- API keys in `.env` file (not committed)
- Documentation in `docs/` folder

---

**Version**: 2.0.0 | **Status**: Production Ready
