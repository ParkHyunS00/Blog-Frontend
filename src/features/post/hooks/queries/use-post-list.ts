import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchPostList } from "@/features/post/api/fetch-post-list";
import type { PostListParams } from "@/features/post/api/post-list";

export function postListQueryOptions(params: PostListParams) {
  return queryOptions({
    queryKey: [
      "posts",
      "list",
      params.page,
      params.size,
      params.category ?? null,
      params.keyword ?? null,
      ...(params.tags ?? []),
    ] as const,
    queryFn: () => fetchPostList(params),
    retry: 1,
  });
}

export function usePostList(params: PostListParams) {
  return useQuery(postListQueryOptions(params));
}

