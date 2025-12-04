# 🚀 ECOVA - Production-Ready Next.js Boilerplate

A comprehensive, production-grade Next.js 16 boilerplate with TypeScript, Redux Toolkit, Sentry monitoring, Microsoft Clarity analytics, Tailwind CSS v4, global toast notifications, sound system, keyboard navigation, and enterprise-level best practices.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Dependencies Overview](#-dependencies-overview)
- [Development Workflow](#-development-workflow)
- [Code Quality & Standards](#-code-quality--standards)
- [Design System](#-design-system)
- [State Management](#-state-management)
- [API Client](#-api-client)
- [Toast Notifications](#-toast-notifications)
- [Sound System](#-sound-system)
- [Keyboard Navigation](#-keyboard-navigation)
- [Test Page](#-test-page)
- [Monitoring & Analytics](#-monitoring--analytics)
- [Deployment](#-deployment)
- [CI/CD](#-cicd)
- [Best Practices](#-best-practices)

---

## 🛠 Tech Stack

### Core Framework
- **Next.js 16.0.4** - React framework with App Router
- **React 19.2.0** - Latest React with Server Components support
- **TypeScript 5.9.3** - Type-safe development

### Styling & UI
- **Tailwind CSS v4.1.17** - Utility-first CSS framework
- **ShadCN UI** - High-quality component library
- **Lucide React** - Icon library
- **class-variance-authority** - Component variant management
- **clsx & tailwind-merge** - Conditional class utilities

### State Management
- **Redux Toolkit 2.11.0** - Modern Redux with best practices
- **React Redux 9.2.0** - React bindings for Redux

### API & Data Fetching
- **Axios 1.13.2** - HTTP client with interceptors

### Monitoring & Analytics
- **Sentry 10.27.0** - Error tracking & performance monitoring
- **Microsoft Clarity** - User behavior analytics (optional)

### Development Tools
- **ESLint 9.39.1** - Code linting
- **Prettier 3.6.2** - Code formatting
- **Husky 9.1.7** - Git hooks
- **lint-staged 16.2.7** - Pre-commit linting
- **Zod** - Runtime type validation for environment variables

---

## ✨ Key Features

### ✅ Production-Ready Architecture
- **Server Components** by default for optimal performance
- **Client Components** only where needed (interactivity)
- **Type-safe** environment variable validation with Zod
- **Error boundaries** with Sentry integration
- **Web Vitals** tracking

### ✅ Developer Experience
- **Path aliases** (`@/*`, `@constants/*`, `@types/*`, `@interfaces/*`)
- **Strict TypeScript** configuration
- **ESLint + Prettier** with auto-formatting
- **Pre-commit hooks** for code quality
- **Hot reload** development server

### ✅ Monitoring & Analytics
- **Sentry** for error tracking (client, server, edge)
- **Microsoft Clarity** for user behavior analytics
- **Web Vitals** performance metrics

### ✅ Design System
- **Centralized theme** management
- **CSS variables** generated from TypeScript
- **Dark mode** support
- **Responsive** design utilities

### ✅ State Management
- **Redux Toolkit** with async thunks
- **Type-safe** Redux hooks
- **Modular** slice architecture

### ✅ User Experience Features
- **Global Toast Notifications** - React Toastify integration
- **Sound System** - Web Audio API with volume control
- **Keyboard Navigation** - Global keyboard shortcuts
- **Test Page** - Comprehensive component testing interface

---

## 📁 Project Structure

```
my-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── sentry-example-api/   # Example API route
│   ├── test/                     # Test pages
│   │   └── page.tsx              # Component test page
│   ├── globals.css               # Global styles
│   ├── layout.tsx               # Root layout (Server Component)
│   ├── page.tsx                 # Home page
│   ├── global-error.tsx         # Global error boundary
│   └── reportWebVitals.ts       # Web Vitals reporting
│
├── components/                   # React components
│   ├── analytics/               # Analytics components
│   │   └── clarity.tsx          # Microsoft Clarity integration
│   ├── test/                    # Test components
│   │   └── color-palette.tsx    # Color palette display
│   ├── ui/                      # ShadCN UI components
│   │   └── theme-toggle.tsx     # Theme switcher
│   ├── keyboard-shortcuts.tsx   # Keyboard navigation wrapper
│   ├── sound-settings.tsx       # Sound settings UI
│   └── skeleton/                # Loading skeletons
│
├── hooks/                        # Custom React hooks
│   └── use-keyboard-navigation.ts # Keyboard navigation hook
│
├── lib/                         # Core library code
│   ├── api/                     # API clients
│   │   └── clients.tsx          # Axios instance with interceptors
│   ├── constants/               # App constants
│   │   ├── app.ts               # App-wide constants
│   │   ├── roles.ts             # User roles
│   │   ├── storage.ts           # LocalStorage keys
│   │   └── urls.ts              # API endpoints
│   ├── interface/               # TypeScript interfaces
│   │   ├── layout.ts            # Layout interfaces
│   │   ├── pagination.ts        # Pagination types
│   │   └── user.ts              # User types
│   ├── slices/                  # Redux slices
│   │   └── authSlice.ts         # Authentication slice
│   ├── types/                   # Type definitions
│   │   ├── api.d.ts             # API response types
│   │   ├── clarity.d.ts         # Clarity types
│   │   ├── common.d.ts          # Common types
│   │   ├── env.ts               # Environment validation (Zod)
│   │   └── redux.d.ts           # Redux types
│   ├── utils/                   # Utility functions
│   │   ├── logger.ts            # Logging utility
│   │   ├── sound.ts             # Sound service (Web Audio API)
│   │   ├── toast.ts             # Toast notification service
│   │   └── utils.ts             # General utilities (cn function)
│   └── store.ts                 # Redux store configuration
│
├── providers/                   # React context providers
│   ├── theme-provider.tsx       # Theme context provider
│   └── toast-provider.tsx       # Toast notifications provider
│
├── scripts/                     # Build scripts
│   └── generate-tokens.ts       # Generate CSS tokens from theme
│
├── styles/                      # Styling files
│   ├── fonts.ts                 # Font configurations
│   ├── theme.ts                 # Theme definitions (source of truth)
│   ├── tokens.css               # Generated CSS variables (auto-generated)
│   └── typography.ts            # Typography scale
│
├── public/                      # Static assets
│
├── .github/                     # GitHub configurations
│   └── workflows/
│       └── ci.yml               # CI/CD pipeline
│
├── instrumentation.ts           # Sentry server instrumentation
├── instrumentation-client.ts    # Sentry client instrumentation
├── sentry.server.config.ts      # Sentry server config
├── sentry.edge.config.ts        # Sentry edge config
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── eslint.config.mjs            # ESLint configuration
├── postcss.config.mjs           # PostCSS configuration
├── components.json              # ShadCN UI configuration
└── package.json                 # Dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** or **pnpm**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

4. **Generate design tokens**
   ```bash
   npm run generate:tokens
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

---

## 🔐 Environment Variables

### Required Variables

Create `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com

# Environment
NEXT_PUBLIC_APP_ENV=development  # or 'production'
```

### Optional Variables

```bash
# Microsoft Clarity (Analytics)
NEXT_PUBLIC_CLARITY_ID=your_clarity_project_id

# Sentry (configured via sentry config files)
# Sentry DSN is hardcoded in config files - update for production
```

### Environment Validation

All environment variables are validated at build time using **Zod**:

- **Location**: `lib/types/env.ts`
- **Validation**: Runtime type checking
- **Error**: Build fails if required vars are missing or invalid

### Environment Files

- `.env.local` - Local development (gitignored)
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.sentry-build-plugin` - Sentry build config (gitignored)

---

## 📦 Dependencies Overview

### Production Dependencies

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `next` | 16.0.4 | React framework | Latest App Router |
| `react` | 19.2.0 | UI library | Latest React |
| `@reduxjs/toolkit` | 2.11.0 | State management | Modern Redux |
| `react-redux` | 9.2.0 | Redux React bindings | Type-safe hooks |
| `axios` | 1.13.2 | HTTP client | Interceptors configured |
| `@sentry/nextjs` | 10.27.0 | Error monitoring | Full-stack tracking |
| `tailwindcss` | 4.1.17 | CSS framework | Latest v4 |
| `lucide-react` | 0.554.0 | Icons | Tree-shakeable |
| `clsx` | 2.1.1 | Class utilities | Conditional classes |
| `tailwind-merge` | 3.4.0 | Tailwind merge | Conflict resolution |
| `class-variance-authority` | 0.7.1 | Component variants | Type-safe variants |
| `react-toastify` | Latest | Toast notifications | Global notification system |
| `zod` | 4.1.13 | Runtime validation | Environment variable validation |

### Development Dependencies

| Package | Version | Purpose | Notes |
|---------|---------|---------|-------|
| `typescript` | 5.9.3 | Type checking | Strict mode enabled |
| `eslint` | 9.39.1 | Linting | Next.js config |
| `prettier` | 3.6.2 | Code formatting | Auto-format on save |
| `husky` | 9.1.7 | Git hooks | Pre-commit checks |
| `lint-staged` | 16.2.7 | Staged linting | Only changed files |
| `@typescript-eslint/*` | 8.48.0 | TS ESLint rules | Type-aware linting |
| `prettier-plugin-tailwindcss` | 0.7.1 | Tailwind formatting | Class sorting |

### Missing Dependencies (Consider Adding)

- **`@tanstack/react-query`** - Consider for server state management
- **`react-hook-form`** - Form handling
- **`date-fns`** - Date utilities
- **`react-error-boundary`** - Error boundaries

---

## 💻 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start dev server (port 3000)
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run generate:tokens # Generate CSS tokens from theme.ts

# Git Hooks (automatic)
npm run prepare         # Setup Husky hooks
```

### Pre-commit Hooks

Husky automatically runs on every commit:

1. **ESLint** - Lints staged `.ts` and `.tsx` files
2. **Prettier** - Formats staged files

To bypass (not recommended):
```bash
git commit --no-verify
```

### Code Formatting

- **Prettier** config: `.prettierrc`
- **Auto-format**: On save (VS Code) or pre-commit
- **Tailwind classes**: Automatically sorted

---

## 🎨 Design System

### Theme Architecture

The design system follows a **single source of truth** pattern:

1. **Define colors** in `styles/theme.ts` (TypeScript)
2. **Generate CSS variables** via `npm run generate:tokens`
3. **Use in Tailwind** via `tailwind.config.ts`
4. **Never edit** `styles/tokens.css` manually

### Theme Structure

```typescript
// styles/theme.ts
export const theme = {
  colors: {
    brand: { primary, primaryLight, primaryDark, ... },
    status: { success, error, warning, info },
    background: { default, muted, dark, surface, card },
    text: { primary, secondary, disabled },
    accent: { blue, yellow, purple, pink, green },
    border: { default, dark }
  }
}
```

### Using Theme Colors

```tsx
// In components
<div className="bg-primary text-text-primary">
  Content
</div>

// Dark mode support
<div className="bg-primary dark:bg-primary-dark">
  Content
</div>
```

### Typography

- **Fonts**: Geist Sans & Geist Mono (from Google Fonts)
- **Scale**: Defined in `styles/typography.ts`
- **Usage**: Via Tailwind classes (`text-sm`, `text-lg`, etc.)

### Dark Mode

- **Toggle**: `<ThemeToggle />` component
- **Provider**: `ThemeProvider` wraps app
- **Storage**: Persisted in localStorage
- **Implementation**: CSS class-based (`dark` class on `<html>`)

---

## 🔄 State Management

### Redux Store Setup

**Location**: `lib/store.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### Using Redux in Components

```tsx
'use client'

import { useDispatch, useSelector } from 'react-redux'
import { login } from '@/lib/slices/authSlice'
import type { RootState } from '@/lib/store'

export function LoginForm() {
  const dispatch = useDispatch()
  const { loading, user, error } = useSelector((state: RootState) => state.auth)

  const handleLogin = () => {
    dispatch(login({ email, password }))
  }

  return (
    // JSX
  )
}
```

### Redux Slices

**Location**: `lib/slices/`

- **Pattern**: Redux Toolkit slices with async thunks
- **Example**: `authSlice.ts` - Login/logout logic
- **Best Practice**: One slice per feature domain

### Type-Safe Redux Hooks

Create typed hooks in `lib/types/redux.d.ts`:

```typescript
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/lib/store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

---

## 🌐 API Client

### Axios Configuration

**Location**: `lib/api/clients.tsx`

```typescript
import axios from 'axios'
import { env } from '@/lib/types/env'

export const api = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})
```

### Request Interceptor

- **Purpose**: Add auth tokens, modify requests
- **Current**: Placeholder for token injection
- **Usage**: Automatically runs on all requests

### Response Interceptor

- **Success**: Returns `response.data` directly
- **Error**: Extracts error message, rejects with Error object
- **Usage**: Consistent error handling

### Making API Calls

```typescript
import { api } from '@/lib/api/clients'

// GET request
const users = await api.get('/users')

// POST request
const result = await api.post('/auth/login', { email, password })

// In Redux thunk
export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    const res = await api.post('auth/login', payload)
    return res.data
  }
)
```

### API Endpoints

**Location**: `lib/constants/urls.ts`

```typescript
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  USERS: '/users'
}
```

---

## 🔔 Toast Notifications

### Global Toast System (React Toastify)

**Location**: `lib/utils/toast.ts`, `providers/toast-provider.tsx`

**Features**:
- ✅ Global toast container (top-right position)
- ✅ Auto-dismiss after 3 seconds
- ✅ Dark mode support
- ✅ Draggable toasts
- ✅ Pause on hover
- ✅ Multiple toast types (success, error, info, warning)

**Usage**:
```typescript
import { toastService } from '@/lib/utils/toast'

// Success notification
toastService.success('Operation completed successfully!')

// Error notification
toastService.error('Something went wrong!')

// Info notification
toastService.info('Here is some information')

// Warning notification
toastService.warning('Please be careful')

// Default notification
toastService.default('Default message')
```

**Integration Example**:
```typescript
import { api } from '@/lib/api/clients'
import { toastService } from '@/lib/utils/toast'

try {
  const result = await api.post('/login', { email, password })
  toastService.success('Login successful!')
} catch (error) {
  toastService.error('Login failed')
}
```

**Customization**:
Edit `providers/toast-provider.tsx` to change position, auto-close time, or styling.

---

## 🔊 Sound System

### Web Audio API Sound Service

**Location**: `lib/utils/sound.ts`, `components/sound-settings.tsx`

**Features**:
- ✅ Web Audio API beep sounds (no external files needed)
- ✅ Volume control (0-100%)
- ✅ Enable/disable toggle
- ✅ Persistent settings (localStorage)
- ✅ Different sounds for success/error/notification
- ✅ User-friendly settings UI

**Usage**:
```typescript
import { soundService } from '@/lib/utils/sound'

// Play sounds
soundService.success()      // Success beep (800Hz)
soundService.error()         // Error beep (400Hz)
soundService.notification()  // Notification beep (600Hz)

// Control settings
soundService.setEnabled(true/false)
soundService.setVolume(0.5) // 0-1 range
```

**Sound Settings Component**:
```typescript
import { SoundSettings } from '@/components/sound-settings'

<SoundSettings />
```

**Integration Example**:
```typescript
import { toastService } from '@/lib/utils/toast'
import { soundService } from '@/lib/utils/sound'

const handleSuccess = () => {
  toastService.success('Operation successful!')
  soundService.success()
}
```

**Customization**:
Edit `lib/utils/sound.ts` to change frequencies or durations:
```typescript
success() {
  this.playBeep(800, 200)  // frequency (Hz), duration (ms)
}
```

---

## ⌨️ Keyboard Navigation

### Global Keyboard Shortcuts

**Location**: `hooks/use-keyboard-navigation.ts`, `components/keyboard-shortcuts.tsx`

**Features**:
- ✅ Global keyboard shortcuts
- ✅ Theme toggle shortcut
- ✅ Help shortcut
- ✅ Extensible for custom shortcuts

**Available Shortcuts**:
- **Ctrl/Cmd + Shift + T** - Toggle theme (light/dark)
- **Ctrl/Cmd + /** - Show keyboard shortcuts help
- **Escape** - Close modals/dropdowns (extensible)

**Usage**:
The keyboard navigation is automatically enabled globally via the `KeyboardShortcuts` component in the root layout. No need to add it manually to components.

**Adding Custom Shortcuts**:
Edit `hooks/use-keyboard-navigation.ts`:
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Add your custom shortcut
    if ((e.ctrlKey || e.metaKey) && e.key === 'K') {
      e.preventDefault()
      // Your custom action
    }
  }
  
  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [])
```

---

## 🧪 Test Page

### Component Testing Interface

**Location**: `app/test/page.tsx`

**Access**: Navigate to `/test` in your browser

**Features**:
- ✅ Toast notification testing
- ✅ Sound testing with controls
- ✅ Theme toggle testing
- ✅ Color palette display
- ✅ Keyboard shortcuts display
- ✅ Form input testing
- ✅ Button variants showcase
- ✅ Typography examples

**What You Can Test**:
1. **Toast Notifications** - Click buttons to see different toast types
2. **Sound System** - Play sounds and adjust volume settings
3. **Theme Toggle** - Switch between light/dark modes
4. **Color Palette** - View all theme colors with their CSS classes
5. **Keyboard Shortcuts** - See available shortcuts and test them
6. **Form Inputs** - Test form interactions with toast/sound feedback
7. **Button Variants** - See all button styles and states
8. **Typography** - View all text styles and sizes

**Usage**:
```bash
# Start dev server
npm run dev

# Visit test page
http://localhost:3000/test
```

**Color Palette Component**:
```typescript
import { ColorPalette } from '@/components/test/color-palette'

<ColorPalette />
```

Displays all theme colors including:
- Primary, Secondary colors
- Status colors (Success, Error, Warning, Info)
- Background colors (bg, card, muted)
- Border colors

---

## 📊 Monitoring & Analytics

### Sentry Error Tracking

**Configuration Files**:
- `instrumentation.ts` - Server-side initialization
- `instrumentation-client.ts` - Client-side initialization
- `sentry.server.config.ts` - Server config
- `sentry.edge.config.ts` - Edge runtime config
- `next.config.ts` - Sentry webpack plugin

**Features**:
- ✅ Error tracking (client, server, edge)
- ✅ Performance monitoring
- ✅ Session replay (10% sample rate)
- ✅ Source maps upload
- ✅ Tunnel route (`/monitoring`) to bypass ad-blockers
- ✅ Web Vitals tracking

**Usage**:
```typescript
import * as Sentry from '@sentry/nextjs'

// Capture exception
Sentry.captureException(error)

// Capture message
Sentry.captureMessage('Something happened', 'info')

// Set user context
Sentry.setUser({ id: '123', email: 'user@example.com' })
```

**Production Setup**:
1. Update DSN in config files
2. Set `SENTRY_AUTH_TOKEN` in environment
3. Configure org/project in `next.config.ts`

### Microsoft Clarity Analytics

**Component**: `components/analytics/clarity.tsx`

**Setup**:
1. Sign up at https://clarity.microsoft.com/
2. Create project and get Project ID
3. Add to `.env.local`:
   ```bash
   NEXT_PUBLIC_CLARITY_ID=your_project_id
   ```
4. Restart dev server

**Features**:
- ✅ User session recordings
- ✅ Heatmaps
- ✅ Click tracking
- ✅ Type-safe integration
- ✅ Only loads if ID is configured

**See**: `CLARITY_SETUP.md` for detailed guide

### Web Vitals

**Location**: `app/reportWebVitals.ts`

- Automatically tracks Core Web Vitals
- Sends metrics to Sentry
- Next.js auto-detects this file

---

## 🚢 Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables

Set these in your hosting platform:

**Vercel**:
1. Go to Project Settings → Environment Variables
2. Add all `NEXT_PUBLIC_*` variables
3. Add `NEXT_PUBLIC_APP_ENV=production`

**Other Platforms**:
- Create `.env.production` file
- Or set via platform's environment variable UI

### Sentry Source Maps

Sentry automatically uploads source maps during build if:
- `SENTRY_AUTH_TOKEN` is set
- `SENTRY_ORG` and `SENTRY_PROJECT` are configured

### Recommended Hosting

- **Vercel** - Best for Next.js (recommended)
- **Netlify** - Good alternative
- **AWS Amplify** - Enterprise option
- **Self-hosted** - Docker + Node.js

---

## 🔄 CI/CD

### GitHub Actions

**Location**: `.github/workflows/ci.yml`

**Triggers**:
- Pull requests to `main` or `develop`

**Steps**:
1. Checkout code
2. Setup Node.js 18
3. Install dependencies
4. Run linting
5. Build application

**To Extend**:
- Add tests: `npm run test`
- Add type checking: `npm run type-check`
- Add E2E tests: `npm run test:e2e`

---

## ✅ Best Practices

### File Organization

- ✅ **One component per file**
- ✅ **Co-locate related files**
- ✅ **Use path aliases** (`@/*`)
- ✅ **Group by feature**, not by type

### Component Patterns

- ✅ **Server Components by default**
- ✅ **`'use client'` only when needed**
- ✅ **Extract client logic** to separate components
- ✅ **Type all props** with TypeScript

### Code Quality

- ✅ **Strict TypeScript** (`strict: true`)
- ✅ **ESLint** on every commit
- ✅ **Prettier** formatting
- ✅ **No `any` types** (use `unknown`)

### Performance

- ✅ **Server Components** for static content
- ✅ **Code splitting** via dynamic imports
- ✅ **Image optimization** with Next.js Image
- ✅ **Font optimization** with `next/font`

### Security

- ✅ **Environment validation** with Zod
- ✅ **No secrets in code**
- ✅ **CSRF protection** (Next.js built-in)
- ✅ **XSS prevention** (React built-in)

### Accessibility

- ✅ **Semantic HTML**
- ✅ **ARIA labels** where needed
- ✅ **Keyboard navigation**
- ✅ **Screen reader support**

---

## 📚 Additional Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [ShadCN UI Docs](https://ui.shadcn.com/)

### Project-Specific Docs

- `CLARITY_SETUP.md` - Microsoft Clarity setup guide

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

**Code Standards**:
- Follow ESLint rules
- Run Prettier before committing
- Write TypeScript types
- Add comments for complex logic

---

## 📝 License

[Your License Here]

---

## 🆘 Support

- **Issues**: [GitHub Issues](your-repo-url/issues)
- **Discussions**: [GitHub Discussions](your-repo-url/discussions)
- **Email**: [your-email@example.com]

---

## 🎯 Roadmap

- [x] Global toast notifications (React Toastify)
- [x] Sound system with Web Audio API
- [x] Keyboard navigation and shortcuts
- [x] Test page for component testing
- [x] Color palette component
- [ ] Add React Query for server state
- [ ] Add React Hook Form
- [ ] Add E2E testing (Playwright)
- [ ] Add Storybook for components
- [ ] Add i18n support
- [ ] Add PWA support
- [ ] Add Docker configuration
- [ ] Add Kubernetes manifests

---

**Built with ❤️ using Next.js 16**
# MY_BOILER_FRONTEND
