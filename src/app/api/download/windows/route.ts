import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

const windowsDownloadUrl =
  process.env.NEXT_PUBLIC_DOWNLOAD_WINDOWS ??
  "https://github.com/AdeelTahir-SE/DawnDesk/releases/download/v0.2.0/dawndesk_0.1.0_x64_en-US.msi";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient();

  if (supabase) {
    await supabase.from("download_events").insert({
      platform: "windows",
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
      ip_hash: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    });
  }

  return NextResponse.redirect(windowsDownloadUrl, 302);
}
