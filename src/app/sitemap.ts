import type { MetadataRoute } from "next";
import subAppsFallback from "@/content/sub-apps.json";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dawndesk.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = [
    "",
    "/solutions",
    "/sub-apps",
    "/documentation",
    "/blog",
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
    ...subAppsFallback.flatMap((app) => [
      {
        url: `${siteUrl}/sub-apps/${app.slug}`,
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
  ];
}
