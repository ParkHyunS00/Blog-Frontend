import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: import.meta.env.DEV,
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  logout: () => set({ isAuthenticated: false }),
}));
