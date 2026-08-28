import { z } from "zod";
import type { PostDetail } from "@/features/post/types/post.types";

const postDetailTagSchema = z.object({
  tagId: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
});

export const postDetailResponseSchema = z.object({
  postId: z.number().int().positive(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  thumbnailImageId: z.number().int().positive().nullable(),
  categoryName: z.string(),
  categorySlug: z.string(),
  tags: z.array(postDetailTagSchema),
  contentImageIds: z.array(z.number().int().positive()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PostDetailResponse = z.infer<typeof postDetailResponseSchema>;

export function mapPostDetail(post: PostDetailResponse): PostDetail {
  return {
    id: post.postId,
    title: post.title,
    summary: post.summary,
    category: post.categoryName,
    createdAt: post.createdAt.slice(0, 10).replaceAll("-", "."),
    content: post.content,
    tags: post.tags.map((tag) => tag.name),
  };
}
