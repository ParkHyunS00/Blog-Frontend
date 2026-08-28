// src/features/admin-auth/hooks/queries/use-auth-status.ts
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchAuthStatus } from "@/features/admin-auth/api/fetch-auth-status";

export const authStatusQueryOptions = queryOptions({
  queryKey: ["admin-auth", "status"] as const,
  queryFn: fetchAuthStatus,
  staleTime: 0,
  retry: false,
});

export function useAuthStatus() {
  return useQuery(authStatusQueryOptions);
}
