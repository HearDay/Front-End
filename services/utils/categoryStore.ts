import { create } from "zustand";

interface CategoryState {
  selectedCategory: string | null;
  categoryArticles: any[];
  scrollX: number;  
  setSelectedCategory: (category: string) => void;
  setCategoryArticles: (articles: any[]) => void;
  setScrollX: (x: number) => void;  
  clearCategory: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: null,
  categoryArticles: [],
  scrollX: 0, 

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setCategoryArticles: (articles) => set({ categoryArticles: articles }),
  setScrollX: (x) => set({ scrollX: x }),

  clearCategory: () => set({ selectedCategory: null, categoryArticles: [], scrollX: 0 }),
}));
