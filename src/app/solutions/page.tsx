import Link from "next/link";
import { ArrowRight, Check, FileText, FolderKanban, ImageIcon, LayoutDashboard, PenTool, ShieldCheck, Video } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { createPageMetadata } from "@/lib/seo";

const solutions = [
  {
    title: "A single command center for active work",
    copy: "DawnDesk gives projects, finance spaces, saved prompts, and recent operations a shared home so users can see what is connected before jumping into work.",
    icon: LayoutDashboard,
  },
  {
    title: "Project execution without scattered context",
    copy: "Project Manager, Notes, and workflow shortcuts keep tasks, plans, comments, and reference material close to the same workspace.",
    icon: FolderKanban,
  },
  {
    title: "Creative asset preparation inside the suite",
    copy: "Photo Editor and Video Editor help users prepare visuals, clips, exports, and supporting media without leaving DawnDesk.",
    icon: ImageIcon,
  },
  {
    title: "Reusable AI prompt operations",
    copy: "Prompt Manager helps teams store templates, organize useful outputs, and keep repeatable AI workflows easy to find.",
    icon: PenTool,
  },
  {
    title: "Documentation and support loops",
    copy: "Built-in documentation, feature requests, bug reports, and release links make DawnDesk easier to improve and support over time.",
    icon: ShieldCheck,
  },
];

const workflows = [
  ["Plan", "Create project structure, capture notes, and outline the work."],
  ["Create", "Edit images, prepare video clips, and save useful prompt templates."],
  ["Track", "Review connected workspaces, recent operations, and active progress."],
  ["Improve", "Use documentation, feature requests, and bug reports to refine the workflow."],
] as const;

const toolkit = [
  { label: "Projects", icon: FolderKanban },
  { label: "Notes", icon: FileText },
  { label: "Photo", icon: ImageIcon },
  { label: "Video", icon: Video },
  { label: "Prompts", icon: PenTool },
  { label: "Docs", icon: ShieldCheck },
];

export const metadata = createPageMetadata({
  title: "Solutions",
  description: "See the practical workflow solutions DawnDesk provides across projects, creative tools, prompts, documentation, and support.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7] text-[#171717]">
      <SiteHeader />

      <section className="relative overflow-hidden bg-black px-5 py-24 text-white lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_38%,rgba(255,196,0,0.24),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p className="eyebrow text-[#ffc400]">Solutions</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[1.05] md:text-7xl">
              DawnDesk connects the work around your work.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              The solution is not one isolated tool. DawnDesk brings command-center visibility, focused sub-apps, reusable prompts, documentation, and feedback channels into one practical workflow.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link className="btn-animated rounded-md bg-[#ffc400] px-7 py-4 text-sm font-extrabold text-black" href="/sub-apps">
                Explore sub apps
              </Link>
              <Link className="btn-animated rounded-md border border-white/25 px-7 py-4 text-sm font-bold text-white" href="/documentation">
                Read documentation
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/12 bg-white/[0.06] p-6 shadow-[0_0_70px_rgba(255,196,0,0.14)]">
            <div className="grid gap-4 sm:grid-cols-2">
              {toolkit.map(({ label, icon: Icon }) => (
                <div className="rounded-md border border-white/10 bg-black/30 p-5" key={label}>
                  <Icon className="text-[#ffc400]" size={28} />
                  <p className="mt-4 font-black">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="eyebrow text-[#c47800]">What DawnDesk solves</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight md:text-5xl">Focused tools with shared context.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {solutions.map(({ title, copy, icon: Icon }) => (
              <article className="rounded-md border border-black/10 bg-white p-7 shadow-sm" key={title}>
                <Icon className="text-[#d29300]" size={32} />
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-black/62">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.7fr_1.3fr] lg:px-8">
          <div>
            <p className="eyebrow text-[#c47800]">Workflow</p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">From idea to finished output.</h2>
            <p className="mt-5 leading-7 text-black/65">DawnDesk is designed around the way work actually moves: plan, create, track, and improve.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {workflows.map(([title, copy], index) => (
              <article className="rounded-md border border-black/10 bg-white p-6 shadow-sm" key={title}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ffc400] text-sm font-black text-black">{index + 1}</span>
                <h3 className="mt-5 text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-black/62">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black px-5 py-20 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow text-[#ffc400]">Ready for the workflow</p>
            <h2 className="mt-4 text-4xl font-black">Use the full DawnDesk toolkit together.</h2>
            <ul className="mt-7 grid gap-3 text-sm font-bold text-white/72 sm:grid-cols-3">
              {["Connected workspace", "Creative tools", "Documentation and feedback"].map((item) => (
                <li className="flex items-center gap-3" key={item}>
                  <Check className="rounded-full bg-[#ffc400] p-1 text-black" size={20} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Link className="btn-animated inline-flex items-center justify-center gap-3 rounded-md bg-[#ffc400] px-8 py-4 text-sm font-extrabold text-black" href="/api/download/windows">
            Download DawnDesk
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
