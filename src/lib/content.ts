import siteFallback from "@/content/site.json";
import subAppsFallback from "@/content/sub-apps.json";
import blogPostsFallback from "@/content/blog-posts.json";
import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "./supabase";

export type SiteContent = typeof siteFallback;
export type SubAppContent = (typeof subAppsFallback)[number];
export type BlogPostContent = (typeof blogPostsFallback)[number];
export type DocumentationPageContent = {
  slug: string;
  title: string;
  summary: string;
  content: string;
};
export type AppReleaseContent = {
  platform: "windows" | "macos" | "linux";
  version: string;
  label: string;
  arch: string;
  url: string;
  isRecommended: boolean;
  isActive: boolean;
  publishedAt: string;
  sortOrder: number;
};

function buildDocumentationFallback(apps: SubAppContent[]): DocumentationPageContent[] {
  return apps.map((app) => ({
    slug: app.slug,
    title: `${app.name} Documentation`,
    summary: app.detail,
    content: `## Overview

${app.summary}

## Key features

${app.features.map((feature) => `- **${feature.title}**: ${feature.copy}`).join("\n")}

## Workflow

${app.workflow.map((step, index) => `${index + 1}. ${step}`).join("\n")}

\`\`\`mermaid
flowchart TD
  Open[Open workspace] --> Work[Complete focused work]
  Work --> Save[Save output]
  Save --> Reuse[Reuse in DawnDesk]
\`\`\`
`,
  }));
}

const releaseFallback: AppReleaseContent[] = [
  {
    platform: "windows",
    version: "0.1.0",
    label: "Windows installer",
    arch: "x64",
    url: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS ?? "https://github.com/AdeelTahir-SE/DawnDesk/releases/download/v0.2.0/dawndesk_0.1.0_x64_en-US.msi",
    isRecommended: true,
    isActive: true,
    publishedAt: "2026-06-01",
    sortOrder: 10,
  },
];

async function readSiteContent(): Promise<SiteContent> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return siteFallback;
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", "homepage")
    .single();

  if (error || !data?.content) {
    return siteFallback;
  }

  return data.content as SiteContent;
}

async function readSubAppsContent(): Promise<SubAppContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return subAppsFallback;
  }

  const { data, error } = await supabase
    .from("sub_apps")
    .select("content")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return subAppsFallback;
  }

  return data.map((row) => row.content as SubAppContent);
}

async function readBlogPostsContent(): Promise<BlogPostContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return blogPostsFallback;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("content")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return blogPostsFallback;
  }

  return data.map((row) => row.content as BlogPostContent);
}

async function readDocumentationContent(): Promise<DocumentationPageContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return buildDocumentationFallback(subAppsFallback);
  }

  const { data, error } = await supabase
    .from("documentation_pages")
    .select("slug,title,summary,content")
    .order("slug", { ascending: true });

  if (error || !data?.length) {
    return buildDocumentationFallback(subAppsFallback);
  }

  return data as DocumentationPageContent[];
}

async function readAppReleasesContent(): Promise<AppReleaseContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return releaseFallback;
  }

  const { data, error } = await supabase
    .from("app_releases")
    .select("platform,version,label,arch,url,is_recommended,is_active,published_at,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return releaseFallback;
  }

  return data.map((row) => ({
    platform: row.platform,
    version: row.version,
    label: row.label,
    arch: row.arch,
    url: row.url,
    isRecommended: row.is_recommended,
    isActive: row.is_active,
    publishedAt: row.published_at,
    sortOrder: row.sort_order,
  })) as AppReleaseContent[];
}

export const getSiteContent = unstable_cache(readSiteContent, ["site-content-homepage"], {
  revalidate: 3600,
  tags: ["site-content"],
});

export const getSubAppsContent = unstable_cache(readSubAppsContent, ["sub-apps-content"], {
  revalidate: 3600,
  tags: ["sub-apps-content"],
});

export const getBlogPostsContent = unstable_cache(readBlogPostsContent, ["blog-posts-content"], {
  revalidate: 3600,
  tags: ["blog-posts-content"],
});

export const getDocumentationContent = unstable_cache(readDocumentationContent, ["documentation-content"], {
  revalidate: 3600,
  tags: ["documentation-content"],
});

export const getAppReleasesContent = unstable_cache(readAppReleasesContent, ["app-releases-content"], {
  revalidate: 3600,
  tags: ["app-releases-content"],
});

export async function getSubAppContent(slug: string): Promise<SubAppContent | undefined> {
  const apps = await getSubAppsContent();
  return apps.find((app) => app.slug === slug);
}

export async function getBlogPostContent(slug: string): Promise<BlogPostContent | undefined> {
  const posts = await getBlogPostsContent();
  return posts.find((post) => post.slug === slug);
}

export async function getDocumentationPageContent(slug: string): Promise<DocumentationPageContent | undefined> {
  const pages = await getDocumentationContent();
  return pages.find((page) => page.slug === slug);
}

export async function getRecommendedRelease(platform: AppReleaseContent["platform"]): Promise<AppReleaseContent | undefined> {
  const releases = await getAppReleasesContent();
  return releases.find((release) => release.platform === platform && release.isRecommended) ?? releases.find((release) => release.platform === platform);
}
