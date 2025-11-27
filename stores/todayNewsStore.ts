import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TodayNewsStore {
  hasShownModal: boolean;
  shouldShowOnReturn: boolean;
  completedNewsId: string | null;

  setHasShownModal: (value: boolean) => void;
  setShouldShowOnReturn: (value: boolean) => void;
  setCompletedNewsId: (id: string | null) => void;
  reset: () => void;
}

export const useTodayNewsStore = create<TodayNewsStore>()(
  persist(
    (set) => ({
      hasShownModal: false,
      shouldShowOnReturn: false,
      completedNewsId: null,

      setHasShownModal: (value) => set({ hasShownModal: value }),
      setShouldShowOnReturn: (value) => set({ shouldShowOnReturn: value }),
      setCompletedNewsId: (id) => set({ completedNewsId: id }),
      reset: () => set({ shouldShowOnReturn: false, completedNewsId: null }),
    }),
    {
      name: 'today-news-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
