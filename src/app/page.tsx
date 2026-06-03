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
import { getAppReleasesContent, getFeatureHistoryContent, getSiteContent, getUpcomingFeaturesContent, type AppReleaseContent } from "@/lib/content";
import { DownloadChooser } from "@/components/DownloadChooser";
import { SearchOverlayButton } from "@/components/SearchOverlayButton";
import { UpdateTree } from "@/components/UpdateTree";
import { UserMenu } from "@/components/UserMenu";
import { PromptManagerMockup } from "@/components/PromptManagerMockup";

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
let updateTimeline = siteContent.updateTimeline ?? siteFallback.updateTimeline;
let audiences = siteContent.audiences.map((item) => ({ ...item, icon: getIcon(item.icon) }));
let testimonials = siteContent.testimonials;
let workspaces = siteContent.workspacesPreview.items.map((item) => ({ ...item, icon: getIcon(item.icon) }));
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
  updateTimeline = siteContent.updateTimeline ?? siteFallback.updateTimeline;
  audiences = siteContent.audiences.map((item) => ({ ...item, icon: getIcon(item.icon) }));
  testimonials = siteContent.testimonials;
  workspaces = siteContent.workspacesPreview.items.map((item) => ({ ...item, icon: getIcon(item.icon) }));
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
  const [content, releases, featureHistory, upcomingFeatures] = await Promise.all([getSiteContent(), getAppReleasesContent(), getFeatureHistoryContent(), getUpcomingFeaturesContent()]);
  setSiteContent(content);
  updateTimeline = featureHistory;
  upcoming = upcomingFeatures;

  return (
    <div className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <Header dark />
      <Hero />
      <WorkspacesOverview />
      <DownloadSection releases={releases} />
      <FeatureSection />
      <SuiteShowcase />
      <ToolHero type="photo" />
      <ToolGrid kicker={siteContent.toolGrids.photo.kicker} title={siteContent.toolGrids.photo.title} features={photoFeatures} notice={siteContent.toolGrids.photo.notice} />
      <ToolHero type="video" />
      <ToolGrid kicker={siteContent.toolGrids.video.kicker} title={siteContent.toolGrids.video.title} features={videoFeatures} notice={siteContent.toolGrids.video.notice} />
      <ToolHero type="prompt" />
      <ToolGrid kicker={siteContent.toolGrids.prompt.kicker} title={siteContent.toolGrids.prompt.title} features={promptFeatures} notice={siteContent.toolGrids.prompt.notice} />
      <UpcomingSection />
      <UpdateTreeSection />
      <AudienceSection />
      {/* <Testimonials /> */}
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
              href={item === "Workspaces" ? "/workspaces" : item === "Documentation" ? "/documentation" : item === "Releases" ? "/releases" : `#${item.toLowerCase()}`}
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <SearchOverlayButton tone={dark ? "dark" : "light"} />
          <UserMenu />
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
            <Link className="btn-animated rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black shadow-[0_0_38px_rgba(255,196,0,0.25)]" href="#download">{hero.primaryCta}</Link>
            <Link className="btn-animated rounded-md border border-white/25 px-7 py-4 text-sm font-bold text-white hover:border-[#ffc400]" href="#features">{hero.secondaryCta}</Link>
          </div>
          <div className="mt-12 flex items-center gap-5 text-sm text-white/60">
            <span className="font-semibold italic">Available for</span>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2 3l6.8-1 0 9.2-6.8 0 0-8.2zm7.5-1.1L21 0l0 11.2-11.5 0 0-10.1zm-7.5 10.4 6.8 0 0 9-6.8-1 0-8zm7.5 0 11.5 0 0 11.3-11.5-1.7 0-9.6z"/>
            </svg>
            <Apple size={20} />
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12 0c-4.3 0-7.8 2.2-7.8 7.3 0 2.2 1 4.1 2.2 5.5-.3 1-.7 2.1-1.3 3-.9 1.4-2.8 2.3-2.8 4 0 .9.8 1.6 2 2.3 2 1.2 5.4 1.9 7.7 1.9 2.3 0 5.7-.7 7.7-1.9 1.2-.7 2-1.4 2-2.3 0-1.7-1.9-2.6-2.8-4-.6-.9-1-2-1.3-3 1.2-1.4 2.2-3.3 2.2-5.5C19.8 2.2 16.3 0 12 0zm0 1c3.8 0 6.8 2 6.8 6.3 0 3-1.6 5.3-3 7.1-1.2-1.3-2.2-2.4-3.8-2.4-1.6 0-2.6 1.1-3.8 2.4-1.4-1.8-3-4.1-3-7.1C5.2 3 8.2 1 12 1zm0 3c-1.3 0-2.3.9-2.3 2.5s1 2.5 2.3 2.5 2.3-.9 2.3-2.5-1-2.5-2.3-2.5zm0 1c.7 0 1.3.6 1.3 1.5s-.6 1.5-1.3 1.5-1.3-.6-1.3-1.5.6-1.5 1.3-1.5zM6.5 18c1.3.9 3.2 1.5 5.5 1.5s4.2-.6 5.5-1.5c.6.4 1 .8 1 1.2 0 1.4-4 2.8-6.5 2.8s-6.5-1.4-6.5-2.8c0-.4.4-.8 1-1.2z"/>
            </svg>
          </div>
        </div>
        <div className="relative z-10 lg:translate-x-8">
          <DashboardMockup large />
        </div>
      </div>
    </section>
  );
}

function WorkspacesOverview() {
  return (
    <section id="workspaces-preview" className="section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow text-[#c47800]">Powerful workspaces</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">Choose the right tool for the moment.</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-black/65">
              DawnDesk is a suite of focused workspaces. Open a tool when you need it, then bring the output back into your daily workflow.
            </p>
            <Link
              className="btn-animated btn-animated-dark mt-8 inline-flex items-center gap-3 rounded-md bg-black px-6 py-4 text-sm font-extrabold text-white transition hover:bg-[#ffc400] hover:text-black"
              href="/workspaces"
            >
              View all workspaces
              <ChevronRight size={18} />
            </Link>
            <div className="mt-8 rounded-md border border-black/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black">Included tools</h3>
              <ul className="mt-5 space-y-3 text-sm font-bold text-black/65">
                {siteContent.workspacesPreview.included.map((item) => (
                  <li className="flex items-center gap-3" key={item}>
                    <Check className="rounded-full bg-[#ffc400] p-1 text-black" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {workspaces.map(({ title, icon: Icon, href, copy }) => (
              <Link className="group rounded-md border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#ffc400] hover:shadow-xl" href="/workspaces" key={title}>
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

function DownloadSection({ releases }: { releases: AppReleaseContent[] }) {
  return (
    <section id="download" className="section">
      <div className="mx-auto max-w-5xl px-5">
        <p className="eyebrow text-[#c47800]">Download DawnDesk</p>
        <h2 className="mt-4 max-w-xl text-4xl font-black leading-tight md:text-5xl">Get DawnDesk<br />for your device</h2>
        <p className="mt-4 max-w-md text-base leading-7 text-black/65">DawnDesk detects your system automatically, and you can still choose another platform or version manually.</p>
        <DownloadChooser releases={releases} />
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
          <div className="mb-6 flex items-center gap-2 text-sm font-black"><Icon className="rounded bg-black p-1 text-white" size={21} /> {content.label}</div>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            {content.title} {content.accent && <span className="block text-[#ffb400]">{content.accent}</span>}
          </h2>
          <p className="mt-6 max-w-lg leading-7 text-black/65">{content.copy}</p>
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {features.map(([title, copy, Icon]) => <MiniFeature key={title} title={title} copy={copy} icon={Icon} />)}
          </div>
          <div className="mt-8 flex items-center gap-6">
            <Link className="btn-animated inline-flex items-center justify-center rounded-md bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black" href={`/workspaces/${type === "photo" ? "photo-editor" : type === "video" ? "video-editor" : "prompt-manager"}`}>
              {content.button}
            </Link>
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
        <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight md:text-5xl ">{title}</h2>
        <h3 className="mt-10 text-2xl font-black text-[#ffb400]">Current Features</h3>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, copy, Icon]) => <MiniFeature key={title} title={title} copy={copy} icon={Icon} />)}
        </div>
        <div className="mt-8">
          <Link href="/upcoming" className="btn-animated inline-flex items-center justify-center rounded-md bg-black/5 px-6 py-3 text-sm font-bold text-black/70 transition hover:bg-black/10 hover:text-black">Coming Soon</Link>
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
          <div className="mt-8">
            <Link href="/upcoming" className="btn-animated rounded-md bg-[#ffc400] px-6 py-3 text-sm font-extrabold text-black">
              See full list
            </Link>
          </div>
        </div>
        <BrandPanel copy="Brighten your workflow. Stay tuned for more updates!" />
      </div>
    </section>
  );
}

function UpdateTreeSection() {
  return (
    <section id="updates" className="section">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <div>
          <p className="eyebrow text-[#c47800]">Growing update tree</p>
          <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">A linear history with feature branches.</h2>
          <p className="mt-5 max-w-md leading-7 text-black/65">
            Follow DawnDesk as each release grows from the main trunk, then branches into the exact features added for that update.
          </p>
        </div>
        <UpdateTree updates={updateTimeline} preview />
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
            <Link className="btn-animated rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black" href="/api/download/windows"><Download className="mr-2 inline" size={17} />Download for Windows</Link>
            <button className="btn-animated rounded-md border border-white/25 px-7 py-4 text-sm font-bold">View Other Platforms</button>
          </div>
        </div>
        <LaptopMockup />
      </div>
    </section>
  );
}

function Footer() {
  const footer = siteContent.footer;
  const allowedSocials = new Set(["x", "yt"]);
  const hiddenFooterItems = new Set(["Careers", "Changelog", "Roadmap"]);
  const footerGroups = footer.groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !hiddenFooterItems.has(item)),
    }))
    .filter((group) => group.items.length > 0);
  const footerSocials = footer.socials.filter((item) => allowedSocials.has(item));
  const footerHref = (item: string) => {
    const map: Record<string, string> = {
      'Workspaces': '/workspaces',
      'Documentation': '/documentation',
      'Blog': '/blog',
      'Report a Bug': '/report-a-bug',
      'Request a Feature': '/request-a-feature',
      'Download': '/#download',
      'Features': '/#features',
      'Contact Us': '/contact-us',
      'Privacy Policy': '/privacy-policy',
      'Terms of Service': '/terms-of-service',
      'FAQ': '/faq'
    };
    return map[item] || '#';
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
            {footerSocials.map((item) => (
              <a
                aria-label={`DawnDesk ${item}`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition hover:bg-[#ffc400] hover:text-black"
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
          {footerGroups.map(({ title, items }) => (
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
              <button className="btn-animated bg-[#ffc400] px-5 text-sm font-extrabold text-black">{footer.newsletter.button}</button>
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

  return <PromptManagerMockup />;
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
