import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchDraftList } from "@/features/post-write/api/post-write-api";

export const draftListQueryKey = ["admin", "posts", "drafts"] as const;

export function draftListQueryOptions(page: number) {
  return queryOptions({
    queryKey: [...draftListQueryKey, page] as const,
    queryFn: () => fetchDraftList(page),
    retry: 1,
  });
}

export function useDraftList(page: number, enabled: boolean) {
  return useQuery({ ...draftListQueryOptions(page), enabled });
}
