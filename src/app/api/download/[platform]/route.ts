import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

const platformFallbacks = {
  windows: process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS ?? "https://github.com/AdeelTahir-SE/DawnDesk/releases/download/v0.2.0/dawndesk_0.1.0_x64_en-US.msi",
  macos: process.env.NEXT_PUBLIC_DOWNLOAD_MAC ?? process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS ?? "https://github.com/AdeelTahir-SE/DawnDesk/releases/download/v0.2.0/dawndesk_0.1.0_x64_en-US.msi",
  linux: process.env.NEXT_PUBLIC_DOWNLOAD_LINUX ?? process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS ?? "https://github.com/AdeelTahir-SE/DawnDesk/releases/download/v0.2.0/dawndesk_0.1.0_x64_en-US.msi",
} as const;

type Platform = keyof typeof platformFallbacks;

export const dynamic = "force-dynamic";

function isSafeDownloadUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest, props: { params: Promise<{ platform: string }> }) {
  const { platform: rawPlatform } = await props.params;
  const platform = rawPlatform as Platform;

  if (!Object.hasOwn(platformFallbacks, platform)) {
    return NextResponse.json({ error: "Unsupported platform." }, { status: 404 });
  }

  const version = request.nextUrl.searchParams.get("version");
  const arch = request.nextUrl.searchParams.get("arch");
  const label = request.nextUrl.searchParams.get("label");
  const supabase = createAdminSupabaseClient();
  let downloadUrl = platformFallbacks[platform];

  if (supabase) {
    let query = supabase
      .from("app_releases")
      .select("url")
      .eq("platform", platform)
      .eq("is_active", true)
      .order("is_recommended", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(1);

    if (version) query = query.eq("version", version);
    if (arch) query = query.eq("arch", arch);
    if (label) query = query.eq("label", label);

    const { data } = await query.maybeSingle();
    if (data?.url && isSafeDownloadUrl(data.url)) {
      downloadUrl = data.url;
    }

    await supabase.from("download_events").insert({
      platform,
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
      ip_hash: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });
  }

  return NextResponse.redirect(downloadUrl, 302);
}
