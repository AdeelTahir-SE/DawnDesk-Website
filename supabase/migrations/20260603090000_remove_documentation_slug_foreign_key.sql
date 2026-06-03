delete from public.documentation_pages;

alter table if exists public.documentation_pages
add constraint documentation_pages_slug_fkey foreign key (slug) references public.sub_apps(slug) on delete cascade;
