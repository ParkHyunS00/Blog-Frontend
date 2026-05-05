import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { ApiException } from "@/core/lib/api-client";
import { authStatusQueryOptions } from "@/features/admin-auth/hooks/queries/use-auth-status";
import { useApiErrorStore } from "@/core/stores/use-api-error-store";

const ADMIN_AUTH_STATUS_KEY = authStatusQueryOptions.queryKey;

function isAuthStatusQueryKey(key: readonly unknown[]): boolean {
  return (
    key.length === ADMIN_AUTH_STATUS_KEY.length &&
    key.every((segment, index) => segment === ADMIN_AUTH_STATUS_KEY[index])
  );
}

function createQueryClient(): QueryClient {
  const ref: { client: QueryClient | null } = { client: null };

  function handleApiError(
    error: unknown,
    failingQueryKey?: readonly unknown[],
  ): void {
    if (!(error instanceof ApiException)) return;
    const { status } = error;
    const isAuthStatusFailure = !!failingQueryKey && isAuthStatusQueryKey(failingQueryKey);

    if (status === 401 || status === 403) {
      if (!isAuthStatusFailure) {
        ref.client?.invalidateQueries(authStatusQueryOptions);
      }
    }

    if (status === 401) {
      if (isAuthStatusFailure) return;
      useApiErrorStore.getState().setShouldRedirectToLogin();
      return;
    }

    if (status === 403) {
      useApiErrorStore.getState().setErrorKind("FORBIDDEN");
      return;
    }

    if (status === 404) {
      useApiErrorStore.getState().setErrorKind("NOT_FOUND");
    }
  }

  const client = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => handleApiError(error, query.queryKey),
    }),
    mutationCache: new MutationCache({
      onError: (error) => handleApiError(error),
    }),
  });

  ref.client = client;
  return client;
}

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
