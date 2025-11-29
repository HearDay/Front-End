import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TodayNewsStore {
  hasShownModal: boolean;
  shouldShowOnReturn: boolean;
  completedNewsId: string | null;
  _hasHydrated: boolean;
  isFirstFocus: boolean;

  setHasShownModal: (value: boolean) => void;
  setShouldShowOnReturn: (value: boolean) => void;
  setCompletedNewsId: (id: string | null) => void;
  setHasHydrated: (value: boolean) => void;
  setIsFirstFocus: (value: boolean) => void;
  reset: () => void;
}

export const useTodayNewsStore = create<TodayNewsStore>()(
  persist(
    (set) => ({
      hasShownModal: false,
      shouldShowOnReturn: false,
      completedNewsId: null,
      _hasHydrated: false,
      isFirstFocus: true,

      setHasShownModal: (value) => set({ hasShownModal: value }),
      setShouldShowOnReturn: (value) => {
        console.log('[Store] setShouldShowOnReturn 호출:', value);
        set({ shouldShowOnReturn: value });
      },
      setCompletedNewsId: (id) => {
        console.log('[Store] setCompletedNewsId 호출:', id);
        set({ completedNewsId: id });
      },
      setHasHydrated: (value) => set({ _hasHydrated: value }),
      setIsFirstFocus: (value) => set({ isFirstFocus: value }),
      reset: () => set({ shouldShowOnReturn: false, completedNewsId: null }),
    }),
    {
      name: 'today-news-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        shouldShowOnReturn: state.shouldShowOnReturn,
        completedNewsId: state.completedNewsId,
        isFirstFocus: state.isFirstFocus,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('[Store] Hydration 완료:', state);
        state?.setHasHydrated(true);
      },
    }
  )
);
