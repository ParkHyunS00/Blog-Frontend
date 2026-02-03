import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const THEME_STORAGE_KEY = "theme";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getSavedTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return null;
}

function getInitialTheme(): Theme {
  return getSavedTheme() ?? getSystemTheme();
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      applyTheme(newTheme);
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));

// Initialize theme on load
if (typeof window !== "undefined") {
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
}
