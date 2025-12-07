# AMAR MVP Deployment Guide

This guide provides instructions for deploying the AMAR MVP application to production using Railway or Heroku for the backend and Vercel/Netlify for the frontend.

## Prerequisites

- Git repository with your code
- API keys for:
  - Google Gemini API
  - Vercel (for deployment)
  - Netlify (for deployment)

## Backend Deployment

### Option 1: Railway (Recommended)

Railway is a modern deployment platform with a generous free tier and excellent developer experience.

#### Steps:

1. **Create Railway Account**

   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your AMAR MVP repository

3. **Configure Environment Variables**

   - In the Railway dashboard, go to your project
   - Click on "Variables"
   - Add the following environment variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key
     VERCEL_TOKEN=your_vercel_token
     NETLIFY_TOKEN=your_netlify_token
     ENVIRONMENT=production
     PORT=8000
     CORS_ORIGINS=https://your-frontend-url.vercel.app
     ```

4. **Deploy**

   - Railway will automatically detect the `railway.json` configuration
   - The backend will be built using the Dockerfile
   - Once deployed, note the public URL (e.g., `https://your-app.railway.app`)

5. **Verify Deployment**
   - Visit `https://your-app.railway.app/health`
   - You should see: `{"status": "healthy", ...}`

#### Railway Configuration

The `railway.json` file in the root directory configures:

- Docker build using `backend/Dockerfile`
- Health check endpoint at `/health`
- Automatic restart on failure
- Maximum 3 restart retries

### Option 2: Heroku

Heroku is a well-established platform with a free tier (requires credit card verification).

#### Steps:

1. **Install Heroku CLI**

   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli

   # Linux
   curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**

   ```bash
   heroku login
   ```

3. **Create Heroku App**

   ```bash
   heroku create your-amar-backend
   ```

4. **Set Environment Variables**

   ```bash
   heroku config:set GEMINI_API_KEY=your_gemini_api_key
   heroku config:set VERCEL_TOKEN=your_vercel_token
   heroku config:set NETLIFY_TOKEN=your_netlify_token
   heroku config:set ENVIRONMENT=production
   heroku config:set CORS_ORIGINS=https://your-frontend-url.vercel.app
   ```

5. **Deploy**

   ```bash
   git push heroku main
   ```

6. **Verify Deployment**
   ```bash
   heroku open
   # Or visit: https://your-amar-backend.herokuapp.com/health
   ```

#### Heroku Configuration

The `Procfile` in the root directory tells Heroku how to run the application:

```
web: cd backend && python main.py
```

The `runtime.txt` specifies Python version:

```
python-3.10.13
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

Vercel is optimized for React applications and provides excellent performance.

#### Steps:

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy Frontend**

   ```bash
   cd frontend
   vercel
   ```

4. **Configure Environment Variables**

   - In the Vercel dashboard, go to your project
   - Go to Settings > Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app
     ```

5. **Redeploy with Environment Variables**

   ```bash
   vercel --prod
   ```

6. **Update Backend CORS**
   - Note your Vercel URL (e.g., `https://your-app.vercel.app`)
   - Update the backend's `CORS_ORIGINS` environment variable to include this URL

### Option 2: Netlify

Netlify is another excellent option for static site hosting.

#### Steps:

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Deploy Frontend**

   ```bash
   cd frontend
   netlify deploy --prod
   ```

4. **Configure Environment Variables**

   - In the Netlify dashboard, go to your site
   - Go to Site settings > Build & deploy > Environment
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app
     ```

5. **Redeploy**

   ```bash
   netlify deploy --prod
   ```

6. **Update Backend CORS**
   - Note your Netlify URL (e.g., `https://your-app.netlify.app`)
   - Update the backend's `CORS_ORIGINS` environment variable to include this URL

## Frontend Configuration

The frontend needs to know the backend API URL. Create a `.env.production` file in the `frontend` directory:

```env
REACT_APP_API_URL=https://your-backend-url.railway.app
```

Update the frontend code to use this environment variable for API calls.

## Post-Deployment Checklist

- [ ] Backend health check returns 200 OK
- [ ] Frontend loads successfully
- [ ] Frontend can connect to backend API
- [ ] CORS is properly configured
- [ ] Environment variables are set correctly
- [ ] Test the complete workflow:
  - [ ] Submit a simple app description
  - [ ] Verify WebSocket connection works
  - [ ] Check that deployment completes successfully

## Monitoring and Logs

### Railway

- View logs in the Railway dashboard
- Logs are automatically collected and searchable
- Set up log alerts in Settings

### Heroku

```bash
heroku logs --tail
```

### Vercel

- View deployment logs in the Vercel dashboard
- Real-time logs available during deployment

### Netlify

- View deployment logs in the Netlify dashboard
- Function logs available for serverless functions

## Troubleshooting

### Backend Issues

**Health check fails:**

- Check environment variables are set correctly
- Verify the application is running on the correct port
- Check logs for startup errors

**CORS errors:**

- Ensure `CORS_ORIGINS` includes your frontend URL
- Verify the frontend URL is correct (no trailing slash)

**API key errors:**

- Verify `GEMINI_API_KEY` is set correctly
- Check that the API key has sufficient quota

### Frontend Issues

**Cannot connect to backend:**

- Verify `REACT_APP_API_URL` is set correctly
- Check that the backend is running and accessible
- Verify CORS is configured properly

**Build fails:**

- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

## Scaling Considerations

### Backend

- Railway: Automatically scales based on usage
- Heroku: Use `heroku ps:scale web=2` to add more dynos

### Frontend

- Vercel: Automatically scales globally via CDN
- Netlify: Automatically scales globally via CDN

## Cost Estimates

### Free Tier Limits

**Railway:**

- $5 free credit per month
- Sufficient for development and light production use

**Heroku:**

- 550-1000 free dyno hours per month
- Requires credit card verification

**Vercel:**

- 100 GB bandwidth per month
- Unlimited deployments

**Netlify:**

- 100 GB bandwidth per month
- 300 build minutes per month

## Security Best Practices

1. **Never commit API keys to Git**

   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Use HTTPS only**

   - Both Railway and Heroku provide HTTPS by default
   - Vercel and Netlify provide HTTPS by default

3. **Rotate API keys regularly**

   - Update keys in deployment platform settings
   - Redeploy after updating keys

4. **Monitor usage**

   - Set up alerts for unusual activity
   - Monitor API quota usage

5. **Enable rate limiting**
   - Already configured in the application
   - Monitor for abuse

## Support

For deployment issues:

- Railway: [railway.app/help](https://railway.app/help)
- Heroku: [help.heroku.com](https://help.heroku.com)
- Vercel: [vercel.com/support](https://vercel.com/support)
- Netlify: [netlify.com/support](https://www.netlify.com/support)
