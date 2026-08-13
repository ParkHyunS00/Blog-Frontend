import { z } from "zod";
import type { Category } from "@/features/category/types/category.types";

export const categoryListItemSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string(),
  slug: z.string(),
  postCount: z.number().int().nonnegative(),
});

export const categoryListSchema = z.array(categoryListItemSchema);

export type CategoryListItem = z.infer<typeof categoryListItemSchema>;

export function buildCategories(items: CategoryListItem[]): Category[] {
  const totalCount = items.reduce((sum, item) => sum + item.postCount, 0);
  return [
    { name: "ALL", slug: null, count: totalCount },
    ...items.map((item) => ({
      name: item.name,
      slug: item.slug,
      count: item.postCount,
    })),
  ];
}

