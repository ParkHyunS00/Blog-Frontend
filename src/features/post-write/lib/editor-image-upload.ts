import { getPostImageDisplayUrl } from "../../post/lib/post-image-url.ts";
import type { PostImageUploadResult } from "../types/post-write-api.types.ts";

export type EditorImageUpload = {
  src: string;
  width: number;
  height: number;
};

export function toEditorImageUpload(
  uploaded: PostImageUploadResult,
  apiBaseUrl: string,
): EditorImageUpload {
  return {
    src: getPostImageDisplayUrl(uploaded.imageId, apiBaseUrl),
    width: uploaded.width,
    height: uploaded.height,
  };
}
