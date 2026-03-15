# AMAR Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure API Key

Create `.env` file:

```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. Run the System

#### For Phase 2 AI Agent Integration

```bash
python export_for_phase2.py "Build a task management app" all
```

Output: `phase2_exports/export_*.{json,md,txt}`

#### For Interactive Exploration

```bash
python dynamic_knowledge_base.py
```

Commands: `phase2`, `save`, `stats`, `help`, `exit`

#### For Demo

```bash
python demo_phase2_workflow.py
```

## 📚 Documentation

- **README.md** - Main documentation
- **PROJECT_STRUCTURE.md** - Project layout
- **docs/PHASE2_QUICK_START.md** - Phase 2 guide
- **docs/BEGINNER.md** - Beginner's guide

## 🎯 What You Get

Every query generates:

- ✅ 90-95% confidence specifications
- ✅ 20-30+ implementation steps
- ✅ Modern UI/UX guidelines
- ✅ Complete technology stack
- ✅ Security best practices
- ✅ Code structure recommendations

## 💡 Example

```bash
python export_for_phase2.py "Build a real-time chat app" all
```

Generates:

- `export_XXXX.json` - Structured data
- `export_XXXX.md` - Documentation
- `export_XXXX_prompt.txt` - AI agent prompt

## 🔧 Core Commands

```bash
# Interactive mode
python dynamic_knowledge_base.py

# Export for Phase 2
python export_for_phase2.py "Your request" all

# Demo workflow
python demo_phase2_workflow.py

# Ingest new documents
python ingest_knowledge_base.py

# Evaluate system
python evaluation.py
```

## 📊 System Status

- ✅ Confidence: 90-95%
- ✅ UI/UX: Modern & User-Friendly
- ✅ Phase 2: Ready
- ✅ Status: Production

## 🆘 Need Help?

- **Troubleshooting**: `docs/TROUBLESHOOTING.md`
- **Full Guide**: `docs/PHASE2_INTEGRATION_GUIDE.md`
- **Cheat Sheet**: `docs/PHASE2_CHEAT_SHEET.md`

---

**Version**: 2.0.0 | **Status**: Production Ready
