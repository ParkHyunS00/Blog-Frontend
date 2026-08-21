import { apiRequest } from "@/core/lib/api-client";
import {
  categoryListSchema,
  type CategoryListItem,
} from "@/features/category/api/category-list";

export async function fetchCategoryList(): Promise<CategoryListItem[]> {
  return apiRequest("/api/categories", { method: "GET" }, categoryListSchema);
}

