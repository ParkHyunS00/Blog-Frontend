import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { ApiException } from "@/core/lib/api-client";
import { authStatusQueryOptions } from "@/features/admin-auth/hooks/queries/use-auth-status";

const ADMIN_AUTH_STATUS_KEY = authStatusQueryOptions.queryKey;

function isAuthError(error: unknown): boolean {
  return (
    error instanceof ApiException &&
    (error.status === 401 || error.status === 403)
  );
}

function isAuthStatusQueryKey(key: readonly unknown[]): boolean {
  return (
    key.length === ADMIN_AUTH_STATUS_KEY.length &&
    key.every((segment, index) => segment === ADMIN_AUTH_STATUS_KEY[index])
  );
}

function createQueryClient(): QueryClient {
  const ref: { client: QueryClient | null } = { client: null };

  function handleAuthError(failingQueryKey?: readonly unknown[]): void {
    if (failingQueryKey && isAuthStatusQueryKey(failingQueryKey)) {
      return;
    }
    ref.client?.invalidateQueries(authStatusQueryOptions);
  }

  const client = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (isAuthError(error)) handleAuthError(query.queryKey);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (isAuthError(error)) handleAuthError();
      },
    }),
  });

  ref.client = client;
  return client;
}

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  const [queryClient] = useState(createQueryClient);
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
