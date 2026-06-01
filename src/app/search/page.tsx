import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { getSiteContent, getSubAppsContent } from "@/lib/content";
import { SiteHeader } from "@/components/SiteHeader";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

type SearchResult = {
  title: string;
  category: string;
  href: string;
  summary: string;
  haystack: string;
};

function scoreResult(result: SearchResult, query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const title = result.title.toLowerCase();
  const haystack = result.haystack.toLowerCase();

  return words.reduce((score, word) => {
    if (title.includes(word)) return score + 3;
    if (haystack.includes(word)) return score + 1;
    return score;
  }, 0);
}

export const metadata = {
  title: "Search - DawnDesk",
  description: "Search DawnDesk pages, sub-apps, and documentation.",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const query = (searchParams?.q ?? "").trim();
  const [siteContent, subApps] = await Promise.all([getSiteContent(), getSubAppsContent()]);

  const results: SearchResult[] = [
    {
      title: "Download DawnDesk",
      category: "Download",
      href: "/#download",
      summary: siteContent.download.windows.compatibility,
      haystack: JSON.stringify(siteContent.download),
    },
    {
      title: "Features",
      category: "Website",
      href: "/#features",
      summary: "Explore DawnDesk productivity, project, notes, creative, and workflow features.",
      haystack: JSON.stringify(siteContent.featureCards),
    },
    {
      title: "Sub Apps",
      category: "Website",
      href: "/sub-apps",
      summary: "Browse the complete DawnDesk toolkit and open each detail page.",
      haystack: JSON.stringify(siteContent.subAppsPreview),
    },
    {
      title: "Documentation",
      category: "Docs",
      href: "/documentation",
      summary: "Browse DawnDesk documentation for each built-in workspace.",
      haystack: "documentation guides help docs workspace sub apps",
    },
    {
      title: "Blog",
      category: "Blog",
      href: "/blog",
      summary: "Product notes, workflow ideas, and release updates from DawnDesk.",
      haystack: "blog resources updates workflow product release notes",
    },
    {
      title: "Request a Feature",
      category: "Support",
      href: "/request-a-feature",
      summary: "Send a DawnDesk feature request.",
      haystack: "feature request idea feedback roadmap support",
    },
    {
      title: "Report a Bug",
      category: "Support",
      href: "/report-a-bug",
      summary: "Report a DawnDesk issue with an optional screenshot attachment.",
      haystack: "bug report issue problem screenshot attachment support",
    },
    ...subApps.flatMap((app) => [
      {
        title: app.name,
        category: "Sub App",
        href: `/sub-apps/${app.slug}`,
        summary: app.summary,
        haystack: JSON.stringify(app),
      },
      {
        title: `${app.name} Documentation`,
        category: "Documentation",
        href: `/documentation/${app.slug}`,
        summary: app.detail,
        haystack: JSON.stringify(app),
      },
    ]),
  ];

  const matches = query
    ? results
        .map((result) => ({ result, score: scoreResult(result, query) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ result }) => result)
    : results.slice(0, 8);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="bg-black px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="eyebrow text-[#ffc400]">Search</p>
          <h1 className="mt-4 text-5xl font-black leading-tight md:text-7xl">Find anything in DawnDesk.</h1>
          <form className="mt-9 flex overflow-hidden rounded-md border border-white/15 bg-white text-black shadow-[0_0_50px_rgba(255,196,0,0.14)]" action="/search">
            <input
              autoFocus
              className="min-w-0 flex-1 px-5 py-4 text-base outline-none"
              defaultValue={query}
              name="q"
              placeholder="Search features, docs, sub-apps..."
              type="search"
            />
            <button className="flex items-center gap-2 bg-[#ffc400] px-6 text-sm font-extrabold text-black" type="submit">
              <Search size={18} />
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-[#c47800]">{query ? "Results" : "Popular pages"}</p>
              <h2 className="mt-2 text-3xl font-black">
                {query ? `${matches.length} result${matches.length === 1 ? "" : "s"} for "${query}"` : "Start with these pages"}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {matches.map((result) => (
              <Link className="group block rounded-md border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#ffc400]" href={result.href} key={`${result.category}-${result.href}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#c47800]">{result.category}</p>
                    <h3 className="mt-2 text-2xl font-black">{result.title}</h3>
                    <p className="mt-3 leading-7 text-black/62">{result.summary}</p>
                  </div>
                  <ArrowRight className="shrink-0 text-black/35 transition group-hover:translate-x-1 group-hover:text-[#c47800]" size={22} />
                </div>
              </Link>
            ))}
          </div>

          {query && matches.length === 0 && (
            <div className="rounded-md border border-black/10 bg-white p-8 text-center shadow-sm">
              <h3 className="text-2xl font-black">No results found</h3>
              <p className="mt-3 text-black/60">Try searching for a sub-app name, feature, bug report, documentation, or download.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
