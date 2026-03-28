import { useState } from "react";
import { AdminKeyForm } from "@/components/admin/admin-key-form";
import { OtpForm } from "@/components/admin/otp-form";

type AuthStep = "admin-key" | "otp";

export function AdminPage(): React.ReactElement {
  const [step, setStep] = useState<AuthStep>("admin-key");
  const [adminKey, setAdminKey] = useState("");
  const [otpValue, setOtpValue] = useState("");

  function handleAdminKeyContinue(): void {
    if (!adminKey.trim()) return;
    setStep("otp");
  }

  function handleOtpVerify(): void {
    if (otpValue.length !== 6) return;
    // TODO: API 연동 - admin key + OTP 검증
    console.log("verify", { adminKey, otpValue });
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col gap-32">
        <AdminKeyForm
          value={adminKey}
          onChange={setAdminKey}
          onSubmit={handleAdminKeyContinue}
          disabled={step === "otp"}
        />
        <OtpForm value={otpValue} onChange={setOtpValue} onSubmit={handleOtpVerify} disabled={step === "admin-key"} />
      </div>
    </div>
  );
}
