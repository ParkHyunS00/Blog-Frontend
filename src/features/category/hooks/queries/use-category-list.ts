import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCategoryList } from "@/features/category/api/fetch-category-list";

export const categoryListQueryOptions = queryOptions({
  queryKey: ["categories", "list"] as const,
  queryFn: fetchCategoryList,
  staleTime: 5 * 60 * 1000,
  retry: 1,
});

export function useCategoryList() {
  return useQuery(categoryListQueryOptions);
}

