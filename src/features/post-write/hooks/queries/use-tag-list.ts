import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchTagList } from "@/features/post-write/api/post-write-api";

export const tagListQueryOptions = queryOptions({
  queryKey: ["tags", "list"] as const,
  queryFn: fetchTagList,
  staleTime: 5 * 60 * 1000,
  retry: 1,
});

export function useTagList() {
  return useQuery(tagListQueryOptions);
}
