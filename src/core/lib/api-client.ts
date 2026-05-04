import { z, type ZodTypeAny } from "zod";
import { getCsrfToken } from "@/core/lib/csrf";
import { standardResponseSchema } from "@/core/lib/standard-response";
import type { ApiError } from "@/core/types/api.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export class ApiException extends Error {
  readonly status: number;
  readonly apiError: ApiError;
  constructor(status: number, apiError: ApiError) {
    super(apiError.message);
    this.name = "ApiException";
    this.status = status;
    this.apiError = apiError;
  }
}

export async function apiRequest<T extends ZodTypeAny>(
  path: string,
  init: RequestInit,
  dataSchema: T,
): Promise<z.infer<T>> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (MUTATING_METHODS.has(method)) {
    const csrf = getCsrfToken();
    if (csrf) headers.set("X-XSRF-TOKEN", csrf);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method,
    headers,
    credentials: "include",
  });

  const json = await response.json().catch(() => null);

  if (response.status === 401 || response.status === 403) {
    const fallbackError: ApiError = {
      code: response.status === 401 ? "UNAUTHENTICATED" : "FORBIDDEN",
      message:
        response.status === 401
          ? "인증이 필요합니다."
          : "접근 권한이 없습니다.",
      description: null,
      detailErrors: null,
    };
    const bodyError =
      json && typeof json === "object" && "error" in json && json.error
        ? (json.error as ApiError)
        : null;
    throw new ApiException(response.status, bodyError ?? fallbackError);
  }

  const parsed = standardResponseSchema(dataSchema).safeParse(json);

  if (!parsed.success) {
    console.error("API 응답 검증 실패", { path, json, issues: parsed.error.issues });
    throw new Error("API 응답 형식이 올바르지 않습니다.");
  }

  const result = parsed.data as { status: number; data: z.infer<T>; error: ApiError | null };

  if (result.error !== null) {
    throw new ApiException(result.status, result.error);
  }

  return result.data;
}
