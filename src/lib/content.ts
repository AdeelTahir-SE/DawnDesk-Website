import siteFallback from "@/content/site.json";
import workspacesFallback from "@/content/workspaces.json";
import blogPostsFallback from "@/content/blog-posts.json";
import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "./supabase";

export type SiteContent = typeof siteFallback;
export type WorkspaceContent = (typeof workspacesFallback)[number];
export type BlogPostContent = (typeof blogPostsFallback)[number];
export type FeatureHistoryContent = SiteContent["updateTimeline"][number];
export type UpcomingFeatureContent = SiteContent["upcoming"][number];
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

function buildDocumentationFallback(apps: WorkspaceContent[]): DocumentationPageContent[] {
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

  const content = data.content as any;
  if (content.subAppsPreview) {
    content.workspacesPreview = content.subAppsPreview;
    delete content.subAppsPreview;
  }

  const jsonStr = JSON.stringify(content);
  const updatedStr = jsonStr
    .replace(/Sub Apps/g, "Workspaces")
    .replace(/sub apps/gi, "workspaces")
    .replace(/Sub App/g, "Workspace")
    .replace(/sub app/gi, "workspace")
    .replace(/sub-apps/g, "workspaces")
    .replace(/sub-app/g, "workspace");

  return JSON.parse(updatedStr) as SiteContent;
}

async function readWorkspacesContent(): Promise<WorkspaceContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return workspacesFallback;
  }

  const { data, error } = await supabase
    .from("sub_apps")
    .select("content")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return workspacesFallback;
  }

  return data.map((row) => row.content as WorkspaceContent);
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
    return buildDocumentationFallback(workspacesFallback);
  }

  const { data, error } = await supabase
    .from("documentation_pages")
    .select("slug,title,summary,content")
    .order("slug", { ascending: true });

  if (error || !data?.length) {
    return buildDocumentationFallback(workspacesFallback);
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

async function readFeatureHistoryContent(): Promise<FeatureHistoryContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return siteFallback.updateTimeline;
  }

  const { data, error } = await supabase
    .from("feature_history")
    .select("content")
    .order("sort_order", { ascending: false });

  if (error || !data?.length) {
    return siteFallback.updateTimeline;
  }

  return data.map((row) => row.content as FeatureHistoryContent);
}

async function readUpcomingFeaturesContent(): Promise<UpcomingFeatureContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return siteFallback.upcoming;
  }

  const { data, error } = await supabase
    .from("upcoming_features")
    .select("content")
    .order("sort_order", { ascending: false });

  if (error || !data?.length) {
    return siteFallback.upcoming;
  }

  return data.map((row) => row.content as UpcomingFeatureContent);
}

export const getSiteContent = unstable_cache(readSiteContent, ["site-content-homepage"], {
  revalidate: 3600,
  tags: ["site-content"],
});

export const getWorkspacesContent = unstable_cache(readWorkspacesContent, ["workspaces-content"], {
  revalidate: 3600,
  tags: ["workspaces-content"],
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

export const getFeatureHistoryContent = unstable_cache(readFeatureHistoryContent, ["feature-history-content"], {
  revalidate: 3600,
  tags: ["feature-history-content"],
});

export const getUpcomingFeaturesContent = unstable_cache(readUpcomingFeaturesContent, ["upcoming-features-content"], {
  revalidate: 3600,
  tags: ["upcoming-features-content"],
});

export async function getWorkspaceContent(slug: string): Promise<WorkspaceContent | undefined> {
  const apps = await getWorkspacesContent();
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
