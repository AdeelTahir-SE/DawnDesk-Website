import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { getSubApps } from "@/app/sub-apps/sub-app-data";
import { SiteHeader } from "@/components/SiteHeader";
import { getDocumentationContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Documentation",
  description: "Browse DawnDesk documentation, guides, and support resources.",
  path: "/documentation",
});

export default async function DocumentationIndexPage() {
  const [subApps, documentationPages] = await Promise.all([
    getSubApps(),
    getDocumentationContent(),
  ]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="bg-black px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-[#ffc400]">Documentation</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-7xl">Explore every DawnDesk guide.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Find product guides, setup notes, troubleshooting help, and workflow documentation in one place.</p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
          {documentationPages.map((page) => {
            const app = subApps.find((subApp) => subApp.slug === page.slug);
            const Icon = app?.icon ?? FileText;
            return (
              <Link className="group rounded-md border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#ffc400]" href={`/documentation/${page.slug}`} key={page.slug}>
                <Icon className="text-[#d29300]" size={34} />
                <h2 className="mt-5 text-xl font-black">{page.title}</h2>
                <p className="mt-3 text-sm leading-6 text-black/60">{page.summary}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-black">
                  Read docs <ArrowRight className="transition group-hover:translate-x-1" size={17} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
