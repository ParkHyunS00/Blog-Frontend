import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePublishedPost } from "@/features/post-write/api/post-write-api";

export function useDeletePublishedPostMutation(postId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deletePublishedPost(postId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["posts", "list"] }),
        queryClient.invalidateQueries({
          queryKey: ["posts", "detail", postId],
          exact: true,
          refetchType: "none",
        }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
      ]);
    },
  });
}
