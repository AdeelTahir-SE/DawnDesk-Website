import siteFallback from "@/content/site.json";
import subAppsFallback from "@/content/sub-apps.json";
import blogPostsFallback from "@/content/blog-posts.json";
import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "./supabase";

export type SiteContent = typeof siteFallback;
export type SubAppContent = (typeof subAppsFallback)[number];
export type BlogPostContent = (typeof blogPostsFallback)[number];

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

export async function getSubAppContent(slug: string): Promise<SubAppContent | undefined> {
  const apps = await getSubAppsContent();
  return apps.find((app) => app.slug === slug);
}

export async function getBlogPostContent(slug: string): Promise<BlogPostContent | undefined> {
  const posts = await getBlogPostsContent();
  return posts.find((post) => post.slug === slug);
}
