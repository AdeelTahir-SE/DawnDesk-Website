import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Database, FileText, LayoutDashboard, LogOut, Newspaper } from "lucide-react";
import { getBlogPostsContent, getSiteContent, getSubAppsContent } from "@/lib/content";
import { createAdminSupabaseClient } from "@/lib/supabase";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "DawnDesk@2026";
const ADMIN_COOKIE = "dawndesk_admin";
const ADMIN_COOKIE_VALUE = "dawndesk-admin-session-v1";

type AdminPageProps = {
  searchParams?: Promise<{
    error?: string;
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

async function saveHomepageContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = JSON.parse(content);
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

  const parsed = JSON.parse(content);
  const { error } = await supabase
    .from("sub_apps")
    .upsert(
      {
        slug,
        name: parsed.name,
        content: parsed,
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
  redirect(`/admin?saved=${slug}`);
}

async function saveBlogPostsContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = JSON.parse(content) as Array<{
    slug: string;
    title: string;
    category: string;
    summary: string;
    content: string;
    publishedAt: string;
  }>;

  const rows = parsed.map((post) => ({
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

  const slugs = parsed.map((post) => post.slug);
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
          <button className="w-full rounded-md bg-[#ffc400] px-6 py-4 text-sm font-extrabold text-black" type="submit">Open admin</button>
        </form>
      </div>
    </main>
  );
}

function JsonEditor({
  action,
  button,
  content,
  rows = 20,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  button: string;
  content: unknown;
  rows?: number;
  title: string;
}) {
  return (
    <section className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black">{title}</h2>
        <span className="rounded bg-[#fff3bf] px-3 py-1 text-xs font-black text-black/72">Supabase JSON</span>
      </div>
      <form action={action} className="mt-5 space-y-4">
        <textarea
          className="w-full rounded-md border border-black/15 bg-[#101012] p-4 font-mono text-xs leading-6 text-white outline-none"
          name="content"
          rows={rows}
          defaultValue={JSON.stringify(content, null, 2)}
          spellCheck={false}
        />
        <button className="rounded-md bg-black px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#ffc400] hover:text-black" type="submit">
          {button}
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

  const [siteContent, subApps, blogPosts] = await Promise.all([getSiteContent(), getSubAppsContent(), getBlogPostsContent()]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <header className="border-b border-black/10 bg-white px-5 py-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow text-[#c47800]">DawnDesk admin</p>
            <h1 className="mt-2 text-4xl font-black">Website content</h1>
          </div>
          <form action={signOutAdmin}>
            <button className="inline-flex items-center gap-2 rounded-md border border-black/15 px-5 py-3 text-sm font-extrabold text-black transition hover:border-[#ffc400]" type="submit">
              <LogOut size={17} />
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        {searchParams?.saved && <p className="mb-6 rounded-md border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Saved `{searchParams.saved}` and revalidated cached pages.</p>}

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Homepage", "Main landing page content", LayoutDashboard],
            ["Sub apps", `${subApps.length} workspace records`, Database],
            ["Blog", `${blogPosts.length} published posts`, Newspaper],
          ].map(([title, copy, Icon]) => (
            <article className="rounded-md border border-black/10 bg-white p-5 shadow-sm" key={title as string}>
              <Icon className="text-[#d29300]" size={28} />
              <h2 className="mt-4 text-xl font-black">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-black/58">{copy as string}</p>
            </article>
          ))}
        </section>

        <div className="mt-8 grid gap-8">
          <JsonEditor action={saveHomepageContent} button="Save homepage content" content={siteContent} rows={26} title="Homepage" />

          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <FileText className="text-[#d29300]" size={28} />
              <h2 className="text-2xl font-black">Sub app content</h2>
            </div>
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
                  <button className="rounded-md bg-black px-6 py-3 text-sm font-extrabold text-white transition hover:bg-[#ffc400] hover:text-black" type="submit">
                    Save {app.name}
                  </button>
                </form>
              </article>
            ))}
          </section>

          <JsonEditor action={saveBlogPostsContent} button="Save blog posts" content={blogPosts} rows={24} title="Blog posts" />
        </div>
      </div>
    </main>
  );
}
