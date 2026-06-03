import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { getUpcomingFeaturesContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Upcoming Features & Roadmap",
  description: "Explore the roadmap and upcoming features planned for DawnDesk.",
  alternates: {
    canonical: "/upcoming",
  },
};

export default async function UpcomingPage() {
  const upcoming = await getUpcomingFeaturesContent();

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-[#ffc400]">DawnDesk Roadmap</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.04] md:text-7xl">Upcoming features you&apos;ll love.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
            We are constantly building new features and tools to make DawnDesk even better. Check out what is on the horizon.
          </p>
          <div className="mt-9">
            <Link className="btn-animated inline-flex rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black" href="/request-a-feature">
              Request a feature
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <div className="space-y-12">
            {upcoming.map((item) => (
              <div className="flex gap-6 rounded-xl border border-black/10 bg-white p-8 shadow-sm transition hover:border-[#ffc400] hover:shadow-lg" key={item.version}>
                <span className={`mt-1 h-8 w-8 shrink-0 rounded-full ${item.color} shadow-inner`} />
                <div>
                  <div className="flex flex-wrap items-center gap-4">
                    <h3 className="text-2xl font-black">{item.version}</h3>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black/60">{item.state}</span>
                  </div>
                  <h4 className="mt-2 text-xl font-bold text-black/90">{item.title}</h4>
                  <p className="mt-3 text-base leading-7 text-black/65">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 rounded-xl bg-black p-10 text-center text-white">
            <h3 className="text-2xl font-black text-[#ffc400]">Don&apos;t see what you need?</h3>
            <p className="mx-auto mt-4 max-w-lg leading-7 text-white/70">
              Our roadmap is driven by user feedback. Let us know what tools or features would make DawnDesk perfect for your workflow.
            </p>
            <div className="mt-8">
              <Link className="btn-animated inline-block rounded-md bg-[#ffc400] px-7 py-3 text-sm font-extrabold text-black" href="/request-a-feature">
                Submit Feedback
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
