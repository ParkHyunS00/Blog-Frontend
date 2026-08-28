import { z } from "zod";

export const postTagSchema = z.object({
  tagId: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
});

export const postCategorySchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
});

export const postImageUploadSchema = z.object({
  imageId: z.number().int().positive(),
  type: z.enum(["CONTENT", "THUMBNAIL"]),
  objectKey: z.string(),
  mimeType: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const postMutationResultSchema = z.object({
  postId: z.number().int().positive(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export const draftListItemSchema = z.object({
  postId: z.number().int().positive(),
  title: z.string(),
  category: postCategorySchema.nullable(),
  tags: z.array(postTagSchema),
  updatedAt: z.string(),
});

export const draftPageSchema = z.object({
  content: z.array(draftListItemSchema),
  page: z.number().int().nonnegative(),
  size: z.number().int().positive(),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export const draftDetailSchema = z.object({
  postId: z.number().int().positive(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  category: postCategorySchema.nullable(),
  tags: z.array(postTagSchema),
  thumbnailImageId: z.number().int().positive().nullable(),
  contentImageIds: z.array(z.number().int().positive()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const tagListSchema = z.array(postTagSchema);
