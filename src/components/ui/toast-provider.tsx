import { useCallback, useState } from "react";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { Toast as ToastPrimitive } from "radix-ui";
import { getErrorToastMessage } from "@/core/toast/error-toast";
import {
  ToastContext,
  type ShowErrorToastOptions,
} from "@/core/toast/toast-context";
import { cn } from "@/lib/utils";

type ToastState = {
  id: number;
  title: string;
  description: string;
  variant: "error" | "success";
};

let nextToastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showErrorToast = useCallback((options: ShowErrorToastOptions): void => {
    nextToastId += 1;
    setToast({
      id: nextToastId,
      title: options.title,
      description: getErrorToastMessage(options.error, options.fallback),
      variant: "error",
    });
  }, []);

  const showSuccessToast = useCallback((options: { title: string; description: string }): void => {
    nextToastId += 1;
    setToast({ id: nextToastId, ...options, variant: "success" });
  }, []);

  return (
    <ToastPrimitive.Provider duration={5000} swipeDirection="right" label="알림">
      <ToastContext.Provider value={{ showErrorToast, showSuccessToast }}>{children}</ToastContext.Provider>

      {toast ? (
        <ToastPrimitive.Root
          key={toast.id}
          open
          onOpenChange={(open) => !open && setToast(null)}
          className={cn(
            "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 rounded-xl border bg-background/95 p-4 text-foreground shadow-xl backdrop-blur-sm outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-bottom-4 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
            toast.variant === "error" ? "border-destructive/25" : "border-emerald-500/25",
          )}
        >
          <span className={cn(
            "flex size-8 items-center justify-center rounded-full",
            toast.variant === "error" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
          )}>
            {toast.variant === "error" ? <CircleAlert aria-hidden="true" className="size-4" /> : <CircleCheck aria-hidden="true" className="size-4" />}
          </span>
          <div className="min-w-0 pt-0.5">
            <ToastPrimitive.Title className="text-sm font-semibold leading-5">
              {toast.title}
            </ToastPrimitive.Title>
            <ToastPrimitive.Description className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
              {toast.description}
            </ToastPrimitive.Description>
          </div>
          <ToastPrimitive.Close
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="알림 닫기"
          >
            <X className="size-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ) : null}

      <ToastPrimitive.Viewport className="fixed right-4 bottom-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col outline-none sm:right-6 sm:bottom-6 sm:w-full" />
    </ToastPrimitive.Provider>
  );
}
