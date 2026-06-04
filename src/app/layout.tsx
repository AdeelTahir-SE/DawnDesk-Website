import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dawndesk.app";
const siteDescription =
  "DawnDesk is a desktop productivity suite that connects projects, notes, prompts, creative editing, documentation, and support workflows in one focused workspace.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DawnDesk - Desktop Productivity Suite",
    template: "%s | DawnDesk",
  },
  description: siteDescription,
  applicationName: "DawnDesk",
  authors: [{ name: "DawnDesk" }],
  creator: "DawnDesk",
  publisher: "DawnDesk",
  category: "Productivity Software",
  keywords: [
    "DawnDesk",
    "desktop productivity app",
    "project management",
    "notes app",
    "prompt manager",
    "photo editor",
    "video editor",
    "workflow tools",
  ],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "DawnDesk",
    title: "DawnDesk - Desktop Productivity Suite",
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DawnDesk desktop productivity suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DawnDesk",
    creator: "@DawnDesk",
    title: "DawnDesk - Desktop Productivity Suite",
    description: siteDescription,
    images: ["/twitter-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-bg font-body text-brand-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "DawnDesk",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Windows, macOS, Linux",
              description: siteDescription,
              url: siteUrl,
              image: `${siteUrl}/opengraph-image`,
              downloadUrl: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS,
              publisher: {
                "@type": "Organization",
                name: "DawnDesk",
                url: siteUrl,
                logo: `${siteUrl}/realistic_logo.png`,
                sameAs: ["https://x.com/DawnDesk", "https://www.youtube.com/@DawnDeskOfficial"],
              },
            }),
          }}
        />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
