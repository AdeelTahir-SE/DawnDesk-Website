import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Bell,
  Bug,
  CircleHelp,
  Download,
  Database,
  FileText,
  GitBranch,
  Home,
  ImageUp,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Newspaper,
  PlusCircle,
  Search,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { AdminSectionNav, type AdminNavIcon, type AdminNavItem } from "@/components/AdminSectionNav";
import { JsonTextarea } from "@/components/JsonTextarea";
import { getAppReleasesContent, getBlogPostsContent, getDocumentationContent, getFeatureHistoryContent, getSiteContent, getWorkspacesContent, getUpcomingFeaturesContent } from "@/lib/content";
import { createAdminSupabaseClient } from "@/lib/supabase";
import {
  appReleasesSchema,
  blogPostSchema,
  blogPostsSchema,
  documentationPagesSchema,
  featureHistorySchema,
  formatZodError,
  workspaceSchema,
  upcomingFeatureSchema,
} from "@/lib/content-validation";

const ADMIN_USERNAME = process.env.ADMIN_CONTENT_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_CONTENT_PASSWORD ?? "";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? "";
const ADMIN_COOKIE = "dawndesk_admin";
const ADMIN_SESSION_SECONDS = 60 * 60 * 8;

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

function hasAdminConfig() {
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD && ADMIN_SESSION_SECRET);
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signAdminSession(expiresAt: number) {
  const payload = String(expiresAt);
  const signature = createHmac("sha256", ADMIN_SESSION_SECRET).update(payload).digest("hex");

  return `${payload}.${signature}`;
}

function isValidAdminSession(token?: string) {
  if (!token || !hasAdminConfig()) return false;

  const [expiresAtValue, signature] = token.split(".");
  const expiresAt = Number(expiresAtValue);

  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt || !signature) {
    return false;
  }

  const expectedSignature = createHmac("sha256", ADMIN_SESSION_SECRET)
    .update(expiresAtValue)
    .digest("hex");

  return safeEqual(signature, expectedSignature);
}

async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return isValidAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
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

  if (!hasAdminConfig()) {
    redirect("/admin?error=config");
  }

  if (!safeEqual(username, ADMIN_USERNAME) || !safeEqual(password, ADMIN_PASSWORD)) {
    redirect("/admin?error=invalid");
  }

  const cookieStore = await cookies();
  const expiresAt = Date.now() + ADMIN_SESSION_SECONDS * 1000;
  cookieStore.set(ADMIN_COOKIE, signAdminSession(expiresAt), {
    httpOnly: true,
    maxAge: ADMIN_SESSION_SECONDS,
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

async function saveWorkspaceContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const slug = String(formData.get("slug") ?? "");
  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = parseJsonOrRedirect(content);
  const validation = workspaceSchema.safeParse(parsed);
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
  revalidatePath("/workspaces");
  revalidatePath(`/workspaces/${slug}`);
  revalidatePath(`/documentation/${slug}`);
  revalidateTag("workspaces-content", "max");
  revalidateTag("documentation-content", "max");
  redirect(`/admin?saved=${slug}`);
}

async function createWorkspaceContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const parsed = parseJsonOrRedirect(content);
  const validation = workspaceSchema.safeParse(parsed);
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
  revalidatePath("/workspaces");
  revalidatePath(`/workspaces/${slug}`);
  revalidatePath(`/documentation/${slug}`);
  revalidateTag("workspaces-content", "max");
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

async function saveFeatureHistoryContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = parseJsonOrRedirect(content);
  const validation = featureHistorySchema.safeParse(parsed);
  if (!validation.success) {
    redirect(`/admin?error=${encodeURIComponent(formatZodError(validation.error))}`);
  }

  const rows = validation.data.map((item, index) => ({
    version: item.version,
    title: item.title,
    content: item,
    sort_order: (validation.data.length - index) * 10,
  }));

  const { error } = await supabase
    .from("feature_history")
    .upsert(rows, { onConflict: "version" });

  if (error) {
    throw new Error(error.message);
  }

  const versions = validation.data.map((item) => item.version);
  await supabase.from("feature_history").delete().not("version", "in", `(${versions.map((version) => `"${version}"`).join(",")})`);

  revalidatePath("/");
  revalidatePath("/updates");
  revalidateTag("feature-history-content", "max");
  redirect("/admin?saved=feature-history");
}

async function saveUpcomingFeaturesContent(formData: FormData) {
  "use server";
  await requireAdmin();

  const content = String(formData.get("content") ?? "");
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const parsed = parseJsonOrRedirect(content);
  const validation = upcomingFeatureSchema.safeParse(parsed);
  if (!validation.success) {
    redirect(`/admin?error=${encodeURIComponent(formatZodError(validation.error))}`);
  }

  const rows = validation.data.map((item, index) => ({
    version: item.version,
    title: item.title,
    content: item,
    sort_order: (validation.data.length - index) * 10,
  }));

  const { error } = await supabase
    .from("upcoming_features")
    .upsert(rows, { onConflict: "version" });

  if (error) {
    throw new Error(error.message);
  }

  const versions = validation.data.map((item) => item.version);
  await supabase.from("upcoming_features").delete().not("version", "in", `(${versions.map((version) => `"${version}"`).join(",")})`);

  revalidatePath("/");
  revalidatePath("/upcoming");
  revalidateTag("upcoming-features-content", "max");
  redirect("/admin?saved=upcoming-features");
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

async function deleteMediaUpload(formData: FormData) {
  "use server";
  await requireAdmin();

  const storagePath = String(formData.get("storagePath") ?? "");
  if (!storagePath) {
    redirect("/admin?error=Missing media storage path");
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { error: storageError } = await supabase.storage
    .from("site-media")
    .remove([storagePath]);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { error: rowError } = await supabase
    .from("media_uploads")
    .delete()
    .eq("storage_path", storagePath);

  if (rowError) {
    throw new Error(rowError.message);
  }

  redirect("/admin?saved=media");
}

async function getMediaUploads() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data, error } = await supabase
    .from("media_uploads")
    .select("file_name, storage_path, public_url, content_type, size_bytes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

async function getBugReports() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data, error } = await supabase
    .from("bug_reports")
    .select("id, name, email, title, steps, expected, actual, attachment_url, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

async function getFeatureRequests() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data, error } = await supabase
    .from("feature_requests")
    .select("id, name, email, title, description, priority, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

async function getDownloadEvents() {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY.");
  }

  const { data, error } = await supabase
    .from("download_events")
    .select("id, platform, referrer, user_agent, created_at")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
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
        {error === "config" && <p className="mt-5 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-100">Admin is disabled until credentials and a session secret are configured.</p>}
        <form action={signInAdmin} className="mt-7 space-y-4">
          <input className="w-full rounded-md border border-white/15 bg-black/35 px-4 py-3 text-sm text-white outline-none" name="username" placeholder="Username" />
          <input className="w-full rounded-md border border-white/15 bg-black/35 px-4 py-3 text-sm text-white outline-none" name="password" placeholder="Password" type="password" />
          <button className="btn-animated w-full rounded-md bg-[#ffc400] px-6 py-4 text-sm font-extrabold text-black" type="submit">Open admin</button>
        </form>
      </div>
    </main>
  );
}

function stringifyJson(content: unknown) {
  return JSON.stringify(content, null, 2);
}

function JsonCodeBlock({
  className = "",
  content,
  maxHeight = "max-h-[360px]",
}: {
  className?: string;
  content: unknown;
  maxHeight?: string;
}) {
  const json = typeof content === "string" ? content : stringifyJson(content);
  const tokenPattern = /("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(?=\s*:))|("(?:\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*")|\b(true|false|null)\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  let lastIndex = 0;
  const nodes = [];

  for (const match of json.matchAll(tokenPattern)) {
    const value = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(json.slice(lastIndex, index));
    }

    const tokenClass = match[1]
      ? "text-[#f7c948]"
      : match[2]
        ? "text-[#7dd3fc]"
        : match[3]
          ? "text-[#fca5a5]"
          : "text-[#c4b5fd]";

    nodes.push(
      <span className={tokenClass} key={`${index}-${value}`}>
        {value}
      </span>,
    );
    lastIndex = index + value.length;
  }

  if (lastIndex < json.length) {
    nodes.push(json.slice(lastIndex));
  }

  return (
    <pre className={`${maxHeight} overflow-auto rounded-md border border-white/10 bg-[#101012] p-4 text-xs leading-6 text-[#e8e8ea] shadow-inner ${className}`}>
      <code>{nodes}</code>
    </pre>
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
    prompt?: {
      body: string;
      title: string;
    };
    title: string;
  };
  rows?: number;
  title: string;
}) {
  const prettyContent = stringifyJson(content);

  return (
    <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-black/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black">{title}</h2>
          <p className="mt-1 text-sm text-black/55">Edit structured content and save directly to Supabase.</p>
        </div>
        <span className="w-fit rounded bg-[#fff3bf] px-3 py-1 text-xs font-black text-black/72">Supabase JSON</span>
      </div>
      <div className={`grid gap-5 p-6 ${format ? "2xl:grid-cols-[minmax(0,1fr)_390px]" : ""}`}>
        <form action={action} className="space-y-4">
          <JsonTextarea defaultValue={prettyContent} minHeight="min-h-[420px]" name="content" rows={rows} />
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
  prompt,
  title,
}: {
  example: unknown;
  notes: string[];
  prompt?: {
    body: string;
    title: string;
  };
  title: string;
}) {
  return (
    <aside className="rounded-lg border border-black/10 bg-[#fbfaf7] p-4">
      <h3 className="text-lg font-black">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-black/65">
        {notes.map((note) => <li key={note}>{note}</li>)}
      </ul>
      {prompt && (
        <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c47800]">{prompt.title}</p>
          <JsonTextarea className="mt-3" defaultValue={prompt.body} minHeight="min-h-[260px]" readOnly rows={10} />
        </div>
      )}
      <p className="mb-2 mt-5 text-xs font-black uppercase tracking-[0.14em] text-black/45">Example JSON</p>
      <JsonCodeBlock content={example} />
    </aside>
  );
}

type AdminSectionRow = {
  description: string;
  href: string;
  iconName: AdminNavIcon;
  icon: LucideIcon;
  items: number;
  status: string;
  title: string;
};

function StatusPill({ children }: { children: string }) {
  return (
    <span className="inline-flex rounded-md border border-emerald-500/20 bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
      {children}
    </span>
  );
}

function AdminStatCard({
  copy,
  label,
  tone = "neutral",
  value,
}: {
  copy: string;
  label: string;
  tone?: "green" | "neutral" | "yellow";
  value: number | string;
}) {
  const dotClass = tone === "green" ? "bg-emerald-500" : tone === "yellow" ? "bg-[#ffc400]" : "bg-black/25";

  return (
    <div className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
      <p className="text-xs font-black text-black/55">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-black">{value}</p>
      <p className="mt-2 flex items-center gap-2 text-xs font-bold text-black/55">
        <span className={`size-2 rounded-full ${dotClass}`} />
        {copy}
      </p>
    </div>
  );
}

function AdminOverview({
  sections,
  totalItems,
}: {
  sections: AdminSectionRow[];
  totalItems: number;
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-black">Website content</h2>
          <p className="mt-1 text-sm text-black/58">Manage live DawnDesk website content, documentation, releases, and media.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-black text-black transition hover:border-[#ffc400]" href="#admin-homepage">
            <Settings size={16} />
            Configure homepage
          </a>
          <a className="inline-flex items-center gap-2 rounded-md bg-[#ffc400] px-4 py-2.5 text-sm font-black text-black shadow-[0_12px_32px_rgba(255,196,0,0.2)] transition hover:bg-[#e7b000]" href="#admin-workspaces">
            <PlusCircle size={16} />
            New content
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard copy="Content areas" label="Total sections" value={sections.length} />
        <AdminStatCard copy="Across admin" label="Total items" value={totalItems} />
        <AdminStatCard copy="Ready to edit" label="Live sections" tone="green" value={sections.length} />
        <AdminStatCard copy="JSON backed" label="Structured editors" tone="yellow" value={6} />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-black/10">
        <div className="grid grid-cols-[minmax(180px,1fr)_minmax(260px,1.5fr)_80px_110px_72px] gap-4 border-b border-black/10 bg-[#fbfaf7] px-4 py-3 text-xs font-black uppercase tracking-[0.08em] text-black/45 max-lg:hidden">
          <span>Section</span>
          <span>Description</span>
          <span>Items</span>
          <span>Status</span>
          <span>Open</span>
        </div>
        <div className="divide-y divide-black/10">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <a
                className="grid gap-3 px-4 py-4 transition hover:bg-[#fff9df] lg:grid-cols-[minmax(180px,1fr)_minmax(260px,1.5fr)_80px_110px_72px] lg:items-center"
                href={section.href}
                key={section.title}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-[#fff3bf] text-[#a36d00]">
                    <Icon size={18} />
                  </span>
                  <span className="text-sm font-black text-black">{section.title}</span>
                </div>
                <p className="text-sm leading-6 text-black/62">{section.description}</p>
                <p className="text-sm font-black text-black">{section.items}</p>
                <StatusPill>{section.status}</StatusPill>
                <span className="text-sm font-black text-[#9a6500]">Edit</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function formatAdminDate(value?: string | null) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function AdminEmptyState({ copy }: { copy: string }) {
  return (
    <div className="rounded-lg border border-dashed border-black/15 bg-[#fbfaf7] px-4 py-8 text-center text-sm font-bold text-black/50">
      {copy}
    </div>
  );
}

function BugReportsPanel({
  reports,
}: {
  reports: Array<{
    actual: string | null;
    attachment_url: string | null;
    created_at: string;
    email: string | null;
    expected: string | null;
    id: number;
    name: string | null;
    steps: string;
    title: string;
  }>;
}) {
  return (
    <section className="scroll-mt-24 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm" id="admin-bugs">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fff3bf] text-[#a36d00]">
            <Bug size={20} />
          </span>
          <div>
            <h2 className="text-2xl font-black">Bug reports</h2>
            <p className="mt-1 text-sm text-black/58">Review issues submitted from the public bug report form.</p>
          </div>
        </div>
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-black text-black/60">{reports.length} reports</span>
      </div>
      <div className="p-6">
        {reports.length === 0 ? (
          <AdminEmptyState copy="No bug reports submitted yet." />
        ) : (
          <div className="divide-y divide-black/10 overflow-hidden rounded-lg border border-black/10">
            {reports.map((report) => (
              <article className="grid gap-4 bg-white px-4 py-4 xl:grid-cols-[minmax(180px,0.75fr)_minmax(260px,1.4fr)_160px]" key={report.id}>
                <div>
                  <p className="text-sm font-black text-black">{report.title}</p>
                  <p className="mt-1 text-xs text-black/55">{report.name || "Anonymous"}{report.email ? ` / ${report.email}` : ""}</p>
                  <p className="mt-2 text-xs font-bold text-black/45">{formatAdminDate(report.created_at)}</p>
                </div>
                <div className="space-y-2 text-sm leading-6 text-black/65">
                  <p><span className="font-black text-black">Steps:</span> {report.steps}</p>
                  {report.expected && <p><span className="font-black text-black">Expected:</span> {report.expected}</p>}
                  {report.actual && <p><span className="font-black text-black">Actual:</span> {report.actual}</p>}
                </div>
                <div className="flex items-start justify-start xl:justify-end">
                  {report.attachment_url ? (
                    <a className="rounded-md border border-black/10 px-4 py-2 text-xs font-black text-[#9a6500] transition hover:border-[#ffc400] hover:text-black" href={report.attachment_url} target="_blank" rel="noreferrer">
                      Open attachment
                    </a>
                  ) : (
                    <span className="rounded-md bg-black/5 px-3 py-2 text-xs font-black text-black/45">No attachment</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeatureRequestsPanel({
  requests,
}: {
  requests: Array<{
    created_at: string;
    description: string;
    email: string | null;
    id: number;
    name: string | null;
    priority: string | null;
    title: string;
  }>;
}) {
  return (
    <section className="scroll-mt-24 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm" id="admin-features">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fff3bf] text-[#a36d00]">
            <Sparkles size={20} />
          </span>
          <div>
            <h2 className="text-2xl font-black">Feature requests</h2>
            <p className="mt-1 text-sm text-black/58">Track ideas submitted from the public new feature form.</p>
          </div>
        </div>
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-black text-black/60">{requests.length} requests</span>
      </div>
      <div className="p-6">
        {requests.length === 0 ? (
          <AdminEmptyState copy="No feature requests submitted yet." />
        ) : (
          <div className="divide-y divide-black/10 overflow-hidden rounded-lg border border-black/10">
            {requests.map((request) => (
              <article className="grid gap-4 bg-white px-4 py-4 lg:grid-cols-[minmax(180px,0.75fr)_minmax(260px,1.5fr)_120px]" key={request.id}>
                <div>
                  <p className="text-sm font-black text-black">{request.title}</p>
                  <p className="mt-1 text-xs text-black/55">{request.name || "Anonymous"}{request.email ? ` / ${request.email}` : ""}</p>
                  <p className="mt-2 text-xs font-bold text-black/45">{formatAdminDate(request.created_at)}</p>
                </div>
                <p className="text-sm leading-6 text-black/65">{request.description}</p>
                <div className="lg:text-right">
                  <span className="rounded-md border border-[#f0df9c] bg-[#fff9df] px-3 py-1 text-xs font-black text-[#9a6500]">
                    {request.priority || "No priority"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DownloadAnalyticsPanel({
  events,
}: {
  events: Array<{
    created_at: string;
    id: number;
    platform: string;
    referrer: string | null;
    user_agent: string | null;
  }>;
}) {
  const byPlatform = events.reduce<Record<string, number>>((counts, event) => {
    counts[event.platform || "unknown"] = (counts[event.platform || "unknown"] ?? 0) + 1;
    return counts;
  }, {});
  const maxPlatform = Math.max(1, ...Object.values(byPlatform));
  const dailyCounts = events.reduce<Record<string, number>>((counts, event) => {
    const day = new Date(event.created_at).toISOString().slice(0, 10);
    counts[day] = (counts[day] ?? 0) + 1;
    return counts;
  }, {});
  const dailySeries = Object.entries(dailyCounts).sort(([a], [b]) => a.localeCompare(b)).slice(-14);
  const maxDaily = Math.max(1, ...dailySeries.map(([, count]) => count));
  const topReferrers = Object.entries(events.reduce<Record<string, number>>((counts, event) => {
    const referrer = event.referrer || "Direct / unknown";
    counts[referrer] = (counts[referrer] ?? 0) + 1;
    return counts;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <section className="scroll-mt-24 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm" id="admin-downloads">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#fff3bf] text-[#a36d00]">
            <Download size={20} />
          </span>
          <div>
            <h2 className="text-2xl font-black">Download analytics</h2>
            <p className="mt-1 text-sm text-black/58">Graph download requests captured by the download redirect endpoint.</p>
          </div>
        </div>
        <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-black text-black/60">{events.length} events</span>
      </div>
      <div className="grid gap-5 p-6 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-lg border border-black/10 bg-[#fbfaf7] p-5">
          <h3 className="text-lg font-black">By platform</h3>
          <div className="mt-5 space-y-4">
            {Object.entries(byPlatform).length === 0 ? (
              <AdminEmptyState copy="No download events yet." />
            ) : (
              Object.entries(byPlatform).map(([platform, count]) => (
                <div key={platform}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-black capitalize text-black">{platform}</span>
                    <span className="font-bold text-black/58">{count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-black/10">
                    <div className="h-full rounded-full bg-[#ffc400]" style={{ width: `${Math.max(8, (count / maxPlatform) * 100)}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="rounded-lg border border-black/10 bg-[#fbfaf7] p-5">
          <h3 className="text-lg font-black">Last 14 active days</h3>
          {dailySeries.length === 0 ? (
            <div className="mt-5">
              <AdminEmptyState copy="No daily download data yet." />
            </div>
          ) : (
            <div className="mt-5 flex h-56 items-end gap-2 border-b border-black/10 pb-2">
              {dailySeries.map(([day, count]) => (
                <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={day}>
                  <div className="w-full rounded-t-md bg-[#ffc400]" style={{ height: `${Math.max(10, (count / maxDaily) * 190)}px` }} title={`${day}: ${count}`} />
                  <span className="w-full truncate text-center text-[10px] font-bold text-black/45">{day.slice(5)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-lg border border-black/10 bg-white p-5 xl:col-span-2">
          <h3 className="text-lg font-black">Top referrers</h3>
          <div className="mt-4 divide-y divide-black/10">
            {topReferrers.length === 0 ? (
              <AdminEmptyState copy="No referrer data yet." />
            ) : (
              topReferrers.map(([referrer, count]) => (
                <div className="flex items-center justify-between gap-4 py-3" key={referrer}>
                  <p className="truncate text-sm font-bold text-black/65">{referrer}</p>
                  <span className="rounded-md bg-black/5 px-3 py-1 text-xs font-black text-black/60">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
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
  prompt: {
    title: "AI blog prompt",
    body: "You are writing a DawnDesk blog post. Return exactly one valid JSON object and nothing else.\n\nRules:\n- No markdown fences around the JSON.\n- No comments, notes, or explanations outside the JSON.\n- Escape every newline in string values as \\n.\n- Use double quotes for all keys and strings.\n- Include every required key shown below.\n- Keep slug lowercase kebab-case and aligned with the title.\n- category must be one of: Guide, Update, Tutorial, Story.\n- summary must be at least 20 characters.\n- publishedAt must use YYYY-MM-DD.\n\nRequired schema:\n{\n  \"slug\": \"kebab-case-id\",\n  \"title\": \"Post title\",\n  \"category\": \"Guide\",\n  \"summary\": \"At least 20 characters\",\n  \"publishedAt\": \"YYYY-MM-DD\",\n  \"content\": \"Markdown with ## headings, paragraphs, links, images, code blocks, and optional Mermaid\"\n}\n\nTopic/context: [PASTE YOUR NOTES].",
  },
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
    "Documentation slugs can be standalone or match a workspace slug for linked branding.",
    "content is markdown and headings automatically become section links.",
    "Use image markdown like ![Caption](https://example.com/image.png).",
  ],
  prompt: {
    title: "AI documentation prompt",
    body: "You are writing DawnDesk documentation. Return exactly one valid JSON object and nothing else.\n\nRules:\n- No markdown fences around the JSON.\n- No comments, notes, or explanations outside the JSON.\n- Escape every newline in string values as \\n.\n- Use double quotes for all keys and strings.\n- Include every required key shown below.\n- Keep slug lowercase kebab-case. It can match a workspace slug when the page documents a workspace.\n- content must be markdown and should include ## Overview, ## Key features, and ## Workflow when useful.\n- Include Mermaid only inside the content string when it is useful.\n\nRequired schema:\n{\n  \"slug\": \"documentation-page-slug\",\n  \"title\": \"Documentation title\",\n  \"summary\": \"Short summary\",\n  \"content\": \"## Overview\\n\\n...\\n\\n## Key features\\n\\n- ...\\n\\n## Workflow\\n\\n1. ...\"\n}\n\nTopic/context: [PASTE YOUR NOTES]",
  },
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
  prompt: {
    title: "AI releases prompt",
    body: "You are preparing DawnDesk release JSON. Return exactly one valid JSON array and nothing else.\n\nRules:\n- No markdown fences around the JSON.\n- No comments, notes, or explanations outside the JSON.\n- Use double quotes for all keys and strings.\n- Include every required key shown below for each item.\n- platform must be windows, macos, or linux.\n- arch must be x64 or arm64.\n- isRecommended and isActive must be booleans, not strings.\n- publishedAt must use YYYY-MM-DD.\n- sortOrder must be a number, preferably increments of 10.\n- Ensure only one recommended active release per platform.\n\nRequired schema:\n[{\n  \"platform\": \"windows\",\n  \"version\": \"0.0.0\",\n  \"label\": \"Installer label\",\n  \"arch\": \"x64\",\n  \"url\": \"https://...\",\n  \"isRecommended\": true,\n  \"isActive\": true,\n  \"publishedAt\": \"YYYY-MM-DD\",\n  \"sortOrder\": 10\n}]\n\nRelease notes/context: [PASTE RELEASE DETAILS].",
  },
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

const featureHistoryFormat = {
  title: "Feature history array format",
  notes: [
    "This editor powers the homepage preview and the complete /updates page.",
    "Each item is one linear release node; branches describe feature groups added in that update.",
    "Put the newest update first. Saving replaces the public feature-history list.",
  ],
  prompt: {
    title: "AI feature history prompt",
    body: "You are preparing DawnDesk feature history JSON. Return exactly one valid JSON array and nothing else.\n\nRules:\n- No markdown fences around the JSON.\n- No comments, notes, or explanations outside the JSON.\n- Use double quotes for all keys and strings.\n- Put newest updates first.\n- Each item is one release node on the linear trunk.\n- branches must explain the feature groups added in that release.\n- Keep summaries concise and user-facing.\n\nRequired schema:\n[{\n  \"version\": \"v0.3.0\",\n  \"date\": \"June 2026\",\n  \"title\": \"Release title\",\n  \"summary\": \"At least 20 characters explaining the update.\",\n  \"status\": \"Latest branch\",\n  \"branches\": [\n    { \"label\": \"Feature group\", \"detail\": \"What changed in this branch.\" }\n  ]\n}]\n\nRelease notes/context: [PASTE UPDATE DETAILS].",
  },
  example: [
    {
      version: "v0.3.0",
      date: "June 2026",
      title: "Creative workspaces become connected",
      summary: "This update grows DawnDesk into a clearer creative suite with connected workspaces.",
      status: "Latest branch",
      branches: [
        {
          label: "Photo Editor",
          detail: "Improved editor preview and clearer feature grouping for daily edits.",
        },
        {
          label: "Prompt Manager",
          detail: "Better prompt categories, search flow, and reuse patterns.",
        },
      ],
    },
  ],
};

const upcomingFeaturesFormat = {
  title: "Upcoming features array format",
  notes: [
    "This list populates the roadmap features.",
    "state should be a short tag like 'In Progress' or 'Planned'.",
    "color is a Tailwind background class like 'bg-amber-400'.",
  ],
  prompt: {
    title: "AI upcoming features prompt",
    body: "You are preparing DawnDesk upcoming features JSON. Return exactly one valid JSON array and nothing else.\n\nRules:\n- No markdown fences around the JSON.\n- No comments, notes, or explanations outside the JSON.\n- Use double quotes for all keys and strings.\n- Each item is one upcoming feature.\n- color must be a valid tailwind bg class like 'bg-amber-400' or 'bg-sky-400'.\n\nRequired schema:\n[{\n  \"version\": \"v2.1\",\n  \"title\": \"Feature Title\",\n  \"copy\": \"Short description\",\n  \"state\": \"In Progress\",\n  \"color\": \"bg-amber-400\"\n}]\n\nDetails: [PASTE UPCOMING DETAILS].",
  },
  example: [
    {
      version: "v2.1",
      title: "Team Collaboration",
      copy: "Real-time collaboration and comments",
      state: "Coming Soon",
      color: "bg-amber-400",
    },
  ],
};

function NewWorkspaceForm() {
  const workspacePrompt = `You are creating a DawnDesk workspace record. Return exactly one valid JSON object and nothing else.

Rules:
- No markdown fences around the JSON.
- No comments, notes, or explanations outside the JSON.
- Use double quotes for all keys and strings.
- Include every required key shown below.
- slug must be lowercase kebab-case and unique.
- icon values must be valid Lucide icon component names already used by the app.
- features must include at least 3 items.
- workflow must include at least 3 short steps.

Required schema:

{
  "slug": "kebab-case-id",
  "name": "Workspace Name",
  "eyebrow": "Short eyebrow",
  "headline": "One-line headline",
  "accent": "Short accent phrase",
  "summary": "Short summary",
  "detail": "1-2 sentence detail",
  "icon": "LucideIconName",
  "features": [{"title": "...", "copy": "...", "icon": "LucideIconName"}],
  "workflow": ["Step 1", "Step 2", "Step 3"]
}

Topic/context: [PASTE YOUR NOTES]. Ensure slug is lowercase and unique.`;
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
    <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c47800]">New workspace</p>
          <h2 className="mt-2 text-2xl font-black">Create workspace from JSON</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">Paste one JSON object in this exact shape. The same record powers the workspace listing, detail page, and starter documentation page.</p>
        </div>
        <span className="rounded-full bg-[#fff3bf] px-4 py-2 text-xs font-black text-black/72">Supabase row</span>
      </div>
      <div className="grid gap-5 p-6 lg:grid-cols-[1fr_0.85fr]">
        <form action={createWorkspaceContent} className="space-y-4">
          <JsonTextarea defaultValue={stringifyJson(example)} minHeight="min-h-[520px]" name="content" required />
          <button className="btn-animated inline-flex w-fit items-center gap-2 rounded-md bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black" type="submit">
            <PlusCircle size={18} />
            Add workspace JSON
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
          <div className="mt-5 rounded-md border border-black/10 bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c47800]">AI workspace prompt</p>
            <JsonTextarea className="mt-3" defaultValue={workspacePrompt} minHeight="min-h-[340px]" readOnly rows={11} />
          </div>
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
    <section className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-black/10 px-6 py-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c47800]">New blog post</p>
          <h2 className="mt-2 text-2xl font-black">Add one blog from JSON</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">Paste one blog JSON object. This saves or updates only that post and does not replace the full blog list.</p>
        </div>
        <span className="rounded-full bg-[#fff3bf] px-4 py-2 text-xs font-black text-black/72">Single post</span>
      </div>
      <form action={saveSingleBlogPostContent} className="space-y-4 p-6">
        <JsonTextarea defaultValue={stringifyJson(example)} minHeight="min-h-[420px]" name="content" required />
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

  const [siteContent, workspaces, blogPosts, documentationPages, releases, featureHistory, upcomingFeatures, mediaUploads, bugReports, featureRequests, downloadEvents] = await Promise.all([
    getSiteContent(),
    getWorkspacesContent(),
    getBlogPostsContent(),
    getDocumentationContent(),
    getAppReleasesContent(),
    getFeatureHistoryContent(),
    getUpcomingFeaturesContent(),
    getMediaUploads(),
    getBugReports(),
    getFeatureRequests(),
    getDownloadEvents(),
  ]);

  const contentSections: AdminSectionRow[] = [
    {
      description: "Main landing page content and homepage-wide settings.",
      href: "#admin-homepage",
      icon: Home,
      iconName: "home",
      items: 1,
      status: "Published",
      title: "Homepage",
    },
    {
      description: "Create and update workspace records used by workspace pages.",
      href: "#admin-workspaces",
      icon: Database,
      iconName: "database",
      items: workspaces.length,
      status: "Published",
      title: "workspaces",
    },
    {
      description: "Add one post or replace the markdown-backed blog collection.",
      href: "#admin-blog",
      icon: Newspaper,
      iconName: "newspaper",
      items: blogPosts.length,
      status: "Published",
      title: "Blog",
    },
    {
      description: "Markdown documentation pages with JSON validation and AI help.",
      href: "#admin-docs",
      icon: FileText,
      iconName: "fileText",
      items: documentationPages.length,
      status: "Published",
      title: "Documentation",
    },
    {
      description: "Manage product releases and active installer files.",
      href: "#admin-releases",
      icon: LinkIcon,
      iconName: "link",
      items: releases.length,
      status: "Published",
      title: "Releases",
    },
    {
      description: "Update the public linear feature history tree and release branches.",
      href: "#admin-feature-history",
      icon: GitBranch,
      iconName: "sparkles",
      items: featureHistory.length,
      status: "Published",
      title: "Feature history",
    },
    {
      description: "Manage upcoming features and roadmap items.",
      href: "#admin-upcoming",
      icon: Sparkles,
      iconName: "sparkles",
      items: upcomingFeatures.length,
      status: "Published",
      title: "Upcoming features",
    },
    {
      description: "Upload public assets and copy URLs into markdown content.",
      href: "#admin-media",
      icon: ImageUp,
      iconName: "imageUp",
      items: mediaUploads.length,
      status: "Ready",
      title: "Media",
    },
    {
      description: "Review issues submitted from the public bug report page.",
      href: "#admin-bugs",
      icon: Bug,
      iconName: "bug",
      items: bugReports.length,
      status: "Inbox",
      title: "Bug reports",
    },
    {
      description: "Review ideas submitted from the public feature request page.",
      href: "#admin-features",
      icon: Sparkles,
      iconName: "sparkles",
      items: featureRequests.length,
      status: "Inbox",
      title: "Feature requests",
    },
    {
      description: "View download request totals and trend graphs.",
      href: "#admin-downloads",
      icon: Download,
      iconName: "download",
      items: downloadEvents.length,
      status: "Tracked",
      title: "Downloads",
    },
  ];
  const totalItems = contentSections.reduce((sum, section) => sum + section.items, 0);
  const navItems: AdminNavItem[] = [
    { count: totalItems, href: "#admin-overview", icon: "layoutDashboard", label: "Website content" },
    ...contentSections.map((section) => ({
      count: section.items,
      href: section.href,
      icon: section.iconName,
      label: section.title,
    })),
  ];

  return (
    <main className="min-h-screen bg-[#f7f5f1] px-4 py-5 text-[#171717] sm:px-6 lg:px-8">
      <header className="mx-auto max-w-[1500px] overflow-hidden rounded-xl border border-black/10 bg-white shadow-[0_18px_60px_rgba(15,12,4,0.08)]">
        <div className="flex flex-col gap-4 border-b border-black/10 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <a className="flex items-center gap-3" href="/admin">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[#ffc400] text-black">
              <LayoutDashboard size={19} />
            </span>
            <span className="text-base font-black">DawnDesk Admin</span>
          </a>
          <div className="flex flex-1 flex-col gap-3 lg:max-w-3xl lg:flex-row lg:items-center lg:justify-end">
            <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-black/10 bg-[#fbfaf7] px-4 py-2.5 text-sm text-black/50 lg:max-w-md">
              <Search size={17} />
              <span className="truncate">Search content, pages, records...</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-md border border-black/10 bg-white text-black/65">
                <Bell size={17} />
              </span>
              <span className="flex size-10 items-center justify-center rounded-md border border-black/10 bg-white text-black/65">
                <CircleHelp size={17} />
              </span>
              <form action={signOutAdmin}>
                <button className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2.5 text-sm font-black text-black transition hover:border-[#ffc400] hover:bg-[#fff9df]" type="submit">
                  <LogOut size={16} />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-5 py-3">
          {[
            ["Website", "#admin-overview", LayoutDashboard],
            ["Homepage", "#admin-homepage", Home],
            ["workspaces", "#admin-workspaces", Database],
            ["Blog", "#admin-blog", Newspaper],
            ["Documentation", "#admin-docs", FileText],
            ["Releases", "#admin-releases", LinkIcon],
            ["Feature history", "#admin-feature-history", GitBranch],
            ["Upcoming", "#admin-upcoming", Sparkles],
            ["Media", "#admin-media", ImageUp],
            ["Bugs", "#admin-bugs", Bug],
            ["Features", "#admin-features", Sparkles],
            ["Downloads", "#admin-downloads", Download],
          ].map(([label, href, Icon]) => (
            <a className="inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-black/66 transition hover:bg-[#fff3bf] hover:text-black" href={href as string} key={label as string}>
              <Icon size={16} />
              {label as string}
            </a>
          ))}
        </nav>
      </header>

      <div className="mx-auto max-w-[1500px] py-6">
        {searchParams?.saved && <p className="mb-5 rounded-md border border-emerald-500/20 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">Saved `{searchParams.saved}` and revalidated cached pages.</p>}
        {searchParams?.error && <p className="mb-5 rounded-md border border-red-500/20 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{searchParams.error}</p>}
        {searchParams?.media && (
          <div className="mb-5 rounded-md border border-[#ffc400]/40 bg-[#fff8d6] px-4 py-3 text-sm font-bold text-black">
            Uploaded media URL:
            <code className="ml-2 break-all rounded bg-white/70 px-2 py-1 text-xs">{searchParams.media}</code>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="space-y-5">
            <div className="rounded-xl border border-black/10 bg-white p-5 shadow-sm lg:sticky lg:top-6">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#ffc400] text-black">
                  <LayoutDashboard size={18} />
                </span>
                <p className="font-black">DawnDesk Admin</p>
              </div>
              <AdminSectionNav items={navItems} />
              <div className="mt-6 rounded-lg border border-[#f0df9c] bg-[#fff9df] p-4">
                <p className="text-sm font-black text-black">Content workflow</p>
                <p className="mt-2 text-xs leading-5 text-black/58">Edit JSON, save to Supabase, and cached pages revalidate automatically.</p>
                <a className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#9a6500]" href="#admin-docs">
                  Open documentation
                  <FileText size={14} />
                </a>
              </div>
            </div>
          </aside>

          <div className="space-y-8">
            <div id="admin-overview" className="scroll-mt-24">
              <AdminOverview sections={contentSections} totalItems={totalItems} />
            </div>
            <div id="admin-homepage" className="scroll-mt-24">
              <JsonEditor action={saveHomepageContent} button="Save homepage content" content={siteContent} format={homepageFormat} rows={26} title="Homepage" />
            </div>

            <section id="admin-workspaces" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-3">
                <FileText className="text-[#d29300]" size={28} />
                <h2 className="text-2xl font-black">workspace content</h2>
              </div>
              <div className="space-y-5">
                <NewWorkspaceForm />
                <div className="grid gap-4 xl:grid-cols-2">
                  {workspaces.map((app) => (
                    <article className="rounded-md border border-black/10 bg-[#fbfaf7] p-4" key={app.slug}>
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <h3 className="truncate text-lg font-black">{app.name}</h3>
                        <span className="shrink-0 rounded bg-black/5 px-3 py-1 text-xs font-black text-black/55">{app.slug}</span>
                      </div>
                      <form action={saveWorkspaceContent} className="space-y-4">
                        <input name="slug" type="hidden" value={app.slug} />
                        <JsonTextarea
                          className="max-h-[420px]"
                          defaultValue={stringifyJson(app)}
                          minHeight="min-h-[300px]"
                          name="content"
                          rows={14}
                        />
                        <button className="btn-animated btn-animated-dark rounded-md bg-black px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-[#ffc400] hover:text-black" type="submit">
                          Save {app.name}
                        </button>
                      </form>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id="admin-blog" className="scroll-mt-24 space-y-6">
              <div className="space-y-5">
                <NewBlogPostForm />
                <JsonEditor action={saveBlogPostsContent} button="Save blog posts" content={blogPosts} format={blogArrayFormat} rows={24} title="Blog posts (markdown supported)" />
              </div>
            </section>

            <div id="admin-docs" className="scroll-mt-24">
              <JsonEditor action={saveDocumentationContent} button="Save documentation pages" content={documentationPages} format={docsFormat} rows={28} title="Documentation pages (markdown supported)" />
            </div>

            <div id="admin-releases" className="scroll-mt-24">
              <JsonEditor action={saveReleasesContent} button="Save app releases" content={releases} format={releasesFormat} rows={18} title="Download releases" />
            </div>

            <div id="admin-feature-history" className="scroll-mt-24">
              <JsonEditor action={saveFeatureHistoryContent} button="Save feature history" content={featureHistory} format={featureHistoryFormat} rows={24} title="Complete features history" />
            </div>

            <div id="admin-upcoming" className="scroll-mt-24">
              <JsonEditor action={saveUpcomingFeaturesContent} button="Save upcoming features" content={upcomingFeatures} format={upcomingFeaturesFormat} rows={24} title="Upcoming features roadmap" />
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
              <div className="mt-6 rounded-lg border border-black/10 bg-[#fbfaf7]">
                <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                  <p className="text-sm font-black">Uploaded media</p>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black/60">{mediaUploads.length} files</span>
                </div>
                <div className="max-h-[360px] overflow-auto">
                  {mediaUploads.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-black/60">No media uploaded yet.</p>
                  ) : (
                    <div className="divide-y divide-black/10">
                      {mediaUploads.map((media) => (
                        <div className="flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between" key={media.storage_path}>
                          <div className="flex min-w-0 gap-4">
                            {media.content_type?.startsWith("image/") ? (
                              <a className="block h-20 w-28 shrink-0 overflow-hidden rounded-md border border-black/10 bg-white" href={media.public_url} target="_blank" rel="noreferrer">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img className="h-full w-full object-cover" src={media.public_url} alt={media.file_name} />
                              </a>
                            ) : (
                              <div className="flex h-20 w-28 shrink-0 items-center justify-center rounded-md border border-black/10 bg-white text-black/35">
                                <FileText size={24} />
                              </div>
                            )}
                            <div className="min-w-0 py-1">
                              <p className="truncate text-sm font-black text-black">{media.file_name}</p>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-black/60">
                                <span>{media.content_type || "unknown"}</span>
                                <span>/</span>
                                <span>{Math.round((media.size_bytes || 0) / 1024)} KB</span>
                              </div>
                              <a className="mt-2 inline-flex text-xs font-bold text-[#9a6500] hover:text-black" href={media.public_url} target="_blank" rel="noreferrer">
                                Open file
                              </a>
                            </div>
                          </div>
                          <form action={deleteMediaUpload}>
                            <input name="storagePath" type="hidden" value={media.storage_path} />
                            <button className="rounded-md border border-black/15 px-4 py-2 text-xs font-extrabold text-black transition hover:border-red-400 hover:text-red-700" type="submit">
                              Delete
                            </button>
                          </form>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
            <BugReportsPanel reports={bugReports} />
            <FeatureRequestsPanel requests={featureRequests} />
            <DownloadAnalyticsPanel events={downloadEvents} />
          </div>
        </div>
      </div>
    </main>
  );
}
