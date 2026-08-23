import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, publishDraft } from "@/features/post-write/api/post-write-api";
import { draftListQueryKey } from "@/features/post-write/hooks/queries/use-draft-list";
import type { PublishPostPayload } from "@/features/post-write/types/post-write-api.types";

export function usePublishPostMutation(draftId: number | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PublishPostPayload) => draftId === null ? createPost(payload) : publishDraft(draftId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: draftListQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["posts"] }),
      ]);
    },
  });
}
