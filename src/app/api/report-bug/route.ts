import { NextResponse, type NextRequest } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase";
import { z } from "zod";

export const dynamic = "force-dynamic";

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;
const allowedAttachmentTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const bugReportSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(255).optional().or(z.literal("")),
  title: z.string().trim().min(1).max(160),
  steps: z.string().trim().min(1).max(5000),
  expected: z.string().trim().max(3000).optional(),
  actual: z.string().trim().max(3000).optional(),
});

function getSafeAttachmentExtension(file: File) {
  if (file.type === "image/jpeg") return "jpg";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return null;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const redirectUrl = new URL("/report-a-bug?sent=1", request.url);
  const validation = bugReportSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    title: formData.get("title") ?? "",
    steps: formData.get("steps") ?? "",
    expected: formData.get("expected") ?? "",
    actual: formData.get("actual") ?? "",
  });

  if (!validation.success) {
    redirectUrl.searchParams.set("sent", "0");
    return NextResponse.redirect(redirectUrl, 303);
  }

  const supabase = createAdminSupabaseClient();
  let attachmentUrl: string | null = null;

  if (supabase) {
    const attachment = formData.get("attachment");

    if (attachment instanceof File && attachment.size > 0) {
      const extension = getSafeAttachmentExtension(attachment);
      if (!extension || attachment.size > MAX_ATTACHMENT_SIZE || !allowedAttachmentTypes.has(attachment.type)) {
        redirectUrl.searchParams.set("sent", "0");
        return NextResponse.redirect(redirectUrl, 303);
      }

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
      name: validation.data.name || null,
      email: validation.data.email || null,
      title: validation.data.title,
      steps: validation.data.steps,
      expected: validation.data.expected || null,
      actual: validation.data.actual || null,
      attachment_url: attachmentUrl,
    });
  }

  return NextResponse.redirect(redirectUrl, 303);
}
