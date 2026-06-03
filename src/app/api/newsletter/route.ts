import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { z } from "zod";

export const dynamic = "force-dynamic";

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const redirectUrl = new URL("/?newsletter=subscribed", request.url);
  const validation = newsletterSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validation.success) {
    redirectUrl.searchParams.set("newsletter", "missing-email");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase
      .from("newsletter_subscribers")
      .upsert({ email: validation.data.email }, { onConflict: "email" });
  }

  return NextResponse.redirect(redirectUrl, 303);
}
