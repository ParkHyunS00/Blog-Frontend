import { createContext, useContext } from "react";

export type ShowErrorToastOptions = {
  title: string;
  error: unknown;
  fallback: string;
};

export type ToastContextValue = {
  showErrorToast: (options: ShowErrorToastOptions) => void;
  showSuccessToast: (options: { title: string; description: string }) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast는 ToastProvider 내부에서 사용해야 합니다.");
  return context;
}
