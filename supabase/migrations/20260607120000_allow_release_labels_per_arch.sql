alter table public.app_releases
drop constraint if exists app_releases_platform_version_arch_key;

alter table public.app_releases
add constraint app_releases_platform_version_arch_label_key
unique (platform, version, arch, label);
