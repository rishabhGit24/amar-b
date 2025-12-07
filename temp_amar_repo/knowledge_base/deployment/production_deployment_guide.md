# Production Deployment Guide for MERN Applications

## Deployment Options Comparison

### 1. Vercel + Railway/Render (RECOMMENDED for Startups)

**Frontend (Vercel)**:
- Automatic deployments from Git
- Global CDN
- Serverless functions
- Free SSL
- Preview deployments
- Cost: $0-20/month

**Backend (Railway/Render)**:
- Easy setup
- Auto-scaling
- Free SSL
- Database included
- Cost: $5-20/month

**Total Cost**: $5-40/month
**Setup Time**: 30 minutes
**Best For**: MVPs, startups, small teams

### 2. AWS (Best for Scale)

**Services**:
- Frontend: S3 + CloudFront or Amplify
- Backend: ECS (Fargate) or EC2
- Database: MongoDB Atlas or DocumentDB
- Storage: S3
- CDN: CloudFront
- Load Balancer: ALB

**Cost**: $50-500/month
**Setup Time**: 2-4 hours
**Best For**: Growing companies, enterprise

### 3. DigitalOcean (Good Balance)

**Services**:
- App Platform (frontend + backend)
- Managed MongoDB
- Spaces (S3-compatible storage)
- CDN

**Cost**: $20-100/month
**Setup Time**: 1 hour
**Best For**: Mid-size applications

## Step-by-Step: Vercel + Railway Deployment

### Prerequisites
```bash
# Install CLIs
npm install -g vercel
npm install -g @railway/cli

# Login
vercel login
railway login
```

### Frontend Deployment (Vercel)

**1. Prepare Next.js App**:
```javascript
// next.config.js
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: ['your-backend-domain.com'],
  },
};
```

**2. Deploy**:
```bash
cd frontend
vercel

# Follow prompts
# Set environment variables in Vercel dashboard
```

**3. Environment Variables** (Vercel Dashboard):
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
```

### Backend Deployment (Railway)

**1. Prepare Express App**:
```javascript
// server.js
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

**2. Create railway.json**:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**3. Deploy**:
```bash
cd backend
railway init
railway up

# Or connect GitHub repo in Railway dashboard
```

**4. Environment Variables** (Railway Dashboard):
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
SENDGRID_API_KEY=...
FRONTEND_URL=https://your-app.vercel.app
```

### Database Setup (MongoDB Atlas)

**1. Create Cluster**:
- Go to mongodb.com/cloud/atlas
- Create free M0 cluster
- Choose region close to your backend

**2. Configure**:
- Network Access: Add 0.0.0.0/0 (allow all)
- Database Access: Create user
- Get connection string

**3. Connection String**:
```
mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

## Environment Variables Management

### Development (.env.local)
```bash
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# Backend
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/issuetracker
JWT_SECRET=dev-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Production
**Never commit secrets!**

Use:
- Vercel: Dashboard → Settings → Environment Variables
- Railway: Dashboard → Variables
- AWS: Systems Manager Parameter Store
- .env files with .gitignore

## CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: backend
```

## Docker Deployment

### Dockerfile (Backend)
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Dockerfile (Frontend)
```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:5000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/issuetracker
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

## SSL/HTTPS Setup

### Automatic (Vercel/Railway)
- SSL certificates automatically provisioned
- HTTPS enforced by default
- No configuration needed

### Manual (AWS/DigitalOcean)
```bash
# Using Let's Encrypt with Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Performance Optimization

### Frontend
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      };
    }
    return config;
  },
};
```

### Backend
```javascript
// Enable compression
const compression = require('compression');
app.use(compression());

// Enable caching
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=300');
  next();
});

// Connection pooling
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
});
```

## Monitoring and Logging

### Sentry (Error Tracking)
```javascript
// Frontend
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

// Backend
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Winston (Logging)
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

## Health Checks

### Backend Health Endpoint
```javascript
app.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    database: 'disconnected',
  };

  try {
    await mongoose.connection.db.admin().ping();
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'ERROR';
  }

  const statusCode = health.status === 'OK' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

## Backup Strategy

### MongoDB Atlas Backups
- Automatic daily backups
- Point-in-time recovery
- Download backups manually

### Manual Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="issuetracker"

mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"

# Upload to S3
aws s3 cp "$BACKUP_DIR/$DATE" "s3://my-backups/$DATE" --recursive

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

## Scaling Strategy

### Horizontal Scaling
```yaml
# Railway: Scale replicas
replicas: 3

# AWS ECS: Task definition
{
  "desiredCount": 3,
  "launchType": "FARGATE"
}
```

### Load Balancing
- Railway: Automatic
- AWS: Application Load Balancer
- DigitalOcean: Load Balancer service

### Database Scaling
- MongoDB Atlas: Upgrade cluster tier
- Read replicas for read-heavy workloads
- Sharding for very large datasets

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] CORS configured properly
- [ ] Security headers set (Helmet.js)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Mongoose)
- [ ] XSS protection
- [ ] CSRF tokens for state-changing operations
- [ ] Regular dependency updates
- [ ] Secrets rotation policy
- [ ] Backup strategy in place
- [ ] Monitoring and alerts configured

## Cost Optimization

### Tips
1. Use free tiers when possible
2. Enable auto-scaling (scale down when idle)
3. Use CDN for static assets
4. Implement caching (Redis)
5. Optimize images
6. Use serverless for low-traffic endpoints
7. Monitor and optimize database queries
8. Use connection pooling
9. Compress responses
10. Clean up unused resources

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates ready
- [ ] Monitoring tools configured
- [ ] Backup strategy in place
- [ ] Documentation updated

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Check health endpoints
- [ ] Verify database connections
- [ ] Test critical user flows
- [ ] Monitor error rates
- [ ] Check performance metrics

### Post-Deployment
- [ ] Monitor for errors
- [ ] Check user feedback
- [ ] Verify analytics
- [ ] Update status page
- [ ] Document any issues
- [ ] Plan rollback if needed

## Rollback Strategy

### Quick Rollback
```bash
# Vercel
vercel rollback

# Railway
railway rollback

# Git-based
git revert HEAD
git push origin main
```

### Database Rollback
- Keep migration scripts
- Test rollback procedures
- Have backup ready
- Document rollback steps

## Conclusion

**Recommended for Issue Reporting App**:
- Frontend: Vercel
- Backend: Railway or Render
- Database: MongoDB Atlas
- Storage: AWS S3 or Cloudinary
- Monitoring: Sentry
- Total Cost: $20-50/month
- Setup Time: 1-2 hours
- Scalability: Excellent

This setup provides:
- ✅ Easy deployment
- ✅ Auto-scaling
- ✅ High availability
- ✅ Good performance
- ✅ Cost-effective
- ✅ Production-ready
