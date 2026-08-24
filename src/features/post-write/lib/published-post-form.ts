import type { PostDetailResponse } from "../../post/api/post-detail.ts";
import { getPostImageDisplayUrl } from "../../post/lib/post-image-url.ts";
import type { PostWriteForm } from "../../post/types/post-write.types.ts";

export function createFormFromPublishedPost(
  post: PostDetailResponse,
  apiBaseUrl: string,
): PostWriteForm {
  return {
    title: post.title,
    summary: post.summary,
    thumbnailFile: null,
    thumbnailUrl: post.thumbnailImageId
      ? getPostImageDisplayUrl(post.thumbnailImageId, apiBaseUrl)
      : "",
    thumbnailImageId: post.thumbnailImageId,
    category: post.categoryName,
    tags: post.tags.map((tag) => tag.name),
    content: post.content,
    contentImageIds: post.contentImageIds,
  };
}
