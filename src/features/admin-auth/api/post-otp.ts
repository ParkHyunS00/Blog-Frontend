import { apiRequest } from "@/core/lib/api-client";
import {
  stepMessageSchema,
  type OtpRequest,
  type StepMessage,
} from "@/features/admin-auth/types/api.types";

export async function postOtp(body: OtpRequest): Promise<StepMessage> {
  const data = await apiRequest(
    "/api/admin/auth/otp",
    { method: "POST", body: JSON.stringify(body) },
    stepMessageSchema,
  );
  if (data === null) {
    throw new Error("OTP 응답이 비어 있습니다.");
  }
  return data;
}
