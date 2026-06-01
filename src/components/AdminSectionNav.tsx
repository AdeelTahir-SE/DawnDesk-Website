"use client";

import { useEffect, useState } from "react";
import {
  Bug,
  Database,
  Download,
  FileText,
  Home,
  ImageUp,
  LayoutDashboard,
  Link,
  Newspaper,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const icons = {
  bug: Bug,
  database: Database,
  download: Download,
  fileText: FileText,
  home: Home,
  imageUp: ImageUp,
  layoutDashboard: LayoutDashboard,
  link: Link,
  newspaper: Newspaper,
  sparkles: Sparkles,
} satisfies Record<string, LucideIcon>;

export type AdminNavIcon = keyof typeof icons;

export type AdminNavItem = {
  count: number;
  href: string;
  icon: AdminNavIcon;
  label: string;
};

export function AdminSectionNav({ items }: { items: AdminNavItem[] }) {
  const [activeHref, setActiveHref] = useState(items[0]?.href ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.querySelector(item.href))
      .filter((section): section is Element => Boolean(section));

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.12, 0.28, 0.5],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="mt-5 space-y-1">
      {items.map((item) => {
        const Icon = icons[item.icon];
        const isActive = activeHref === item.href;

        return (
          <a
            aria-current={isActive ? "page" : undefined}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
              isActive
                ? "bg-[#fff3bf] font-black text-black"
                : "font-bold text-black/72 hover:bg-[#fbfaf7] hover:text-black"
            }`}
            href={item.href}
            key={item.href}
            onClick={() => setActiveHref(item.href)}
          >
            <Icon className={isActive ? "text-black" : "text-black/55"} size={17} />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs font-black ${isActive ? "bg-white/70 text-black/62" : "bg-black/5 text-black/54"}`}>
              {item.count}
            </span>
          </a>
        );
      })}
    </div>
  );
}
