import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchDraftDetail } from "@/features/post-write/api/post-write-api";

export const draftDetailQueryKey = (postId: number) => ["admin", "posts", "draft", postId] as const;

export function draftDetailQueryOptions(postId: number) {
  return queryOptions({
    queryKey: draftDetailQueryKey(postId),
    queryFn: () => fetchDraftDetail(postId),
    retry: 1,
  });
}

export function useDraftDetail(postId: number | null) {
  return useQuery({
    ...draftDetailQueryOptions(postId ?? 0),
    enabled: postId !== null,
  });
}
