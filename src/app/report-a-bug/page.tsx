import { Bug, Upload } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Report a Bug",
  description: "Report a DawnDesk issue with an optional screenshot attachment.",
  path: "/report-a-bug",
});

export default function ReportBugPage({ searchParams }: { searchParams?: { sent?: string } }) {
  const sent = searchParams?.sent === "1";

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="section">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
          <div>
            <Bug className="text-[#d29300]" size={42} />
            <p className="eyebrow mt-6 text-[#c47800]">Report a bug</p>
            <h1 className="mt-4 text-5xl font-black leading-tight">Send the details that help us fix it.</h1>
            <p className="mt-5 leading-8 text-black/65">Attach a screenshot when the visual state matters. The image uploads to the Supabase storage bucket created by the migration.</p>
          </div>

          <form action="/api/report-bug" method="post" encType="multipart/form-data" className="rounded-md border border-black/10 bg-white p-7 shadow-sm">
            {sent && <p className="mb-5 rounded-md bg-[#fff3bf] px-4 py-3 text-sm font-bold text-black">Thanks. Your bug report was saved.</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <input className="rounded-md border border-black/15 px-4 py-3 text-sm" name="name" placeholder="Your name" />
              <input className="rounded-md border border-black/15 px-4 py-3 text-sm" name="email" type="email" placeholder="Email" />
            </div>
            <input className="mt-4 w-full rounded-md border border-black/15 px-4 py-3 text-sm" name="title" placeholder="Bug title" required />
            <textarea className="mt-4 min-h-32 w-full rounded-md border border-black/15 px-4 py-3 text-sm" name="steps" placeholder="Steps to reproduce" required />
            <textarea className="mt-4 min-h-24 w-full rounded-md border border-black/15 px-4 py-3 text-sm" name="expected" placeholder="Expected result" />
            <textarea className="mt-4 min-h-24 w-full rounded-md border border-black/15 px-4 py-3 text-sm" name="actual" placeholder="Actual result" />
            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-black/20 bg-[#fbfaf7] px-4 py-5 text-sm font-bold text-black/65">
              <Upload size={20} />
              Attach screenshot or image
              <input className="sr-only" name="attachment" type="file" accept="image/*" />
            </label>
            <button className="btn-animated btn-animated-dark mt-5 rounded-md bg-black px-6 py-3 text-sm font-extrabold text-white" type="submit">Submit bug report</button>
          </form>
        </div>
      </section>
    </main>
  );
}
