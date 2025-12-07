# AMAR - Autonomous Multi-Agent React Application Generator

🤖 AI-powered system that generates production-ready React applications from natural language descriptions.

## 🌟 Features

- **AI-Powered Code Generation**: Uses Gemini/Groq LLM to generate complete React applications
- **RAG-Enhanced**: 63 knowledge chunks provide context for better code generation
- **Multi-Agent System**: Planner, Builder, and Deployer agents work together
- **Real-Time Progress**: WebSocket updates show live agent activities
- **Auto-Deployment**: Automatic deployment to Vercel or Netlify
- **Self-Healing**: Automatic retry on failures (up to 3 attempts)
- **Production-Ready**: Complete error handling and resource management

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 16+
- 8+ GB RAM (for RAG system)

### Installation

```bash
# Clone repository
git clone https://github.com/rishabhGit24/amar-b.git
cd amar-b

# Backend setup
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys

# Frontend setup
cd ../frontend
npm install
```

### Configuration

Edit `backend/.env`:

```env
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
VERCEL_TOKEN=your_vercel_token
NETLIFY_TOKEN=your_netlify_token
DISABLE_RAG=false
```

### Run

```bash
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
cd frontend
npm start

# Open browser
http://localhost:3000
```

## 📖 Usage

1. Enter your app description: "Build a todo list app with React"
2. Watch real-time progress as agents work
3. Get your deployed app URL in ~60 seconds!

## 🏗️ Architecture

```
User Input
    ↓
RAG Enhancement (adds context from knowledge base)
    ↓
Planner Agent (creates structured plan)
    ↓
Builder Agent (generates React code)
    ↓
Tester Agent (validates code)
    ↓
Deployer Agent (deploys to Vercel/Netlify)
    ↓
Deployed Application URL
```

## 🧪 Testing

```bash
# Test Gemini API
cd backend
python test_gemini_quick.py

# Test complete flow
python test_complete_flow.py

# Test RAG system
python test_rag_simple.py
```

## 📦 Components

### Backend (`/backend`)

- FastAPI server with WebSocket support
- RAG-FAISS knowledge base
- 3 AI Agents (Planner, Builder, Deployer)
- LangGraph workflow orchestrator
- Error handling & graceful failure
- Memory management & audit logging

### Frontend (`/frontend`)

- React application
- Real-time progress via WebSocket
- Clean UI for input/output
- Deployment URL display

### Knowledge Base

- Architecture patterns
- Deployment guides
- UI/UX best practices
- Web stack comparisons

## 🔧 Configuration Options

### Disable RAG (Low Memory Systems)

```env
DISABLE_RAG=true
```

### Use Groq Instead of Gemini

```env
USE_GROQ=true
```

### Mock Deployment (Testing)

```env
MOCK_DEPLOYMENT=true
```

## 📊 Performance

- **With RAG**: ~3 GB RAM, ~45-90 seconds end-to-end
- **Without RAG**: ~500 MB RAM, ~40-80 seconds end-to-end

## 🐛 Known Issues

- **High Memory Usage**: RAG system requires 8+ GB RAM
- **TensorFlow Warnings**: Normal startup warnings, can be ignored

## 📚 Documentation

- `READY_TO_DEPLOY.md` - Complete deployment guide
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment checklist
- `COMPLETE_FLOW_GUIDE.md` - System flow overview
- `SYSTEM_READY.md` - Detailed system status

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Google Gemini API
- Groq API
- LangChain & LangGraph
- Vercel & Netlify

## 📞 Support

For issues and questions, please open a GitHub issue.

---

**Built with ❤️ using AI agents**
