import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Download, Sparkles } from "lucide-react";
import { getSubApp, subApps } from "../sub-app-data";

export function generateStaticParams() {
  return subApps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata(props: PageProps<"/sub-apps/[slug]">) {
  const { slug } = await props.params;
  const app = getSubApp(slug);

  if (!app) {
    return {
      title: "Sub App - DawnDesk",
    };
  }

  return {
    title: `${app.name} - DawnDesk`,
    description: app.summary,
  };
}

export default async function SubAppDetailPage(props: PageProps<"/sub-apps/[slug]">) {
  const { slug } = await props.params;
  const app = getSubApp(slug);

  if (!app) {
    notFound();
  }

  const Icon = app.icon;

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/92 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link className="text-xl font-extrabold text-[#ffc400]" href="/">DawnDesk</Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <Link className="text-white/80 hover:text-[#ffc400]" href="/sub-apps">Sub Apps</Link>
            <Link className="text-white/80 hover:text-[#ffc400]" href="/#features">Features</Link>
            <Link className="text-white/80 hover:text-[#ffc400]" href="/#download">Download</Link>
          </nav>
          <Sparkles className="text-[#ffc400]" size={20} />
        </div>
      </header>

      <section className="relative overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,196,0,0.24),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <Link className="mb-9 inline-flex items-center gap-2 text-sm font-bold text-white/65 hover:text-[#ffc400]" href="/sub-apps">
              <ArrowLeft size={16} />
              Back to Sub Apps
            </Link>
            <div className="flex items-center gap-3 text-sm font-extrabold text-[#ffc400]">
              <Icon size={28} />
              {app.eyebrow}
            </div>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[1.05] md:text-7xl">{app.headline}</h1>
            <p className="mt-6 text-2xl font-extrabold text-[#ffc400]">{app.accent}</p>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">{app.detail}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link className="inline-flex items-center gap-2 rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black" href="/#download">
                <Download size={18} />
                Download Free
              </Link>
              <Link className="rounded-md border border-white/25 px-7 py-4 text-sm font-bold text-white" href="/sub-apps">View All Sub Apps</Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/12 bg-white/[0.06] p-6 shadow-[0_0_70px_rgba(255,196,0,0.14)]">
            <div className="rounded-lg border border-white/10 bg-[#101012] p-5">
              <div className="mb-5 flex items-center justify-between text-xs text-white/55">
                <span className="font-black text-[#ffc400]">{app.name}</span>
                <span>Free Included Tool</span>
              </div>
              <div className="grid min-h-[340px] gap-4 sm:grid-cols-[150px_1fr]">
                <aside className="rounded-md bg-black/35 p-3">
                  {app.workflow.map((step, index) => (
                    <div className={`mb-3 rounded px-3 py-3 text-xs font-bold ${index === 0 ? "bg-[#ffc400]/15 text-[#ffc400]" : "bg-white/[0.04] text-white/55"}`} key={step}>
                      Step {index + 1}
                    </div>
                  ))}
                </aside>
                <main className="space-y-4">
                  {app.features.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <article className="rounded-md border border-white/10 bg-white/[0.045] p-4" key={feature.title}>
                        <div className="flex items-start gap-4">
                          <FeatureIcon className="text-[#ffc400]" size={24} />
                          <div>
                            <h2 className="font-black text-white">{feature.title}</h2>
                            <p className="mt-2 text-sm leading-6 text-white/58">{feature.copy}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </main>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
          <div>
            <p className="eyebrow text-[#c47800]">How it works</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">A focused workflow for {app.name.toLowerCase()}.</h2>
            <p className="mt-5 max-w-md leading-7 text-black/65">{app.summary}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {app.workflow.map((step, index) => (
              <article className="rounded-md border border-black/10 bg-white p-6 shadow-sm" key={step}>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffc400] text-sm font-black text-black">{index + 1}</span>
                <h3 className="mt-5 text-xl font-black">{step}</h3>
                <p className="mt-3 text-sm leading-6 text-black/60">Use this step to keep your work connected with the rest of DawnDesk.</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-xl bg-black p-8 text-white md:p-12">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="eyebrow text-[#ffc400]">Free forever</p>
                <h2 className="mt-4 text-3xl font-black md:text-5xl">{app.name} is included with DawnDesk.</h2>
                <ul className="mt-7 grid gap-3 text-sm font-bold text-white/72 sm:grid-cols-3">
                  {["No paid upgrade", "No checkout screen", "No feature lock"].map((item) => (
                    <li className="flex items-center gap-3" key={item}>
                      <Check className="rounded-full bg-[#ffc400] p-1 text-black" size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link className="inline-flex items-center justify-center gap-3 rounded-md bg-[#ffc400] px-8 py-4 text-sm font-extrabold text-black" href="/#download">
                <Download size={18} />
                Download DawnDesk
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
