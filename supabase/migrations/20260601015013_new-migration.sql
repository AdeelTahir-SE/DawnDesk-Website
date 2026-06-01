create table if not exists public.site_content (
  key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.sub_apps (
  slug text primary key,
  name text not null,
  content jsonb not null,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_content_set_updated_at on public.site_content;
create trigger site_content_set_updated_at
before update on public.site_content
for each row execute function public.set_updated_at();

drop trigger if exists sub_apps_set_updated_at on public.sub_apps;
create trigger sub_apps_set_updated_at
before update on public.sub_apps
for each row execute function public.set_updated_at();

alter table public.site_content enable row level security;
alter table public.sub_apps enable row level security;

drop policy if exists "Public can read site content" on public.site_content;
create policy "Public can read site content"
on public.site_content for select
using (true);

drop policy if exists "Public can read sub apps" on public.sub_apps;
create policy "Public can read sub apps"
on public.sub_apps for select
using (true);

insert into public.site_content (key, content)
values ('homepage', $json${
  "navigation": {
    "mainItems": [
      "Features",
      "Solutions",
      "Sub Apps",
      "Resources",
      "Download"
    ]
  },
  "dashboard": {
    "items": [
      "Dashboard",
      "Projects",
      "Tasks",
      "Calendar",
      "Notes",
      "Photo Editor",
      "Video Editor",
      "Finance",
      "Dev Tools",
      "Settings"
    ],
    "stats": [
      {
        "label": "Active Tasks",
        "value": 12,
        "detail": "5 high priority"
      },
      {
        "label": "Projects Completed",
        "value": 24,
        "detail": "+3 this week"
      },
      {
        "label": "AI Requests",
        "value": 48,
        "detail": "Ready to reuse"
      }
    ],
    "productivityHeights": [
      35,
      50,
      42,
      75,
      62,
      90,
      70
    ]
  },
  "hero": {
    "eyebrow": "Smarter work. Every day.",
    "title": "Your workflow.",
    "highlight": "All in one place.",
    "copy": "DawnDesk helps you stay organized, get more done, and focus on what matters most.",
    "primaryCta": "Download Now",
    "secondaryCta": "Explore Features"
  },
  "download": {
    "platforms": [
      {
        "name": "Windows",
        "detail": "Version 2.0.1",
        "icon": "Monitor",
        "active": true
      },
      {
        "name": "macOS",
        "detail": "Coming soon",
        "icon": "Apple"
      },
      {
        "name": "Linux",
        "detail": "Coming soon",
        "icon": "Cloud"
      }
    ],
    "windows": {
      "title": "DawnDesk for Windows",
      "version": "Version 0.1.0",
      "size": "MSI installer",
      "compatibility": "Compatible with Windows 10/11 (64-bit)",
      "primaryCta": "Download for Windows",
      "secondaryCta": "Release notes",
      "url": "https://github.com/AdeelTahir-SE/DawnDesk/releases/download/v0.2.0/dawndesk_0.1.0_x64_en-US.msi"
    }
  },
  "featureCards": [
    {
      "title": "Task Management",
      "copy": "Organize tasks with priorities, due dates and reminders.",
      "icon": "BadgeCheck",
      "tone": "text-violet-600 bg-violet-100"
    },
    {
      "title": "Project Tracking",
      "copy": "Track progress and collaborate with your team.",
      "icon": "FolderKanban",
      "tone": "text-amber-600 bg-amber-100"
    },
    {
      "title": "Notes & Docs",
      "copy": "Create, edit, and store notes and documents securely.",
      "icon": "FileText",
      "tone": "text-sky-600 bg-sky-100"
    },
    {
      "title": "Calendar Integration",
      "copy": "Sync with your calendar and never miss a deadline.",
      "icon": "CalendarDays",
      "tone": "text-purple-600 bg-purple-100"
    },
    {
      "title": "AI Assistant",
      "copy": "Get smart suggestions and automate repetitive tasks.",
      "icon": "Sparkles",
      "tone": "text-indigo-600 bg-indigo-100"
    },
    {
      "title": "File Management",
      "copy": "Store and organize your files in one place.",
      "icon": "FileArchive",
      "tone": "text-rose-600 bg-rose-100"
    }
  ],
  "suiteTools": [
    "Dashboard",
    "Tasks & To-Do",
    "Projects",
    "Notes",
    "Calendar",
    "Photo & Video Editor",
    "Finance Tracker",
    "Dev Tools",
    "And more..."
  ],
  "upcoming": [
    {
      "version": "v2.1",
      "title": "Team Collaboration",
      "copy": "Real-time collaboration and comments",
      "state": "Coming Soon",
      "color": "bg-amber-400"
    },
    {
      "version": "v2.2",
      "title": "Advanced Analytics",
      "copy": "Deep insights and productivity reports",
      "state": "In Progress",
      "color": "bg-sky-400"
    },
    {
      "version": "v2.3",
      "title": "Automation Builder",
      "copy": "Create repeatable workflows without extra setup",
      "state": "Planned",
      "color": "bg-violet-400"
    }
  ],
  "audiences": [
    {
      "title": "Freelancers",
      "copy": "Manage client projects, deadlines, and invoices with ease.",
      "icon": "CircleUserRound",
      "tone": "text-emerald-600 bg-emerald-100"
    },
    {
      "title": "Teams",
      "copy": "Collaborate, assign tasks, and track progress together.",
      "icon": "UsersRound",
      "tone": "text-cyan-600 bg-cyan-100"
    },
    {
      "title": "Businesses",
      "copy": "Streamline operations, improve productivity, and grow faster.",
      "icon": "BriefcaseBusiness",
      "tone": "text-orange-600 bg-orange-100"
    },
    {
      "title": "Students",
      "copy": "Organize notes, assignments, and study schedules.",
      "icon": "GraduationCap",
      "tone": "text-indigo-600 bg-indigo-100"
    },
    {
      "title": "Developers",
      "copy": "Use built-in dev tools to code, test, and deploy faster.",
      "icon": "Code2",
      "tone": "text-violet-600 bg-violet-100"
    },
    {
      "title": "Creators",
      "copy": "Edit photos, videos, and content without leaving the app.",
      "icon": "Palette",
      "tone": "text-pink-600 bg-pink-100"
    }
  ],
  "testimonials": [
    {
      "quote": "DawnDesk completely changed how I manage my work. Everything is so organized now!",
      "name": "Aarav Mehta",
      "role": "Freelancer"
    },
    {
      "quote": "The all-in-one tools save me hours every week. Highly recommended!",
      "name": "Priya Sharma",
      "role": "Project Manager"
    },
    {
      "quote": "Finally, a productivity app that keeps the tools I need in one place.",
      "name": "Rohan Verma",
      "role": "Developer"
    }
  ],
  "subAppsPreview": {
    "included": [
      "Focused workspaces",
      "One install for every tool",
      "Regular app updates"
    ],
    "items": [
      {
        "title": "Photo Editor",
        "icon": "ImageIcon",
        "href": "/sub-apps/photo-editor",
        "copy": "Open the photo editor workspace and keep your work connected."
      },
      {
        "title": "Video Editor",
        "icon": "Video",
        "href": "/sub-apps/video-editor",
        "copy": "Open the video editor workspace and keep your work connected."
      },
      {
        "title": "Prompt Manager",
        "icon": "PenTool",
        "href": "/sub-apps/prompt-manager",
        "copy": "Open the prompt manager workspace and keep your work connected."
      },
      {
        "title": "Project Tracker",
        "icon": "FolderKanban",
        "href": "/sub-apps/project-tracker",
        "copy": "Open the project tracker workspace and keep your work connected."
      },
      {
        "title": "Notes & Docs",
        "icon": "FileText",
        "href": "/sub-apps/notes-docs",
        "copy": "Open the notes & docs workspace and keep your work connected."
      },
      {
        "title": "View All",
        "icon": "Menu",
        "href": "/sub-apps",
        "copy": "Browse the complete DawnDesk toolkit and open each detail page."
      }
    ]
  },
  "toolFeatureSets": {
    "photo": [
      {
        "title": "AI Enhance",
        "copy": "One-click image enhancement",
        "icon": "Wand2"
      },
      {
        "title": "Filters & Effects",
        "copy": "Stunning filters and creative effects",
        "icon": "Sparkles"
      },
      {
        "title": "Crop & Resize",
        "copy": "Perfect your composition",
        "icon": "LayoutGrid"
      },
      {
        "title": "Adjustments",
        "copy": "Fine-tune light, color and more",
        "icon": "Settings2"
      },
      {
        "title": "Retouch",
        "copy": "Remove blemishes and imperfections",
        "icon": "PenTool"
      },
      {
        "title": "Text & Stickers",
        "copy": "Add text, stickers and shapes",
        "icon": "Tags"
      },
      {
        "title": "Frames",
        "copy": "Add stylish frames to your photos",
        "icon": "ImageIcon"
      },
      {
        "title": "Batch Edit",
        "copy": "Edit multiple photos at once",
        "icon": "FileArchive"
      }
    ],
    "video": [
      {
        "title": "Multi-track Timeline",
        "copy": "Edit video, audio and effects separately",
        "icon": "Film"
      },
      {
        "title": "Transitions",
        "copy": "Add smooth transitions",
        "icon": "Share2"
      },
      {
        "title": "Text & Titles",
        "copy": "Add animated text and titles",
        "icon": "Tags"
      },
      {
        "title": "Effects & Filters",
        "copy": "Apply cinematic effects",
        "icon": "Wand2"
      },
      {
        "title": "Audio Tools",
        "copy": "Adjust volume and add music",
        "icon": "Bell"
      },
      {
        "title": "Speed Control",
        "copy": "Slow down or speed up your videos",
        "icon": "TimerReset"
      },
      {
        "title": "Export Options",
        "copy": "Export in multiple resolutions",
        "icon": "Upload"
      },
      {
        "title": "Video Stabilizer",
        "copy": "Stabilize shaky footage",
        "icon": "ShieldCheck"
      }
    ],
    "prompt": [
      {
        "title": "Categories & Tags",
        "copy": "Organize prompts with ease",
        "icon": "Tags"
      },
      {
        "title": "Quick Search",
        "copy": "Search by keyword, tag or category",
        "icon": "Search"
      },
      {
        "title": "Favorites",
        "copy": "Keep your best prompts handy",
        "icon": "Heart"
      },
      {
        "title": "Usage History",
        "copy": "Track and reuse your prompts",
        "icon": "TimerReset"
      },
      {
        "title": "Import & Export",
        "copy": "Import or export prompt files",
        "icon": "Upload"
      },
      {
        "title": "Cloud Sync",
        "copy": "Access prompts across devices",
        "icon": "Cloud"
      },
      {
        "title": "Prompt Templates",
        "copy": "Pre-built templates to start fast",
        "icon": "FileText"
      },
      {
        "title": "Share Prompts",
        "copy": "Share prompts with your team",
        "icon": "Share2"
      }
    ]
  },
  "toolHeroes": {
    "photo": {
      "label": "Photo Editor",
      "title": "Photo Editor",
      "accent": "Edit. Enhance. Inspire.",
      "copy": "A powerful photo editing tool built for everyone. Edit like a pro with advanced tools and beautiful filters.",
      "button": "Open Photo Editor",
      "featureSet": "photo",
      "icon": "ImageIcon"
    },
    "video": {
      "label": "Video Editor",
      "title": "Create. Edit. Share.",
      "accent": "",
      "copy": "Edit videos with ease using professional tools designed for creators, marketers, and businesses.",
      "button": "Open Video Editor",
      "featureSet": "video",
      "icon": "Video"
    },
    "prompt": {
      "label": "Prompt Manager",
      "title": "Organize. Optimize.",
      "accent": "Generate better.",
      "copy": "Save, organize, and manage your AI prompts efficiently. Boost your creativity and save time.",
      "button": "Open Prompt Manager",
      "featureSet": "prompt",
      "icon": "PenTool"
    }
  },
  "toolGrids": {
    "photo": {
      "kicker": "PHOTO EDITOR FEATURES",
      "title": "Everything you need to edit like a pro",
      "notice": "More features coming soon! We're working on AI background removal, object erase, and more."
    },
    "video": {
      "kicker": "VIDEO EDITOR FEATURES",
      "title": "Powerful tools for stunning videos",
      "notice": "More powerful features on the way! Green screen, AI subtitles, motion tracking and more coming soon."
    },
    "prompt": {
      "kicker": "PROMPT MANAGER FEATURES",
      "title": "Manage your prompts like never before",
      "notice": "More coming soon! AI prompt suggestions, community prompts and collaboration features."
    }
  },
  "footer": {
    "copy": "Your workflow. All in one place. Stay organized, get more done, and focus on what matters most.",
    "copyright": "? 2026 DawnDesk. All rights reserved.",
    "socials": [
      "f",
      "x",
      "ig",
      "in",
      "yt"
    ],
    "groups": [
      {
        "title": "Product",
        "items": [
          "Features",
          "Download",
          "Sub Apps",
          "Changelog",
          "Roadmap"
        ]
      },
      {
        "title": "Resources",
        "items": [
          "Documentation",
          "Blog",
          "Help Center",
          "Guides",
          "Community"
        ]
      },
      {
        "title": "Company",
        "items": [
          "About Us",
          "Contact Us",
          "Privacy Policy",
          "Terms of Service"
        ]
      },
      {
        "title": "Support",
        "items": [
          "FAQ",
          "System Status",
          "Report a Bug",
          "Request a Feature"
        ]
      }
    ],
    "newsletter": {
      "title": "Stay in the loop",
      "copy": "Get the latest updates, tips, and productivity insights straight to your inbox.",
      "placeholder": "Enter your email",
      "button": "Subscribe"
    }
  }
}$json$::jsonb)
on conflict (key) do update set content = excluded.content;

insert into public.sub_apps (slug, name, content, sort_order)
values
  ('photo-editor', 'Photo Editor', $json${
  "slug": "photo-editor",
  "name": "Photo Editor",
  "eyebrow": "Create polished visuals",
  "headline": "Edit, enhance, and export images inside DawnDesk.",
  "accent": "Built for fast creative work.",
  "summary": "A focused photo workspace for quick edits, retouching, filters, and batch-ready image polish.",
  "detail": "Photo Editor keeps everyday image editing close to your projects, notes, and tasks, so you can clean up visuals without switching tools.",
  "icon": "ImageIcon",
  "features": [
    {
      "title": "AI Enhance",
      "copy": "Improve image quality with one quick action.",
      "icon": "Wand2"
    },
    {
      "title": "Filters & Effects",
      "copy": "Apply clean looks for product, content, and social visuals.",
      "icon": "Sparkles"
    },
    {
      "title": "Crop & Resize",
      "copy": "Prepare images for docs, campaigns, thumbnails, and posts.",
      "icon": "LayoutGrid"
    },
    {
      "title": "Batch Export",
      "copy": "Process groups of files with consistent output settings.",
      "icon": "FileArchive"
    }
  ],
  "workflow": [
    "Import or drag in an image",
    "Apply edits and compare changes",
    "Export the final asset back to your workflow"
  ]
}$json$::jsonb, 0),
  ('video-editor', 'Video Editor', $json${
  "slug": "video-editor",
  "name": "Video Editor",
  "eyebrow": "Produce sharper videos",
  "headline": "Cut, arrange, caption, and export videos without leaving your desk.",
  "accent": "Simple enough for quick edits.",
  "summary": "A practical video editor with timeline tools, transitions, titles, audio controls, and export presets.",
  "detail": "Video Editor is designed for creators and teams who need fast, reliable edits for product clips, explainers, and social content.",
  "icon": "Film",
  "features": [
    {
      "title": "Multi-track Timeline",
      "copy": "Layer video, audio, titles, and effects with precision.",
      "icon": "Film"
    },
    {
      "title": "Transitions",
      "copy": "Add smooth movement between scenes.",
      "icon": "Share2"
    },
    {
      "title": "Audio Tools",
      "copy": "Balance sound, trim clips, and add backing tracks.",
      "icon": "Bell"
    },
    {
      "title": "Export Options",
      "copy": "Render videos in practical formats and resolutions.",
      "icon": "Upload"
    }
  ],
  "workflow": [
    "Drop clips into the timeline",
    "Trim, title, and tune audio",
    "Export a share-ready video"
  ]
}$json$::jsonb, 1),
  ('prompt-manager', 'Prompt Manager', $json${
  "slug": "prompt-manager",
  "name": "Prompt Manager",
  "eyebrow": "Organize better prompts",
  "headline": "Save, tag, search, and reuse your best AI prompts.",
  "accent": "Built for repeatable creative work.",
  "summary": "A prompt library for writers, marketers, developers, and teams who reuse AI workflows.",
  "detail": "Prompt Manager helps you collect prompt ideas, turn them into reusable templates, and keep important variations easy to find.",
  "icon": "PenTool",
  "features": [
    {
      "title": "Categories & Tags",
      "copy": "Group prompts by project, role, or outcome.",
      "icon": "Tags"
    },
    {
      "title": "Quick Search",
      "copy": "Find prompts by keyword, category, or tag.",
      "icon": "Search"
    },
    {
      "title": "Usage History",
      "copy": "Track what worked and reuse it later.",
      "icon": "TimerReset"
    },
    {
      "title": "Prompt Templates",
      "copy": "Create reusable structures for common requests.",
      "icon": "FileText"
    }
  ],
  "workflow": [
    "Capture a prompt",
    "Tag it with context",
    "Reuse and improve it over time"
  ]
}$json$::jsonb, 2),
  ('project-tracker', 'Project Tracker', $json${
  "slug": "project-tracker",
  "name": "Project Tracker",
  "eyebrow": "Keep projects moving",
  "headline": "Plan work, watch progress, and keep every task visible.",
  "accent": "Made for focused execution.",
  "summary": "A lightweight project command center for milestones, task ownership, progress, and deadlines.",
  "detail": "Project Tracker gives each project a clear home, connecting tasks, notes, files, and status updates in one view.",
  "icon": "FolderKanban",
  "features": [
    {
      "title": "Milestone Boards",
      "copy": "Break projects into stages and visible outcomes.",
      "icon": "FolderKanban"
    },
    {
      "title": "Calendar Views",
      "copy": "Connect deadlines and schedules to real work.",
      "icon": "CalendarDays"
    },
    {
      "title": "Status Controls",
      "copy": "Track blocked, active, and completed work clearly.",
      "icon": "Settings2"
    },
    {
      "title": "Team Handoff",
      "copy": "Share next steps without losing context.",
      "icon": "Share2"
    }
  ],
  "workflow": [
    "Create project milestones",
    "Attach tasks and notes",
    "Review progress from one dashboard"
  ]
}$json$::jsonb, 3),
  ('notes-docs', 'Notes & Docs', $json${
  "slug": "notes-docs",
  "name": "Notes & Docs",
  "eyebrow": "Capture every detail",
  "headline": "Write notes, store docs, and connect ideas to action.",
  "accent": "A calm place for useful thinking.",
  "summary": "A clean writing and document space for meeting notes, plans, research, and team knowledge.",
  "detail": "Notes & Docs turns scattered information into a searchable workspace that sits beside the rest of your productivity tools.",
  "icon": "FileText",
  "features": [
    {
      "title": "Rich Notes",
      "copy": "Capture formatted notes, lists, and plans.",
      "icon": "FileText"
    },
    {
      "title": "Smart Search",
      "copy": "Find old ideas and documents quickly.",
      "icon": "Search"
    },
    {
      "title": "Linked Context",
      "copy": "Connect notes to projects, tasks, and files.",
      "icon": "Share2"
    },
    {
      "title": "Archive Space",
      "copy": "Keep reference material tidy and accessible.",
      "icon": "FileArchive"
    }
  ],
  "workflow": [
    "Write or import notes",
    "Link them to active work",
    "Search and reuse what matters"
  ]
}$json$::jsonb, 4),
  ('dev-tools', 'Dev Tools', $json${
  "slug": "dev-tools",
  "name": "Dev Tools",
  "eyebrow": "Utilities for builders",
  "headline": "Small developer tools for everyday coding tasks.",
  "accent": "Fast helpers, right where you work.",
  "summary": "Handy utilities for formatting, inspecting, snippets, and developer-focused project support.",
  "detail": "Dev Tools gives technical users a compact set of helpers for common tasks, without turning DawnDesk into a heavy IDE.",
  "icon": "Code2",
  "features": [
    {
      "title": "Code Snippets",
      "copy": "Store useful snippets beside project notes.",
      "icon": "Code2"
    },
    {
      "title": "Format Helpers",
      "copy": "Clean up common text and code formats.",
      "icon": "Settings2"
    },
    {
      "title": "Quick Search",
      "copy": "Find snippets, docs, and references quickly.",
      "icon": "Search"
    },
    {
      "title": "Shareable Outputs",
      "copy": "Move useful results into tasks or docs.",
      "icon": "Share2"
    }
  ],
  "workflow": [
    "Open a utility",
    "Run the quick transformation",
    "Save the result to your workspace"
  ]
}$json$::jsonb, 5)
on conflict (slug) do update set
  name = excluded.name,
  content = excluded.content,
  sort_order = excluded.sort_order;
