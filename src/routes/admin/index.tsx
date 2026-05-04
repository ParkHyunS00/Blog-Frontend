import { useState } from "react";
import { AdminKeyForm } from "@/components/admin/admin-key-form";
import { OtpForm } from "@/components/admin/otp-form";
import { useAdminAuth } from "@/features/admin-auth/hooks/use-admin-auth";

export function AdminPage(): React.ReactElement | null {
  const auth = useAdminAuth();
  const [adminKey, setAdminKey] = useState("");
  const [otpCode, setOtpCode] = useState("");

  if (auth.isStatusLoading || auth.step === "AUTHENTICATED") {
    return null;
  }

  const showOtp = auth.step === "OTP_REQUIRED";

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-32">
        <AdminKeyForm
          value={adminKey}
          onChange={setAdminKey}
          onSubmit={() => auth.submitAdminKey(adminKey)}
          disabled={showOtp}
          isSubmitting={auth.isSubmittingKey}
          errorMessage={auth.keyError?.message ?? null}
        />
        <OtpForm
          value={otpCode}
          onChange={setOtpCode}
          onSubmit={() => auth.submitOtp(otpCode)}
          disabled={!showOtp}
          isSubmitting={auth.isSubmittingOtp}
          errorMessage={auth.otpError?.message ?? null}
        />
      </div>
    </div>
  );
}
