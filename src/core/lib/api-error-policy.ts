import type { ApiErrorKind } from "@/core/stores/use-api-error-store";

export type ApiErrorAction = {
  invalidateAuthStatus: boolean;
  redirectToLogin: boolean;
  errorKind: ApiErrorKind | null;
};

const NO_ACTION: ApiErrorAction = {
  invalidateAuthStatus: false,
  redirectToLogin: false,
  errorKind: null,
};

type ApiErrorContext = {
  isAuthStatusFailure?: boolean;
  handlesAuthErrorLocally?: boolean;
};

export function resolveApiErrorAction(
  status: number,
  context: ApiErrorContext,
): ApiErrorAction {
  if (context.handlesAuthErrorLocally && (status === 401 || status === 403)) {
    return NO_ACTION;
  }

  if (status === 401) {
    if (context.isAuthStatusFailure) return NO_ACTION;
    return {
      invalidateAuthStatus: true,
      redirectToLogin: true,
      errorKind: null,
    };
  }

  if (status === 403) {
    return {
      invalidateAuthStatus: !context.isAuthStatusFailure,
      redirectToLogin: false,
      errorKind: "FORBIDDEN",
    };
  }

  if (status === 404) {
    return {
      invalidateAuthStatus: false,
      redirectToLogin: false,
      errorKind: "NOT_FOUND",
    };
  }

  return NO_ACTION;
}
