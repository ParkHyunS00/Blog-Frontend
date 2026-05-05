import { z } from "zod";
import { apiRequest } from "@/core/lib/api-client";

export async function postLogout(): Promise<null> {
  return apiRequest("/api/admin/auth/logout", { method: "POST" }, z.null());
}
