create table if not exists public.feature_history (
  version text primary key,
  title text not null,
  content jsonb not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists feature_history_set_updated_at on public.feature_history;

create trigger feature_history_set_updated_at
before update on public.feature_history
for each row
execute function public.set_updated_at();

alter table public.feature_history enable row level security;

drop policy if exists "Public can read feature history" on public.feature_history;

create policy "Public can read feature history"
on public.feature_history
for select
using (true);

insert into public.feature_history (version, title, content, sort_order)
values
  (
    'v0.3.0',
    'Creative workspaces become connected',
    $json${
      "version": "v0.3.0",
      "date": "June 2026",
      "title": "Creative workspaces become connected",
      "summary": "This update grows DawnDesk into a clearer creative suite, keeping photo, video, prompt, and project work connected from the main dashboard.",
      "status": "Latest branch",
      "branches": [
        {
          "label": "Photo Editor",
          "detail": "Improved editor preview, faster tool discovery, and clearer feature grouping for daily edits."
        },
        {
          "label": "Video Editor",
          "detail": "Timeline-focused workspace with stronger export messaging and creator-friendly editing paths."
        },
        {
          "label": "Prompt Manager",
          "detail": "Better prompt categories, search flow, and reuse patterns for AI-assisted writing and planning."
        }
      ]
    }$json$::jsonb,
    30
  ),
  (
    'v0.2.0',
    'Sub apps branch from the core suite',
    $json${
      "version": "v0.2.0",
      "date": "May 2026",
      "title": "Sub apps branch from the core suite",
      "summary": "DawnDesk starts presenting each tool as its own focused workspace while keeping the install and navigation unified.",
      "status": "Shipped",
      "branches": [
        {
          "label": "Sub App Pages",
          "detail": "Dedicated detail pages explain each workspace, its workflow, and where it fits in DawnDesk."
        },
        {
          "label": "Documentation",
          "detail": "Docs pages mirror the app structure so users can learn the exact tool they opened."
        },
        {
          "label": "Search",
          "detail": "Site search helps users jump across features, docs, blog posts, and support flows."
        }
      ]
    }$json$::jsonb,
    20
  ),
  (
    'v0.1.0',
    'Foundation for the DawnDesk workflow',
    $json${
      "version": "v0.1.0",
      "date": "April 2026",
      "title": "Foundation for the DawnDesk workflow",
      "summary": "The first public structure introduces the main productivity promise: one place for projects, notes, downloads, and focused tools.",
      "status": "Foundation",
      "branches": [
        {
          "label": "Dashboard",
          "detail": "A central command view shows the product direction and organizes the core app experience."
        },
        {
          "label": "Download Flow",
          "detail": "Windows installer path, platform cards, and release content establish the shipping pipeline."
        },
        {
          "label": "Support",
          "detail": "Bug reporting, feature requests, and content management routes prepare the feedback loop."
        }
      ]
    }$json$::jsonb,
    10
  )
on conflict (version) do update set
  title = excluded.title,
  content = excluded.content,
  sort_order = excluded.sort_order,
  updated_at = now();
