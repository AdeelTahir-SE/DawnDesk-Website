import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database, FileText, ImageUp, LayoutDashboard, Link as LinkIcon, LogOut, Newspaper, PlusCircle } from "lucide-react";
import { getAppReleasesContent, getBlogPostsContent, getDocumentationContent, getSiteContent, getSubAppsContent } from "@/lib/content";
import { createAdminSupabaseClient } from "@/lib/supabase";
import {
  appReleasesSchema,
  blogPostSchema,
  blogPostsSchema,
  documentationPagesSchema,
  formatZodError,
  subAppSchema,
} from "@/lib/content-validation";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "DawnDesk@2026";
const ADMIN_COOKIE = "dawndesk_admin";
const ADMIN_COOKIE_VALUE = "dawndesk-admin-session-v1";

type AdminPageProps = {
  searchParams?: Promise<{
    error?: string;
    media?: string;
    saved?: string;
  }>;
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin - DawnDesk",
  robots: {
    index: false,
    follow: false,
  },
};

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === ADMIN_COOKIE_VALUE;
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin?error=session");
  }
}

async function signInAdmin(formData: FormData) {
  "use server";

  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    redirect("/admin?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, ADMIN_COOKIE_VALUE, {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/admin");
}

async function signOutAdmin() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin");
}

function parseJsonOrRedirect(content: string) {
  try {
    return JSON.parse(content) as unknown;
  } catch {
    redirect("/admin?error=Invalid JSON format");
  }
}

async function saveHomepageContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = parseJsonOrRedirect(content);
  const { error } = await supabase
    .from("site_content")
    .upsert({ key: "homepage", content: parsed }, { onConflict: "key" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidateTag("site-content", "max");
  redirect("/admin?saved=homepage");
}

async function saveSubAppContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "");
  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = parseJsonOrRedirect(content);
  const validation = subAppSchema.safeParse(parsed);
  if (!validation.success) {
    redirect(`/admin?error=${encodeURIComponent(formatZodError(validation.error))}`);
  }
  const { error } = await supabase
    .from("sub_apps")
    .upsert(
      {
        slug,
        name: validation.data.name,
        content: validation.data,
      },
      { onConflict: "slug" },
    );

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/sub-apps");
  revalidatePath(`/sub-apps/${slug}`);
  revalidatePath(`/documentation/${slug}`);
  revalidateTag("sub-apps-content", "max");
  revalidateTag("documentation-content", "max");
  redirect(`/admin?saved=${slug}`);
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createSubAppContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const parsed = parseJsonOrRedirect(content);
  const validation = subAppSchema.safeParse(parsed);
  if (!validation.success) {
    redirect(`/admin?error=${encodeURIComponent(formatZodError(validation.error))}`);
  }
  const { slug, name } = validation.data;

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data: lastApp } = await supabase
    .from("sub_apps")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = Number(lastApp?.sort_order ?? 0) + 10;
  const { error } = await supabase
    .from("sub_apps")
    .upsert({
      slug,
      name,
      content: validation.data,
      sort_order: sortOrder,
    }, { onConflict: "slug" });

  if (error) {
    throw new Error(error.message);
  }

  await supabase
    .from("documentation_pages")
    .upsert({
      slug,
      title: `${name} Documentation`,
      summary: validation.data.detail,
      content: `## Overview

${validation.data.summary}

## Key features

${validation.data.features.map((feature) => `- **${feature.title}**: ${feature.copy}`).join("\n")}

## Workflow

${validation.data.workflow.map((step, index) => `${index + 1}. ${step}`).join("\n")}

\`\`\`mermaid
flowchart TD
  Open[Open ${name}] --> Work[Complete focused work]
  Work --> Save[Save output]
  Save --> Reuse[Reuse in DawnDesk]
\`\`\`
`,
    }, { onConflict: "slug" });

  revalidatePath("/");
  revalidatePath("/sub-apps");
  revalidatePath(`/sub-apps/${slug}`);
  revalidatePath(`/documentation/${slug}`);
  revalidateTag("sub-apps-content", "max");
  revalidateTag("documentation-content", "max");
  redirect(`/admin?saved=${slug}`);
}

async function saveSingleBlogPostContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const parsed = parseJsonOrRedirect(content);
  const validation = blogPostSchema.safeParse(parsed);
  if (!validation.success) {
    redirect(`/admin?error=${encodeURIComponent(formatZodError(validation.error))}`);
  }

  const post = validation.data;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { error } = await supabase
    .from("blog_posts")
    .upsert({
      slug: post.slug,
      title: post.title,
      category: post.category,
      summary: post.summary,
      content: post,
      published_at: post.publishedAt,
    }, { onConflict: "slug" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidateTag("blog-posts-content", "max");
  redirect(`/admin?saved=blog-${post.slug}`);
}

async function saveBlogPostsContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = parseJsonOrRedirect(content);
  const validation = blogPostsSchema.safeParse(parsed);
  if (!validation.success) {
    redirect(`/admin?error=${encodeURIComponent(formatZodError(validation.error))}`);
  }

  const rows = validation.data.map((post) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    summary: post.summary,
    content: post,
    published_at: post.publishedAt,
  }));

  const { error } = await supabase
    .from("blog_posts")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    throw new Error(error.message);
  }

  const slugs = validation.data.map((post) => post.slug);
  if (slugs.length > 0) {
    await supabase.from("blog_posts").delete().not("slug", "in", `(${slugs.map((slug) => `"${slug}"`).join(",")})`);
  }

  revalidatePath("/blog");
  for (const slug of slugs) {
    revalidatePath(`/blog/${slug}`);
  }
  revalidateTag("blog-posts-content", "max");
  redirect("/admin?saved=blog");
}

async function saveDocumentationContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = parseJsonOrRedirect(content);
  const validation = documentationPagesSchema.safeParse(parsed);
  if (!validation.success) {
    redirect(`/admin?error=${encodeURIComponent(formatZodError(validation.error))}`);
  }

  const { error } = await supabase
    .from("documentation_pages")
    .upsert(validation.data, { onConflict: "slug" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/documentation");
  for (const page of validation.data) {
    revalidatePath(`/documentation/${page.slug}`);
  }
  revalidateTag("documentation-content", "max");
  redirect("/admin?saved=documentation");
}

async function saveReleasesContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = parseJsonOrRedirect(content);
  const validation = appReleasesSchema.safeParse(parsed);
  if (!validation.success) {
    redirect(`/admin?error=${encodeURIComponent(formatZodError(validation.error))}`);
  }

  const rows = validation.data.map((release) => ({
    platform: release.platform,
    version: release.version,
    label: release.label,
    arch: release.arch,
    url: release.url,
    is_recommended: release.isRecommended,
    is_active: release.isActive,
    published_at: release.publishedAt,
    sort_order: release.sortOrder,
  }));

  const { error } = await supabase
    .from("app_releases")
    .upsert(rows, { onConflict: "platform,version,arch" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidateTag("app-releases-content", "max");
  redirect("/admin?saved=releases");
}

async function uploadMedia(formData: FormData) {
  "use server";
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin?error=Choose a media file to upload");
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const extension = file.name.split(".").pop() || "bin";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const storagePath = `${Date.now()}-${crypto.randomUUID()}-${safeName}`;
  const { error } = await supabase.storage
    .from("site-media")
    .upload(storagePath, file, {
      contentType: file.type || "application/octet-stream",
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from("site-media").getPublicUrl(storagePath);
  await supabase.from("media_uploads").insert({
    file_name: file.name,
    storage_path: storagePath,
    public_url: data.publicUrl,
    content_type: file.type || null,
    size_bytes: file.size,
  });

  redirect(`/admin?saved=media&media=${encodeURIComponent(data.publicUrl)}`);
}

function AdminLogin({ error }: { error?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 text-white">
      <div className="w-full max-w-md rounded-xl border border-white/12 bg-white/[0.06] p-8 shadow-[0_0_80px_rgba(255,196,0,0.16)]">
        <p className="eyebrow text-[#ffc400]">DawnDesk admin</p>
        <h1 className="mt-4 text-4xl font-black">Sign in</h1>
        <p className="mt-4 leading-7 text-white/62">Use the server-side admin credentials to edit website content stored in Supabase.</p>
        {error === "invalid" && <p className="mt-5 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">Invalid username or password.</p>}
        {error === "session" && <p className="mt-5 rounded-md border border-[#ffc400]/30 bg-[#ffc400]/10 px-4 py-3 text-sm font-bold text-[#ffe28a]">Please sign in to continue.</p>}
        <form action={signInAdmin} className="mt-7 space-y-4">
          <input className="w-full rounded-md border border-white/15 bg-black/35 px-4 py-3 text-sm text-white outline-none" name="username" placeholder="Username" />
          <input className="w-full rounded-md border border-white/15 bg-black/35 px-4 py-3 text-sm text-white outline-none" name="password" placeholder="Password" type="password" />
          <button className="btn-animated w-full rounded-md bg-[#ffc400] px-6 py-4 text-sm font-extrabold text-black" type="submit">Open admin</button>
        </form>
      </div>
    </main>
  );
}

function JsonEditor({
  action,
  button,
  content,
  format,
  rows = 20,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  button: string;
  content: unknown;
  format?: {
    example: unknown;
    notes: string[];
    title: string;
  };
  rows?: number;
  title: string;
}) {
  return (
    <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black">{title}</h2>
        <span className="rounded bg-[#fff3bf] px-3 py-1 text-xs font-black text-black/72">Supabase JSON</span>
      </div>
      <div className={`mt-5 grid gap-5 ${format ? "xl:grid-cols-[1.35fr_0.75fr]" : ""}`}>
        <form action={action} className="space-y-4">
          <textarea
            className="w-full rounded-md border border-black/15 bg-[#101012] p-4 font-mono text-xs leading-6 text-white outline-none"
            name="content"
            rows={rows}
            defaultValue={JSON.stringify(content, null, 2)}
            spellCheck={false}
          />
          <button className="btn-animated btn-animated-dark rounded-md bg-black px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#ffc400] hover:text-black" type="submit">
            {button}
          </button>
        </form>
        {format && <JsonFormatGuide {...format} />}
      </div>
    </section>
  );
}

function JsonFormatGuide({
  example,
  notes,
  title,
}: {
  example: unknown;
  notes: string[];
  title: string;
}) {
  return (
    <aside className="rounded-md border border-black/10 bg-[#fbfaf7] p-5">
      <h3 className="text-lg font-black">{title}</h3>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-black/65">
        {notes.map((note) => <li key={note}>{note}</li>)}
      </ul>
      <pre className="mt-5 max-h-[360px] overflow-auto rounded-md bg-[#101012] p-4 text-xs leading-6 text-white">
        <code>{JSON.stringify(example, null, 2)}</code>
      </pre>
    </aside>
  );
}

const homepageFormat = {
  title: "Homepage JSON format",
  notes: [
    "Keep the top-level object keys intact.",
    "Navigation, download, footer, and section objects are required by the homepage.",
    "Icon values must match supported lucide icon names used by the site.",
  ],
  example: {
    hero: {
      eyebrow: "DawnDesk",
      title: "Workspace command center",
      primaryCta: "Download for Windows",
    },
    download: {
      windows: {
        title: "DawnDesk for Windows",
        version: "Version 0.1.0",
      },
    },
    footer: {
      socials: ["x", "yt"],
    },
  },
};

const blogArrayFormat = {
  title: "Blog array format",
  notes: [
    "This editor replaces the full blog list.",
    "Use the single-blog form above when you only want to add or update one post.",
    "content is markdown and supports headings, links, images, code blocks, and Mermaid.",
  ],
  example: [
    {
      slug: "example-post",
      title: "Example Post",
      category: "Guide",
      summary: "A short summary of at least twenty characters.",
      publishedAt: "2026-06-01",
      content: "## Heading\n\nMarkdown content here.",
    },
  ],
};

const docsFormat = {
  title: "Documentation array format",
  notes: [
    "Each documentation slug must match a sub-app slug.",
    "content is markdown and headings automatically become section links.",
    "Use image markdown like ![Caption](https://example.com/image.png).",
  ],
  example: [
    {
      slug: "photo-editor",
      title: "Photo Editor Documentation",
      summary: "A short documentation summary.",
      content: "## Overview\n\nDocumentation markdown.\n\n```mermaid\nflowchart TD\n  A --> B\n```",
    },
  ],
};

const releasesFormat = {
  title: "Release array format",
  notes: [
    "platform must be windows, macos, or linux.",
    "Set isActive false to hide an old release from users.",
    "Set one recommended release per platform for auto-selection.",
  ],
  example: [
    {
      platform: "windows",
      version: "0.1.0",
      label: "Windows installer",
      arch: "x64",
      url: "https://github.com/AdeelTahir-SE/DawnDesk/releases/download/v0.2.0/dawndesk_0.1.0_x64_en-US.msi",
      isRecommended: true,
      isActive: true,
      publishedAt: "2026-06-01",
      sortOrder: 10,
    },
  ],
};

function NewSubAppForm() {
  const example = {
    slug: "automation-hub",
    name: "Automation Hub",
    eyebrow: "Automate repeated work",
    headline: "Build simple automations for recurring DawnDesk workflows.",
    accent: "Made for repeatable operations.",
    summary: "A focused automation workspace for connecting routine steps across projects, notes, prompts, and creative outputs.",
    detail: "Automation Hub helps users turn repeated actions into structured workflows that stay connected to the rest of DawnDesk.",
    icon: "Sparkles",
    features: [
      { title: "Workflow Recipes", copy: "Save repeatable step-by-step workflows for common operations.", icon: "Settings2" },
      { title: "Connected Outputs", copy: "Send generated results back into projects, notes, or documentation.", icon: "Share2" },
      { title: "Quick Search", copy: "Find saved automations by name, context, or workspace.", icon: "Search" },
      { title: "Execution History", copy: "Review what ran recently and where the output was saved.", icon: "TimerReset" },
    ],
    workflow: ["Create an automation recipe", "Run it inside the active workspace", "Review and reuse the output"],
  };

  return (
    <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c47800]">New sub app</p>
          <h2 className="mt-2 text-2xl font-black">Create sub app from JSON</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">Paste one JSON object in this exact shape. The same record powers the sub-app listing, detail page, and starter documentation page.</p>
        </div>
        <span className="rounded-full bg-[#fff3bf] px-4 py-2 text-xs font-black text-black/72">Supabase row</span>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.85fr]">
        <form action={createSubAppContent} className="space-y-4">
          <textarea
            className="min-h-[520px] w-full rounded-md border border-black/15 bg-[#101012] p-4 font-mono text-xs leading-6 text-white outline-none"
            name="content"
            defaultValue={JSON.stringify(example, null, 2)}
            spellCheck={false}
            required
          />
          <button className="btn-animated inline-flex w-fit items-center gap-2 rounded-md bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black" type="submit">
            <PlusCircle size={18} />
            Add sub app JSON
          </button>
        </form>
        <div className="rounded-md border border-black/10 bg-[#fbfaf7] p-5">
          <h3 className="text-lg font-black">Required JSON format</h3>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-black/65">
            <li><code>slug</code>: lowercase hyphenated id</li>
            <li><code>name</code>, <code>eyebrow</code>, <code>headline</code>, <code>accent</code>, <code>summary</code>, <code>detail</code></li>
            <li><code>icon</code>: one lucide icon name already used in the app, e.g. <code>Sparkles</code></li>
            <li><code>features</code>: array of objects with <code>title</code>, <code>copy</code>, <code>icon</code></li>
            <li><code>workflow</code>: array of short workflow steps</li>
          </ul>
          <p className="mt-5 rounded-md bg-white px-4 py-3 text-sm font-bold text-black/62">Saving this also creates a starter markdown documentation page for the same slug.</p>
        </div>
      </div>
    </section>
  );
}

function NewBlogPostForm() {
  const example = {
    slug: "using-markdown-in-dawndesk-docs",
    title: "Using Markdown in DawnDesk Docs",
    category: "Guide",
    summary: "A practical guide showing markdown, images, code blocks, and Mermaid diagrams in DawnDesk content.",
    publishedAt: "2026-06-01",
    content: "## Start with markdown\n\nWrite normal markdown content here. You can use **bold text**, `inline code`, links like [DawnDesk](/), and images.\n\n![DawnDesk logo](/realistic_logo.png)\n\n### Mermaid diagram\n\n```mermaid\nflowchart TD\n  Admin[Admin JSON] --> Supabase[(Supabase)]\n  Supabase --> Blog[Blog page]\n```\n\n### Code example\n\n```js\nconst renderer = \"markdown\";\nconsole.log(renderer);\n```",
  };

  return (
    <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c47800]">New blog post</p>
          <h2 className="mt-2 text-2xl font-black">Add one blog from JSON</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">Paste one blog JSON object. This saves or updates only that post and does not replace the full blog list.</p>
        </div>
        <span className="rounded-full bg-[#fff3bf] px-4 py-2 text-xs font-black text-black/72">Single post</span>
      </div>
      <form action={saveSingleBlogPostContent} className="mt-6 space-y-4">
        <textarea
          className="min-h-[420px] w-full rounded-md border border-black/15 bg-[#101012] p-4 font-mono text-xs leading-6 text-white outline-none"
          name="content"
          defaultValue={JSON.stringify(example, null, 2)}
          spellCheck={false}
          required
        />
        <button className="btn-animated inline-flex w-fit items-center gap-2 rounded-md bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black" type="submit">
          <PlusCircle size={18} />
          Add blog JSON
        </button>
      </form>
    </section>
  );
}

export default async function AdminPage(props: AdminPageProps) {
  const searchParams = await props.searchParams;

  if (!(await isAdminAuthenticated())) {
    return <AdminLogin error={searchParams?.error} />;
  }

  const [siteContent, subApps, blogPosts, documentationPages, releases] = await Promise.all([
    getSiteContent(),
    getSubAppsContent(),
    getBlogPostsContent(),
    getDocumentationContent(),
    getAppReleasesContent(),
  ]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <header className="border-b border-black/10 bg-white px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow text-[#c47800]">DawnDesk admin</p>
            <h1 className="mt-2 text-4xl font-black">Website content</h1>
          </div>
          <form action={signOutAdmin}>
            <button className="btn-animated inline-flex items-center gap-2 rounded-md border border-black/15 px-5 py-3 text-sm font-extrabold text-black transition hover:border-[#ffc400]" type="submit">
              <LogOut size={17} />
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {searchParams?.saved && <p className="mb-6 rounded-md border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Saved `{searchParams.saved}` and revalidated cached pages.</p>}
        {searchParams?.error && <p className="mb-6 rounded-md border border-red-500/20 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{searchParams.error}</p>}
        {searchParams?.media && (
          <div className="mb-6 rounded-md border border-[#ffc400]/40 bg-[#fff8d6] px-4 py-3 text-sm font-bold text-black">
            Uploaded media URL:
            <code className="ml-2 break-all rounded bg-white/70 px-2 py-1 text-xs">{searchParams.media}</code>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Homepage", "Main landing page content", LayoutDashboard, "#admin-homepage"],
            ["Sub apps", `${subApps.length} workspace records`, Database, "#admin-sub-apps"],
            ["Blog", `${blogPosts.length} published posts`, Newspaper, "#admin-blog"],
            ["Docs", `${documentationPages.length} markdown pages`, FileText, "#admin-docs"],
            ["Releases", `${releases.length} active files`, LinkIcon, "#admin-releases"],
          ].map(([title, copy, Icon, href]) => (
            <a className="group rounded-md border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#ffc400] hover:shadow-lg" href={href as string} key={title as string}>
              <Icon className="text-[#d29300]" size={28} />
              <h2 className="mt-4 text-xl font-black transition group-hover:text-[#9a6500]">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-black/58">{copy as string}</p>
            </a>
          ))}
        </section>

        <div className="mt-8 grid gap-8">
          <div id="admin-homepage" className="scroll-mt-24">
            <JsonEditor action={saveHomepageContent} button="Save homepage content" content={siteContent} format={homepageFormat} rows={26} title="Homepage" />
          </div>

          <section id="admin-media" className="scroll-mt-24 rounded-xl border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ImageUp className="text-[#d29300]" size={28} />
              <div>
                <h2 className="text-2xl font-black">Upload media</h2>
                <p className="mt-1 text-sm text-black/58">Upload images/files to the public Supabase `site-media` bucket, then paste the URL into markdown.</p>
              </div>
            </div>
            <form action={uploadMedia} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
              <input className="rounded-md border border-black/15 px-4 py-3 text-sm" name="file" type="file" accept="image/*,video/*,.pdf" required />
              <button className="btn-animated rounded-md bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black" type="submit">Upload media</button>
            </form>
          </section>

          <section id="admin-sub-apps" className="scroll-mt-24 space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="text-[#d29300]" size={28} />
              <h2 className="text-2xl font-black">Sub app content</h2>
            </div>
            <NewSubAppForm />
            {subApps.map((app) => (
              <article className="rounded-md border border-black/10 bg-white p-6 shadow-sm" key={app.slug}>
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-black">{app.name}</h3>
                  <span className="rounded bg-black/5 px-3 py-1 text-xs font-black text-black/55">{app.slug}</span>
                </div>
                <form action={saveSubAppContent} className="space-y-4">
                  <input name="slug" type="hidden" value={app.slug} />
                  <textarea
                    className="w-full rounded-md border border-black/15 bg-[#101012] p-4 font-mono text-xs leading-6 text-white outline-none"
                    name="content"
                    rows={16}
                    defaultValue={JSON.stringify(app, null, 2)}
                    spellCheck={false}
                  />
                  <button className="btn-animated btn-animated-dark rounded-md bg-black px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#ffc400] hover:text-black" type="submit">
                    Save {app.name}
                  </button>
                </form>
              </article>
            ))}
          </section>

          <section id="admin-blog" className="scroll-mt-24 space-y-6">
            <NewBlogPostForm />
            <JsonEditor action={saveBlogPostsContent} button="Save blog posts" content={blogPosts} format={blogArrayFormat} rows={24} title="Blog posts (markdown supported)" />
          </section>
          <div id="admin-docs" className="scroll-mt-24">
            <JsonEditor action={saveDocumentationContent} button="Save documentation pages" content={documentationPages} format={docsFormat} rows={28} title="Documentation pages (markdown supported)" />
          </div>
          <div id="admin-releases" className="scroll-mt-24">
            <JsonEditor action={saveReleasesContent} button="Save app releases" content={releases} format={releasesFormat} rows={18} title="Download releases" />
          </div>
        </div>
      </div>
    </main>
  );
}
