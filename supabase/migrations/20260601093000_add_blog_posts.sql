create table if not exists public.blog_posts (
  slug text primary key,
  title text not null,
  category text not null,
  summary text not null,
  content jsonb not null,
  published_at date not null default current_date,
  updated_at timestamptz not null default now()
);

drop trigger if exists blog_posts_set_updated_at on public.blog_posts;
create trigger blog_posts_set_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "Public can read blog posts" on public.blog_posts;
create policy "Public can read blog posts"
on public.blog_posts for select
using (true);

insert into public.blog_posts (slug, title, category, summary, content, published_at)
values
  (
    'calmer-command-center',
    'Designing a calmer command center',
    'Product',
    'How DawnDesk keeps projects, notes, prompts, and creative tools close without overwhelming the workspace.',
    $json${
      "slug": "calmer-command-center",
      "title": "Designing a calmer command center",
      "category": "Product",
      "summary": "How DawnDesk keeps projects, notes, prompts, and creative tools close without overwhelming the workspace.",
      "content": "DawnDesk is built around a command center that keeps active work visible without turning every screen into noise. The dashboard highlights connected workspaces, saved prompts, recent operations, and useful shortcuts so users can move into the right tool quickly.",
      "publishedAt": "2026-06-01"
    }$json$::jsonb,
    '2026-06-01'
  ),
  (
    'creative-asset-workflow',
    'A practical workflow for creative assets',
    'Workflow',
    'Use the photo and video workspaces to prepare assets, then keep the outputs connected to active work.',
    $json${
      "slug": "creative-asset-workflow",
      "title": "A practical workflow for creative assets",
      "category": "Workflow",
      "summary": "Use the photo and video workspaces to prepare assets, then keep the outputs connected to active work.",
      "content": "Creative work often lives beside planning work. DawnDesk keeps photo and video editing close to notes, project context, and prompt workflows so assets can be prepared and reused without jumping between disconnected tools.",
      "publishedAt": "2026-06-01"
    }$json$::jsonb,
    '2026-06-01'
  ),
  (
    'what-is-coming-next',
    'What is coming next for DawnDesk',
    'Updates',
    'A quick look at workspace sync, collaboration improvements, and refinements planned for upcoming releases.',
    $json${
      "slug": "what-is-coming-next",
      "title": "What is coming next for DawnDesk",
      "category": "Updates",
      "summary": "A quick look at workspace sync, collaboration improvements, and refinements planned for upcoming releases.",
      "content": "Upcoming DawnDesk work focuses on stronger sync, better workspace handoffs, practical collaboration features, and smoother documentation around each sub-app. The goal is to make the suite easier to trust in daily work.",
      "publishedAt": "2026-06-01"
    }$json$::jsonb,
    '2026-06-01'
  )
on conflict (slug) do update set
  title = excluded.title,
  category = excluded.category,
  summary = excluded.summary,
  content = excluded.content,
  published_at = excluded.published_at;
