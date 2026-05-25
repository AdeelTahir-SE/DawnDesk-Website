# DawnDesk Website — Best Practices

> Engineering and design standards for maintaining the DawnDesk landing site. All contributors are expected to follow these guidelines to keep the codebase clean, performant, and consistent.

---

## Table of Contents

1. [Project Conventions](#1-project-conventions)
2. [TypeScript Standards](#2-typescript-standards)
3. [Next.js App Router Patterns](#3-nextjs-app-router-patterns)
4. [Component Architecture](#4-component-architecture)
5. [Styling with Tailwind CSS](#5-styling-with-tailwind-css)
6. [Performance](#6-performance)
7. [Accessibility](#7-accessibility)
8. [SEO](#8-seo)
9. [Supabase Usage](#9-supabase-usage)
10. [Download Tracking](#10-download-tracking)
11. [Security](#11-security)
12. [Testing](#12-testing)
13. [Git Workflow](#13-git-workflow)
14. [Deployment Checklist](#14-deployment-checklist)

---

## 1. Project Conventions

### File Naming
- All files and folders use **kebab-case**: `hero-section.tsx`, `download-button.tsx`
- Page files are always `page.tsx` inside a named route folder
- Component files use **PascalCase** for the default export name but **kebab-case** for the filename
- Utility files use **camelCase**: `formatDate.ts`, `getPlatform.ts`

### Import Order
Always group imports in this order, separated by a blank line:

```ts
// 1. React / Next.js core
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// 2. Third-party libraries
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'

// 3. Internal components
import { Button } from '@/components/ui/button'
import { HeroSection } from '@/components/sections/hero-section'

// 4. Utilities / lib
import { supabase } from '@/lib/supabase'
import { detectPlatform } from '@/lib/platform'

// 5. Types
import type { Platform } from '@/types'
```

### Path Aliases
Always use the `@/` alias for internal imports. Never use relative paths that climb more than one level:

```ts
// ✅ Good
import { Button } from '@/components/ui/button'

// ❌ Bad
import { Button } from '../../../components/ui/button'
```

---

## 2. TypeScript Standards

- **Strict mode is ON** — never disable `strict` in `tsconfig.json`
- Never use `any`; use `unknown` and narrow it, or define a proper type
- All props must be typed with an explicit `interface` or `type`; no inline object type literals on component signatures
- Use `type` for unions and mapped types; use `interface` for object shapes that may be extended
- Export prop types alongside their component for reuse

```ts
// ✅ Good
export interface DownloadButtonProps {
  platform: 'windows' | 'mac' | 'linux'
  version: string
  onDownload?: () => void
}

export function DownloadButton({ platform, version, onDownload }: DownloadButtonProps) { ... }
```

- Prefer `const` assertions and `as const` for literal arrays used as type sources
- All async functions must have their return type explicitly annotated

---

## 3. Next.js App Router Patterns

### Server vs Client Components
- Default to **Server Components**; add `'use client'` only when you need:
  - Browser APIs (`window`, `navigator`, `document`)
  - React hooks (`useState`, `useEffect`, `useContext`)
  - Event handlers directly on the component

```tsx
// ✅ Prefer: server component for static content
// app/features/page.tsx — no 'use client' needed

// ✅ Correct: client component only for interactive download button
'use client'
export function DownloadButton() { ... }
```

### Data Fetching
- Fetch data in Server Components using `async/await` directly in the component
- Use `fetch` with explicit `cache` control; never fetch in a `useEffect` for data that can be server-rendered
- Use `revalidate` in route segment config for ISR where appropriate

```ts
// app/download/page.tsx
export const revalidate = 3600 // revalidate download counts every hour

async function getDownloadStats() {
  const { data } = await supabase.from('downloads').select('platform, count')
  return data
}
```

### Metadata
Every page must export a `metadata` object or a `generateMetadata` function:

```ts
export const metadata: Metadata = {
  title: 'Download DawnDesk — All-in-One Desktop Productivity Suite',
  description: 'Download DawnDesk for Windows, macOS, or Linux. Free, fast, and powerful.',
  openGraph: {
    title: 'Download DawnDesk',
    images: ['/og-image.png'],
  },
}
```

### API Routes
- All API routes live in `app/api/` using Route Handlers
- Always validate request bodies with a schema (use `zod`)
- Return proper HTTP status codes; never return `200` for errors
- Rate-limit any public API routes that write to the database

---

## 4. Component Architecture

### Folder Structure
```
components/
├── ui/           # Primitive, stateless, reusable elements (Button, Badge, Card)
├── sections/     # Page-level sections (HeroSection, FeaturesSection, DownloadSection)
└── layout/       # Structural components (Navbar, Footer, PageWrapper)
```

### Rules
- **ui/** components must be completely stateless and accept all data as props
- **sections/** components may be server or client components and can fetch their own data
- **layout/** components are always server components unless navigation state is needed
- No business logic inside UI components; keep them purely presentational
- Co-locate component-specific hooks in the same file unless the hook is reused elsewhere

### Composition over Configuration
Build small, focused components and compose them rather than building large monoliths with dozens of props:

```tsx
// ✅ Good — composed
<DownloadCard>
  <DownloadCard.Header platform="windows" />
  <DownloadCard.Stats count={42310} />
  <DownloadCard.Button version="1.0.0" />
</DownloadCard>

// ❌ Bad — bloated props
<DownloadCard platform="windows" count={42310} version="1.0.0" showStats headerVariant="dark" ... />
```

---

## 5. Styling with Tailwind CSS

### Custom Theme (tailwind.config.ts)
The DawnDesk brand palette is defined once in the Tailwind config and referenced everywhere:

```ts
theme: {
  extend: {
    colors: {
      brand: {
        black:    '#0A0A0A',
        yellow:   '#F5C518',
        'yellow-dim': '#C49B10',
        white:    '#F2F2F2',
        gray:     '#1A1A1A',
        muted:    '#3A3A3A',
      },
    },
    fontFamily: {
      display: ['var(--font-display)', 'sans-serif'],
      body:    ['var(--font-body)', 'sans-serif'],
      mono:    ['var(--font-mono)', 'monospace'],
    },
  },
}
```

### Class Conventions
- Use `cn()` (from `clsx` + `tailwind-merge`) for all conditional class merging — never template literals
- Keep Tailwind class lists readable by grouping: layout → spacing → typography → color → border → effects
- Extract repeated class combinations into a component rather than duplicating utility strings
- Avoid `style={{}}` inline styles; use Tailwind or CSS variables exclusively

### Responsive Design
- Mobile-first: base styles are mobile, then `md:` and `lg:` scale up
- The landing page must look excellent on: 375px (iPhone SE), 768px (iPad), 1280px (desktop), 1920px (wide)
- Test breakpoints before every PR

---

## 6. Performance

### Images
- **Always** use `next/image` for any image on the site; never raw `<img>` tags
- Provide explicit `width` and `height` or use `fill` with a sized container
- Set `priority` on above-the-fold images (hero screenshot, logo)
- Use `.webp` format for all screenshots and marketing images; keep originals in `/public/screenshots/`
- Compress all images before committing; target under 200 KB for hero images

### Fonts
- Load fonts via `next/font` — never link Google Fonts from a `<link>` tag
- Assign fonts to CSS variables; apply them in `globals.css` on `html` and `body`
- Use `display: 'swap'` to prevent invisible text during load

### Bundle Size
- Run `npm run build` and review the bundle output before merging any PR that adds a new dependency
- Prefer tree-shakeable libraries; avoid importing entire icon packs
- Lazy-load components that appear below the fold using `next/dynamic`

```ts
const ScreenshotCarousel = dynamic(() => import('@/components/sections/screenshot-carousel'), {
  loading: () => <div className="h-96 bg-brand-gray animate-pulse rounded-xl" />,
})
```

### Core Web Vitals Targets
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |
| TTFB | < 800ms |

---

## 7. Accessibility

- All interactive elements must be keyboard-navigable and have visible focus rings
- Every `<img>` and `<Image>` must have a meaningful `alt` attribute; use `alt=""` for purely decorative images
- Use semantic HTML: `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<button>` (not `<div onClick>`)
- Color contrast ratio must meet WCAG AA (4.5:1 for body text, 3:1 for large text) — the yellow-on-black palette easily satisfies this
- All form inputs need associated `<label>` elements; use `htmlFor` + `id`
- Animated elements must respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. SEO

- Every page has a unique `<title>` and `<meta name="description">` set via the Next.js Metadata API
- The root `layout.tsx` sets baseline metadata; individual pages override specific fields
- Provide Open Graph and Twitter card metadata on all pages
- The `/` and `/download` pages include JSON-LD structured data (SoftwareApplication schema)
- Generate a `sitemap.xml` using `next-sitemap` and submit it to Google Search Console
- Use canonical URLs to prevent duplicate content between `/` and `/download`
- All download links use meaningful anchor text, not "click here"

---

## 9. Supabase Usage

### Client Setup
Use a single shared Supabase client per environment:

```ts
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Rules
- Never expose the Supabase **service role key** in client-side code or `NEXT_PUBLIC_` env vars — service role key is only for server-side API routes
- Always use Row Level Security (RLS) on every table; the `downloads` table should allow inserts from anon but restrict selects to authenticated users or aggregate views only
- Generate TypeScript types from your Supabase schema using the Supabase CLI and commit them to `/types/supabase.ts`
- Catch all Supabase errors explicitly; never silently swallow them

---

## 10. Download Tracking

- Downloads are tracked server-side in the `/api/download` route handler — never directly from the client
- The route handler validates the `platform` parameter before writing to the database
- Respond with a `302` redirect to the actual binary URL after recording the download
- Protect against spam by checking for a reasonable `User-Agent` header and rate-limiting by IP (use Vercel's `x-forwarded-for` header)

---

## 11. Security

- Never commit `.env.local` or any file containing secrets; it is in `.gitignore`
- All user-supplied input (contact form) must be sanitized server-side before storage
- Set security headers in `next.config.ts`:

```ts
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

- Use `Content-Security-Policy` headers in production to limit script sources
- Dependencies must be kept up to date; run `npm audit` before every release and resolve high/critical vulnerabilities

---

## 12. Testing

- Unit test all utility functions in `lib/` using **Vitest**
- Component tests use **React Testing Library**; test behavior, not implementation
- Write at least one test for the download tracking API route
- Do not test Tailwind classes or visual styling — test logic and user interactions
- Tests live in `__tests__/` folders co-located with the code they test, or in a top-level `tests/` directory

---

## 13. Git Workflow

### Branch Naming
```
feat/hero-animation
fix/download-button-ios
chore/update-dependencies
docs/add-best-practices
```

### Commit Messages (Conventional Commits)
```
feat: add platform auto-detection to download page
fix: correct download count not incrementing on Linux
chore: upgrade Next.js to 14.2.5
docs: update README with new env variables
style: align hero section CTA buttons
```

### PR Rules
- PRs must target `main` via a feature branch; never push directly to `main`
- Every PR requires at least one reviewer approval before merging
- CI must pass (lint, type-check, build) before merging
- Include a screenshot in the PR description for any visual change

---

## 14. Deployment Checklist

Before every production release, verify:

- [ ] `npm run build` completes without errors or warnings
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run lint` passes
- [ ] All environment variables are set in the Vercel dashboard
- [ ] Download links for all three platforms are live and tested
- [ ] `NEXT_PUBLIC_APP_VERSION` matches the latest DawnDesk release tag
- [ ] Open Graph image (`/public/og-image.png`) is up to date
- [ ] `sitemap.xml` is regenerated and submitted
- [ ] Core Web Vitals pass on PageSpeed Insights for both mobile and desktop
- [ ] The `/api/download` route correctly increments counts for all three platforms
- [ ] Security headers are present in the response (verify with securityheaders.com)