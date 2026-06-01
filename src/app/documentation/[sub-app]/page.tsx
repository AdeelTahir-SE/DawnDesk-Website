import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Download } from "lucide-react";
import subAppsFallback from "@/content/sub-apps.json";
import { getSubApp } from "@/app/sub-apps/sub-app-data";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";

type DocumentationPageProps = {
  params: Promise<{
    "sub-app": string;
  }>;
};

export function generateStaticParams() {
  return subAppsFallback.map((app) => ({ "sub-app": app.slug }));
}

export async function generateMetadata(props: DocumentationPageProps) {
  const params = await props.params;
  const app = await getSubApp(params["sub-app"]);

  if (!app) {
    return {
      title: "Documentation - DawnDesk",
    };
  }

  return {
    ...createPageMetadata({
      title: `${app.name} Documentation`,
      description: app.detail,
      path: `/documentation/${app.slug}`,
    }),
  };
}

export default async function DocumentationPage(props: DocumentationPageProps) {
  const params = await props.params;
  const app = await getSubApp(params["sub-app"]);

  if (!app) {
    notFound();
  }

  const Icon = app.icon;

  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="bg-black px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Link className="inline-flex items-center gap-2 text-sm font-bold text-white/65 hover:text-[#ffc400]" href={`/sub-apps/${app.slug}`}>
            <ArrowLeft size={16} />
            Back to {app.name}
          </Link>
          <div className="mt-10 flex items-center gap-4">
            <Icon className="text-[#ffc400]" size={34} />
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#ffc400]">Documentation</p>
          </div>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight md:text-7xl">{app.name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/70">{app.detail}</p>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md border border-black/10 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black">Contents</h2>
              <nav className="mt-5 space-y-3 text-sm font-bold text-black/65">
                <a className="block hover:text-[#c47800]" href="#overview">Overview</a>
                <a className="block hover:text-[#c47800]" href="#features">Features</a>
                <a className="block hover:text-[#c47800]" href="#workflow">Workflow</a>
              </nav>
            </div>
          </aside>

          <div className="space-y-8">
            <article id="overview" className="rounded-md border border-black/10 bg-white p-8 shadow-sm">
              <p className="eyebrow text-[#c47800]">Overview</p>
              <h2 className="mt-4 text-3xl font-black">{app.headline}</h2>
              <p className="mt-5 leading-8 text-black/65">{app.summary}</p>
            </article>

            <article id="features" className="rounded-md border border-black/10 bg-white p-8 shadow-sm">
              <p className="eyebrow text-[#c47800]">Features</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {app.features.map((feature) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div className="rounded-md border border-black/10 bg-[#fbfaf7] p-5" key={feature.title}>
                      <FeatureIcon className="text-[#d29300]" size={24} />
                      <h3 className="mt-4 font-black">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-black/60">{feature.copy}</p>
                    </div>
                  );
                })}
              </div>
            </article>

            <article id="workflow" className="rounded-md border border-black/10 bg-white p-8 shadow-sm">
              <p className="eyebrow text-[#c47800]">Workflow</p>
              <ol className="mt-6 space-y-4">
                {app.workflow.map((step, index) => (
                  <li className="flex gap-4 rounded-md border border-black/10 bg-[#fbfaf7] p-5" key={step}>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffc400] text-sm font-black text-black">{index + 1}</span>
                    <div>
                      <h3 className="font-black">{step}</h3>
                      <p className="mt-2 text-sm leading-6 text-black/60">Complete this step inside the {app.name} workspace and keep the result connected to DawnDesk.</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link className="btn-animated btn-animated-dark mt-8 inline-flex items-center gap-3 rounded-md bg-black px-6 py-4 text-sm font-extrabold text-white" href="/api/download/windows">
                <Download size={18} />
                Download DawnDesk
              </Link>
            </article>

            <article className="rounded-md border border-black/10 bg-white p-8 shadow-sm">
              <p className="eyebrow text-[#c47800]">Checklist</p>
              <ul className="mt-6 grid gap-3 text-sm font-bold text-black/68 sm:grid-cols-3">
                {["Open the workspace", "Complete the workflow", "Export or reuse the result"].map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <Check className="rounded-full bg-[#ffc400] p-1 text-black" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
