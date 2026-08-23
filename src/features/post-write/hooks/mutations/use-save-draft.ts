import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDraft, updateDraft } from "@/features/post-write/api/post-write-api";
import { draftListQueryKey } from "@/features/post-write/hooks/queries/use-draft-list";
import type { SaveDraftPayload } from "@/features/post-write/types/post-write-api.types";

export function useSaveDraftMutation(draftId: number | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SaveDraftPayload) => draftId === null ? createDraft(payload) : updateDraft(draftId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: draftListQueryKey }),
  });
}
