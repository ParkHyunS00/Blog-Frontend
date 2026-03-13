import type { Post } from "@/features/post/types/post.types";
import type { Category } from "@/features/category/types/category.types";

export function getCategories(posts: Post[]): Category[] {
  const countMap = new Map<string, number>();

  for (const post of posts) {
    countMap.set(post.category, (countMap.get(post.category) ?? 0) + 1);
  }

  const categories: Category[] = Array.from(countMap.entries()).map(
    ([name, count]) => ({ name, count }),
  );

  categories.sort((a, b) => a.name.localeCompare(b.name));

  return [{ name: "ALL", count: posts.length }, ...categories];
}
