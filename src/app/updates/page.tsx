import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { UpdateTree } from "@/components/UpdateTree";
import { getFeatureHistoryContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Update Tree",
  description: "Explore the linear DawnDesk update history and the feature branches added in each release.",
  alternates: {
    canonical: "/updates",
  },
};

export default async function UpdatesPage() {
  const updates = await getFeatureHistoryContent();

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-[#ffc400]">DawnDesk update tree</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.04] md:text-7xl">A growing trunk of releases with feature branches.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
            Read the product history in one straight line, then scan each branch to see what changed in that update.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <UpdateTree updates={updates} />
        </div>
      </section>
    </div>
  );
}
