// src/features/admin-auth/hooks/mutations/use-admin-key-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAdminKey } from "@/features/admin-auth/api/post-admin-key";
import { csrfQueryOptions } from "@/features/admin-auth/hooks/queries/use-csrf";
import { authStatusQueryOptions } from "@/features/admin-auth/hooks/queries/use-auth-status";

export function useAdminKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { handlesAuthErrorLocally: true },
    mutationFn: postAdminKey,
    onSuccess: async () => {
      await Promise.all([
        queryClient.fetchQuery(csrfQueryOptions),
        queryClient.invalidateQueries(authStatusQueryOptions),
      ]);
    },
  });
}
