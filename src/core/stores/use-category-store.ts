import { create } from "zustand";

interface CategoryState {
  selectedCategory: string;
  setSelectedCategory: (name: string) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: "ALL",
  setSelectedCategory: (name) => set({ selectedCategory: name }),
}));
