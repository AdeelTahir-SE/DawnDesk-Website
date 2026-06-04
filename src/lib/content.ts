import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "./supabase";

export type SiteContent = typeof emptySiteContent;
export type WorkspaceContent = {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  accent: string;
  summary: string;
  detail: string;
  icon: string;
  features: {
    title: string;
    copy: string;
    icon: string;
  }[];
  workflow: string[];
};
export type BlogPostContent = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  publishedAt: string;
};
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

export const emptySiteContent = {
  navigation: {
    mainItems: ["Features", "Workspaces", "Documentation", "Releases"],
  },
  dashboard: {
    items: [] as string[],
    stats: [] as { label: string; value: number; detail: string }[],
    productivityHeights: [] as number[],
  },
  hero: {
    eyebrow: "DawnDesk",
    title: "DawnDesk",
    highlight: "Desktop productivity suite.",
    copy: "Website content is managed in Supabase.",
    primaryCta: "Download Now",
    secondaryCta: "Explore Features",
  },
  download: {
    platforms: [] as { name: string; detail: string; icon: string; active?: boolean }[],
    windows: {
      title: "DawnDesk for Windows",
      version: "",
      size: "",
      compatibility: "",
      primaryCta: "Download for Windows",
      secondaryCta: "Release notes",
      url: "",
    },
  },
  featureCards: [] as { title: string; copy: string; icon: string; tone: string }[],
  suiteTools: [] as string[],
  upcoming: [] as { version: string; title: string; copy: string; state: string; color: string }[],
  updateTimeline: [] as {
    version: string;
    date: string;
    title: string;
    summary: string;
    status: string;
    branches: { label: string; detail: string }[];
  }[],
  audiences: [] as { title: string; copy: string; icon: string; tone: string }[],
  testimonials: [] as { quote: string; name: string; role: string }[],
  workspacesPreview: {
    included: [] as string[],
    items: [] as { title: string; icon: string; href: string; copy: string }[],
  },
  toolFeatureSets: {
    photo: [] as { title: string; copy: string; icon: string }[],
    video: [] as { title: string; copy: string; icon: string }[],
    prompt: [] as { title: string; copy: string; icon: string }[],
  },
  toolHeroes: {
    photo: {
      label: "Photo Editor",
      title: "Photo Editor",
      accent: "",
      copy: "",
      button: "Open Photo Editor",
      featureSet: "photo",
      icon: "ImageIcon",
    },
    video: {
      label: "Video Editor",
      title: "Video Editor",
      accent: "",
      copy: "",
      button: "Open Video Editor",
      featureSet: "video",
      icon: "Video",
    },
    prompt: {
      label: "Prompt Manager",
      title: "Prompt Manager",
      accent: "",
      copy: "",
      button: "Open Prompt Manager",
      featureSet: "prompt",
      icon: "PenTool",
    },
  },
  toolGrids: {
    photo: {
      kicker: "PHOTO EDITOR",
      title: "Photo Editor",
      notice: "",
    },
    video: {
      kicker: "VIDEO EDITOR",
      title: "Video Editor",
      notice: "",
    },
    prompt: {
      kicker: "PROMPT MANAGER",
      title: "Prompt Manager",
      notice: "",
    },
  },
  footer: {
    copy: "DawnDesk desktop productivity suite.",
    copyright: "(c) 2026 DawnDesk. All rights reserved.",
    socials: ["x", "yt"],
    groups: [] as { title: string; items: string[] }[],
    newsletter: {
      title: "Stay in the loop",
      copy: "Get DawnDesk updates.",
      placeholder: "Enter your email",
      button: "Subscribe",
    },
  },
};

const emptyWorkspaces: WorkspaceContent[] = [];
const emptyBlogPosts: BlogPostContent[] = [];
const emptyDocumentationPages: DocumentationPageContent[] = [];
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
    return emptySiteContent;
  }

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("key", "homepage")
    .single();

  if (error || !data?.content) {
    return emptySiteContent;
  }

  const content = data.content as Record<string, unknown>;
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
    return emptyWorkspaces;
  }

  const { data, error } = await supabase
    .from("sub_apps")
    .select("content")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return emptyWorkspaces;
  }

  return data.map((row) => row.content as WorkspaceContent);
}

async function readBlogPostsContent(): Promise<BlogPostContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return emptyBlogPosts;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("content")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return emptyBlogPosts;
  }

  return data.map((row) => row.content as BlogPostContent);
}

async function readDocumentationContent(): Promise<DocumentationPageContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return emptyDocumentationPages;
  }

  const { data, error } = await supabase
    .from("documentation_pages")
    .select("slug,title,summary,content")
    .order("slug", { ascending: true });

  if (error || !data?.length) {
    return emptyDocumentationPages;
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
    return [];
  }

  const { data, error } = await supabase
    .from("feature_history")
    .select("content")
    .order("sort_order", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return data.map((row) => row.content as FeatureHistoryContent);
}

async function readUpcomingFeaturesContent(): Promise<UpcomingFeatureContent[]> {
  const supabase = createPublicSupabaseClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("upcoming_features")
    .select("content")
    .order("sort_order", { ascending: false });

  if (error || !data?.length) {
    return [];
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
