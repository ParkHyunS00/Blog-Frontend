import { apiRequest } from "@/core/lib/api-client";
import {
  stepMessageSchema,
  type AdminKeyRequest,
  type StepMessage,
} from "@/features/admin-auth/types/api.types";

export async function postAdminKey(body: AdminKeyRequest): Promise<StepMessage> {
  const data = await apiRequest(
    "/api/admin/auth/key",
    { method: "POST", body: JSON.stringify(body) },
    stepMessageSchema,
  );
  if (data === null) {
    throw new Error("Admin Key 응답이 비어 있습니다.");
  }
  return data;
}
