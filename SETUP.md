# ScholarSync Frontend - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your backend URL
```

### 3. Run Development Server
```bash
npm run dev
```

App runs on: `http://localhost:3000`

## Available Routes

### Public Routes
- `/` - Landing page
- `/auth/login` - Login
- `/auth/student` - Student registration
- `/auth/sponsor` - Sponsor registration

### Student Routes (Protected)
- `/student` - Student dashboard
- `/student/profile` - Edit profile
- `/student/discover` - Find scholarships
- `/student/recommendations` - AI recommendations
- `/student/applications` - Track applications
- `/student/ai-assistance` - AI chatbot
- `/student/documents` - Manage documents

### Sponsor Routes (Protected)
- `/sponsor` - Sponsor dashboard
- `/sponsor/scholarships` - Manage scholarships
- `/sponsor/applicants` - View applicants
- `/sponsor/screening` - Screen applications
- `/sponsor/communications` - Messages

## Key Components Created

- Authentication pages (login, register)
- Student dashboard
- Sponsor dashboard
- API integration service
- Utility functions

## Configuration

### Required Environment Variables
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

## Building for Production

```bash
npm run build
npm start
```

## Features Included

✅ Student Registration
✅ Sponsor Registration
✅ Login/Logout
✅ Protected Routes
✅ API Integration
✅ Toast Notifications
✅ Responsive Design
✅ Tailwind CSS Styling

## Color Scheme

- **Teal** (#0EA5E9) - Primary brand color
- **Purple** (#A855F7) - AI features
- **Green** (#10B981) - Success states
- **Amber** (#F59E0B) - Warnings
- **Coral** (#FF6B6B) - Errors

## Project Structure

```
src/
├── app/                      # Next.js pages
│   ├── page.tsx             # Home/Landing
│   ├── auth/                # Authentication
│   ├── student/             # Student portal
│   └── sponsor/             # Sponsor portal
├── components/              # Reusable components
├── services/                # API services
├── utils/                   # Helper functions
├── hooks/                   # Custom hooks
├── types/                   # TypeScript types
└── styles/                  # CSS files
```

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint

# Format code
npm run format
```

## Styling with Tailwind CSS

The project uses Tailwind CSS with custom ScholarSync color palette:

```html
<!-- Teal primary button -->
<button className="bg-scholar-600 text-white">Primary</button>

<!-- Purple AI button -->
<button className="bg-ai-600 text-white">AI Feature</button>

<!-- Green success -->
<div className="bg-green-600">Success</div>
```

## Authentication Flow

1. User registers/logs in
2. Token stored in localStorage
3. Token added to API requests via interceptor
4. Protected routes check authentication

## API Integration

All API calls use the centralized `services/api.ts`:

```typescript
import { studentService } from '@/services/api'

const profile = await studentService.getProfile()
```

## Deployment

Ready to deploy to:
- Vercel (recommended)
- Netlify
- AWS Amplify
- Any Node.js hosting

## Troubleshooting

**Port 3000 in use:**
```bash
lsof -i :3000
kill -9 <PID>
```

**Module not found:**
```bash
npm install
npm run build
```

**API connection failing:**
- Check `.env.local` API URL
- Ensure backend is running
- Check CORS configuration

## Next Steps

1. ✅ Run `npm install`
2. ✅ Configure `.env.local`
3. ✅ Run `npm run dev`
4. ✅ Create user account
5. ✅ Explore dashboards

For production, update environment variables and build accordingly.
