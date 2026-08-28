import { useMutation } from "@tanstack/react-query";
import { uploadPostImage } from "@/features/post-write/api/post-write-api";
import { optimizePostImage } from "@/features/post-write/lib/optimize-post-image";
import type { PostImageType } from "@/features/post-write/types/post-write-api.types";

export function useUploadPostImage() {
  return useMutation({
    mutationFn: async ({ file, type }: { file: File; type: PostImageType }) => {
      const optimizedFile = await optimizePostImage(file, type);
      return uploadPostImage(optimizedFile, type);
    },
  });
}
