import { create } from "zustand";

interface SavedCategoryScrollState {
  savedSelectedCategory: string;     // 선택된 카테고리
  savedScrollX: number;              // 카테고리칩 스크롤 X 위치

  setSavedSelectedCategory: (category: string) => void;
  setSavedScrollX: (x: number) => void;
  resetSavedCategory: () => void;
}

export const useSavedCategoryScrollStore = create<SavedCategoryScrollState>((set) => ({
  savedSelectedCategory: "전체",   // 기본값
  savedScrollX: 0,

  setSavedSelectedCategory: (category) =>
    set({ savedSelectedCategory: category }),

  setSavedScrollX: (x) =>
    set({ savedScrollX: x }),

  resetSavedCategory: () =>
    set({ savedSelectedCategory: "전체", savedScrollX: 0 }),
}));
