import { z } from "zod";

const iconName = z.string().min(1, "Icon is required");

export const featureSchema = z.object({
  title: z.string().trim().min(2, "Feature title is required"),
  copy: z.string().trim().min(8, "Feature copy is too short"),
  icon: iconName,
});

export const workspaceSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens"),
  name: z.string().trim().min(2, "Name is required"),
  eyebrow: z.string().trim().min(2, "Eyebrow is required"),
  headline: z.string().trim().min(8, "Headline is required"),
  accent: z.string().trim().min(3, "Accent is required"),
  summary: z.string().trim().min(20, "Summary must be at least 20 characters"),
  detail: z.string().trim().min(20, "Detail must be at least 20 characters"),
  icon: iconName,
  features: z.array(featureSchema).min(1, "Add at least one feature"),
  workflow: z.array(z.string().trim().min(3)).min(1, "Add at least one workflow step"),
});

export const blogPostSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Blog slug must be lowercase words separated by hyphens"),
  title: z.string().trim().min(5, "Blog title is required"),
  category: z.string().trim().min(2, "Blog category is required"),
  summary: z.string().trim().min(20, "Blog summary must be at least 20 characters"),
  content: z.string().trim().min(40, "Blog markdown content is required"),
  publishedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Published date must be YYYY-MM-DD"),
});

export const blogPostsSchema = z.array(blogPostSchema).min(1, "Add at least one blog post");

export const documentationPageSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Documentation slug must be lowercase words separated by hyphens"),
  title: z.string().trim().min(5, "Documentation title is required"),
  summary: z.string().trim().min(20, "Documentation summary must be at least 20 characters"),
  content: z.string().trim().min(40, "Documentation markdown content is required"),
});

export const documentationPagesSchema = z.array(documentationPageSchema);

export const appReleaseSchema = z.object({
  platform: z.enum(["windows", "macos", "linux"]),
  version: z.string().trim().min(1, "Version is required"),
  label: z.string().trim().min(2, "Label is required"),
  arch: z.string().trim().min(2, "Architecture is required"),
  url: z.string().trim().url("Release URL must be valid"),
  isRecommended: z.boolean(),
  isActive: z.boolean(),
  publishedAt: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Published date must be YYYY-MM-DD"),
  sortOrder: z.number().int(),
});

export const appReleasesSchema = z.array(appReleaseSchema).min(1, "Add at least one app release").superRefine((releases, context) => {
  const seen = new Map<string, number>();

  releases.forEach((release, index) => {
    const key = [release.platform, release.version, release.arch, release.label].map((value) => value.toLowerCase()).join("|");
    const firstIndex = seen.get(key);

    if (firstIndex === undefined) {
      seen.set(key, index);
      return;
    }

    context.addIssue({
      code: "custom",
      message: `Duplicate app release identity also appears at index ${firstIndex}`,
      path: [index],
    });
  });
});

export const featureHistoryItemSchema = z.object({
  version: z.string().trim().min(1, "Version is required"),
  date: z.string().trim().min(3, "Date is required"),
  title: z.string().trim().min(5, "Title is required"),
  summary: z.string().trim().min(20, "Summary must be at least 20 characters"),
  status: z.string().trim().min(2, "Status is required"),
  branches: z.array(z.object({
    label: z.string().trim().min(2, "Branch label is required"),
    detail: z.string().trim().min(10, "Branch detail is too short"),
  })).min(1, "Add at least one branch"),
});

export const featureHistorySchema = z.array(featureHistoryItemSchema).min(1, "Add at least one feature history item");

export const upcomingFeatureItemSchema = z.object({
  version: z.string().trim().min(1, "Version is required"),
  title: z.string().trim().min(2, "Title is required"),
  copy: z.string().trim().min(5, "Copy is required"),
  state: z.string().trim().min(2, "State is required"),
  color: z.string().trim().min(3, "Color is required"),
});

export const upcomingFeatureSchema = z.array(upcomingFeatureItemSchema).min(1, "Add at least one upcoming feature");

export function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`).join("; ");
}
