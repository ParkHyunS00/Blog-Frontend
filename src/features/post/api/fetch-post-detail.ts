import { apiRequest } from "../../../core/lib/api-client.ts";
import {
  postDetailResponseSchema,
  type PostDetailResponse,
} from "./post-detail.ts";

export function fetchPostDetail(postId: number): Promise<PostDetailResponse> {
  return apiRequest(
    `/api/posts/${postId}`,
    { method: "GET" },
    postDetailResponseSchema,
  );
}
