import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

type OtpFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function OtpForm({
  value,
  onChange,
  onSubmit,
  disabled,
}: OtpFormProps): React.ReactElement {
  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-center text-lg font-semibold">
        Authentication Code
      </label>
      <InputOTP
        maxLength={6}
        value={value}
        onChange={onChange}
        disabled={disabled}
      >
        <InputOTPGroup className="w-full">
          {Array.from({ length: 6 }, (_, i) => (
            <InputOTPSlot
              key={i}
              index={i}
              className="h-11 flex-1 text-base"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button
        type="submit"
        disabled={disabled || value.length !== 6}
        className="h-11 rounded-lg bg-[#4F6AE8] text-base font-semibold text-white hover:bg-[#3D56D4] dark:bg-[#5B7FFF] dark:hover:bg-[#4A6EEE]"
      >
        Verify
      </Button>
    </form>
  );
}
