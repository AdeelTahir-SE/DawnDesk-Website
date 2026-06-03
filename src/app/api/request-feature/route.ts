import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { z } from "zod";

export const dynamic = "force-dynamic";

const featureRequestSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(5000),
  priority: z.enum(["Useful", "Important", "Critical"]).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const redirectUrl = new URL("/request-a-feature?sent=1", request.url);
  const validation = featureRequestSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    priority: formData.get("priority") ?? "",
  });

  if (!validation.success) {
    redirectUrl.searchParams.set("sent", "0");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const supabase = createAdminSupabaseClient();
  if (supabase) {
    await supabase.from("feature_requests").insert({
      name: validation.data.name || null,
      email: validation.data.email || null,
      title: validation.data.title,
      description: validation.data.description,
      priority: validation.data.priority || null,
    });
  }

  return NextResponse.redirect(redirectUrl, 303);
}
