import type { MetadataRoute } from "next";
import workspacesFallback from "@/content/workspaces.json";
import blogPostsFallback from "@/content/blog-posts.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dawndesk.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/solutions",
    "/workspaces",
    "/documentation",
    "/blog",
    "/login",
    "/request-a-feature",
    "/report-a-bug",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...workspacesFallback.flatMap((app) => [
      {
        url: `${siteUrl}/workspaces/${app.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
      {
        url: `${siteUrl}/documentation/${app.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
    ]),
    ...blogPostsFallback.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
