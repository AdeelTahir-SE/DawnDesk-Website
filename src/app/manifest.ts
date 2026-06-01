import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DawnDesk",
    short_name: "DawnDesk",
    description: "A desktop productivity suite for projects, notes, prompts, creative editing, and connected workflows.",
    start_url: "/",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#ffc400",
    icons: [
      {
        src: "/realistic_logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/realistic_logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
