// src/features/admin-auth/hooks/mutations/use-otp-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postOtp } from "@/features/admin-auth/api/post-otp";
import { csrfQueryOptions } from "@/features/admin-auth/hooks/queries/use-csrf";
import { authStatusQueryOptions } from "@/features/admin-auth/hooks/queries/use-auth-status";

export function useOtpMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    meta: { handlesAuthErrorLocally: true },
    mutationFn: postOtp,
    onSuccess: async () => {
      await Promise.all([
        queryClient.fetchQuery(csrfQueryOptions),
        queryClient.invalidateQueries(authStatusQueryOptions),
      ]);
    },
  });
}
