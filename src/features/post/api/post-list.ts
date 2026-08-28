import { z } from "zod";
import type { Post } from "@/features/post/types/post.types";

const postListTagSchema = z.object({
  tagId: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
});

export const postListItemSchema = z.object({
  postId: z.number().int().positive(),
  title: z.string(),
  summary: z.string(),
  thumbnailImageId: z.number().int().positive().nullable(),
  categoryName: z.string(),
  categorySlug: z.string(),
  tags: z.array(postListTagSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const postListResponseSchema = z.object({
  content: z.array(postListItemSchema),
  page: z.number().int().nonnegative(),
  size: z.number().int().min(1).max(5),
  totalElements: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
});

export type PostListItem = z.infer<typeof postListItemSchema>;
export type PostListResponse = z.infer<typeof postListResponseSchema>;

export type PostListParams = {
  category?: string;
  tags?: string[];
  keyword?: string;
  page: number;
  size: number;
};

export function buildPostListSearchParams(params: PostListParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  if (params.category) searchParams.set("category", params.category);
  for (const tag of params.tags ?? []) searchParams.append("tags", tag);
  if (params.keyword) searchParams.set("keyword", params.keyword);
  searchParams.set("page", String(params.page));
  searchParams.set("size", String(params.size));

  return searchParams;
}

export function mapPostListItem(item: PostListItem, apiBaseUrl = ""): Post {
  const normalizedApiBaseUrl = apiBaseUrl.replace(/\/$/, "");
  return {
    id: item.postId,
    title: item.title,
    summary: item.summary,
    thumbnailUrl:
      item.thumbnailImageId === null
        ? null
        : `${normalizedApiBaseUrl}/api/post-images/${item.thumbnailImageId}`,
    tags: item.tags.map((tag) => tag.name),
    category: item.categoryName,
    createdAt: item.createdAt.slice(0, 10).replaceAll("-", "."),
  };
}
