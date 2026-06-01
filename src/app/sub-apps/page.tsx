import Link from "next/link";
import { ArrowRight, Check, Download, Search, Sparkles } from "lucide-react";
import { getSubApps } from "./sub-app-data";

export const metadata = {
  title: "Sub Apps - DawnDesk",
  description: "Explore DawnDesk's built-in sub apps for editing, prompts, projects, notes, and developer workflows.",
};

export default async function SubAppsPage() {
  const subApps = await getSubApps();

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/92 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link className="text-xl font-extrabold text-[#ffc400]" href="/">DawnDesk</Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <Link className="text-[#ffc400]" href="/sub-apps">Sub Apps</Link>
            <Link className="text-white/80 hover:text-[#ffc400]" href="/#features">Features</Link>
            <Link className="text-white/80 hover:text-[#ffc400]" href="/#download">Download</Link>
          </nav>
          <div className="flex items-center gap-4 text-white/85">
            <Search size={18} />
            <Sparkles size={18} />
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-black text-white">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,196,0,0.24),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
          <div>
            <p className="eyebrow text-[#ffc400]">DawnDesk sub apps</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.05] md:text-7xl">
              Every tool is focused and built into one workflow.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/70">
              Explore the complete DawnDesk toolkit. Each sub app has its own workspace, feature set, and detail page.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a className="rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black" href="#sub-app-list">Explore Sub Apps</a>
              <Link className="rounded-md border border-white/25 px-7 py-4 text-sm font-bold text-white" href="/#download">Download DawnDesk</Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {subApps.slice(0, 4).map((app) => {
              const Icon = app.icon;
              return (
                <Link className="rounded-md border border-white/12 bg-white/[0.06] p-6 transition hover:border-[#ffc400]" href={`/sub-apps/${app.slug}`} key={app.slug}>
                  <Icon className="text-[#ffc400]" size={32} />
                  <h2 className="mt-5 text-xl font-black">{app.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-white/60">{app.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <main id="sub-app-list">
        {subApps.map((app, index) => {
          const Icon = app.icon;
          return (
            <section className="section" key={app.slug}>
              <div className={`mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8 ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <div className="flex items-center gap-3 text-sm font-extrabold">
                    <Icon className="rounded bg-black p-2 text-[#ffc400]" size={38} />
                    {app.eyebrow}
                  </div>
                  <h2 className="mt-6 text-4xl font-black leading-tight md:text-5xl">{app.name}</h2>
                  <p className="mt-4 text-2xl font-extrabold text-[#d29300]">{app.accent}</p>
                  <p className="mt-5 max-w-xl text-lg leading-8 text-black/65">{app.summary}</p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link className="inline-flex items-center gap-2 rounded-md bg-black px-6 py-4 text-sm font-extrabold text-white" href={`/sub-apps/${app.slug}`}>
                      More Detail <ArrowRight size={17} />
                    </Link>
                    <Link className="rounded-md border border-black/15 px-6 py-4 text-sm font-bold" href="/#download">Download DawnDesk</Link>
                  </div>
                </div>
                <div className="rounded-xl border border-black/10 bg-white p-6 shadow-xl">
                  <h3 className="text-xl font-black">What you get</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {app.features.map((feature) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <article className="rounded-md border border-black/10 bg-[#fbfaf7] p-5" key={feature.title}>
                          <FeatureIcon className="text-[#d29300]" size={24} />
                          <h4 className="mt-4 font-black">{feature.title}</h4>
                          <p className="mt-2 text-sm leading-6 text-black/60">{feature.copy}</p>
                        </article>
                      );
                    })}
                  </div>
                  <ul className="mt-6 space-y-3 text-sm font-bold text-black/68">
                    {app.workflow.map((step) => (
                      <li className="flex items-center gap-3" key={step}>
                        <Check className="rounded-full bg-[#ffc400] p-1 text-black" size={20} />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}
      </main>

      <section className="bg-black px-5 py-20 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow text-[#ffc400]">DawnDesk toolkit</p>
            <h2 className="mt-4 text-4xl font-black">All sub apps are built into one workspace.</h2>
            <p className="mt-4 max-w-xl leading-7 text-white/65">Install DawnDesk once and use the full toolkit for creative, project, and productivity workflows.</p>
          </div>
          <Link className="inline-flex items-center justify-center gap-3 rounded-md bg-[#ffc400] px-8 py-4 text-sm font-extrabold text-black" href="/#download">
            <Download size={18} />
            Download DawnDesk
          </Link>
        </div>
      </section>
    </div>
  );
}
