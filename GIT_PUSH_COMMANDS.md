# Git Push Commands

## Step 1: Initialize Git (if not already done)

```bash
cd "R:\StartUp\New folder (2)"
git init
```

## Step 2: Add Remote Repository

```bash
git remote add origin https://github.com/rishabhGit24/amar-b.git
```

Or if remote already exists:

```bash
git remote set-url origin https://github.com/rishabhGit24/amar-b.git
```

## Step 3: Create .gitignore

Create a `.gitignore` file in the root directory with:

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
ENV/
.venv
*.egg-info/
dist/
build/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# Environment
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Testing
.pytest_cache/
.hypothesis/
coverage/
.coverage

# Temporary
temp/
tmp/
*.tmp

# Build outputs
frontend/build/
frontend/dist/

# RAG/ML models (large files)
*.pkl
*.index
*.bin
*.pt
*.pth

# Keep .env.example but ignore .env
.env
!.env.example
```

## Step 4: Stage All Files

```bash
git add .
```

## Step 5: Commit Changes

```bash
git commit -m "Complete AMAR system with RAG, Gemini API, and all fixes

- Fixed RAG dependencies (numpy, scikit-learn compatibility)
- Configured Gemini API (working and tested)
- Added Groq as backup LLM
- Implemented complete workflow with LangGraph
- Added 3 AI agents (Planner, Builder, Deployer)
- Integrated RAG-FAISS with 63 knowledge chunks
- Added error handling and graceful failure
- Memory management and resource monitoring
- Real-time WebSocket progress updates
- Auto-deployment to Vercel/Netlify
- Complete test suite
- Production-ready configuration"
```

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main --force
```

Note: Use `--force` only if you're sure you want to overwrite the remote repository.

## Step 7: Verify

Visit: https://github.com/rishabhGit24/amar-b

---

## Quick Commands (Copy-Paste)

```bash
cd "R:\StartUp\New folder (2)"
git init
git remote add origin https://github.com/rishabhGit24/amar-b.git
git add .
git commit -m "Complete AMAR system - production ready"
git branch -M main
git push -u origin main --force
```

---

## Important Notes

1. **API Keys**: The `.gitignore` will prevent `.env` from being pushed
2. **Large Files**: RAG model files (_.pkl, _.index) are ignored
3. **Node Modules**: Frontend dependencies are ignored
4. **Python Cache**: All cache files are ignored

## After Push

1. Go to GitHub repository settings
2. Add secrets for deployment:

   - `GEMINI_API_KEY`
   - `GROQ_API_KEY`
   - `VERCEL_TOKEN`
   - `NETLIFY_TOKEN`

3. Set up GitHub Actions (optional) for CI/CD

---

## Troubleshooting

### If remote already exists:

```bash
git remote remove origin
git remote add origin https://github.com/rishabhGit24/amar-b.git
```

### If you get authentication error:

Use GitHub Personal Access Token instead of password

### If files are too large:

```bash
git lfs install
git lfs track "*.pkl"
git lfs track "*.index"
```

---

## Ready to Push! 🚀
