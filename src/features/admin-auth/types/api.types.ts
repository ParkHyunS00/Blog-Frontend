// src/features/admin-auth/types/api.types.ts
import { z } from "zod";

export const authStepSchema = z.enum([
  "ADMIN_KEY_REQUIRED",
  "OTP_REQUIRED",
  "AUTHENTICATED",
]);
export type AuthStep = z.infer<typeof authStepSchema>;

export const authStatusSchema = z.object({
  authenticated: z.boolean(),
  step: authStepSchema,
});
export type AuthStatus = z.infer<typeof authStatusSchema>;

export const stepMessageSchema = z.object({
  message: authStepSchema,
});
export type StepMessage = z.infer<typeof stepMessageSchema>;

export interface AdminKeyRequest {
  adminKey: string;
}

export interface OtpRequest {
  otpCode: string;
}
