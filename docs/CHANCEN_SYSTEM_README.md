# Chancen International Rwanda - AI-Powered Admissions & Student Lifecycle Management System

## 🎯 Overview

A production-ready full-stack system designed for **Chancen International Rwanda**, a social enterprise specializing in Income Share Agreement (ISA) financing for tertiary and vocational education. This system automates student recruitment, selection, enrollment, academic progress tracking, employability monitoring, and ISA repayment tracking.

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js + React)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Admin Portal │  │Student Portal │  │Finance Panel │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────────┘
                              ↓ (REST API)
┌─────────────────────────────────────────────────────────────┐
│               Backend (Express + TypeScript)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Core Services                                  │ │
│  │  • Auth & RBAC      • Rule Engine                     │ │
│  │  • AI Screening     • Application Processing          │ │
│  │  • Monitoring       • ISA Repayment Tracking          │ │
│  └────────────────────────────────────────────────────────┘ │
│         ↓                         ↓                          │
│  ┌──────────────┐        ┌──────────────┐                  │
│  │ PostgreSQL   │        │ Gemini API   │                  │
│  │ Database     │        │ (AI Screening)                  │
│  └──────────────┘        └──────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Key Features

### 1. **Automated Student Recruitment**
- Rule-based candidate screening using predefined eligibility criteria
- Academic score filtering
- Socioeconomic indicator assessment
- Program preference matching
- Configurable admin rules (no-code interface)

### 2. **AI-Powered Candidate Screening & Ranking**
- Gemini API integration for intelligent candidate ranking
- Multi-factor scoring (academic, socioeconomic, career alignment)
- Automated recommendation system
- Explainable AI decisions

### 3. **End-to-End Student Lifecycle Management**
- **Application Stage**: Form submission, document upload
- **Selection Stage**: Automated filtering, AI ranking, admin decisions
- **Enrollment Stage**: Student onboarding, program assignment
- **Academic Progress**: Real-time GPA tracking, course performance
- **Employability Tracking**: Job placement, salary range monitoring
- **ISA Repayment**: Income monitoring, payment tracking, completion status

### 4. **Role-Based Access Control (RBAC)**
- **Admin**: Full system control, rule management, analytics
- **Recruiter**: Application screening, candidate communication
- **Student**: Personal dashboard, application tracking, ISA status
- **Finance/Monitoring**: Repayment tracking, employment verification

### 5. **Advanced Analytics & Monitoring**
- Real-time student progress dashboards
- Employment outcomes reporting
- ISA repayment statistics
- Cohort analysis
- Impact metrics visualization

---

## 🏗️ System Architecture Details

### Backend Structure
```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # Database connection
│   │   ├── gemini.ts        # Gemini API config
│   │   └── env.ts           # Environment validation
│   │
│   ├── models/              # Database models
│   │   ├── User.ts
│   │   ├── Application.ts
│   │   ├── Student.ts
│   │   ├── Rule.ts
│   │   ├── ScreeningResult.ts
│   │   └── ISARepayment.ts
│   │
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── application.service.ts
│   │   ├── ai-screening.service.ts    # Gemini integration
│   │   ├── rule-engine.service.ts     # Rule evaluation
│   │   ├── student-monitoring.service.ts
│   │   └── isa-tracking.service.ts
│   │
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── application.controller.ts
│   │   ├── admin.controller.ts
│   │   └── monitoring.controller.ts
│   │
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── application.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── student.routes.ts
│   │   └── monitoring.routes.ts
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── errorHandler.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── validators.ts
│   │   ├── transformers.ts
│   │   └── helpers.ts
│   │
│   ├── types/               # TypeScript types
│   │   ├── index.ts
│   │   ├── user.types.ts
│   │   ├── application.types.ts
│   │   └── rule.types.ts
│   │
│   ├── jobs/                # Background jobs
│   │   ├── employment-verification.job.ts
│   │   ├── isa-repayment-check.job.ts
│   │   └── scheduler.ts
│   │
│   └── index.ts             # Server entry point
│
├── docker/                  # Docker configuration
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   ├── globals.css      # Global styles
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── applications/
│   │   │   ├── rules/           # Rule builder
│   │   │   ├── students/
│   │   │   ├── analytics/       # Dashboards
│   │   │   └── isa-tracking/
│   │   │
│   │   ├── recruiter/
│   │   │   ├── dashboard/
│   │   │   ├── candidates/
│   │   │   └── screening/
│   │   │
│   │   ├── student/
│   │   │   ├── dashboard/
│   │   │   ├── application/
│   │   │   ├── progress/
│   │   │   └── isa-status/
│   │   │
│   │   └── finance/
│   │       ├── dashboard/
│   │       ├── repayment-tracking/
│   │       └── reports/
│   │
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── RuleBuilder.tsx
│   │   │   ├── ApplicationReview.tsx
│   │   │   ├── StudentList.tsx
│   │   │   └── AnalyticsDashboard.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── RuleForm.tsx
│   │   │   └── FilterForm.tsx
│   │   │
│   │   ├── charts/
│   │   │   ├── EmploymentChart.tsx
│   │   │   ├── RepaymentChart.tsx
│   │   │   └── CohortAnalysis.tsx
│   │   │
│   │   └── student/
│   │       ├── ApplicationStatus.tsx
│   │       ├── ProgressTracker.tsx
│   │       └── ISADashboard.tsx
│   │
│   ├── services/
│   │   ├── api.ts                # API client
│   │   ├── auth.service.ts
│   │   ├── application.service.ts
│   │   ├── admin.service.ts
│   │   └── monitoring.service.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApplication.ts
│   │   └── useMonitoring.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── RuleContext.tsx
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── user.types.ts
│   │   ├── application.types.ts
│   │   └── rule.types.ts
│   │
│   ├── utils/
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   └── styles/
│       ├── colors.ts            # Chancen brand colors
│       ├── theme.ts
│       └── tailwind.css
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── next.config.js
├── tailwind.config.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## 🗄️ Database Schema (PostgreSQL)

### Core Tables

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL, -- admin, recruiter, student, finance
  status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended
  profile_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Applications
```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  program_id VARCHAR(255),
  status VARCHAR(50), -- draft, submitted, screening, reviewed, accepted, rejected
  academic_score DECIMAL(5,2),
  personal_statement TEXT,
  documents JSONB,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Students (After Enrollment)
```sql
CREATE TABLE students (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  application_id UUID REFERENCES applications(id),
  enrollment_date DATE,
  program_name VARCHAR(255),
  institution_name VARCHAR(255),
  expected_graduation DATE,
  current_gpa DECIMAL(3,2),
  academic_status VARCHAR(50), -- active, on-track, at-risk, graduated
  employment_status VARCHAR(50), -- not_employed, employed, self_employed
  employment_date DATE,
  current_salary DECIMAL(12,2),
  salary_currency VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Rules
```sql
CREATE TABLE rules (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  rule_definition JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  weight DECIMAL(3,2) DEFAULT 1.0,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Screening Results
```sql
CREATE TABLE screening_results (
  id UUID PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id),
  rule_evaluation_score DECIMAL(5,2),
  ai_score DECIMAL(5,2),
  final_score DECIMAL(5,2),
  recommendation VARCHAR(50), -- accept, reject, review
  explanation TEXT,
  screened_by UUID REFERENCES users(id),
  screened_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### ISA Repayment
```sql
CREATE TABLE isa_agreements (
  id UUID PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES students(id),
  amount_financed DECIMAL(12,2),
  monthly_salary_threshold DECIMAL(12,2), -- 80,000 RWF
  repayment_percentage DECIMAL(4,3), -- e.g., 0.10 for 10%
  status VARCHAR(50) DEFAULT 'active', -- active, completed, defaulted
  started_at DATE,
  completed_at DATE,
  total_repaid DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE isa_payments (
  id UUID PRIMARY KEY,
  agreement_id UUID NOT NULL REFERENCES isa_agreements(id),
  payment_amount DECIMAL(12,2),
  payment_date DATE,
  income_reported DECIMAL(12,2),
  verification_status VARCHAR(50), -- pending, verified, disputed
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose
- Google Cloud Project with Gemini API enabled

### Environment Variables

**Backend (.env)**
```
# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://chancen.example.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/chancen_db

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRY=7d

# Gemini API
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# File Storage (S3 or local)
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_S3_BUCKET=chancen-documents

# Background Jobs
BULL_REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=https://api.chancen.example.com
NEXT_PUBLIC_APP_NAME=Chancen International Rwanda
NEXT_PUBLIC_BRAND_COLOR=#22C55E
```

### Quick Start - Docker Compose

```bash
# Clone repository
git clone <repository-url>
cd chancen-system

# Build and start services
docker-compose up -d

# Initialize database
docker-compose exec backend npm run db:migrate

# Open application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/api/docs
```

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run build
npm run db:migrate
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📚 API Documentation

### Authentication
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Applications
```
POST /api/v1/applications              # Submit application
GET /api/v1/applications/:id           # Get application details
PUT /api/v1/applications/:id           # Update application
POST /api/v1/applications/:id/submit   # Submit for review
```

### Admin - Rule Management
```
GET /api/v1/admin/rules                # List all rules
POST /api/v1/admin/rules               # Create rule
PUT /api/v1/admin/rules/:id            # Update rule
DELETE /api/v1/admin/rules/:id         # Delete rule
POST /api/v1/admin/rules/:id/test      # Test rule with sample data
```

### Admin - Screening & Decisions
```
GET /api/v1/admin/applications/pending # List pending applications
POST /api/v1/admin/applications/:id/screen     # Trigger screening
GET /api/v1/admin/applications/:id/screening   # Get screening result
POST /api/v1/admin/applications/:id/decide     # Make final decision
```

### Student Monitoring
```
GET /api/v1/students/:id/progress      # Get academic progress
GET /api/v1/students/:id/employment    # Get employment status
GET /api/v1/students/:id/isa-status    # Get ISA repayment status
```

### Analytics
```
GET /api/v1/analytics/cohort            # Cohort analysis
GET /api/v1/analytics/employment        # Employment statistics
GET /api/v1/analytics/isa-performance   # ISA repayment metrics
GET /api/v1/analytics/impact            # Overall impact metrics
```

---

## 🎨 Design System - Chancen Brand Colors

**Primary Colors:**
- **Chancen Green**: `#22C55E` (rgba(34, 197, 94, 1))
- **Dark Green**: `#16A34A`
- **Light Green**: `#DCF7DC`
- **White**: `#FFFFFF`

**Secondary Colors:**
- **Blue**: `#3B82F6` (for data visualization)
- **Orange**: `#F97316` (for important alerts)
- **Gray**: `#6B7280` (for neutral elements)

**Typography:**
- Primary Font: Inter or Open Sans
- Headings: Bold, Dark Green
- Body: Regular, Dark Gray
- Accent: Bold, Chancen Green

---

## 🔒 Security Features

1. **JWT-based Authentication**
   - Secure token generation and validation
   - Token refresh mechanism
   - Expiry management

2. **Role-Based Access Control (RBAC)**
   - Granular permission system
   - Route-level authorization
   - Data-level isolation

3. **Data Encryption**
   - Sensitive fields encrypted in database
   - TLS for data in transit
   - Secure password hashing (bcrypt)

4. **Input Validation**
   - Server-side validation for all inputs
   - Type checking with TypeScript
   - Sanitization of user input

5. **Rate Limiting**
   - API rate limiting to prevent abuse
   - Per-user and per-IP rate limits

---

## 📊 AI Screening & Rule Engine

### Rule Definition Format
```json
{
  "name": "High Academic Achievement",
  "conditions": [
    {
      "field": "academic_score",
      "operator": ">=",
      "value": 80
    },
    {
      "field": "socioeconomic_level",
      "operator": "in",
      "value": ["low", "very_low"]
    }
  ],
  "weight": 1.5,
  "impact": "positive"
}
```

### AI Screening Process
1. **Extract Features** from application data
2. **Evaluate Rules** against all rules
3. **Generate AI Score** using Gemini API
4. **Combine Scores** (weighted average)
5. **Generate Recommendation** (accept/reject/review)
6. **Provide Explanation** for decision

---

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test              # Unit tests
npm run test:integration  # Integration tests
npm run test:coverage     # Coverage report

# Frontend tests
cd frontend
npm run test              # Component tests
npm run test:e2e          # End-to-end tests
```

---

## 📈 Monitoring & Logging

### Application Metrics
- Request/response times
- Error rates
- API endpoint usage
- Authentication success rates
- Rule evaluation performance
- AI scoring performance

### Logs
- Application logs: `/logs/app.log`
- Error logs: `/logs/error.log`
- API access logs: `/logs/access.log`
- Job execution logs: `/logs/jobs.log`

---

## 🚢 Deployment

### Docker Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes Deployment (Optional)
See `k8s/` directory for Helm charts and manifests.

### Cloud Deployment
- **AWS**: ECS + RDS PostgreSQL
- **Google Cloud**: Cloud Run + Cloud SQL
- **Azure**: App Service + Azure Database

---

## 📝 Contributing

1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/feature-name`
4. Create Pull Request

---

## 📞 Support & Contact

For questions or support, contact: support@chancen.org

---

## 📄 License

This project is proprietary software for Chancen International Rwanda.

---

## 🙏 Acknowledgments

Built for Chancen International Rwanda - enabling access to education through innovative financing.

**Version**: 1.0.0  
**Last Updated**: June 2026  
**Status**: Production Ready
