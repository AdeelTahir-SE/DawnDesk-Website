import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";
import { getBlogPostsContent } from "@/lib/content";

export const metadata = createPageMetadata({
  title: "Blog",
  description: "Product notes, workflow ideas, and release updates from DawnDesk.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getBlogPostsContent();

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-black px-5 py-24 text-white lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,196,0,0.22),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">DawnDesk blog</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-7xl">Updates, workflows, and product notes.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Read product improvements, practical workspace ideas, and technical notes written in markdown with support for code and diagrams.</p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-3 lg:px-8">
          {posts.map((post) => (
            <article className="group flex min-h-[320px] flex-col rounded-xl border border-black/10 bg-white p-7 shadow-sm" key={post.title}>
              <div className="flex items-center justify-between gap-4">
                <p className="rounded-full bg-[#fff3bf] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#9a6500]">{post.category}</p>
                <span className="flex items-center gap-2 text-xs font-bold text-black/45"><CalendarDays size={14} />{post.publishedAt}</span>
              </div>
              <h2 className="mt-5 text-2xl font-black leading-tight transition group-hover:text-[#9a6500]">{post.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-black/62">{post.summary}</p>
              <Link className="btn-animated mt-7 inline-flex w-fit items-center gap-2 rounded-md border border-black/12 px-5 py-3 text-sm font-extrabold text-black hover:border-[#ffc400]" href={`/blog/${post.slug}`}>
                Read post <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
