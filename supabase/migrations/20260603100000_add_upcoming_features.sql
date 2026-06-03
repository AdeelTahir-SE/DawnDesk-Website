create table if not exists public.upcoming_features (
  version text primary key,
  title text not null,
  content jsonb not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists upcoming_features_set_updated_at on public.upcoming_features;

create trigger upcoming_features_set_updated_at
before update on public.upcoming_features
for each row
execute function public.set_updated_at();

alter table public.upcoming_features enable row level security;

drop policy if exists "Public can read upcoming features" on public.upcoming_features;

create policy "Public can read upcoming features"
on public.upcoming_features
for select
using (true);

insert into public.upcoming_features (version, title, content, sort_order)
values
  (
    'v2.3',
    'Automation Builder',
    $json${
      "version": "v2.3",
      "title": "Automation Builder",
      "copy": "Create repeatable workflows without extra setup",
      "state": "Planned",
      "color": "bg-violet-400"
    }$json$::jsonb,
    10
  ),
  (
    'v2.2',
    'Advanced Analytics',
    $json${
      "version": "v2.2",
      "title": "Advanced Analytics",
      "copy": "Deep insights and productivity reports",
      "state": "In Progress",
      "color": "bg-sky-400"
    }$json$::jsonb,
    20
  ),
  (
    'v2.1',
    'Team Collaboration',
    $json${
      "version": "v2.1",
      "title": "Team Collaboration",
      "copy": "Real-time collaboration and comments",
      "state": "Coming Soon",
      "color": "bg-amber-400"
    }$json$::jsonb,
    30
  )
on conflict (version) do update set
  title = excluded.title,
  content = excluded.content,
  sort_order = excluded.sort_order,
  updated_at = now();
