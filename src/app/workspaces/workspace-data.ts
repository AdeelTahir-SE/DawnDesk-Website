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
import { getWorkspacesContent, type WorkspaceContent } from "@/lib/content";

const iconMap = {
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
} satisfies Record<string, ElementType>;

type IconName = keyof typeof iconMap;

export type WorkspaceFeature = {
  title: string;
  copy: string;
  icon: ElementType;
};

export type Workspace = {
  slug: string;
  name: string;
  eyebrow: string;
  headline: string;
  accent: string;
  summary: string;
  detail: string;
  icon: ElementType;
  features: WorkspaceFeature[];
  workflow: string[];
};

function getIcon(icon: string): ElementType {
  return iconMap[icon as IconName] ?? Sparkles;
}

export function mapWorkspaces(content: WorkspaceContent[]): Workspace[] {
  return content.map((app) => ({
    ...app,
    icon: getIcon(app.icon),
    features: app.features.map((feature) => ({
      ...feature,
      icon: getIcon(feature.icon),
    })),
  }));
}

export async function getWorkspaces() {
  return mapWorkspaces(await getWorkspacesContent());
}

export async function getWorkspace(slug: string) {
  const workspaces = await getWorkspaces();
  return workspaces.find((app) => app.slug === slug);
}
