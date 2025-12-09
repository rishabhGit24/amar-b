# API-Based Deployment Guide

## What Changed?

The AMAR system now uses **REST APIs directly** instead of CLI tools for deployment. This means:

✅ **No npm required**
✅ **No Node.js required**
✅ **No CLI tools to install**
✅ **Works in any Python environment**

## How It Works

### Old Method (CLI-based)

```
Python → npm install vercel → vercel deploy → Vercel
         ❌ Requires npm/Node.js
```

### New Method (API-based)

```
Python → Vercel REST API → Vercel
         ✅ Direct HTTP requests
```

## Setup Instructions

### 1. Get Your API Tokens

#### For Vercel:

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name (e.g., "AMAR Deployment")
4. Copy the token

#### For Netlify:

1. Go to https://app.netlify.com/user/applications#personal-access-tokens
2. Click "New access token"
3. Give it a description (e.g., "AMAR Deployment")
4. Copy the token

### 2. Add Tokens to .env File

Edit `backend/.env`:

```env
# Vercel Deployment (recommended)
VERCEL_TOKEN=your_vercel_token_here

# OR Netlify Deployment (alternative)
NETLIFY_TOKEN=your_netlify_token_here

# You can set both for automatic fallback
```

### 3. Restart the Server

```bash
cd backend
python main.py
```

## Testing the Deployment

Try deploying a simple app:

```
User Input: "Build a landing page about AI, keep it simple with just 1 page"
```

Expected output:

```
🚀 DEPLOYER: Deploying application to hosting platform
📤 Uploading files to Vercel...
⏳ Monitoring deployment status...
✓ Deployment ready!
✓ DEPLOYER: Deployed to https://your-app.vercel.app
```

## Advantages of API-Based Deployment

### 1. **No Dependencies**

- No need to install npm, Node.js, or CLI tools
- Works in pure Python environments
- Easier to containerize (Docker)

### 2. **More Reliable**

- Direct API calls are more predictable
- No CLI version conflicts
- Better error messages

### 3. **Faster**

- No CLI tool installation time
- Direct HTTP requests
- Parallel file uploads possible

### 4. **Better Control**

- Full control over deployment process
- Custom retry logic
- Detailed status monitoring

## How Files Are Uploaded

### Vercel API

```python
# Files are base64-encoded and sent in JSON
{
  "name": "amar-app-abc123",
  "files": [
    {
      "file": "package.json",
      "data": "base64_encoded_content"
    },
    {
      "file": "src/App.tsx",
      "data": "base64_encoded_content"
    }
  ],
  "projectSettings": {
    "framework": "create-react-app",
    "buildCommand": "npm run build",
    "outputDirectory": "build"
  }
}
```

### Netlify API

```python
# Files are zipped and uploaded as binary
1. Create site via API
2. Upload zip file with all project files
3. Monitor deployment status
```

## Troubleshooting

### Error: "No deployment platform configured"

**Solution:** Add at least one API token to `.env`:

```env
VERCEL_TOKEN=your_token_here
```

### Error: "Vercel API error: Invalid token"

**Solution:**

1. Check your token is correct
2. Regenerate token at https://vercel.com/account/tokens
3. Update `.env` file

### Error: "Deployment timeout"

**Solution:**

- Check your internet connection
- Verify the project isn't too large
- Try again (temporary API issue)

### Error: "Netlify site creation error"

**Solution:**

1. Verify token has correct permissions
2. Check Netlify account isn't at site limit
3. Try Vercel as alternative

## Reverting to CLI-Based Deployment

If you prefer the old CLI-based method:

1. Restore the backup:

```bash
copy backend\agents\deployer.py.backup backend\agents\deployer.py
```

2. Update the import in `backend/workflow/orchestrator.py`:

```python
from agents.deployer import DeployerAgent
```

3. Restart the server

## API Rate Limits

### Vercel

- Free tier: 100 deployments/day
- Hobby tier: Unlimited deployments
- No rate limit on API calls

### Netlify

- Free tier: 300 build minutes/month
- Unlimited sites
- API rate limit: 500 requests/minute

## Security Notes

### Token Storage

- Tokens are stored in `.env` file (not committed to git)
- Never share your tokens publicly
- Regenerate tokens if compromised

### Token Permissions

- Vercel tokens have full account access
- Netlify tokens can be scoped to specific permissions
- Use separate tokens for different projects

## Comparison: CLI vs API

| Feature          | CLI Method | API Method       |
| ---------------- | ---------- | ---------------- |
| Requires npm     | ✅ Yes     | ❌ No            |
| Requires Node.js | ✅ Yes     | ❌ No            |
| Installation     | Complex    | Simple           |
| Dependencies     | Many       | None             |
| Reliability      | Medium     | High             |
| Error Messages   | CLI output | Structured JSON  |
| Deployment Speed | Slower     | Faster           |
| Docker-friendly  | ❌ No      | ✅ Yes           |
| Cross-platform   | Issues     | Works everywhere |

## Implementation Details

### File Structure

```
backend/agents/
├── deployer.py          # Old CLI-based (backup)
├── deployer.py.backup   # Backup of old version
└── deployer_api.py      # New API-based (active)
```

### Key Changes

1. **No subprocess calls** - Pure Python HTTP requests
2. **Direct API integration** - Uses `requests` library
3. **Better error handling** - Structured API responses
4. **Status monitoring** - Polls deployment status via API

### Code Flow

```python
1. Prepare files (base64 encode for Vercel, zip for Netlify)
2. Create deployment via API
3. Upload files
4. Monitor deployment status
5. Return deployment URL
```

## Future Enhancements

Possible improvements:

1. **Parallel uploads** - Upload multiple files simultaneously
2. **Incremental deployments** - Only upload changed files
3. **Custom domains** - Automatically configure custom domains
4. **Environment variables** - Set env vars via API
5. **Deployment previews** - Create preview deployments for testing

## Support

If you encounter issues:

1. Check the logs for detailed error messages
2. Verify your API tokens are valid
3. Test API access manually:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" https://api.vercel.com/v2/user
   ```
4. Check platform status pages:
   - Vercel: https://www.vercel-status.com/
   - Netlify: https://www.netlifystatus.com/

## Conclusion

The API-based deployment method is:

- ✅ Simpler to set up
- ✅ More reliable
- ✅ Faster to execute
- ✅ Easier to maintain
- ✅ Better for production

No more npm dependency issues! 🎉
