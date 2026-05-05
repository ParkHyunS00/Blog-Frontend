import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type AdminKeyFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

export function AdminKeyForm({
  value,
  onChange,
  onSubmit,
  disabled,
  isSubmitting,
  errorMessage,
}: AdminKeyFormProps): React.ReactElement {
  function handleSubmit(e: React.FormEvent): void {
    e.preventDefault();
    onSubmit();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    onChange(e.target.value);
  }

  const isLocked = disabled || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-center text-lg font-semibold">Admin Key</label>
      <Input
        type="password"
        value={value}
        onChange={handleChange}
        disabled={isLocked}
        autoFocus
        className="h-11 rounded-lg"
      />
      <Button
        type="submit"
        disabled={isLocked || !value.trim()}
        className="h-11 rounded-lg bg-[#4F6AE8] text-base font-semibold text-white hover:bg-[#3D56D4] dark:bg-[#5B7FFF] dark:hover:bg-[#4A6EEE]"
      >
        {isSubmitting ? "Continuing…" : "Continue"}
      </Button>
      {errorMessage ? (
        <p className="text-center text-sm text-destructive">{errorMessage}</p>
      ) : null}
    </form>
  );
}
