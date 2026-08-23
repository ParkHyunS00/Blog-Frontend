import { useMutation } from "@tanstack/react-query";
import { deletePostImage } from "@/features/post-write/api/post-write-api";

export function useDeletePostImage() {
  return useMutation({ mutationFn: deletePostImage });
}
