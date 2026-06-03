import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { DownloadChooser } from "@/components/DownloadChooser";
import { getAppReleasesContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Releases",
  description: "Download the latest version of DawnDesk for your system.",
  alternates: {
    canonical: "/releases",
  },
};

export default async function ReleasesPage() {
  const releases = await getAppReleasesContent();

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />
      <section className="relative overflow-hidden bg-black text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <p className="eyebrow text-[#ffc400]">DawnDesk Releases</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[1.04] md:text-7xl">Download the latest builds.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/72">
            Get the newest features and improvements. DawnDesk detects your system automatically, but you can always choose another platform or version.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <DownloadChooser releases={releases} />
        </div>
      </section>
    </div>
  );
}
