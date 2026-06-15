# Chancen System - Quick Start Guide

## 🚀 5-Minute Setup (Development)

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git
- Google Gemini API Key

### Step 1: Clone and Setup

```bash
# Clone repository
git clone <your-repo-url> chancen-system
cd chancen-system

# Copy environment files
cp .env.backend.example backend/.env
cp .env.frontend.example frontend/.env.local

# Edit .env files with your values (especially GEMINI_API_KEY)
```

### Step 2: Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# Wait 30 seconds for database to initialize
sleep 30

# View logs
docker-compose logs -f backend

# Check services
docker-compose ps
```

### Step 3: Access Application

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api/v1
API Docs: http://localhost:5000/api/docs
Database UI (Adminer): http://localhost:8080
Email UI (Mailhog): http://localhost:8025
```

### Step 4: Create Admin Account

```bash
# Connect to database via Adminer (http://localhost:8080)
# Or use psql command:

psql postgresql://chancen_user:chancen_password@localhost:5432/chancen_db

# Create admin user (password will be hashed by backend)
INSERT INTO users (email, password_hash, full_name, role, status) VALUES (
  'admin@chancen.org',
  'will_be_hashed_by_backend',
  'System Administrator',
  'admin',
  'active'
);
```

Or use the API:

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@chancen.org",
    "password": "AdminPass123!",
    "full_name": "System Administrator",
    "role": "admin"
  }'
```

### Step 5: Login and Explore

1. Open http://localhost:3000
2. Login with admin credentials
3. Navigate to Admin Dashboard
4. Start creating screening rules
5. View sample applications

---

## 🎯 Manual Setup (Without Docker)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with database and API keys

# Create database
createdb chancen_db
PGPASSWORD=password psql -U postgres -d chancen_db -f ../00_chancen_database_schema.sql

# Run migrations
npm run db:migrate

# Start backend
npm run dev
# Backend runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with API URL

# Start frontend
npm run dev
# Frontend runs on http://localhost:3000
```

### Redis Setup (for jobs)

```bash
# Mac
brew install redis
redis-server

# Linux
sudo apt-get install redis-server
redis-server

# Docker
docker run -d -p 6379:6379 redis:7-alpine
```

---

## 📝 Common Tasks

### Create a Screening Rule

```bash
curl -X POST http://localhost:5000/api/v1/admin/rules \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "High Achievers",
    "description": "Accept students with 80+ score",
    "rule_definition": {
      "conditions": [
        {
          "field": "academic_score",
          "operator": ">=",
          "value": 80
        }
      ],
      "weight": 1.0,
      "impact": "positive"
    }
  }'
```

### Submit Test Application

```bash
curl -X POST http://localhost:5000/api/v1/applications \
  -H "Authorization: Bearer <student_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "program_id": "prog_001",
    "academic_score": 85,
    "personal_statement": "I am a dedicated student...",
    "motivation_statement": "I want to study because...",
    "socioeconomic_level": "low",
    "household_monthly_income": 500000,
    "dependents_count": 2
  }'
```

### Trigger AI Screening

```bash
curl -X POST http://localhost:5000/api/v1/admin/applications/{app_id}/screen \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json"
```

### Get Screening Result

```bash
curl -X GET http://localhost:5000/api/v1/admin/applications/{app_id}/screening \
  -H "Authorization: Bearer <admin_token>"
```

### Make Admission Decision

```bash
curl -X POST http://localhost:5000/api/v1/admin/applications/{app_id}/decide \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "accepted",
    "notes": "Strong candidate",
    "send_email_notification": true
  }'
```

---

## 🧪 Testing

### Backend Tests

```bash
cd backend

# Unit tests
npm run test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend

# Component tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 📊 Database Queries

### View All Applications

```sql
SELECT * FROM applications ORDER BY created_at DESC;
```

### Count Applications by Status

```sql
SELECT status, COUNT(*) as count FROM applications GROUP BY status;
```

### View Screening Results

```sql
SELECT 
  sr.id,
  a.program_name,
  sr.final_score,
  sr.recommendation,
  sr.screened_at
FROM screening_results sr
JOIN applications a ON sr.application_id = a.id
ORDER BY sr.screened_at DESC;
```

### Get ISA Summary for Student

```sql
SELECT 
  s.user_id,
  s.program_name,
  i.status,
  i.amount_financed,
  i.total_repaid,
  s.current_salary
FROM students s
LEFT JOIN isa_agreements i ON s.id = i.student_id
WHERE s.user_id = 'user_id_here';
```

---

## 🔧 Troubleshooting

### Docker Issues

```bash
# Check container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database

# Restart specific service
docker-compose restart backend

# Full reset
docker-compose down -v
docker-compose up -d
```

### Database Connection Issues

```bash
# Test connection
psql postgresql://chancen_user:chancen_password@localhost:5432/chancen_db

# Check migrations
SELECT * FROM pg_tables WHERE schemaname = 'public';

# Reset database (careful!)
docker-compose exec database psql -U chancen_user -d chancen_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker-compose exec backend npm run db:migrate
```

### API Not Responding

```bash
# Check backend logs
docker-compose logs backend

# Test API endpoint
curl http://localhost:5000/api/v1/health

# Check port availability
lsof -i :5000
```

### Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Clear Next.js cache
rm -rf frontend/.next
docker-compose restart frontend
```

---

## 🌐 Environment Variables Reference

### Critical Backend Variables
- `GEMINI_API_KEY` - Required for AI screening
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Must be strong and unique
- `REDIS_HOST` - For background jobs

### Critical Frontend Variables
- `NEXT_PUBLIC_API_URL` - Backend API endpoint

---

## 📚 Next Steps

1. **Read Full Documentation**: `CHANCEN_SYSTEM_README.md`
2. **API Reference**: `API_ROUTES.md`
3. **Database Schema**: `00_chancen_database_schema.sql`
4. **Deploy to Production**: See `DEPLOYMENT_GUIDE.md`

---

## 💡 Tips

- Use Mailhog (localhost:8025) to view emails during development
- Use Adminer (localhost:8080) to browse database
- Enable `LOG_LEVEL=debug` for detailed logging
- Test rules before deploying with `/admin/rules/:id/test` endpoint
- Use mock data to test workflows without Gemini API calls

---

## 🆘 Getting Help

1. Check logs: `docker-compose logs -f`
2. Review API docs at `/api/docs`
3. Check database health
4. Verify all environment variables
5. Restart containers: `docker-compose restart`

---

## 🚢 Production Deployment

See `DEPLOYMENT_GUIDE.md` for complete production setup instructions.

---

**Happy coding!** 🎉
