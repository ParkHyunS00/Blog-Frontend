// src/features/admin-auth/api/fetch-csrf.ts
import { refreshCsrfTokenFromServer } from "@/core/lib/api-client";
import type { CsrfToken } from "@/core/lib/csrf";

export async function fetchCsrf(): Promise<CsrfToken> {
  return refreshCsrfTokenFromServer();
}
