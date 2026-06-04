import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { getBlogPostContent, getBlogPostsContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";
import { MarkdownContent } from "@/components/MarkdownContent";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const posts = await getBlogPostsContent();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const post = await getBlogPostContent(slug);

  if (!post) {
    return {
      title: "Blog - DawnDesk",
    };
  }

  return {
    ...createPageMetadata({
      title: post.title,
      description: post.summary,
      path: `/blog/${post.slug}`,
    }),
  };
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const { slug } = await props.params;
  const post = await getBlogPostContent(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />
      <article>
        <section className="relative overflow-hidden bg-black px-5 py-20 text-white lg:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(255,196,0,0.22),transparent_34%)]" />
          <div className="relative mx-auto max-w-4xl">
            <Link className="btn-animated inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-bold text-white/72 transition hover:border-[#ffc400] hover:text-[#ffc400]" href="/blog">
              <ArrowLeft size={16} />
              Back to blog
            </Link>
            <p className="mt-10 text-xs font-black uppercase tracking-[0.18em] text-[#ffc400]">{post.category}</p>
            <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">{post.summary}</p>
            <p className="mt-6 text-sm font-bold text-white/45">{post.publishedAt}</p>
          </div>
        </section>
        <section className="section">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-xl border border-black/10 bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c47800]">Article</p>
                <h2 className="mt-4 text-xl font-black leading-tight">{post.title}</h2>
                <p className="mt-4 text-sm leading-6 text-black/58">Markdown content with headings, lists, code blocks, and Mermaid diagrams.</p>
              </div>
            </aside>
            <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm md:p-10">
              <MarkdownContent content={post.content} />
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
