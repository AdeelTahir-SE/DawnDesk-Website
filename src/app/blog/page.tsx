import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

      <section className="bg-black px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow text-[#ffc400]">Blog</p>
          <h1 className="mt-4 max-w-3xl text-5xl font-black leading-tight md:text-7xl">Updates and workflow notes.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">Follow product improvements, workspace ideas, and practical ways to use DawnDesk.</p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-3 lg:px-8">
          {posts.map((post) => (
            <article className="rounded-md border border-black/10 bg-white p-7 shadow-sm" key={post.title}>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#c47800]">{post.category}</p>
              <h2 className="mt-4 text-2xl font-black leading-tight">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-black/62">{post.summary}</p>
              <Link className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-black" href={`/blog/${post.slug}`}>
                Read post <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
