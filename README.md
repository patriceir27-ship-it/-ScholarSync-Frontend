# 🎓 ScholarSync Frontend

AI-Powered Student Funding and Scholarship Management Platform Frontend

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](#license)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Component Documentation](#component-documentation)
- [Color System](#color-system)
- [Authentication Flow](#authentication-flow)
- [Real-time Features](#real-time-features)
- [Performance Optimization](#performance-optimization)
- [Contributing](#contributing)

---

## ✨ Features

### Student Portal
- **Dashboard**: Overview of recommended scholarships and applications
- **Profile Management**: Complete student profile with academic information
- **Document Upload**: Upload and manage academic documents (transcripts, certificates)
- **Scholarship Discovery**: Browse, search, and filter scholarships
- **Recommendations**: AI-powered personalized scholarship recommendations
- **Applications**: Track and manage scholarship applications
- **AI Assistance**: Chatbot for questions and essay generation
- **Notifications**: Real-time updates on application status

### Sponsor Portal
- **Dashboard**: Comprehensive analytics and metrics
- **Scholarship Management**: Create, edit, and manage scholarships
- **Applicant Management**: View and evaluate student applications
- **AI Scoring**: Automated applicant scoring and ranking
- **Screening**: Batch applicant evaluation
- **Shortlist Management**: Select and manage final candidates
- **Interview Scheduling**: Schedule and track interviews
- **Communications**: Message center with applicants
- **Reports**: Export and analyze data

### Admin Dashboard
- **User Management**: Manage students, sponsors, and admins
- **System Analytics**: Platform-wide metrics
- **Content Moderation**: Review and moderate content
- **System Settings**: Platform configuration

### General Features
- **Multi-language Support**: English, French, Kinyarwanda
- **Dark/Light Mode**: Theme switching
- **Responsive Design**: Mobile, tablet, and desktop
- **Accessibility**: WCAG 2.1 AA compliant
- **Real-time Updates**: WebSocket integration
- **Progressive Web App**: Offline support

---

## 🛠 Tech Stack

### Core Framework
- **Next.js** ^14.0.0 - React framework with SSR/SSG
- **React** ^18.2.0 - UI library
- **TypeScript** ^5.3.3 - Type safety

### Styling
- **Tailwind CSS** ^3.4.1 - Utility-first CSS
- **PostCSS** ^8.4.32 - CSS processing
- **next-themes** ^0.2.1 - Theme management

### State Management
- **Zustand** ^4.4.1 - Lightweight state management
- **React Context** - Local state
- **React Hook Form** ^7.48.0 - Form state

### Data Fetching & API
- **Axios** ^1.6.2 - HTTP client
- **SWR** - Data fetching with caching (optional)

### Form Handling
- **React Hook Form** ^7.48.0 - Form state
- **Zod** ^3.22.4 - Schema validation
- **@hookform/resolvers** ^3.3.3 - Resolver for Zod

### UI Components & Charts
- **Recharts** ^2.10.3 - Charts and graphs
- **React Icons** ^4.12.0 - Icon library
- **Framer Motion** ^10.16.12 - Animations
- **React Dropzone** ^14.2.3 - File upload

### Authentication
- **NextAuth.js** ^4.24.5 - Authentication

### Date & Time
- **date-fns** ^2.30.0 - Date utilities

### Real-time Communication
- **Socket.IO Client** ^4.7.2 - Real-time updates

### SEO & Meta
- **next-seo** ^6.2.0 - SEO management

### Notifications
- **React Hot Toast** ^2.4.1 - Toast notifications

### Testing
- **Jest** ^29.7.0 - Testing framework
- **@testing-library/react** ^14.1.2 - React testing utilities

---

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Backend API running on http://localhost:5000

### Clone the Repository
```bash
git clone https://github.com/scholarsync/scholarsync-frontend.git
cd scholarsync-frontend
```

### Install Dependencies
```bash
npm install
# or
yarn install
```

### Setup Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_WS_URL=http://localhost:5000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth (for authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application Settings
NEXT_PUBLIC_APP_NAME=ScholarSync
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Scholarship Management
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_FEATURE_DARK_MODE=true
NEXT_PUBLIC_FEATURE_NOTIFICATIONS=true
NEXT_PUBLIC_FEATURE_RECOMMENDATIONS=true
NEXT_PUBLIC_FEATURE_AI_CHAT=true

# Analytics (Optional)
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id

# Sentry (Optional - Error tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

---

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Code Formatting
```bash
npm run format
```

### Type Checking
```bash
npm run type-check
```

### Testing
```bash
npm test
npm run test:watch
npm run test:coverage
```

---

## 📁 Project Structure

```
src/
├── app/                     # Next.js App Router
│   ├── auth/               # Authentication pages
│   ├── student/            # Student portal
│   ├── sponsor/            # Sponsor portal
│   ├── admin/              # Admin dashboard
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
│
├── components/
│   ├── common/             # Shared components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   │
│   ├── student/            # Student components
│   │   ├── StudentDashboard.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── ScholarshipCard.tsx
│   │   ├── ApplicationForm.tsx
│   │   ├── AIAssistant.tsx
│   │   └── ...
│   │
│   ├── sponsor/            # Sponsor components
│   │   ├── SponsorDashboard.tsx
│   │   ├── AnalyticsDashboard.tsx
│   │   ├── ApplicantTable.tsx
│   │   ├── ScoringPanel.tsx
│   │   └── ...
│   │
│   ├── forms/              # Form components
│   ├── charts/             # Chart components
│   └── layout/             # Layout components
│
├── context/                # React Context
│   ├── AuthContext.tsx
│   ├── UserContext.tsx
│   ├── NotificationContext.tsx
│   └── ThemeContext.tsx
│
├── hooks/                  # Custom hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   ├── useForm.ts
│   ├── useNotification.ts
│   └── ...
│
├── services/               # API services
│   ├── api.ts             # Base API client
│   ├── auth.service.ts
│   ├── student.service.ts
│   ├── scholarship.service.ts
│   └── ...
│
├── types/                  # TypeScript types
│   ├── index.ts
│   ├── student.types.ts
│   ├── sponsor.types.ts
│   └── ...
│
├── utils/                  # Helper functions
│   ├── constants.ts
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
│
├── styles/                 # Global styles
│   ├── variables.css
│   ├── typography.css
│   └── animations.css
│
└── public/                 # Static assets
    ├── images/
    ├── icons/
    └── documents/
```

---

## 🎨 Color System

The frontend uses a beautiful, accessible color palette designed for educational platforms.

### Primary Colors
- **Teal** (#0EA5E9): Main brand color for CTAs and primary actions
- **Purple** (#A855F7): AI features and special highlights
- **Green** (#10B981): Success states and achievements
- **Amber** (#F59E0B): Warnings and important information
- **Coral** (#FF6B6B): Error states and urgent actions

### Tailwind Configuration
See `tailwind.config.ts` for complete color configuration with all shades.

### Component Color Usage
- Buttons: Teal for primary, Green for success, Coral for danger
- Cards: Light blue background with teal borders
- Status indicators: Green (approved), Amber (pending), Coral (rejected)
- AI elements: Purple backgrounds and text

---

## 🔐 Authentication Flow

### Student Registration
1. User navigates to `/auth/student`
2. Fills registration form
3. Confirms email
4. Creates first profile
5. Redirected to student dashboard

### Sponsor Registration
1. User navigates to `/auth/sponsor`
2. Fills organization details
3. Confirms email and verifies organization
4. Creates organization profile
5. Redirected to sponsor dashboard

### Login
1. User enters credentials
2. API validates and returns JWT token
3. Token stored in secure HTTP-only cookie
4. User redirected based on role

### OAuth (Google)
1. User clicks "Login with Google"
2. Redirected to Google OAuth flow
3. Returns to app with OAuth token
4. User created/logged in automatically

### Protected Routes
- Student routes require `role === 'student'`
- Sponsor routes require `role === 'sponsor'`
- Admin routes require `role === 'admin'`
- Middleware checks token validity on each request

---

## 🔔 Real-time Features

### WebSocket Connection
```typescript
// Automatic connection on mount
// Connects to backend WebSocket server
// Handles reconnection automatically
```

### Events
```typescript
// Student events
'application:status_updated'
'scholarship:new_match'
'message:received'
'notification:new'

// Sponsor events
'application:received'
'application:status_changed'
'interview:scheduled'
'message:received'
```

### Usage
```typescript
import { useWebSocket } from '@/hooks/useWebSocket';

const MyComponent = () => {
  const { subscribe, unsubscribe } = useWebSocket();

  useEffect(() => {
    const unsubscribeFn = subscribe('application:status_updated', (data) => {
      console.log('Application status changed:', data);
    });

    return () => unsubscribeFn();
  }, []);
};
```

---

## ⚡ Performance Optimization

### Code Splitting
- Route-based code splitting with Next.js
- Component-level lazy loading
- Dynamic imports for heavy components

### Image Optimization
- Next.js Image component for automatic optimization
- Responsive images with srcSet
- Lazy loading for below-fold images

### Caching
- HTTP caching headers configured
- Service Worker for offline support
- Browser cache for static assets

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
# Check .next/static/chunks
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

### Mobile Features
- Touch-friendly buttons (44px minimum)
- Optimized navigation for small screens
- Modal-based forms on mobile
- Bottom sheet for selections

---

## ♿ Accessibility

### Standards Compliance
- WCAG 2.1 AA
- Section 508 compliant
- ARIA labels and descriptions
- Keyboard navigation support

### Features
- Color contrast > 4.5:1 for normal text
- Focus indicators on all interactive elements
- Alt text for all images
- Semantic HTML structure
- Screen reader support

### Testing
```bash
# Use axe DevTools browser extension
# Test with screen readers (NVDA, JAWS)
# Keyboard-only navigation testing
```

---

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Testing (Cypress - Optional)
```bash
npm run e2e
```

### Testing Patterns
- Component testing with React Testing Library
- Service testing with Jest
- Mock API responses

---

## 📊 Component Examples

### Using the StudentDashboard
```tsx
import { StudentDashboard } from '@/components/student/StudentDashboard';

export default function Page() {
  return (
    <div>
      <StudentDashboard />
    </div>
  );
}
```

### Using the ScholarshipCard
```tsx
import { ScholarshipCard } from '@/components/student/ScholarshipCard';

export default function Page() {
  const scholarship = {
    id: 'uuid',
    name: 'Excellence Award',
    amount: 50000,
    matchScore: 92
  };

  return <ScholarshipCard scholarship={scholarship} />;
}
```

### Using the AIAssistant
```tsx
import { AIAssistant } from '@/components/student/AIAssistant';

export default function Page() {
  return (
    <AIAssistant 
      context="scholarship_application"
      isOpen={true}
    />
  );
}
```

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Push to GitHub
git push origin main

# Vercel will automatically deploy
# Environment variables configured in Vercel dashboard
```

### Netlify
```bash
npm run build
# Deploy dist folder
```

### Docker
```bash
docker build -t scholarsync-frontend .
docker run -p 3000:3000 scholarsync-frontend
```

---

## 🐛 Debugging

### Enable Debug Mode
```bash
DEBUG=scholarsync:* npm run dev
```

### Browser DevTools
- React DevTools extension
- Redux DevTools (if using Redux)
- Network tab for API requests
- Console for errors and logs

### Common Issues

#### CORS Errors
- Check backend CORS configuration
- Verify API_URL environment variable
- Ensure backend is running

#### Authentication Errors
- Clear cookies and localStorage
- Check JWT token expiration
- Verify NextAuth configuration

#### Performance Issues
- Check Network tab for large payloads
- Use React DevTools Profiler
- Analyze bundle size with `npm run build`

---

## 📝 Contributing

### Branch Naming
- `feature/feature-name` - New features
- `fix/bug-name` - Bug fixes
- `docs/description` - Documentation updates
- `chore/task` - Maintenance tasks

### Commit Messages
```
feat: Add student recommendation UI
fix: Resolve scholarship card layout issue
docs: Update component documentation
chore: Update dependencies
```

### Pull Request Process
1. Create a feature branch
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Format code with Prettier
6. Submit a pull request

---

## 📜 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👥 Support

For support, email support@scholarsync.com or create an issue in the repository.

---

## 🗺️ Roadmap

- [x] Core platform functionality
- [x] AI-powered recommendations
- [x] Real-time notifications
- [ ] Mobile application
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Blockchain verification
- [ ] International expansion

---

## 📞 Contact

- **Email**: support@scholarsync.com
- **Website**: https://scholarsync.com
- **Twitter**: @scholarsync
- **LinkedIn**: ScholarSync Inc

---

**Built with ❤️ for students and sponsors worldwide**
