import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { ApiException } from "@/core/lib/api-client";
import { resolveApiErrorAction } from "@/core/lib/api-error-policy";
import { authStatusQueryOptions } from "@/features/admin-auth/hooks/queries/use-auth-status";
import { useApiErrorStore } from "@/core/stores/use-api-error-store";
import { ToastProvider } from "@/components/ui/toast-provider";

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
    handlesAuthErrorLocally = false,
  ): void {
    if (!(error instanceof ApiException)) return;
    const isAuthStatusFailure = !!failingQueryKey && isAuthStatusQueryKey(failingQueryKey);
    const action = resolveApiErrorAction(error.status, {
      isAuthStatusFailure,
      handlesAuthErrorLocally,
    });

    if (action.invalidateAuthStatus) {
      ref.client?.invalidateQueries(authStatusQueryOptions);
    }

    if (action.redirectToLogin) {
      useApiErrorStore.getState().setShouldRedirectToLogin();
    }

    if (action.errorKind) useApiErrorStore.getState().setErrorKind(action.errorKind);
  }

  const client = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => handleApiError(error, query.queryKey),
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) =>
        handleApiError(
          error,
          undefined,
          mutation.meta?.handlesAuthErrorLocally === true,
        ),
    }),
  });

  ref.client = client;
  return client;
}

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
