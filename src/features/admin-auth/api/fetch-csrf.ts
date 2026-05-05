// src/features/admin-auth/api/fetch-csrf.ts
import { z } from "zod";
import { apiRequest } from "@/core/lib/api-client";

export async function fetchCsrf(): Promise<null> {
  return apiRequest("/api/admin/csrf", { method: "GET" }, z.null());
}
