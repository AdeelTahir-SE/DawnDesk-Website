update public.site_content
set content = jsonb_set(
  jsonb_set(
    content,
    '{footer,socials}',
    '["x", "yt"]'::jsonb,
    true
  ),
  '{footer,groups}',
  (
    select jsonb_agg(
      jsonb_set(
        footer_group,
        '{items}',
        coalesce(
          (
            select jsonb_agg(item)
            from jsonb_array_elements(footer_group->'items') as item
            where item #>> '{}' not in ('Careers', 'Changelog', 'Roadmap')
          ),
          '[]'::jsonb
        ),
        true
      )
    )
    from jsonb_array_elements(content->'footer'->'groups') as footer_group
  ),
  true
)
where key = 'homepage';
