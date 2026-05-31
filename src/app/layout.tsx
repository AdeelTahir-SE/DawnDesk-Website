import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "DawnDesk - All-in-One Desktop Productivity Suite",
  description:
    "DawnDesk brings tasks, notes, projects, editing tools, prompts, and productivity workflows into one focused desktop app.",
  openGraph: {
    title: "DawnDesk",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-bg font-body text-brand-text antialiased">
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
