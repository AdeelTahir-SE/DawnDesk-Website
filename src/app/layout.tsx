import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
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
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen bg-brand-bg font-body text-brand-text antialiased">
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
