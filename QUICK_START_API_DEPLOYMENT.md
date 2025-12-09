# Quick Start: API-Based Deployment

## 🚀 Get Started in 3 Steps

### Step 1: Get Your Token (2 minutes)

**Option A: Vercel (Recommended)**

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "AMAR" and click "Create"
4. Copy the token

**Option B: Netlify**

1. Go to https://app.netlify.com/user/applications#personal-access-tokens
2. Click "New access token"
3. Name it "AMAR" and click "Generate token"
4. Copy the token

### Step 2: Add Token to .env (30 seconds)

Open `backend/.env` and add:

```env
VERCEL_TOKEN=paste_your_token_here
```

Or for Netlify:

```env
NETLIFY_TOKEN=paste_your_token_here
```

### Step 3: Test It (1 minute)

```bash
cd backend
python test_api_deployment.py
```

You should see:

```
✅ Vercel Token: Configured
✅ Vercel API: Connected
✅ READY TO DEPLOY!
```

## 🎉 That's It!

Now start your server and deploy:

```bash
cd backend
python main.py
```

Then use the web interface to deploy your first app!

## 📝 Example Deployment

**Input:**

```
Build a landing page about AI, keep it simple with just 1 page
```

**Output:**

```
🚀 DEPLOYER: Deploying application to hosting platform
📤 Uploading 17 files to Vercel...
⏳ Monitoring deployment status...
✓ Deployment ready!
✓ DEPLOYER: Deployed to https://amar-app-abc123.vercel.app
```

## ❓ Troubleshooting

### "No deployment platform configured"

→ Add token to `backend/.env`

### "Invalid token"

→ Regenerate token and update `.env`

### "Connection error"

→ Check internet connection

## 📚 More Info

- Full guide: `API_DEPLOYMENT_GUIDE.md`
- Revert instructions: `REVERT_TO_CLI_DEPLOYMENT.md`
- Summary: `DEPLOYMENT_FIX_SUMMARY.md`

---

**No npm required! No Node.js required! Just Python + API token = Deploy! 🎉**
