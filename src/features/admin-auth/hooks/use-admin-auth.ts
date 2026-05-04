// src/features/admin-auth/hooks/use-admin-auth.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApiException } from "@/core/lib/api-client";
import type { ApiError } from "@/core/types/api.types";
import { useCsrf } from "@/features/admin-auth/hooks/queries/use-csrf";
import { useAuthStatus } from "@/features/admin-auth/hooks/queries/use-auth-status";
import { useAdminKeyMutation } from "@/features/admin-auth/hooks/mutations/use-admin-key-mutation";
import { useOtpMutation } from "@/features/admin-auth/hooks/mutations/use-otp-mutation";
import type { AuthStep } from "@/features/admin-auth/types/api.types";

function toApiError(error: unknown): ApiError | null {
  if (error instanceof ApiException) return error.apiError;
  if (error instanceof Error) {
    return {
      code: "UNKNOWN",
      message: error.message,
      description: null,
      detailErrors: null,
    };
  }
  return null;
}

export interface UseAdminAuthResult {
  step: AuthStep;
  isStatusLoading: boolean;
  submitAdminKey: (adminKey: string) => void;
  submitOtp: (code: string) => void;
  keyError: ApiError | null;
  otpError: ApiError | null;
  isSubmittingKey: boolean;
  isSubmittingOtp: boolean;
}

export function useAdminAuth(): UseAdminAuthResult {
  const navigate = useNavigate();
  useCsrf();
  const status = useAuthStatus();
  const keyMutation = useAdminKeyMutation();
  const otpMutation = useOtpMutation();

  const step: AuthStep = status.data?.step ?? "ADMIN_KEY_REQUIRED";

  useEffect(() => {
    if (status.data?.step === "AUTHENTICATED") {
      navigate("/", { replace: true });
    }
  }, [status.data?.step, navigate]);

  return {
    step,
    isStatusLoading: status.isLoading,
    submitAdminKey: (adminKey: string) => keyMutation.mutate({ adminKey }),
    submitOtp: (otpCode: string) => otpMutation.mutate({ otpCode }),
    keyError: toApiError(keyMutation.error),
    otpError: toApiError(otpMutation.error),
    isSubmittingKey: keyMutation.isPending,
    isSubmittingOtp: otpMutation.isPending,
  };
}
