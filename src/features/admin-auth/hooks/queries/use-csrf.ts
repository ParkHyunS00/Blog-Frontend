// src/features/admin-auth/hooks/queries/use-csrf.ts
import { queryOptions, useQuery } from "@tanstack/react-query";
import { fetchCsrf } from "@/features/admin-auth/api/fetch-csrf";

export const csrfQueryOptions = queryOptions({
  queryKey: ["admin-auth", "csrf"] as const,
  queryFn: fetchCsrf,
  staleTime: 0,
  gcTime: 0,
  retry: false,
});

export function useCsrf() {
  return useQuery(csrfQueryOptions);
}
