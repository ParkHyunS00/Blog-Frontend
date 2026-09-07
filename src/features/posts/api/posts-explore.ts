import { z } from "zod";
import { apiRequest } from "../../../core/lib/api-client.ts";

export const categoryLatestSchema = z.array(
  z.object({
    categoryId: z.number().int().positive(),
    categoryName: z.string(),
    categorySlug: z.string(),
    postCount: z.number().int().nonnegative(),
    latestPost: z.object({
      postId: z.number().int().positive(),
      title: z.string(),
      summary: z.string(),
      createdAt: z.string(),
    }),
  }),
);

export const popularPostsSchema = z.array(
  z.object({
    postId: z.number().int().positive(),
    title: z.string(),
    categoryName: z.string(),
    categorySlug: z.string(),
    createdAt: z.string(),
    viewCount: z.number().int().nonnegative(),
  }),
);

export async function fetchCategoryLatestPosts() {
  const data = await apiRequest("/api/categories/latest-posts", { method: "GET" }, categoryLatestSchema);
  return data.map((item) => ({
    category: item.categoryName,
    categorySlug: item.categorySlug,
    title: item.latestPost.title,
    summary: item.latestPost.summary,
    postCount: item.postCount,
    updatedAt: item.latestPost.createdAt.slice(0, 10).replaceAll("-", "."),
  }));
}

export async function fetchPopularPosts() {
  const data = await apiRequest("/api/posts/popular", { method: "GET" }, popularPostsSchema);
  return data.map((item) => ({
    id: item.postId,
    title: item.title,
    category: item.categoryName,
    publishedAt: item.createdAt.slice(0, 10).replaceAll("-", "."),
    viewCount: item.viewCount,
  }));
}
