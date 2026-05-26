import {
  Bell,
  CalendarDays,
  Code2,
  FileArchive,
  FileText,
  Film,
  FolderKanban,
  ImageIcon,
  LayoutGrid,
  PenTool,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Tags,
  TimerReset,
  Upload,
  Wand2,
} from "lucide-react";
import type { ElementType } from "react";

export type SubAppFeature = {
  title: string;
  copy: string;
  icon: ElementType;
};

export type SubApp = {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  accent: string;
  summary: string;
  detail: string;
  icon: ElementType;
  features: SubAppFeature[];
  workflow: string[];
};

export const subApps: SubApp[] = [
  {
    slug: "photo-editor",
    name: "Photo Editor",
    eyebrow: "Create polished visuals",
    headline: "Edit, enhance, and export images inside DawnDesk.",
    accent: "Built for fast creative work.",
    summary: "A focused photo workspace for quick edits, retouching, filters, and batch-ready image polish.",
    detail:
      "Photo Editor keeps everyday image editing close to your projects, notes, and tasks, so you can clean up visuals without switching tools.",
    icon: ImageIcon,
    features: [
      { title: "AI Enhance", copy: "Improve image quality with one quick action.", icon: Wand2 },
      { title: "Filters & Effects", copy: "Apply clean looks for product, content, and social visuals.", icon: Sparkles },
      { title: "Crop & Resize", copy: "Prepare images for docs, campaigns, thumbnails, and posts.", icon: LayoutGrid },
      { title: "Batch Export", copy: "Process groups of files with consistent output settings.", icon: FileArchive },
    ],
    workflow: ["Import or drag in an image", "Apply edits and compare changes", "Export the final asset back to your workflow"],
  },
  {
    slug: "video-editor",
    name: "Video Editor",
    eyebrow: "Produce sharper videos",
    headline: "Cut, arrange, caption, and export videos without leaving your desk.",
    accent: "Simple enough for quick edits.",
    summary: "A practical video editor with timeline tools, transitions, titles, audio controls, and export presets.",
    detail:
      "Video Editor is designed for creators and teams who need fast, reliable edits for product clips, explainers, and social content.",
    icon: Film,
    features: [
      { title: "Multi-track Timeline", copy: "Layer video, audio, titles, and effects with precision.", icon: Film },
      { title: "Transitions", copy: "Add smooth movement between scenes.", icon: Share2 },
      { title: "Audio Tools", copy: "Balance sound, trim clips, and add backing tracks.", icon: Bell },
      { title: "Export Options", copy: "Render videos in practical formats and resolutions.", icon: Upload },
    ],
    workflow: ["Drop clips into the timeline", "Trim, title, and tune audio", "Export a share-ready video"],
  },
  {
    slug: "prompt-manager",
    name: "Prompt Manager",
    eyebrow: "Organize better prompts",
    headline: "Save, tag, search, and reuse your best AI prompts.",
    accent: "Built for repeatable creative work.",
    summary: "A prompt library for writers, marketers, developers, and teams who reuse AI workflows.",
    detail:
      "Prompt Manager helps you collect prompt ideas, turn them into reusable templates, and keep important variations easy to find.",
    icon: PenTool,
    features: [
      { title: "Categories & Tags", copy: "Group prompts by project, role, or outcome.", icon: Tags },
      { title: "Quick Search", copy: "Find prompts by keyword, category, or tag.", icon: Search },
      { title: "Usage History", copy: "Track what worked and reuse it later.", icon: TimerReset },
      { title: "Prompt Templates", copy: "Create reusable structures for common requests.", icon: FileText },
    ],
    workflow: ["Capture a prompt", "Tag it with context", "Reuse and improve it over time"],
  },
  {
    slug: "project-tracker",
    name: "Project Tracker",
    eyebrow: "Keep projects moving",
    headline: "Plan work, watch progress, and keep every task visible.",
    accent: "Made for focused execution.",
    summary: "A lightweight project command center for milestones, task ownership, progress, and deadlines.",
    detail:
      "Project Tracker gives each project a clear home, connecting tasks, notes, files, and status updates in one view.",
    icon: FolderKanban,
    features: [
      { title: "Milestone Boards", copy: "Break projects into stages and visible outcomes.", icon: FolderKanban },
      { title: "Calendar Views", copy: "Connect deadlines and schedules to real work.", icon: CalendarDays },
      { title: "Status Controls", copy: "Track blocked, active, and completed work clearly.", icon: Settings2 },
      { title: "Team Handoff", copy: "Share next steps without losing context.", icon: Share2 },
    ],
    workflow: ["Create project milestones", "Attach tasks and notes", "Review progress from one dashboard"],
  },
  {
    slug: "notes-docs",
    name: "Notes & Docs",
    eyebrow: "Capture every detail",
    headline: "Write notes, store docs, and connect ideas to action.",
    accent: "A calm place for useful thinking.",
    summary: "A clean writing and document space for meeting notes, plans, research, and team knowledge.",
    detail:
      "Notes & Docs turns scattered information into a searchable workspace that sits beside the rest of your productivity tools.",
    icon: FileText,
    features: [
      { title: "Rich Notes", copy: "Capture formatted notes, lists, and plans.", icon: FileText },
      { title: "Smart Search", copy: "Find old ideas and documents quickly.", icon: Search },
      { title: "Linked Context", copy: "Connect notes to projects, tasks, and files.", icon: Share2 },
      { title: "Archive Space", copy: "Keep reference material tidy and accessible.", icon: FileArchive },
    ],
    workflow: ["Write or import notes", "Link them to active work", "Search and reuse what matters"],
  },
  {
    slug: "dev-tools",
    name: "Dev Tools",
    eyebrow: "Utilities for builders",
    headline: "Small developer tools for everyday coding tasks.",
    accent: "Fast helpers, right where you work.",
    summary: "Handy utilities for formatting, inspecting, snippets, and developer-focused project support.",
    detail:
      "Dev Tools gives technical users a compact set of helpers for common tasks, without turning DawnDesk into a heavy IDE.",
    icon: Code2,
    features: [
      { title: "Code Snippets", copy: "Store useful snippets beside project notes.", icon: Code2 },
      { title: "Format Helpers", copy: "Clean up common text and code formats.", icon: Settings2 },
      { title: "Quick Search", copy: "Find snippets, docs, and references quickly.", icon: Search },
      { title: "Shareable Outputs", copy: "Move useful results into tasks or docs.", icon: Share2 },
    ],
    workflow: ["Open a utility", "Run the quick transformation", "Save the result to your workspace"],
  },
];

export function getSubApp(slug: string) {
  return subApps.find((app) => app.slug === slug);
}
