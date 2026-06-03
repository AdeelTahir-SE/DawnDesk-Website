create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contact_submissions enable row level security;

-- Only admins should be able to view these, or service roles.
-- Standard users don't need access. Insertions from the web go through a server action,
-- which bypasses RLS using the admin service role key, so we don't need an insert policy
-- for anon users unless we want them to insert directly from the client.
-- Since we are using a Server Action, no public policies are strictly needed.
