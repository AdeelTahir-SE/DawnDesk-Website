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
import subAppsContent from "@/content/sub-apps.json";

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

function getIcon(icon: string): ElementType {
  return iconMap[icon as IconName] ?? Sparkles;
}

export const subApps: SubApp[] = subAppsContent.map((app) => ({
  ...app,
  icon: getIcon(app.icon),
  features: app.features.map((feature) => ({
    ...feature,
    icon: getIcon(feature.icon),
  })),
}));

export function getSubApp(slug: string) {
  return subApps.find((app) => app.slug === slug);
}
