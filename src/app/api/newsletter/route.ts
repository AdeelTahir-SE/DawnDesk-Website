import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const redirectUrl = new URL("/?newsletter=subscribed", request.url);

  if (!email) {
    redirectUrl.searchParams.set("newsletter", "missing-email");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase
      .from("newsletter_subscribers")
      .upsert({ email }, { onConflict: "email" });
  }

  return NextResponse.redirect(redirectUrl, 303);
}
