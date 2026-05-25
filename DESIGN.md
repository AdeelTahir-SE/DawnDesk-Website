# DawnDesk Website — Design System

> The visual language for the DawnDesk landing website. All UI decisions — color, typography, spacing, motion, and component style — derive from this document. When in doubt, refer here first.

---

## Design Philosophy

DawnDesk is a **power-user tool** that lives on the desktop. The website must feel like the product: dark, precise, fast, and professional. The aesthetic is **Industrial Editorial** — the confidence of developer tooling with the polish of a product launch page.

> "Built for people who get things done. The website should feel the same way."

Every element earns its place. No decorative fluff, no stock gradients, no bloated hero sections. The yellow cuts through the black like a cursor on a terminal. The white delivers information cleanly. Everything else is shadow and structure.

---

## 1. Color Palette

### Core Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#0A0A0A` | Page background — near-black, not pure black |
| `--color-surface` | `#111111` | Cards, panels, elevated surfaces |
| `--color-surface-hover` | `#1A1A1A` | Card hover state background |
| `--color-border` | `#242424` | Subtle dividers, card borders |
| `--color-border-accent` | `#F5C518` | Highlighted borders, active states |
| `--color-yellow` | `#F5C518` | Primary accent — CTAs, highlights, icons |
| `--color-yellow-dim` | `#C49B10` | Yellow hover state, secondary yellow usage |
| `--color-yellow-glow` | `rgba(245, 197, 24, 0.15)` | Glow effects, focus rings, card halos |
| `--color-white` | `#F2F2F2` | Primary body text, headings |
| `--color-muted` | `#888888` | Secondary text, captions, metadata |
| `--color-muted-dark` | `#555555` | Disabled text, placeholders |

### Usage Rules

- **Background hierarchy**: `--color-bg` → `--color-surface` → `--color-surface-hover`. Never go lighter than surface-hover for any elevated element.
- **Yellow is sparse**: Yellow appears on primary CTAs, key metrics, active tab indicators, and hover highlights. It should feel like a spotlight, not wallpaper.
- **Never use pure `#000000`** as a background — it feels harsh and flat. Use `#0A0A0A`.
- **Never use pure `#FFFFFF`** for text — use `#F2F2F2` to reduce eye strain on dark backgrounds.
- **Yellow on black contrast ratio**: `#F5C518` on `#0A0A0A` = **9.3:1** — far exceeds WCAG AAA.

### CSS Variable Declaration
```css
:root {
  --color-bg:             #0A0A0A;
  --color-surface:        #111111;
  --color-surface-hover:  #1A1A1A;
  --color-border:         #242424;
  --color-border-accent:  #F5C518;
  --color-yellow:         #F5C518;
  --color-yellow-dim:     #C49B10;
  --color-yellow-glow:    rgba(245, 197, 24, 0.15);
  --color-white:          #F2F2F2;
  --color-muted:          #888888;
  --color-muted-dark:     #555555;
}
```

---

## 2. Typography

### Font Families

| Role | Font | Fallback | Source |
|------|------|----------|--------|
| Display (headings) | **Syne** | sans-serif | Google Fonts |
| Body (paragraphs) | **DM Sans** | sans-serif | Google Fonts |
| Mono (code, version tags) | **JetBrains Mono** | monospace | Google Fonts |

**Why these fonts:**
- **Syne** has strong geometric character with wide letterforms — it fills a hero section with authority and reads as modern without being generic.
- **DM Sans** is highly legible at small sizes with a technical-yet-approachable feel that complements Syne without competing.
- **JetBrains Mono** is the developer community's preferred mono font and reinforces DawnDesk's technical positioning.

### Type Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--text-hero` | `clamp(3rem, 6vw, 5.5rem)` | 1.05 | 700 | Hero section headline |
| `--text-h1` | `clamp(2rem, 4vw, 3.5rem)` | 1.1 | 700 | Page section headings |
| `--text-h2` | `clamp(1.5rem, 2.5vw, 2.25rem)` | 1.2 | 600 | Sub-section headings |
| `--text-h3` | `1.25rem` | 1.3 | 600 | Card titles, feature names |
| `--text-body-lg` | `1.125rem` | 1.7 | 400 | Lead paragraphs, hero sub-copy |
| `--text-body` | `1rem` | 1.7 | 400 | General body copy |
| `--text-sm` | `0.875rem` | 1.6 | 400 | Captions, metadata, labels |
| `--text-xs` | `0.75rem` | 1.5 | 500 | Tags, version badges, eyebrows |
| `--text-mono` | `0.875rem` | 1.5 | 400 | Version numbers, code snippets |

### Typography Rules

- **Never center-align body paragraphs** — only headings and short one-liners are center-aligned
- **Letter spacing on headings**: Apply `letter-spacing: -0.02em` to display and H1 text for tighter, more polished rendering
- **Uppercase sparingly**: Use `text-transform: uppercase` with `letter-spacing: 0.1em` for eyebrow labels (e.g. "VERSION 1.0.0") only
- **Line length**: Body text columns should be capped at `65ch` to maintain readability
- **Yellow text**: Use yellow color on a word or phrase within a heading to create emphasis (e.g. "Everything you need, **built in.**")

---

## 3. Spacing System

Based on a **4px base unit**. All spacing values are multiples of 4:

| Token | Value | Common Use |
|-------|-------|-----------|
| `space-1` | `4px` | Icon gap, tight padding |
| `space-2` | `8px` | Badge padding, small gaps |
| `space-3` | `12px` | Input padding, tight stack |
| `space-4` | `16px` | Standard component padding |
| `space-6` | `24px` | Card padding, section internal gap |
| `space-8` | `32px` | Section content gap |
| `space-12` | `48px` | Between major elements |
| `space-16` | `64px` | Section top/bottom padding (mobile) |
| `space-24` | `96px` | Section top/bottom padding (desktop) |
| `space-32` | `128px` | Hero vertical padding |

**Page max-width**: `1280px` — centered with `auto` horizontal margins.
**Content column**: `800px` — for text-heavy sections like changelog.
**Horizontal page padding**: `24px` mobile, `48px` tablet, `80px` desktop.

---

## 4. Component Styles

### Buttons

#### Primary Button (Download CTA)
```css
background: #F5C518;
color: #0A0A0A;
font: 600 0.9375rem/1 'DM Sans', sans-serif;
letter-spacing: 0.01em;
padding: 14px 28px;
border-radius: 6px;
border: none;
transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;

/* Hover */
background: #C49B10;
transform: translateY(-1px);
box-shadow: 0 8px 24px rgba(245, 197, 24, 0.3);

/* Active */
transform: translateY(0);
box-shadow: none;
```

#### Secondary Button (Ghost)
```css
background: transparent;
color: #F2F2F2;
border: 1px solid #242424;
padding: 13px 27px;
border-radius: 6px;

/* Hover */
border-color: #F5C518;
color: #F5C518;
background: rgba(245, 197, 24, 0.06);
```

#### Platform Download Buttons (Windows / macOS / Linux)
- Same as Primary but with a platform icon to the left
- Each platform button shows its icon in yellow, label in black
- Below each button: version number in `--color-muted` using mono font

### Cards

```css
background: #111111;
border: 1px solid #242424;
border-radius: 12px;
padding: 28px;
transition: border-color 0.2s ease, box-shadow 0.2s ease;

/* Hover */
border-color: rgba(245, 197, 24, 0.4);
box-shadow: 0 0 0 1px rgba(245, 197, 24, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4);
```

### Badges / Tags

```css
/* Yellow accent badge (e.g. "NEW", "v1.0.0") */
background: rgba(245, 197, 24, 0.12);
color: #F5C518;
border: 1px solid rgba(245, 197, 24, 0.3);
padding: 3px 10px;
border-radius: 999px;
font: 500 0.75rem/1.5 'JetBrains Mono', monospace;
letter-spacing: 0.05em;
text-transform: uppercase;

/* Neutral badge (e.g. platform tags) */
background: #1A1A1A;
color: #888888;
border: 1px solid #242424;
```

### Dividers

```css
/* Standard divider */
border: none;
border-top: 1px solid #242424;

/* Accent divider (used under hero headline) */
width: 48px;
height: 3px;
background: #F5C518;
border-radius: 2px;
```

### Input Fields (Contact Form)
```css
background: #111111;
border: 1px solid #242424;
border-radius: 6px;
color: #F2F2F2;
padding: 12px 16px;
font: 400 1rem 'DM Sans', sans-serif;

/* Focus */
border-color: #F5C518;
outline: none;
box-shadow: 0 0 0 3px rgba(245, 197, 24, 0.12);

/* Placeholder */
color: #555555;
```

---

## 5. Layout & Grid

### Page Sections

Each full-width section follows this structure:

```
<section>
  └── .container          max-width: 1280px, centered, horizontal padding
       └── .section-inner  specific layout grid
```

### Section Structure

| Section | Layout |
|---------|--------|
| Navbar | Flex row, space-between, sticky top-0 |
| Hero | Single column centered, max-width 900px for text |
| Feature Grid | 3-column grid (desktop), 2-col (tablet), 1-col (mobile) |
| App Showcase | Alternating left/right two-column layout |
| Download | 3-column platform cards, centered |
| Screenshots | Full-bleed horizontal scroll or centered with shadows |
| Changelog | Single 800px content column |
| Footer | 4-column grid (desktop), stacked (mobile) |

### Navbar

- Background: `rgba(10, 10, 10, 0.85)` with `backdrop-filter: blur(12px)`
- Border bottom: `1px solid #1A1A1A`
- Logo: DawnDesk wordmark in `--color-white`, display font
- Nav links: `--color-muted`, hover to `--color-white`, active to `--color-yellow`
- CTA button: Primary yellow button (compact size)
- Sticky on scroll; add `border-bottom-color: #242424` after scrolling 50px

---

## 6. Iconography

- Use **Lucide React** for all UI icons (download, chevron, check, platform icons)
- Icon size: `16px` for inline text icons, `20px` for standalone, `32px` for feature cards
- Icon color: defaults to `currentColor` — set on parent via `color` property
- Platform icons (Windows, Apple, Linux) use SVG — source from `public/icons/`
- Feature icons in cards use a **yellow icon on dark pill background**:

```css
.feature-icon-wrap {
  width: 44px;
  height: 44px;
  background: rgba(245, 197, 24, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F5C518;
}
```

---

## 7. Motion & Animation

### Principles
- Animations serve information hierarchy — they direct attention, not decorate
- All transitions are `ease` or `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo feel)
- Duration: 150ms for hover micro-interactions, 300–500ms for reveals
- Stagger page sections on mount using Framer Motion with 80ms stagger delay

### Key Animations

#### Hero Text Reveal
```
Initial: opacity 0, y: 20px
Animate: opacity 1, y: 0
Duration: 600ms, ease-out
Stagger: headline → sub-copy → buttons → badge (80ms apart)
```

#### Card Hover Glow
```
Transition: border-color 200ms, box-shadow 200ms
box-shadow on hover: 0 0 0 1px rgba(245,197,24,0.1), 0 8px 32px rgba(0,0,0,0.4)
```

#### Section Scroll Reveal (Framer Motion)
```js
initial: { opacity: 0, y: 32 }
whileInView: { opacity: 1, y: 0 }
viewport: { once: true, margin: "-80px" }
transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
```

#### Download Button Pulse (hero only)
```css
@keyframes yellow-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 197, 24, 0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(245, 197, 24, 0); }
}
/* Apply only to the primary hero CTA button */
animation: yellow-pulse 2.5s ease infinite;
```

### Reduced Motion
All animations must be disabled for users who prefer reduced motion:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Visual Effects & Atmosphere

### Hero Background
The hero section uses a **radial gradient halo** behind the headline:
```css
background:
  radial-gradient(ellipse 900px 600px at 50% 0%, rgba(245, 197, 24, 0.06) 0%, transparent 70%),
  #0A0A0A;
```

### Noise Texture Overlay (Optional)
A subtle grain texture adds depth to flat surfaces:
```css
.noise-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/noise.png');
  opacity: 0.025;
  pointer-events: none;
}
```

### Screenshot Shadows
App screenshots use a multi-layered shadow to float them off the page:
```css
box-shadow:
  0 2px 4px rgba(0,0,0,0.4),
  0 8px 24px rgba(0,0,0,0.5),
  0 32px 80px rgba(0,0,0,0.6),
  0 0 0 1px rgba(255,255,255,0.05);
border-radius: 12px;
```

### Scrolling Ticker (Sub-apps List)
A horizontal auto-scrolling ticker below the hero lists all DawnDesk sub-apps separated by yellow diamond separators:
```
Todo  ◆  Photo Editor  ◆  Project Manager  ◆  Calendar  ◆  Notes  ◆  ...
```

---

## 9. Responsive Breakpoints

```css
/* Mobile first */
/* sm  */ @media (min-width: 640px)  { ... }
/* md  */ @media (min-width: 768px)  { ... }
/* lg  */ @media (min-width: 1024px) { ... }
/* xl  */ @media (min-width: 1280px) { ... }
/* 2xl */ @media (min-width: 1536px) { ... }
```

- Navigation collapses to a hamburger menu below `md`
- Hero headline font scales with `clamp()` — no breakpoint overrides needed
- Feature grid: 1 col → 2 col at `md` → 3 col at `lg`
- Download cards: stacked → 3 col at `md`
- App showcase alternating layout stacks vertically on mobile

---

## 10. Tailwind Config Reference

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-brand-black: #0A0A0A;
  --color-brand-surface: #111111;
  --color-brand-surface-2: #1A1A1A;
  --color-brand-border: #242424;
  --color-brand-yellow: #F5C518;
  --color-brand-yellow-dim: #C49B10;
  --color-brand-white: #F2F2F2;
  --color-brand-muted: #888888;
  --color-brand-muted-dark: #555555;

  --font-display: var(--font-syne), sans-serif;
  --font-body: var(--font-dm-sans), sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;

  --shadow-yellow-glow: 0 0 0 3px rgba(245, 197, 24, 0.15);
  --shadow-card-hover: 0 0 0 1px rgba(245, 197, 24, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-screenshot: 0 2px 4px rgba(0, 0, 0, 0.4), 0 8px 24px rgba(0, 0, 0, 0.5), 0 32px 80px rgba(0, 0, 0, 0.6);

  --animate-yellow-pulse: yellow-pulse 2.5s ease infinite;
  --animate-ticker: ticker 30s linear infinite;

  @keyframes yellow-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(245, 197, 24, 0.4); }
    50% { box-shadow: 0 0 0 12px rgba(245, 197, 24, 0); }
  }

  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
}
```

---

## 11. Do's and Don'ts

### ✅ Do
- Use yellow for one focal point per section, not as a general color
- Pair large display text with generous negative space
- Keep card content scannable — icon, title, one-line description
- Use the screenshot shadow on all app UI images
- Let the black breathe — emptiness is part of the aesthetic

### ❌ Don't
- Add gradients between two colors (only radial halos from yellow are permitted)
- Use yellow as a background for large areas
- Use more than two font weights per section
- Add rounded corners larger than `12px` on cards — keep it angular and intentional
- Use colored text other than yellow and white — no blues, greens, or purples
- Add stock photos or generic illustrations — screenshots of the actual app only