# Chancen International Rwanda - Frontend

Production-ready React/Next.js admin dashboard and student portal for AI-powered student lifecycle management.

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and fill in:
   - `NEXT_PUBLIC_API_URL`: Backend API URL
   - `NEXT_PUBLIC_FRONTEND_URL`: Frontend domain

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

4. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## Features

### Admin Dashboard
- **Overview/Metrics Dashboard**
  - Total applications, admitted, enrolled, employed, repaying (KPIs)
  - Real-time charts (applications over time, admission rate, employment rate)
  - Quick-access actions

- **Eligibility Rule Builder**
  - Visual rule creator: IF [condition] THEN [action]
  - No-code UI for defining screening criteria
  - Test rules on sample data before activation

- **Candidate Screening Dashboard**
  - Table of all applications with AI scores
  - Color-coded scores (green=high, yellow=medium, red=low)
  - One-click "Apply Selected Rule" button for bulk screening
  - AI reasoning/explainability for each score

- **Student Lifecycle Monitoring**
  - Search/filter students by ID, name, cohort
  - View: Application → Enrollment → Academic → Employment → ISA repayment
  - Timeline view of major milestones
  - Export reports

- **Analytics & Reports**
  - Cohort comparison (graduation rates, employment by program)
  - Repayment forecasting
  - Data visualizations

### Student Portal
- **Application Form**
  - Multi-step form with progress bar
  - Save and return functionality
  - Auto-fill from Google profile

- **Status Dashboard**
  - Application status tracking
  - Enrollment details if accepted
  - Quick links to next steps

- **Student Progress Hub**
  - Current semester courses and grades
  - GPA and attendance tracking
  - Certifications earned

- **Employment & Income Tracker**
  - Update employment status
  - Income tracking
  - ISA status monitoring

- **ISA Repayment Portal**
  - Monthly repayment amount owed
  - Repayment schedule and history
  - Payment status tracking
  - Download ISA agreement

## Pages Structure

```
src/pages/
├── index.js                    # Landing page
├── login.js                    # Login page
├── register.js                 # Registration page
├── admin/
│   ├── dashboard.js           # Admin dashboard
│   ├── screening.js           # Candidate screening
│   ├── rules.js               # Eligibility rules
│   └── students.js            # Student monitoring
└── student/
    ├── dashboard.js           # Student portal
    └── application.js         # Application form
```

## API Integration

All API calls use Axios with automatic token handling in `src/services/api.js`:

- **authService** - Authentication endpoints
- **applicationService** - Application management
- **screeningService** - AI screening
- **rulesService** - Eligibility rules
- **studentService** - Student monitoring
- **dashboardService** - Metrics and analytics

## Styling

- **Tailwind CSS** for utility-first styling
- **Chancen Green** (#2D7D4A) as primary color
- **Chancen Gold** (#D4AF37) for accents
- **Responsive Design** - mobile-first approach
- **Custom Components** - reusable UI elements

## Color Scheme

```
Primary:        #2D7D4A (Chancen Green)
Dark Green:     #1f5630
Light Green:    #4a9d6f
Accent:         #D4AF37 (Gold)
Gray:           #2C3E50
Light Gray:     #ECF0F1
```

## Deployment on Vercel

### Steps
1. Push repository to GitHub
2. Create new Vercel project
3. Connect GitHub repository
4. Configure environment variables in Vercel dashboard
5. Deploy

**Environment Variables for Vercel:**
- `NEXT_PUBLIC_API_URL` - Production backend URL
- `NEXT_PUBLIC_FRONTEND_URL` - Production frontend URL

### Production Build
```bash
npm run build
npm start
```

## Authentication Flow

1. User registers or logs in
2. JWT token stored in localStorage
3. Token automatically included in all API requests
4. Role-based routing (admin → admin dashboard, student → student portal)
5. Automatic logout on token expiration (401)

## Key Libraries

- **Next.js** - React framework with SSR/SSG
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **Recharts** - Data visualization
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library
- **date-fns** - Date utilities
- **Zustand** - State management (optional, ready to use)

## Development Tips

- **Hot Reload**: Changes automatically reflect on save
- **API Debugging**: Check Network tab in DevTools
- **Token Issues**: Clear localStorage if experiencing 401 errors
- **CORS**: Ensure backend CORS allows frontend domain

## Testing the Frontend

### 1. Register Account
```
Email: student@example.com
Password: password123
```

### 2. Login
Use registered credentials

### 3. View Dashboard
Navigate to `/admin/dashboard` (admin) or `/student/dashboard` (student)

### 4. Test Features
- View metrics and analytics
- Check application list
- Update student information

## Performance Optimization

- Code splitting with Next.js dynamic imports
- Image optimization
- CSS minification via Tailwind
- Lazy loading of components
- Efficient API calls with axios

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Troubleshooting

**Issue: 401 Unauthorized**
- Solution: Clear localStorage and re-login

**Issue: API connection refused**
- Solution: Ensure backend is running on correct port

**Issue: Styling not applied**
- Solution: Run `npm run build` and check CSS output

**Issue: Pages not loading**
- Solution: Check browser console for errors and API responses

## Environment Variables Reference

```
NEXT_PUBLIC_API_URL           - Backend API URL (e.g., http://localhost:3001/api)
NEXT_PUBLIC_FRONTEND_URL      - Frontend domain (e.g., http://localhost:3000)
```

## Support

For issues or questions about the frontend:
1. Check browser console for errors
2. Verify API connectivity in Network tab
3. Check backend logs
4. Review .env.local configuration

---

Built for Chancen International Rwanda | Production-Ready | AI-Powered Student Financing
