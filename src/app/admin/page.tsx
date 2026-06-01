import { revalidatePath, revalidateTag } from "next/cache";
import { getSiteContent, getSubAppsContent } from "@/lib/content";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const metadata = {
  title: "Admin - DawnDesk",
  robots: {
    index: false,
    follow: false,
  },
};

async function saveHomepageContent(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const expectedPassword = process.env.ADMIN_CONTENT_PASSWORD;
  const content = String(formData.get("content") ?? "");

  if (!expectedPassword || password !== expectedPassword) {
    throw new Error("Invalid admin password.");
  }

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
}

async function saveSubAppContent(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const expectedPassword = process.env.ADMIN_CONTENT_PASSWORD;
  const slug = String(formData.get("slug") ?? "");
  const content = String(formData.get("content") ?? "");

  if (!expectedPassword || password !== expectedPassword) {
    throw new Error("Invalid admin password.");
  }

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
}

export default async function AdminPage() {
  const [siteContent, subApps] = await Promise.all([getSiteContent(), getSubAppsContent()]);

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-5 py-10 text-[#171717] lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="eyebrow text-[#c47800]">DawnDesk admin</p>
        <h1 className="mt-4 text-4xl font-black">Website content</h1>
        <p className="mt-3 max-w-2xl leading-7 text-black/60">
          Edit the JSON content stored in Supabase. Set `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_CONTENT_PASSWORD`
          before saving changes.
        </p>

        <section className="mt-10 rounded-md border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">Homepage</h2>
          <form action={saveHomepageContent} className="mt-5 space-y-4">
            <input
              className="w-full rounded-md border border-black/15 px-4 py-3 text-sm"
              name="password"
              placeholder="Admin password"
              type="password"
            />
            <textarea
              className="min-h-[520px] w-full rounded-md border border-black/15 bg-[#101012] p-4 font-mono text-xs leading-6 text-white"
              name="content"
              defaultValue={JSON.stringify(siteContent, null, 2)}
              spellCheck={false}
            />
            <button className="rounded-md bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black" type="submit">
              Save homepage content
            </button>
          </form>
        </section>

        <section className="mt-8 space-y-6">
          {subApps.map((app) => (
            <article className="rounded-md border border-black/10 bg-white p-6 shadow-sm" key={app.slug}>
              <h2 className="text-2xl font-black">{app.name}</h2>
              <form action={saveSubAppContent} className="mt-5 space-y-4">
                <input name="slug" type="hidden" value={app.slug} />
                <input
                  className="w-full rounded-md border border-black/15 px-4 py-3 text-sm"
                  name="password"
                  placeholder="Admin password"
                  type="password"
                />
                <textarea
                  className="min-h-[360px] w-full rounded-md border border-black/15 bg-[#101012] p-4 font-mono text-xs leading-6 text-white"
                  name="content"
                  defaultValue={JSON.stringify(app, null, 2)}
                  spellCheck={false}
                />
                <button className="rounded-md bg-black px-6 py-3 text-sm font-extrabold text-white" type="submit">
                  Save {app.name}
                </button>
              </form>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
