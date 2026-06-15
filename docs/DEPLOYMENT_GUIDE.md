# Chancen System - Production Deployment Guide

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Internet Users                        │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │    CDN / CloudFlare / Nginx        │
        │    (Static Assets + DDoS)          │
        └────────────────┬───────────────────┘
                         │
        ┌────────────────┴──────────────────────┬──────────────┐
        ▼                                       ▼              ▼
   ┌─────────────┐                    ┌─────────────────┐ ┌────────────┐
   │   Frontend  │                    │  Backend API    │ │  Database  │
   │   (Next.js) │                    │  (Express)      │ │(PostgreSQL)│
   │   on        │                    │  on Cloud Run / │ │   Cloud    │
   │  Vercel/    │                    │   Render / ECS  │ │    SQL     │
   │  Cloud Run  │                    │                 │ └────────────┘
   └─────────────┘                    └────────┬────────┘
                                               │
                               ┌───────────────┼────────────────┐
                               ▼               ▼                ▼
                        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
                        │ Redis Queue  │ │ Email Service│ │ S3 Storage   │
                        │              │ │ (SendGrid)   │ │ (Documents)  │
                        └──────────────┘ └──────────────┘ └──────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Background   │
                        │ Jobs        │
                        │ (Deployment) │
                        └──────────────┘
```

---

## 📋 Pre-Deployment Checklist

### Security ✅
- [ ] JWT_SECRET is strong (32+ characters, random)
- [ ] Database password is strong and unique
- [ ] CORS_ORIGINS restricted to known domains
- [ ] HTTPS enabled everywhere
- [ ] Environment variables not in git
- [ ] .env files added to .gitignore
- [ ] Rate limiting configured
- [ ] CORS headers configured properly

### Code ✅
- [ ] All tests passing (`npm run test`)
- [ ] TypeScript compilation successful (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] No console.log statements left
- [ ] Error handling implemented
- [ ] Logging configured

### Database ✅
- [ ] Schema created and tested
- [ ] Migrations tested
- [ ] Backup strategy defined
- [ ] Database user has minimal necessary permissions
- [ ] Connection pooling configured

### Infrastructure ✅
- [ ] Cloud provider account ready
- [ ] SSL certificates provisioned
- [ ] Domain registered and configured
- [ ] Email service configured (SendGrid/SES)
- [ ] Cloud storage (S3) configured
- [ ] Monitoring and alerts configured
- [ ] Backup system configured

### Environment ✅
- [ ] Production .env configured
- [ ] All secrets in environment variables
- [ ] API keys for external services
- [ ] Gemini API key configured
- [ ] Email service credentials
- [ ] AWS/Cloud credentials

---

## 🌥️ Deployment Option 1: AWS (ECS + RDS)

### 1. Create RDS PostgreSQL Instance

```bash
# Create security group for RDS
aws ec2 create-security-group \
  --group-name chancen-rds-sg \
  --description "Chancen RDS Security Group" \
  --vpc-id vpc-xxxxx

# Authorize port 5432 from app servers
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxx \
  --protocol tcp \
  --port 5432 \
  --source-security-group-id sg-app-xxxxx

# Create RDS instance (using AWS Console is easier)
# Instance type: db.t3.micro (free tier)
# Allocated storage: 20 GB
# Multi-AZ: enabled (production)
# Backup retention: 30 days
```

### 2. Setup ECR for Docker Images

```bash
# Create ECR repositories
aws ecr create-repository --repository-name chancen-backend
aws ecr create-repository --repository-name chancen-frontend

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend image
cd backend
docker build -t chancen-backend:latest .
docker tag chancen-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/chancen-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/chancen-backend:latest

# Build and push frontend image
cd ../frontend
docker build -t chancen-frontend:latest .
docker tag chancen-frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/chancen-frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/chancen-frontend:latest
```

### 3. Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster --cluster-name chancen-prod

# Create task definitions (see below)
aws ecs register-task-definition --cli-input-json file://backend-task-def.json
aws ecs register-task-definition --cli-input-json file://frontend-task-def.json

# Create services
aws ecs create-service \
  --cluster chancen-prod \
  --service-name chancen-backend \
  --task-definition chancen-backend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx],securityGroups=[sg-xxxxx]}"
```

### 4. Setup Application Load Balancer

```bash
# Create load balancer
aws elbv2 create-load-balancer \
  --name chancen-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxx

# Create target groups
aws elbv2 create-target-group \
  --name chancen-backend-tg \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-xxxxx

aws elbv2 create-target-group \
  --name chancen-frontend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxxxx

# Create listeners
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

---

## 🌐 Deployment Option 2: Google Cloud (Cloud Run + Cloud SQL)

### 1. Create Cloud SQL Database

```bash
# Create instance
gcloud sql instances create chancen-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --backup \
  --retained-backups-count=30

# Create database
gcloud sql databases create chancen_db --instance=chancen-db

# Create user
gcloud sql users create chancen_user --instance=chancen-db

# Apply schema
gcloud sql connect chancen-db --user=postgres < 00_chancen_database_schema.sql
```

### 2. Deploy Backend to Cloud Run

```bash
# Build image
cd backend
gcloud builds submit --tag gcr.io/PROJECT_ID/chancen-backend

# Deploy
gcloud run deploy chancen-backend \
  --image gcr.io/PROJECT_ID/chancen-backend \
  --platform managed \
  --region us-central1 \
  --memory 512Mi \
  --cpu 1 \
  --set-env-vars DATABASE_URL=postgresql://chancen_user:PASSWORD@/chancen_db?host=/cloudsql/PROJECT_ID:us-central1:chancen-db \
  --set-env-vars GEMINI_API_KEY=YOUR_KEY \
  --set-env-vars JWT_SECRET=YOUR_SECRET \
  --allow-unauthenticated
```

### 3. Deploy Frontend to Cloud Run

```bash
# Build image
cd frontend
gcloud builds submit --tag gcr.io/PROJECT_ID/chancen-frontend

# Deploy
gcloud run deploy chancen-frontend \
  --image gcr.io/PROJECT_ID/chancen-frontend \
  --platform managed \
  --region us-central1 \
  --memory 256Mi \
  --set-env-vars NEXT_PUBLIC_API_URL=https://chancen-backend-xxxxx.run.app/api/v1 \
  --allow-unauthenticated
```

### 4. Setup Cloud Load Balancer

```bash
# Create health checks
gcloud compute health-checks create http chancen-backend-health \
  --port=5000 \
  --request-path=/health

# Create backend service
gcloud compute backend-services create chancen-backend-service \
  --protocol=HTTP \
  --health-checks=chancen-backend-health \
  --load-balancing-scheme=EXTERNAL

# Add backends (Cloud Run services)
gcloud compute backend-services add-backend chancen-backend-service \
  --instance-group=chancen-backend-ig \
  --instance-group-zone=us-central1-a
```

---

## 🐳 Deployment Option 3: DigitalOcean (App Platform)

### 1. Push Code to GitHub

```bash
git remote add origin https://github.com/yourusername/chancen-system.git
git branch -M main
git push -u origin main
```

### 2. Create DigitalOcean App

```bash
# Create app.yaml
apiVersion: v1
name: chancen-system
services:
  - name: backend
    github:
      repo: yourusername/chancen-system
      branch: main
    build_command: cd backend && npm install && npm run build
    run_command: npm run start
    http_port: 5000
    envs:
      - key: DATABASE_URL
        scope: RUN_AND_BUILD_TIME
        value: postgresql://user:pass@host:5432/db
      - key: GEMINI_API_KEY
        scope: RUN_AND_BUILD_TIME
        value: ${GEMINI_API_KEY}
  - name: frontend
    github:
      repo: yourusername/chancen-system
      branch: main
    build_command: cd frontend && npm install && npm run build
    run_command: npm run start
    http_port: 3000
    envs:
      - key: NEXT_PUBLIC_API_URL
        value: https://chancen-system-api.ondigitalocean.app/api/v1
databases:
  - name: chancen-db
    engine: PG
    version: "15"
    production: true

# Deploy
doctl apps create --spec app.yaml
```

---

## 📊 Environment Variables (Production)

```bash
# Backend
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://chancen_user:STRONG_PASSWORD@db-host:5432/chancen_db
JWT_SECRET=VERY_STRONG_RANDOM_STRING_32_CHARS_MIN
GEMINI_API_KEY=YOUR_PRODUCTION_KEY
FRONTEND_URL=https://chancen.example.com
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=YOUR_SENDGRID_KEY
AWS_S3_BUCKET=chancen-prod-documents
AWS_ACCESS_KEY_ID=YOUR_AWS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET
REDIS_HOST=redis-host
REDIS_PORT=6379
LOG_LEVEL=warn
CORS_ORIGINS=https://chancen.example.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.chancen.example.com/api/v1
NEXT_PUBLIC_APP_NAME=Chancen International Rwanda
```

---

## 🔐 SSL/TLS Configuration

### Using Let's Encrypt with Certbot

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d chancen.example.com -d api.chancen.example.com

# Renew automatically
sudo certbot renew --dry-run
```

### Nginx Configuration Example

```nginx
server {
    listen 443 ssl http2;
    server_name chancen.example.com;

    ssl_certificate /etc/letsencrypt/live/chancen.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chancen.example.com/privkey.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 443 ssl http2;
    server_name api.chancen.example.com;

    ssl_certificate /etc/letsencrypt/live/chancen.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/chancen.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name chancen.example.com api.chancen.example.com;
    return 301 https://$server_name$request_uri;
}
```

---

## 📈 Monitoring & Logging

### Using CloudWatch (AWS)

```bash
# Create log groups
aws logs create-log-group --log-group-name /chancen/backend
aws logs create-log-group --log-group-name /chancen/frontend

# Create alarms
aws cloudwatch put-metric-alarm \
  --alarm-name chancen-backend-high-error-rate \
  --alarm-description "Alert if backend error rate is high" \
  --metric-name Errors \
  --namespace AWS/ECS \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

### Using Datadog or New Relic

```bash
# Add monitoring agent to backend
npm install --save @datadog/browser-rum

# Configure in code
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'YOUR_APP_ID',
  clientToken: 'YOUR_CLIENT_TOKEN',
  site: 'datadoghq.com',
  service: 'chancen-backend',
  env: 'production',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

datadogRum.startSessionReplayRecording();
```

---

## 🔄 Continuous Deployment (CI/CD)

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build backend
        run: cd backend && npm install && npm run build
      - name: Test backend
        run: cd backend && npm run test
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com
          docker build -t chancen-backend .
          docker tag chancen-backend:latest ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/chancen-backend:latest
          docker push ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.us-east-1.amazonaws.com/chancen-backend:latest
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster chancen-prod --service chancen-backend --force-new-deployment

  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build frontend
        run: cd frontend && npm install && npm run build
      - name: Test frontend
        run: cd frontend && npm run test
      - name: Deploy to Vercel
        run: |
          npm i -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🔍 Post-Deployment Verification

```bash
# Test API endpoints
curl -X GET https://api.chancen.example.com/api/v1/health

# Test database connection
psql postgresql://user:pass@db-host:5432/chancen_db -c "SELECT version();"

# Check frontend loads
curl -s https://chancen.example.com | grep -i "chancen"

# Test authentication
curl -X POST https://api.chancen.example.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@chancen.org","password":"PASSWORD"}'

# Check logs
docker logs chancen-backend
docker logs chancen-frontend
```

---

## 🚨 Incident Response

### Database Down
```bash
# Check status
aws rds describe-db-instances --db-instance-identifier chancen-db
# Restore from backup
aws rds restore-db-instance-from-db-snapshot --db-instance-identifier chancen-db-restored --db-snapshot-identifier snapshot-xxx
```

### High Error Rate
```bash
# Check logs
docker logs chancen-backend | tail -100
# Scale up servers
aws ecs update-service --cluster chancen-prod --service chancen-backend --desired-count 4
```

### SSL Certificate Expired
```bash
# Renew
sudo certbot renew --force-renewal
# Restart services
systemctl restart nginx
```

---

## 📚 References

- [AWS ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/)
- [Google Cloud Run](https://cloud.google.com/run/docs)
- [PostgreSQL Production Setup](https://www.postgresql.org/docs/15/admin.html)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

**Deployment Completed!** 🎉
