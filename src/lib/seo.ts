import type { Metadata } from "next";

const ogImage = "/opengraph-image";

export function createPageMetadata({
  description,
  path,
  title,
}: {
  description: string;
  path: string;
  title: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | DawnDesk`,
      description,
      url: path,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "DawnDesk desktop productivity suite",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | DawnDesk`,
      description,
      images: ["/twitter-image"],
    },
  };
}
