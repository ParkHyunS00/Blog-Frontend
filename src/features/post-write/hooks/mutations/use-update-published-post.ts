import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePublishedPost } from "@/features/post-write/api/post-write-api";
import type { PublishPostPayload } from "@/features/post-write/types/post-write-api.types";

export function useUpdatePublishedPostMutation(postId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PublishPostPayload) => {
      if (postId === null) throw new Error("수정할 게시글 ID가 없습니다.");
      return updatePublishedPost(postId, payload);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
      ]);
    },
  });
}
