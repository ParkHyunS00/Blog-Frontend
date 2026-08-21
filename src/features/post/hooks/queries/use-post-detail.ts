import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchPostDetail } from "@/features/post/api/fetch-post-detail";

export function postDetailQueryOptions(postId: number) {
  return queryOptions({
    queryKey: ["posts", "detail", postId] as const,
    queryFn: () => fetchPostDetail(postId),
    enabled: Number.isInteger(postId) && postId > 0,
    retry: 1,
  });
}

export function usePostDetail(postId: number) {
  return useQuery(postDetailQueryOptions(postId));
}
