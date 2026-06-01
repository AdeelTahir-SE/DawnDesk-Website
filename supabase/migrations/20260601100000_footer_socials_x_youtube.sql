update public.site_content
set content = jsonb_set(
  content,
  '{footer,socials}',
  '["x", "yt"]'::jsonb,
  true
)
where key = 'homepage';
