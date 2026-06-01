import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import blogPostsFallback from "@/content/blog-posts.json";
import { SiteHeader } from "@/components/SiteHeader";
import { getBlogPostContent } from "@/lib/content";
import { createPageMetadata } from "@/lib/seo";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPostsFallback.map((post) => ({ slug: post.slug }));
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
        <section className="bg-black px-5 py-20 text-white lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link className="inline-flex items-center gap-2 text-sm font-bold text-white/65 transition hover:text-[#ffc400]" href="/blog">
              <ArrowLeft size={16} />
              Back to blog
            </Link>
            <p className="eyebrow mt-10 text-[#ffc400]">{post.category}</p>
            <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">{post.summary}</p>
            <p className="mt-6 text-sm font-bold text-white/45">{post.publishedAt}</p>
          </div>
        </section>
        <section className="section">
          <div className="mx-auto max-w-3xl px-5 lg:px-8">
            <div className="rounded-md border border-black/10 bg-white p-8 text-lg leading-9 text-black/72 shadow-sm">
              {post.content}
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
