import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const redirectUrl = new URL("/request-a-feature?sent=1", request.url);

  if (!title || !description) {
    redirectUrl.searchParams.set("sent", "0");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase.from("feature_requests").insert({
      name: String(formData.get("name") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      title,
      description,
      priority: String(formData.get("priority") ?? "").trim() || null,
    });
  }

  return NextResponse.redirect(redirectUrl, 303);
}
