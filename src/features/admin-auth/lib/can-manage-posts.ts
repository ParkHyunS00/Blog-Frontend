import type { AuthStatus } from "@/features/admin-auth/types/api.types";

export function canManagePosts(authStatus: AuthStatus | undefined): boolean {
  return authStatus?.authenticated === true && authStatus.step === "AUTHENTICATED";
}
