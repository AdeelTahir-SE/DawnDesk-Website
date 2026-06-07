"use client";

import { useMemo, useState } from "react";
import { PackageOpen } from "lucide-react";
import { FaApple, FaLinux, FaWindows } from "react-icons/fa";
import type { AppReleaseContent } from "@/lib/content";

const platformLabels = {
  windows: { label: "Windows" },
  macos: { label: "macOS" },
  linux: { label: "Linux" },
} as const;

function OsIcon({
  className = "",
  platform,
  size = 20,
}: {
  className?: string;
  platform: AppReleaseContent["platform"];
  size?: number;
}) {
  const iconProps = {
    "aria-hidden": true,
    className,
    size,
  };

  if (platform === "windows") {
    return <FaWindows {...iconProps} />;
  }

  if (platform === "macos") {
    return <FaApple {...iconProps} />;
  }

  return <FaLinux {...iconProps} />;
}

function detectPlatform(): AppReleaseContent["platform"] {
  if (typeof navigator === "undefined") return "windows";

  const platform = navigator.platform.toLowerCase();
  const userAgent = navigator.userAgent.toLowerCase();

  if (platform.includes("mac") || userAgent.includes("mac os")) return "macos";
  if (platform.includes("linux") || userAgent.includes("linux")) return "linux";
  return "windows";
}

function getDownloadHref(release: AppReleaseContent) {
  const params = new URLSearchParams({
    version: release.version,
    arch: release.arch,
    label: release.label,
  });

  return `/api/download/${release.platform}?${params.toString()}`;
}

export function DownloadChooser({ releases }: { releases: AppReleaseContent[] }) {
  const availablePlatforms = useMemo(
    () => Array.from(new Set(releases.map((release) => release.platform))) as AppReleaseContent["platform"][],
    [releases],
  );
  const [platform, setPlatform] = useState<AppReleaseContent["platform"]>(() => {
    const detected = detectPlatform();
    return availablePlatforms.includes(detected) ? detected : availablePlatforms[0] ?? "windows";
  });

  const platformReleases = releases.filter((release) => release.platform === platform);
  const selected = platformReleases.find((release) => release.isRecommended) ?? platformReleases[0];
  const hasKnownPlatform = Object.hasOwn(platformLabels, platform);

  return (
    <div className="mt-10 overflow-hidden rounded-xl border border-black/15 bg-white shadow-sm">
      <div className="grid border-b border-black/10 md:grid-cols-3">
        {(Object.keys(platformLabels) as AppReleaseContent["platform"][]).map((key) => {
          const item = platformLabels[key];
          const enabled = availablePlatforms.includes(key);
          return (
            <button
              className={`btn-animated flex items-center justify-center gap-3 px-5 py-5 text-sm font-extrabold ${platform === key ? "border-b-2 border-[#ffc400] text-black" : "text-black/50"} ${enabled ? "" : "opacity-50"}`}
              disabled={!enabled}
              key={key}
              onClick={() => setPlatform(key)}
              type="button"
            >
              <OsIcon platform={key} size={20} />
              {item.label}
              {!enabled && <span className="rounded bg-black/5 px-2 py-1 text-[10px] font-bold">Soon</span>}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-8 p-8 md:flex-row md:items-start">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-500">
          {hasKnownPlatform ? <OsIcon platform={platform} size={48} /> : <PackageOpen size={48} />}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-black">{selected?.label ?? "DawnDesk download"}</h3>
          <p className="mt-2 text-sm text-black/60">
            {selected ? `Version ${selected.version} | ${selected.arch} | Published ${selected.publishedAt}` : "No release is active for this platform yet."}
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            {selected && (
              <a className="btn-animated rounded-md bg-[#ffc400] px-7 py-3 text-sm font-extrabold text-black" href={getDownloadHref(selected)}>
                Download {platformLabels[selected.platform].label}
              </a>
            )}

          </div>
          {platformReleases.length > 1 && (
            <div className="mt-8 grid gap-3">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-black/45">Other versions</p>
              {platformReleases.map((release) => (
                <a className="flex items-center justify-between rounded-md border border-black/10 px-4 py-3 text-sm font-bold hover:border-[#ffc400]" href={getDownloadHref(release)} key={`${release.platform}-${release.version}-${release.arch}-${release.label}`}>
                  <span>{release.label} - {release.version} {release.arch}</span>
                  {/* <span className="text-black/45">{release.isRecommended ? "Recommended" : "Download"}</span> */}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
