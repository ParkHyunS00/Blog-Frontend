import { apiRequest } from "@/core/lib/api-client";
import {
  buildPostListSearchParams,
  postListResponseSchema,
  type PostListParams,
  type PostListResponse,
} from "@/features/post/api/post-list";

export async function fetchPostList(params: PostListParams): Promise<PostListResponse> {
  const searchParams = buildPostListSearchParams(params);
  return apiRequest(`/api/posts?${searchParams}`, { method: "GET" }, postListResponseSchema);
}

