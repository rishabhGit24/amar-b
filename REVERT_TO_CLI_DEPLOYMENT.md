# How to Revert to CLI-Based Deployment

If you prefer the old CLI-based deployment method, follow these steps:

## Quick Revert (Windows CMD)

```cmd
REM 1. Restore the original deployer
copy backend\agents\deployer.py.backup backend\agents\deployer.py

REM 2. Done! Restart your server
cd backend
python main.py
```

## Manual Revert Steps

### Step 1: Restore Original Deployer

Replace the import in `backend/workflow/orchestrator.py`:

**Change from:**

```python
from agents.deployer_api import DeployerAgentAPI as DeployerAgent
```

**Change to:**

```python
from agents.deployer import DeployerAgent
```

### Step 2: Verify the Change

Check that `backend/workflow/orchestrator.py` line 25 looks like:

```python
from agents.deployer import DeployerAgent
```

### Step 3: Restart Server

```bash
cd backend
python main.py
```

## What You'll Need for CLI Method

After reverting, you'll need to install:

1. **Node.js** (includes npm)

   - Download from: https://nodejs.org/
   - Recommended: LTS version

2. **Vercel CLI** (if using Vercel)

   ```bash
   npm install -g vercel
   ```

3. **Netlify CLI** (if using Netlify)
   ```bash
   npm install -g netlify-cli
   ```

## Comparison

### API Method (Current)

✅ No npm/Node.js required
✅ Faster deployment
✅ Better error messages
✅ Works in any Python environment
❌ Requires API tokens

### CLI Method (Old)

✅ Familiar workflow
✅ Uses official CLI tools
❌ Requires npm/Node.js
❌ Installation complexity
❌ Slower deployment
❌ CLI version conflicts

## Files Involved

- `backend/agents/deployer.py` - Original CLI-based deployer
- `backend/agents/deployer.py.backup` - Backup of original
- `backend/agents/deployer_api.py` - New API-based deployer
- `backend/workflow/orchestrator.py` - Imports the deployer

## Troubleshooting Revert

### Issue: "Module not found: deployer"

**Solution:** Make sure you restored the backup:

```cmd
copy backend\agents\deployer.py.backup backend\agents\deployer.py
```

### Issue: "npm not found"

**Solution:** Install Node.js from https://nodejs.org/

### Issue: "vercel command not found"

**Solution:** Install Vercel CLI:

```bash
npm install -g vercel
```

## Keep Both Methods

You can keep both deployers and switch between them:

### Use API Method:

```python
# In backend/workflow/orchestrator.py
from agents.deployer_api import DeployerAgentAPI as DeployerAgent
```

### Use CLI Method:

```python
# In backend/workflow/orchestrator.py
from agents.deployer import DeployerAgent
```

Just change the import and restart the server!

## Recommendation

**Stick with API method** unless you have a specific reason to use CLI:

- It's simpler
- It's faster
- It has fewer dependencies
- It's more reliable

The CLI method is only needed if:

- You already have npm/Node.js installed
- You prefer using official CLI tools
- You have custom CLI configurations
