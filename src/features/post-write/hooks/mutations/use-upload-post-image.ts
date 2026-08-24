import { useMutation } from "@tanstack/react-query";
import { uploadPostImage } from "@/features/post-write/api/post-write-api";
import type { PostImageType } from "@/features/post-write/types/post-write-api.types";

export function useUploadPostImage() {
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type: PostImageType }) => uploadPostImage(file, type),
  });
}
