import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDraft } from "@/features/post-write/api/post-write-api";
import { draftDetailQueryKey } from "@/features/post-write/hooks/queries/use-draft-detail";
import { draftListQueryKey } from "@/features/post-write/hooks/queries/use-draft-list";

export function useDeleteDraftMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDraft,
    onSuccess: async (_data, postId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: draftListQueryKey }),
        queryClient.removeQueries({ queryKey: draftDetailQueryKey(postId) }),
      ]);
    },
  });
}
