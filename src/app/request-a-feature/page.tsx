import { Lightbulb } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Request a Feature",
  description: "Send a DawnDesk feature request.",
  path: "/request-a-feature",
});

export default function RequestFeaturePage({ searchParams }: { searchParams?: { sent?: string } }) {
  const sent = searchParams?.sent === "1";

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <Lightbulb className="text-[#d29300]" size={42} />
            <p className="eyebrow mt-6 text-[#c47800]">Request a feature</p>
            <h1 className="mt-4 text-5xl font-black leading-tight">Help shape DawnDesk.</h1>
            <p className="mt-5 leading-8 text-black/65">Tell us what would make your workflow smoother. Requests are saved to Supabase for review.</p>
          </div>

          <form action="/api/request-feature" method="post" className="rounded-md border border-black/10 bg-white p-7 shadow-sm">
            {sent && <p className="mb-5 rounded-md bg-[#fff3bf] px-4 py-3 text-sm font-bold text-black">Response submitted! Your feature request was saved.</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-md border border-black/15 px-4 py-3 text-sm" name="name" placeholder="Your name" />
              <input className="rounded-md border border-black/15 px-4 py-3 text-sm" name="email" type="email" placeholder="Email" />
            </div>
            <input className="mt-4 w-full rounded-md border border-black/15 px-4 py-3 text-sm" name="title" placeholder="Feature title" required />
            <select className="mt-4 w-full rounded-md border border-black/15 px-4 py-3 text-sm" name="priority" defaultValue="Useful">
              <option>Useful</option>
              <option>Important</option>
              <option>Critical</option>
            </select>
            <textarea className="mt-4 min-h-44 w-full rounded-md border border-black/15 px-4 py-3 text-sm" name="description" placeholder="Describe the feature and the workflow it improves" required />
            <button className="btn-animated btn-animated-dark mt-5 rounded-md bg-black px-6 py-3 text-sm font-extrabold text-white" type="submit">Submit request</button>
          </form>
        </div>
      </section>
    </main>
  );
}
