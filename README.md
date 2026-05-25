# DawnDesk — Official Landing Website

> The public-facing Next.js website for DawnDesk — a feature-rich all-in-one desktop productivity suite. This site is the primary download page and product showcase.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Pages & Routes](#pages--routes)
- [Download System](#download-system)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This repository contains the source code for the **DawnDesk landing website** — a Next.js application that:

- Showcases DawnDesk's suite of built-in applications (Todo, Photo Editor, Project Manager, and more)
- Provides platform-specific download links for Windows, macOS, and Linux
- Tracks download counts via Supabase
- Handles changelog and version history pages
- Provides documentation links and a contact/support section

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (download tracking, contact form submissions) |
| Hosting | Vercel |
| Fonts | Google Fonts (via `next/font`) |
| Analytics | Vercel Analytics |
| Icons | Lucide React |
| Animations | Framer Motion |

---

## Project Structure

```
dawndesk-site/
├── app/
│   ├── layout.tsx              # Root layout with fonts and metadata
│   ├── page.tsx                # Landing / hero page
│   ├── download/
│   │   └── page.tsx            # Download page with platform detection
│   ├── features/
│   │   └── page.tsx            # Full feature list page
│   ├── changelog/
│   │   └── page.tsx            # Version history and release notes
│   └── contact/
│       └── page.tsx            # Support and contact form
├── components/
│   ├── ui/                     # Reusable UI primitives (Button, Badge, etc.)
│   ├── sections/               # Page sections (Hero, Features, Download, Footer)
│   └── layout/                 # Navbar, Footer
├── lib/
│   ├── supabase.ts             # Supabase client setup
│   └── downloads.ts            # Download tracking helpers
├── public/
│   ├── downloads/              # Installer binaries (or links to GitHub Releases)
│   ├── screenshots/            # App screenshots for the showcase section
│   └── icons/                  # DawnDesk logo and app icons
├── styles/
│   └── globals.css             # Global CSS and Tailwind base layer
├── types/
│   └── index.ts                # Shared TypeScript types
├── .env.local                  # Local environment variables (not committed)
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration with custom theme
└── tsconfig.json               # TypeScript config
```

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- A Supabase project (for download tracking)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/dawndesk-site.git
cd dawndesk-site

# 2. Install dependencies
npm install

# 3. Copy the environment template and fill in your values
cp .env.example .env.local

# 4. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

---

## Environment Variables

Create a `.env.local` file at the project root with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Download URLs (point to GitHub Releases or your CDN)
NEXT_PUBLIC_DOWNLOAD_WINDOWS=https://releases.dawndesk.app/latest/DawnDesk-Setup.exe
NEXT_PUBLIC_DOWNLOAD_MAC=https://releases.dawndesk.app/latest/DawnDesk.dmg
NEXT_PUBLIC_DOWNLOAD_LINUX=https://releases.dawndesk.app/latest/DawnDesk.AppImage

# App version (shown in hero and download page)
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_RELEASE_DATE=2025-06-01

# Optional: Vercel Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_vercel_analytics_id
```

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the development server on `localhost:3000` |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the project |
| `npm run type-check` | Run TypeScript type checking without emitting |
| `npm run format` | Format all files with Prettier |

---

## Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Hero, features overview, screenshots carousel, CTA to download |
| `/download` | Platform-specific download page with OS auto-detection |
| `/features` | Full breakdown of all DawnDesk sub-apps and their features |
| `/changelog` | Versioned release notes (v1, v2, v3...) |
| `/contact` | Support form wired to Supabase or an email provider |

---

## Download System

Download buttons on the `/download` page:

1. Auto-detect the user's OS via `navigator.userAgent` on the client
2. Pre-select the appropriate platform tab (Windows / macOS / Linux)
3. On button click, call a Next.js API route `/api/download` that:
   - Increments the download counter in Supabase
   - Returns a redirect to the actual binary URL
4. Total download counts are fetched server-side and displayed on the page

The Supabase table schema for tracking:

```sql
create table downloads (
  id uuid primary key default gen_random_uuid(),
  platform text not null,           -- 'windows' | 'mac' | 'linux'
  version text not null,
  downloaded_at timestamptz default now()
);
```

---

## Deployment

The site is configured for one-click deployment to **Vercel**.

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**. The `NEXT_PUBLIC_*` variables will be inlined at build time.

For the download binary files, host them on **GitHub Releases** and point the env vars to the release asset URLs. This keeps the repository lightweight.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org/)
4. Open a pull request with a clear description

---

