// src/features/admin-auth/api/fetch-auth-status.ts
import { apiRequest } from "@/core/lib/api-client";
import {
  authStatusSchema,
  type AuthStatus,
} from "@/features/admin-auth/types/api.types";

export async function fetchAuthStatus(): Promise<AuthStatus> {
  const data = await apiRequest("/api/admin/auth/status", { method: "GET" }, authStatusSchema);
  if (data === null) {
    throw new Error("인증 상태 응답이 비어 있습니다.");
  }
  return data;
}
