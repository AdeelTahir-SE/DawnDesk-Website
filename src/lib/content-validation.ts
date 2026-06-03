import { z } from "zod";

const iconName = z.string().min(1, "Icon is required");

export const featureSchema = z.object({
  title: z.string().trim().min(2, "Feature title is required"),
  copy: z.string().trim().min(8, "Feature copy is too short"),
  icon: iconName,
});

export const subAppSchema = z.object({
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

export const appReleasesSchema = z.array(appReleaseSchema).min(1, "Add at least one app release");

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

export function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => `${issue.path.join(".") || "value"}: ${issue.message}`).join("; ");
}
