import { create } from "zustand";

export type ApiErrorKind = "FORBIDDEN" | "NOT_FOUND";

interface ApiErrorState {
  errorKind: ApiErrorKind | null;
  shouldRedirectToLogin: boolean;
  setErrorKind: (kind: ApiErrorKind) => void;
  setShouldRedirectToLogin: () => void;
  reset: () => void;
}

export const useApiErrorStore = create<ApiErrorState>((set) => ({
  errorKind: null,
  shouldRedirectToLogin: false,
  setErrorKind: (kind) => set({ errorKind: kind }),
  setShouldRedirectToLogin: () => set({ shouldRedirectToLogin: true }),
  reset: () => set({ errorKind: null, shouldRedirectToLogin: false }),
}));
