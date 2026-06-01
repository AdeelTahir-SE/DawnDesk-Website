import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const title = String(formData.get("title") ?? "").trim();
  const steps = String(formData.get("steps") ?? "").trim();
  const redirectUrl = new URL("/report-a-bug?sent=1", request.url);

  if (!title || !steps) {
    redirectUrl.searchParams.set("sent", "0");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const supabase = createAdminSupabaseClient();
  let attachmentUrl: string | null = null;

  if (supabase) {
    const attachment = formData.get("attachment");

    if (attachment instanceof File && attachment.size > 0) {
      const extension = attachment.name.split(".").pop() || "png";
      const storagePath = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from("bug-report-attachments")
        .upload(storagePath, attachment, {
          contentType: attachment.type || "application/octet-stream",
        });

      if (!error) {
        const { data } = supabase.storage
          .from("bug-report-attachments")
          .getPublicUrl(storagePath);
        attachmentUrl = data.publicUrl;
      }
    }

    await supabase.from("bug_reports").insert({
      name: String(formData.get("name") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      title,
      steps,
      expected: String(formData.get("expected") ?? "").trim() || null,
      actual: String(formData.get("actual") ?? "").trim() || null,
      attachment_url: attachmentUrl,
    });
  }

  return NextResponse.redirect(redirectUrl, 303);
}
