import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import subAppsFallback from "@/content/sub-apps.json";
import { getSubApp } from "@/app/sub-apps/sub-app-data";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";
import { getDocumentationPageContent } from "@/lib/content";
import { getMarkdownHeadings, MarkdownContent } from "@/components/MarkdownContent";

type DocumentationPageProps = {
  params: Promise<{
    "sub-app": string;
  }>;
};

export function generateStaticParams() {
  return subAppsFallback.map((app) => ({ "sub-app": app.slug }));
}

export async function generateMetadata(props: DocumentationPageProps) {
  const params = await props.params;
  const app = await getSubApp(params["sub-app"]);
  const docs = await getDocumentationPageContent(params["sub-app"]);

  if (!app) {
    return {
      title: "Documentation - DawnDesk",
    };
  }

  return {
    ...createPageMetadata({
      title: `${app.name} Documentation`,
      description: docs?.summary ?? app.detail,
      path: `/documentation/${app.slug}`,
    }),
  };
}

export default async function DocumentationPage(props: DocumentationPageProps) {
  const params = await props.params;
  const [app, docs] = await Promise.all([
    getSubApp(params["sub-app"]),
    getDocumentationPageContent(params["sub-app"]),
  ]);

  if (!app || !docs) {
    notFound();
  }

  const Icon = app.icon;
  const headings = getMarkdownHeadings(docs.content);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="bg-black px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-white/65 hover:text-[#ffc400]" href={`/sub-apps/${app.slug}`}>
            <ArrowLeft size={16} />
            Back to {app.name}
          </Link>
          <div className="mt-10 flex items-center gap-4">
            <Icon className="text-[#ffc400]" size={34} />
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#ffc400]">Documentation</p>
          </div>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight md:text-7xl">{docs.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">{docs.summary}</p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Contents</h2>
              <nav className="mt-5 space-y-3 text-sm font-bold text-black/65">
                {headings.map((heading) => (
                  <a className={`block hover:text-[#c47800] ${heading.depth === 3 ? "pl-4 text-black/50" : ""}`} href={`#${heading.id}`} key={heading.id}>
                    {heading.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="space-y-8">
            <article className="rounded-xl border border-black/10 bg-white p-8 shadow-sm">
              <MarkdownContent content={docs.content} />
              <Link className="btn-animated btn-animated-dark mt-10 inline-flex items-center gap-3 rounded-md bg-black px-6 py-4 text-sm font-extrabold text-white" href="/api/download/windows">
                <Download size={18} />
                Download DawnDesk
              </Link>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
