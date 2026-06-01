# DawnDesk Content JSON Format

Edit the JSON files in this folder when website copy, feature lists, app cards, roadmap items, testimonials, or footer links need to change.

## Files

- `site.json` controls the homepage content, navigation labels, download platforms, general feature cards, audience cards, testimonials, footer links, and homepage sub-app preview cards.
- `sub-apps.json` controls the `/sub-apps` listing page and each `/sub-apps/[slug]` detail page.

## Shared Rules

- Keep every JSON file valid: double quotes only, no comments, no trailing commas.
- Keep `slug` values lowercase with hyphens. Example: `photo-editor`.
- Keep `href` values as site paths. Example: `/sub-apps/photo-editor`.
- Keep `icon` values as supported icon keys listed below. Icons are mapped in TypeScript so JSON stays simple.
- Keep `tone` values as Tailwind class strings only when a card needs a specific icon color/background.

## Supported Icon Keys

Use one of these values in any `icon` field:

`Apple`, `BadgeCheck`, `Bell`, `BriefcaseBusiness`, `CalendarDays`, `CircleUserRound`, `Cloud`, `Code2`, `FileArchive`, `FileText`, `Film`, `FolderKanban`, `GraduationCap`, `Heart`, `ImageIcon`, `LayoutGrid`, `Lightbulb`, `Mail`, `Menu`, `Monitor`, `Palette`, `PenTool`, `Search`, `Settings2`, `Share2`, `ShieldCheck`, `Sparkles`, `Star`, `Tags`, `TimerReset`, `Upload`, `UsersRound`, `Video`, `Wand2`

## `site.json`

Top-level format:

```json
{
  "navigation": {
    "mainItems": ["Features", "Solutions", "Sub Apps", "Resources", "Download"]
  },
  "dashboard": {
    "items": ["Dashboard", "Projects"],
    "stats": [
      { "label": "Active Tasks", "value": 12, "detail": "5 high priority" }
    ],
    "productivityHeights": [35, 50, 42]
  },
  "hero": {
    "eyebrow": "Smarter work. Every day.",
    "title": "Your workflow.",
    "highlight": "All in one place.",
    "copy": "Short supporting copy.",
    "primaryCta": "Download Now",
    "secondaryCta": "Explore Features"
  },
  "download": {
    "platforms": [
      { "name": "Windows", "detail": "Version 2.0.1", "icon": "Monitor", "active": true }
    ],
    "windows": {
      "title": "DawnDesk for Windows",
      "version": "Version 2.0.1",
      "size": "120 MB",
      "compatibility": "Compatible with Windows 10/11 (64-bit)",
      "primaryCta": "Download for Windows",
      "secondaryCta": "Download portable version"
    }
  },
  "featureCards": [
    { "title": "Task Management", "copy": "Card copy.", "icon": "BadgeCheck", "tone": "text-violet-600 bg-violet-100" }
  ],
  "suiteTools": ["Dashboard", "Tasks & To-Do"],
  "upcoming": [
    { "version": "v2.1", "title": "Team Collaboration", "copy": "Roadmap copy.", "state": "Coming Soon", "color": "bg-amber-400" }
  ],
  "audiences": [
    { "title": "Freelancers", "copy": "Audience copy.", "icon": "CircleUserRound", "tone": "text-emerald-600 bg-emerald-100" }
  ],
  "testimonials": [
    { "quote": "Quote text.", "name": "Person Name", "role": "Role" }
  ],
  "subAppsPreview": {
    "included": ["Focused workspaces"],
    "items": [
      { "title": "Photo Editor", "icon": "ImageIcon", "href": "/sub-apps/photo-editor", "copy": "Preview card copy." }
    ]
  },
  "toolFeatureSets": {
    "photo": [
      { "title": "AI Enhance", "copy": "Feature copy.", "icon": "Wand2" }
    ]
  },
  "toolHeroes": {
    "photo": {
      "label": "Photo Editor",
      "title": "Photo Editor",
      "accent": "Edit. Enhance. Inspire.",
      "copy": "Hero copy.",
      "button": "Open Photo Editor",
      "featureSet": "photo",
      "icon": "ImageIcon"
    }
  },
  "toolGrids": {
    "photo": {
      "kicker": "PHOTO EDITOR FEATURES",
      "title": "Everything you need to edit like a pro",
      "notice": "More features coming soon."
    }
  },
  "footer": {
    "copy": "Footer brand copy.",
    "copyright": "Copyright text.",
    "socials": ["f", "x"],
    "groups": [
      { "title": "Product", "items": ["Features", "Download"] }
    ],
    "newsletter": {
      "title": "Stay in the loop",
      "copy": "Newsletter copy.",
      "placeholder": "Enter your email",
      "button": "Subscribe"
    }
  }
}
```

## `sub-apps.json`

Top-level format:

```json
[
  {
    "slug": "photo-editor",
    "name": "Photo Editor",
    "eyebrow": "Create polished visuals",
    "headline": "Edit, enhance, and export images inside DawnDesk.",
    "accent": "Built for fast creative work.",
    "summary": "Short listing-page copy.",
    "detail": "Longer detail-page copy.",
    "icon": "ImageIcon",
    "features": [
      { "title": "AI Enhance", "copy": "Feature copy.", "icon": "Wand2" }
    ],
    "workflow": [
      "Import or drag in an image",
      "Apply edits and compare changes",
      "Export the final asset back to your workflow"
    ]
  }
]
```
