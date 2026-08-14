import { apiRequest } from "@/core/lib/api-client";
import {
  postDetailResponseSchema,
  type PostDetailResponse,
} from "@/features/post/api/post-detail";

export function fetchPostDetail(postId: number): Promise<PostDetailResponse> {
  return apiRequest(`/api/posts/${postId}`, { method: "GET" }, postDetailResponseSchema);
}
