import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogout } from "@/features/admin-auth/api/post-logout";
import { csrfQueryOptions } from "@/features/admin-auth/hooks/queries/use-csrf";
import { authStatusQueryOptions } from "@/features/admin-auth/hooks/queries/use-auth-status";

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLogout,
    onSuccess: async () => {
      await Promise.all([
        queryClient.fetchQuery(csrfQueryOptions),
        queryClient.invalidateQueries(authStatusQueryOptions),
      ]);
    },
  });
}
