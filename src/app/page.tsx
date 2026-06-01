import {
  Apple,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  Cloud,
  Code2,
  Download,
  FileArchive,
  FileText,
  Film,
  FolderKanban,
  GraduationCap,
  Heart,
  ImageIcon,
  LayoutGrid,
  Lightbulb,
  Menu,
  Monitor,
  Palette,
  PenTool,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
  TimerReset,
  Upload,
  UsersRound,
  Video,
  Wand2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ElementType } from "react";
import siteFallback from "@/content/site.json";
import { getSiteContent } from "@/lib/content";
import { SearchOverlayButton } from "@/components/SearchOverlayButton";

type ToolFeature = readonly [string, string, ElementType];
type ToolHeroContent = {
  label: string;
  title: string;
  accent: string;
  copy: string;
  button: string;
  featureSet: ToolType;
  icon: ElementType;
};

const iconMap = {
  Apple,
  BadgeCheck,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CircleUserRound,
  Cloud,
  Code2,
  FileArchive,
  FileText,
  Film,
  FolderKanban,
  GraduationCap,
  Heart,
  ImageIcon,
  LayoutGrid,
  Lightbulb,
  Menu,
  Monitor,
  Palette,
  PenTool,
  Search,
  Settings2,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Tags,
  TimerReset,
  Upload,
  UsersRound,
  Video,
  Wand2,
} satisfies Record<string, ElementType>;

type IconName = keyof typeof iconMap;
type ToolType = "photo" | "video" | "prompt";

function getIcon(icon: string): ElementType {
  return iconMap[icon as IconName] ?? Sparkles;
}

function mapFeature(feature: { title: string; copy: string; icon: string }): ToolFeature {
  return [feature.title, feature.copy, getIcon(feature.icon)];
}

function mapToolHero(hero: (typeof siteFallback.toolHeroes)[ToolType]): ToolHeroContent {
  return {
    ...hero,
    featureSet: hero.featureSet as ToolType,
    icon: getIcon(hero.icon),
  };
}

let siteContent = siteFallback;
let navItems = siteContent.navigation.mainItems;
let platformItems = siteContent.download.platforms.map((item) => ({ ...item, icon: getIcon(item.icon) }));
let featureCards = siteContent.featureCards.map((item) => ({ ...item, icon: getIcon(item.icon) }));
let suiteTools = siteContent.suiteTools;
let upcoming = siteContent.upcoming;
let audiences = siteContent.audiences.map((item) => ({ ...item, icon: getIcon(item.icon) }));
let testimonials = siteContent.testimonials;
let subApps = siteContent.subAppsPreview.items.map((item) => ({ ...item, icon: getIcon(item.icon) }));
let photoFeatures = siteContent.toolFeatureSets.photo.map(mapFeature);
let videoFeatures = siteContent.toolFeatureSets.video.map(mapFeature);
let promptFeatures = siteContent.toolFeatureSets.prompt.map(mapFeature);
let toolFeaturesByType: Record<ToolType, ToolFeature[]> = {
  photo: photoFeatures,
  video: videoFeatures,
  prompt: promptFeatures,
};
let toolHeroes: Record<ToolType, ToolHeroContent> = {
  photo: mapToolHero(siteContent.toolHeroes.photo),
  video: mapToolHero(siteContent.toolHeroes.video),
  prompt: mapToolHero(siteContent.toolHeroes.prompt),
};

function setSiteContent(content: typeof siteFallback) {
  siteContent = content;
  navItems = siteContent.navigation.mainItems;
  platformItems = siteContent.download.platforms.map((item) => ({ ...item, icon: getIcon(item.icon) }));
  featureCards = siteContent.featureCards.map((item) => ({ ...item, icon: getIcon(item.icon) }));
  suiteTools = siteContent.suiteTools;
  upcoming = siteContent.upcoming;
  audiences = siteContent.audiences.map((item) => ({ ...item, icon: getIcon(item.icon) }));
  testimonials = siteContent.testimonials;
  subApps = siteContent.subAppsPreview.items.map((item) => ({ ...item, icon: getIcon(item.icon) }));
  photoFeatures = siteContent.toolFeatureSets.photo.map(mapFeature);
  videoFeatures = siteContent.toolFeatureSets.video.map(mapFeature);
  promptFeatures = siteContent.toolFeatureSets.prompt.map(mapFeature);
  toolFeaturesByType = {
    photo: photoFeatures,
    video: videoFeatures,
    prompt: promptFeatures,
  };
  toolHeroes = {
    photo: mapToolHero(siteContent.toolHeroes.photo),
    video: mapToolHero(siteContent.toolHeroes.video),
    prompt: mapToolHero(siteContent.toolHeroes.prompt),
  };
}

export default async function Home() {
  setSiteContent(await getSiteContent());

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <Header dark />
      <Hero />
      <SubAppsOverview />
      <DownloadSection />
      <FeatureSection />
      <SuiteShowcase />
      <ToolHero type="photo" />
      <ToolGrid kicker={siteContent.toolGrids.photo.kicker} title={siteContent.toolGrids.photo.title} features={photoFeatures} notice={siteContent.toolGrids.photo.notice} />
      <ToolHero type="video" />
      <ToolGrid kicker={siteContent.toolGrids.video.kicker} title={siteContent.toolGrids.video.title} features={videoFeatures} notice={siteContent.toolGrids.video.notice} />
      <ToolHero type="prompt" />
      <ToolGrid kicker={siteContent.toolGrids.prompt.kicker} title={siteContent.toolGrids.prompt.title} features={promptFeatures} notice={siteContent.toolGrids.prompt.notice} />
      <UpcomingSection />
      <AudienceSection />
      <Testimonials />
      <DownloadCta />
      <Footer />
    </div>
  );
}

function Header({ dark = false }: { dark?: boolean }) {
  return (
    <header className={`sticky top-0 z-50 border-b ${dark ? "border-white/10 bg-black/90 text-white" : "border-black/10 bg-[#fbfaf7]/90 text-black"} backdrop-blur-xl`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a className="flex items-center gap-3 text-xl font-extrabold text-[#ffc400]" href="#">
          <Image src="/realistic_logo.png" alt="DawnDesk logo" width={48} height={48} className="h-12 w-12 object-contain" />
          DawnDesk
        </a>
        <nav className="hidden items-center gap-9 text-sm font-semibold md:flex">
          {navItems.map((item) => (
            <a
              key={item}
              className="opacity-85 transition hover:text-[#ffc400] hover:opacity-100"
              href={item === "Sub Apps" ? "/sub-apps" : item === "Solutions" ? "/solutions" : `#${item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <SearchOverlayButton tone={dark ? "dark" : "light"} />
          <Link aria-label="Login with Google" className="transition hover:text-[#ffc400]" href="/login">
            <CircleUserRound size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  const hero = siteContent.hero;

  return (
    <section className="relative overflow-hidden bg-black text-white">
      <Glow />
      <div className="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div className="relative z-10">
          <p className="mb-7 text-xs font-extrabold uppercase tracking-[0.18em] text-[#ffc400]">{hero.eyebrow}</p>
          <h1 className="max-w-xl text-5xl font-black leading-[1.04] md:text-7xl">
            {hero.title} <span className="text-[#ffc400]">{hero.highlight}</span>
          </h1>
          <p className="mt-8 max-w-md text-lg leading-8 text-white/78">{hero.copy}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <a className="rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black shadow-[0_0_38px_rgba(255,196,0,0.25)]" href="/api/download/windows">{hero.primaryCta}</a>
            <a className="rounded-md border border-white/25 px-7 py-4 text-sm font-bold text-white hover:border-[#ffc400]" href="#features">{hero.secondaryCta}</a>
          </div>
          <div className="mt-12 flex items-center gap-5 text-sm text-white/60">
            <span className="font-semibold italic">Available for</span>
            <Monitor size={20} />
            <Apple size={20} />
            <Cloud size={20} />
          </div>
        </div>
        <div className="relative z-10 lg:translate-x-8">
          <DashboardMockup large />
        </div>
      </div>
    </section>
  );
}

function SubAppsOverview() {
  return (
    <section id="sub-apps-preview" className="section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow text-[#c47800]">Powerful sub apps</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Choose the right tool for the moment.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-black/65">
              DawnDesk is a suite of focused workspaces. Open a tool when you need it, then bring the output back into your daily workflow.
            </p>
            <Link
              className="mt-8 inline-flex items-center gap-3 rounded-md bg-black px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#ffc400] hover:text-black"
              href="/sub-apps"
            >
              View all sub apps
              <ChevronRight size={18} />
            </Link>
            <div className="mt-8 rounded-md border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black">Included tools</h3>
              <ul className="mt-5 space-y-3 text-sm font-bold text-black/65">
                {siteContent.subAppsPreview.included.map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <Check className="rounded-full bg-[#ffc400] p-1 text-black" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {subApps.map(({ title, icon: Icon, href, copy }) => (
              <Link className="group rounded-md border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#ffc400] hover:shadow-xl" href={href} key={title}>
                <div className="flex items-start justify-between gap-5">
                  <Icon className="rounded-md bg-[#fff3bf] p-2 text-[#d29300]" size={42} />
                  <ChevronRight className="mt-2 text-black/25 transition group-hover:translate-x-1 group-hover:text-[#d29300]" size={20} />
                </div>
                <h3 className="mt-6 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/58">{copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DownloadSection() {
  const windows = siteContent.download.windows;

  return (
    <section id="download" className="section">
      <div className="mx-auto max-w-5xl px-5">
        <p className="eyebrow text-[#c47800]">Download DawnDesk</p>
        <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight md:text-5xl">Get DawnDesk<br />for your device</h2>
        <p className="mt-4 max-w-md text-base leading-7 text-black/65">Choose your platform and start boosting your productivity today.</p>
        <div className="mt-10 overflow-hidden rounded-md border border-black/15 bg-white shadow-sm">
          <div className="grid border-b border-black/10 md:grid-cols-3">
            {platformItems.map(({ name, icon: Icon, active }) => (
              <button className={`flex items-center justify-center gap-3 px-5 py-5 text-sm font-extrabold ${active ? "border-b-2 border-[#ffc400] text-black" : "text-black/50"}`} key={name}>
                <Icon size={20} />
                {name}
                {!active && <span className="rounded bg-black/5 px-2 py-1 text-[10px] font-bold">Coming Soon</span>}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-8 p-8 md:flex-row md:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-md bg-sky-50 text-sky-500">
              <Monitor size={48} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black">{windows.title}</h3>
              <p className="mt-2 text-sm text-black/60">{windows.version} <span className="mx-3">|</span> {windows.size}</p>
              <p className="mt-2 text-sm text-black/60">{windows.compatibility}</p>
              <div className="mt-7 flex flex-wrap gap-4">
                <a className="rounded-md bg-[#ffc400] px-7 py-3 text-sm font-extrabold text-black" href="/api/download/windows">{windows.primaryCta}</a>
                <a className="rounded-md border border-black/15 px-7 py-3 text-sm font-bold" href={windows.url}>{windows.secondaryCta}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section id="features" className="section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow">Powerful features</p>
        <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight md:text-5xl">Everything you need, built in.</h2>
        <p className="mt-5 max-w-lg leading-7 text-black/65">DawnDesk comes packed with tools to help you manage tasks, projects, and more.</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureCards.map(({ title, copy, icon: Icon, tone }) => <InfoCard key={title} title={title} copy={copy} icon={Icon} tone={tone} />)}
        </div>
      </div>
    </section>
  );
}

function SuiteShowcase() {
  return (
    <section className="section">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <p className="eyebrow">One app. Many tools.</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Your all-in-one productivity suite</h2>
          <p className="mt-5 max-w-md leading-7 text-black/65">DawnDesk brings all your essential tools together in one beautiful and easy-to-use interface.</p>
          <ul className="mt-8 space-y-4">
            {suiteTools.map((item) => (
              <li className="flex items-center gap-3 text-sm font-bold" key={item}><Check className="rounded-full bg-[#ffc400] p-1 text-black" size={20} /> {item}</li>
            ))}
          </ul>
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}

function ToolHero({ type }: { type: "photo" | "video" | "prompt" }) {
  const content = toolHeroes[type];
  const features = toolFeaturesByType[content.featureSet].slice(0, 4);
  const Icon = content.icon;

  return (
    <section className="section">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div>
          <div className="mb-6 flex items-center gap-2 text-sm font-extrabold"><Icon className="rounded bg-black p-1 text-white" size={21} /> {content.label}</div>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            {content.title} {content.accent && <span className="block text-[#ffb400]">{content.accent}</span>}
          </h2>
          <p className="mt-6 max-w-lg leading-7 text-black/65">{content.copy}</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {features.map(([title, copy, Icon]) => <MiniFeature key={title} title={title} copy={copy} icon={Icon} />)}
          </div>
          <div className="mt-8 flex items-center gap-6">
            <button className="rounded-md bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black">{content.button}</button>
            <span className="text-sm font-semibold text-black/55">Built into DawnDesk</span>
          </div>
        </div>
        <EditorMockup type={type} />
      </div>
    </section>
  );
}

function ToolGrid({ kicker, title, features, notice }: { kicker: string; title: string; features: ToolFeature[]; notice: string }) {
  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow">{kicker}</p>
        <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight md:text-5xl">{title}</h2>
        <div className="mt-8 flex gap-3">
          <button className="rounded-md border border-[#ffc400] bg-[#fff8d6] px-5 py-3 text-sm font-extrabold text-[#d99500]">Current Features</button>
          <button className="rounded-md px-5 py-3 text-sm font-bold text-black/70">Coming Soon</button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, copy, Icon]) => <MiniFeature key={title} title={title} copy={copy} icon={Icon} />)}
        </div>
        <div className="mt-8 flex items-center gap-4 rounded-md border border-black/10 bg-white px-5 py-5 text-sm text-black/65">
          <Lightbulb className="rounded bg-[#fff2c2] p-2 text-[#e09a00]" size={38} />
          <div><strong className="block text-black">More features coming soon!</strong>{notice}</div>
        </div>
      </div>
    </section>
  );
}

function UpcomingSection() {
  return (
    <section className="section">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="eyebrow text-[#c47800]">What&apos;s coming</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Upcoming features you&apos;ll love</h2>
          <p className="mt-5 max-w-md leading-7 text-black/65">We&apos;re constantly building new features to make DawnDesk even better.</p>
          <div className="mt-9 space-y-7">
            {upcoming.map((item) => (
              <div className="flex gap-5" key={item.version}>
                <span className={`mt-1 h-6 w-6 rounded-full ${item.color}`} />
                <div>
                  <h3 className="font-black">{item.version} <span className="ml-5 font-bold text-black/80">{item.title}</span></h3>
                  <p className="mt-1 text-sm text-black/60">{item.copy}</p>
                  <p className="mt-1 text-xs font-bold text-black/40">{item.state}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BrandPanel copy="Brighten your workflow. Stay tuned for more updates!" />
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow text-[#c47800]">Built for everyone</p>
        <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Who is DawnDesk for?</h2>
        <p className="mt-5 max-w-xl leading-7 text-black/65">Whether you&apos;re a freelancer, part of a team, or managing a business, DawnDesk adapts to you.</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map(({ title, copy, icon: Icon, tone }) => <InfoCard key={title} title={title} copy={copy} icon={Icon} tone={tone} />)}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <p className="eyebrow text-[#c47800]">Trusted by users</p>
        <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">What our users say</h2>
        <p className="mt-4 max-w-md leading-7 text-black/65">Join thousands of productive users who love DawnDesk.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <article className="rounded-md border border-black/10 bg-white p-8" key={item.name}>
              <p className="min-h-28 text-lg font-semibold leading-8 text-black/80">&quot;{item.quote}&quot;</p>
              <div className="mt-7 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-[#ffc400]">{item.name.charAt(0)}</div>
                <div><h3 className="font-black">{item.name}</h3><p className="text-sm text-black/55">{item.role}</p></div>
              </div>
              <div className="mt-5 flex gap-1 text-[#ffc400]">{Array.from({ length: 5 }).map((_, star) => <Star fill="currentColor" size={18} key={`${index}-${star}`} />)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DownloadCta() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <Glow />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div className="relative z-10">
          <p className="eyebrow text-[#ffc400]">Download DawnDesk</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Download DawnDesk<br />and boost your productivity today!</h2>
          <ul className="mt-8 space-y-4 text-sm font-bold text-white/80">
            {["Core tools included", "Regular updates", "Works on Windows, macOS & Linux", "Focused workspaces"].map((item) => <li className="flex items-center gap-3" key={item}><Check className="rounded-full bg-[#ffc400] p-1 text-black" size={20} /> {item}</li>)}
          </ul>
          <div className="mt-9 flex flex-wrap gap-4">
            <a className="rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black" href="/api/download/windows"><Download className="mr-2 inline" size={17} />Download for Windows</a>
            <button className="rounded-md border border-white/25 px-7 py-4 text-sm font-bold">View Other Platforms</button>
          </div>
        </div>
        <LaptopMockup />
      </div>
    </section>
  );
}

function Footer() {
  const footer = siteContent.footer;
  const footerHref = (item: string) => {
    if (item === "Sub Apps") return "/sub-apps";
    if (item === "Documentation") return "/documentation";
    if (item === "Blog") return "/blog";
    if (item === "Report a Bug") return "/report-a-bug";
    if (item === "Request a Feature") return "/request-a-feature";
    if (item === "Download") return "#download";
    if (item === "Features") return "#features";
    return "#";
  };
  const socialHref = (item: string) => {
    if (item === "x") return "https://x.com/DawnDesk";
    if (item === "yt") return "https://www.youtube.com/@DawnDeskOfficial";
    return "#";
  };

  return (
    <footer className="bg-black px-5 py-16 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_2.6fr_1.6fr]">
        <div>
          <h2 className="text-3xl font-black text-[#ffc400]">DawnDesk</h2>
          <p className="mt-5 max-w-xs leading-8 text-white/68">{footer.copy}</p>
          <div className="mt-8 flex gap-4 text-white/70">
            {footer.socials.map((item) => (
              <a
                aria-label={`DawnDesk ${item}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition hover:bg-[#ffc400] hover:text-black"
                href={socialHref(item)}
                key={item}
              >
                <SocialIcon name={item} />
              </a>
            ))}
          </div>
          <p className="mt-16 text-sm text-white/45">{footer.copyright}</p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footer.groups.map(({ title, items }) => (
            <div key={title}>
              <h3 className="mb-5 font-black">{title}</h3>
              <ul className="space-y-4 text-white/62">
                {items.map((item) => <li key={item}><a className="hover:text-[#ffc400]" href={footerHref(item)}>{item}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <div className="rounded-md border border-white/15 bg-white/[0.06] p-7">
            <h3 className="text-xl font-black">{footer.newsletter.title}</h3>
            <p className="mt-4 leading-7 text-white/62">{footer.newsletter.copy}</p>
            <form action="/api/newsletter" method="post" className="mt-7 flex overflow-hidden rounded-md border border-white/15 bg-black/30">
              <input className="min-w-0 flex-1 bg-transparent px-4 py-4 text-sm outline-none" name="email" type="email" placeholder={footer.newsletter.placeholder} required />
              <button className="bg-[#ffc400] px-5 text-sm font-extrabold text-black">{footer.newsletter.button}</button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InfoCard({ title, copy, icon: Icon, tone }: { title: string; copy: string; icon: ElementType; tone: string }) {
  return (
    <article className="rounded-md border border-black/10 bg-white p-7 shadow-sm">
      <Icon className={`mb-5 rounded-md p-2 ${tone}`} size={40} />
      <h3 className="text-lg font-black">{title}</h3>
      <p className="mt-3 leading-7 text-black/62">{copy}</p>
    </article>
  );
}

function MiniFeature({ title, copy, icon: Icon }: { title: string; copy: string; icon: ElementType }) {
  return (
    <article className="rounded-md border border-black/10 bg-white p-5">
      <div className="flex items-start gap-4">
        <Icon size={22} className="mt-1 text-black" />
        <div>
          <h3 className="font-black">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-black/58">{copy}</p>
        </div>
      </div>
    </article>
  );
}

function DashboardMockup({ large = false }: { large?: boolean }) {
  return (
    <ScreenshotFrame
      alt="DawnDesk dashboard command center"
      className={large ? "rotate-[-2deg]" : ""}
      height={689}
      priority={large}
      src="/screenshots/dawndesk-dashboard.png"
      width={1348}
    />
  );
}

function ScreenshotFrame({
  alt,
  className = "",
  height,
  priority = false,
  src,
  width,
}: {
  alt: string;
  className?: string;
  height: number;
  priority?: boolean;
  src: string;
  width: number;
}) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/12 bg-[#090909] p-3 shadow-[0_0_70px_rgba(255,196,0,0.16)] ${className}`}>
      <Image
        alt={alt}
        className="h-auto w-full rounded-lg border border-white/10 object-cover"
        height={height}
        priority={priority}
        quality={85}
        sizes="(min-width: 1280px) 720px, (min-width: 1024px) 56vw, 94vw"
        src={src}
        width={width}
      />
    </div>
  );
}

function EditorMockup({ type }: { type: "photo" | "video" | "prompt" }) {
  const isPrompt = type === "prompt";

  if (type === "photo") {
    return (
      <ScreenshotFrame
        alt="DawnDesk photo editor with marquee selection tools"
        height={667}
        src="/screenshots/dawndesk-photo-editor.png"
        width={1186}
      />
    );
  }

  if (type === "video") {
    return (
      <ScreenshotFrame
        alt="DawnDesk video editor timeline workspace"
        height={667}
        src="/screenshots/dawndesk-video-editor.png"
        width={1186}
      />
    );
  }

  return (
    <div className="rounded-xl border border-black/15 bg-[#101012] p-4 shadow-2xl">
      <div className="mb-4 flex items-center justify-between text-xs text-white/70">
        <span>Prompt Manager</span>
        <span>＋ ○ ×</span>
      </div>
      {isPrompt ? (
        <div className="grid min-h-[380px] grid-cols-[130px_1fr] gap-4">
          <div className="space-y-3 rounded-md bg-black/35 p-3">
            {["All Prompts", "Favorites", "Work", "Marketing", "Writing", "Development"].map((item) => <div className="rounded bg-white/[0.05] px-3 py-3 text-xs text-white/62" key={item}>{item}</div>)}
          </div>
          <div className="space-y-3">
            {["Blog Post Idea Generator", "Social Media Post Creator", "Product Description Writer", "Email Template Generator", "Content Outline Builder", "Code Explanation Helper"].map((item, index) => <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.05] p-4 text-sm text-white" key={item}><span>{item}</span><span className="rounded bg-white/10 px-3 py-1 text-xs text-white/50">{["Marketing", "Writing", "Development"][index % 3]}</span></div>)}
          </div>
        </div>
      ) : (
        <>
          <div className="relative h-[300px] overflow-hidden rounded-md bg-gradient-to-br from-sky-200 via-emerald-100 to-stone-300">
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-emerald-900/55" />
            <div className="absolute left-1/2 top-14 h-24 w-56 -translate-x-1/2 rounded-full bg-white/40 blur-2xl" />
            <div className="absolute bottom-16 left-[18%] h-28 w-48 skew-x-[-18deg] bg-slate-700/45" />
            <div className="absolute bottom-20 right-[12%] h-36 w-56 skew-x-[18deg] bg-slate-800/50" />
          </div>
          <div className="mt-4 grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, index) => <div className="h-14 rounded bg-gradient-to-br from-sky-300 to-stone-500" key={index} />)}
          </div>
        </>
      )}
    </div>
  );
}

function BrandPanel({ copy }: { copy: string }) {
  return (
    <div className="mx-auto flex min-h-[360px] w-full max-w-md flex-col items-center justify-center rounded-xl border border-black/10 bg-[#121215] p-10 text-center text-white shadow-2xl">
      <div className="mb-8 h-24 w-32 rounded-full bg-[#ffc400] blur-2xl" />
      <Image className="-mt-24 mb-4  h-44 w-64 object-cover" src="/realistic_logo.png" alt="DawnDesk logo" width={174} height={174} />
      <h3 className="text-3xl font-black text-[#ffc400]">DawnDesk</h3>
      <p className="mt-4 max-w-xs leading-7 text-white/75">{copy}</p>
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="relative">
      <DashboardMockup />
      <div className="mx-auto h-8 w-[86%] rounded-b-2xl bg-gradient-to-b from-zinc-700 to-zinc-950" />
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  const common = {
    "aria-hidden": true,
    className: "h-4 w-4",
    fill: "currentColor",
    viewBox: "0 0 24 24",
  };

  if (name === "f") {
    return (
      <svg {...common}>
        <path d="M14.5 8.2V6.9c0-.7.5-.9.9-.9h2.1V2.4L14.6 2c-3.3 0-5 2-5 5.5v.7H6.5V12h3.1v10h4.1V12h3.1l.5-3.8h-3.8Z" />
      </svg>
    );
  }

  if (name === "x") {
    return (
      <svg {...common}>
        <path d="M17.7 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.4L1.7 3h6.5l4.4 5.8L17.7 3Zm-1.1 16.2h1.7L7.3 4.7H5.4l11.2 14.5Z" />
      </svg>
    );
  }

  if (name === "ig") {
    return (
      <svg {...common}>
        <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm8.8 2.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4ZM12 7.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8Zm0 2a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8Z" />
      </svg>
    );
  }

  if (name === "in") {
    return (
      <svg {...common}>
        <path d="M6.7 8.8H3V21h3.7V8.8ZM4.9 3A2.1 2.1 0 1 0 4.8 7.2 2.1 2.1 0 0 0 4.9 3ZM21 14.3c0-3.7-2-5.8-5-5.8-2.3 0-3.3 1.3-3.9 2.2V8.8H8.6V21h3.7v-6c0-.3 0-.6.1-.9.3-.6.9-1.3 2-1.3 1.4 0 2 1 2 2.6V21H20v-6.7h1Z" />
      </svg>
    );
  }

  if (name === "yt") {
    return (
      <svg {...common}>
        <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.4V8.6l5.9 3.4-5.9 3.4Z" />
      </svg>
    );
  }

  return <span>{name}</span>;
}

function Glow() {
  return <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_45%,rgba(255,196,0,0.22),transparent_34%),radial-gradient(circle_at_10%_20%,rgba(255,196,0,0.08),transparent_28%)]" />;
}
