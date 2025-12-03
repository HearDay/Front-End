import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TodayNewsStore {
  // 모달 표시 관련
  showModal: boolean;
  hasShownInitialModal: boolean;
  userDismissed: boolean; // 사용자가 직접 닫았는지
  hasTriggeredInitialPopup: boolean; // 최초 팝업 트리거 여부 (세션 유지)

  // 백버튼으로 돌아왔을 때 관련
  pendingReturn: boolean; // 뉴스 플레이어에서 돌아올 예정인지
  completedNewsIds: string[]; // 완료한 뉴스 ID 배열
  lastViewedNewsId: string | null; // 마지막으로 본 뉴스 ID (스크롤 위치용)

  // Hydration 관련
  _hasHydrated: boolean;

  // Actions
  setShowModal: (value: boolean) => void;
  setHasShownInitialModal: (value: boolean) => void;
  setUserDismissed: (value: boolean) => void;
  setPendingReturn: (value: boolean) => void;
  setCompletedNewsIds: (ids: string[]) => void;
  setLastViewedNewsId: (id: string | null) => void;
  addCompletedNewsId: (id: string) => void; // 완료 ID 추가
  setHasHydrated: (value: boolean) => void;
  setHasTriggeredInitialPopup: (value: boolean) => void;

  // 사용자가 직접 모달을 닫음
  dismissModal: () => void;

  // 카드 클릭 시 호출 - 백버튼으로 돌아올 것을 예약
  onNewsCardClick: (newsId: string) => void;

  // 백버튼으로 돌아왔을 때 호출 - 모달을 띄워야 하면 true 반환
  checkAndShowOnReturn: () => boolean;

  reset: () => void;
}

export const useTodayNewsStore = create<TodayNewsStore>()(
  persist(
    (set, get) => ({
      showModal: false,
      hasShownInitialModal: false,
      userDismissed: false,
      hasTriggeredInitialPopup: false,
      pendingReturn: false,
      completedNewsIds: [],
      lastViewedNewsId: null,
      _hasHydrated: false,

      setShowModal: (value) => {
        console.log('[Store] setShowModal:', value);
        set({ showModal: value });
      },

      setHasShownInitialModal: (value) => {
        console.log('[Store] setHasShownInitialModal:', value);
        set({ hasShownInitialModal: value });
      },

      setUserDismissed: (value) => {
        console.log('[Store] setUserDismissed:', value);
        set({ userDismissed: value });
      },

      setPendingReturn: (value) => {
        console.log('[Store] setPendingReturn:', value);
        set({ pendingReturn: value });
      },

      setCompletedNewsIds: (ids) => {
        console.log('[Store] setCompletedNewsIds:', ids);
        set({ completedNewsIds: ids });
      },

      setLastViewedNewsId: (id) => {
        console.log('[Store] setLastViewedNewsId:', id);
        set({ lastViewedNewsId: id });
      },

      addCompletedNewsId: (id) => {
        const state = get();
        if (!state.completedNewsIds.includes(id)) {
          console.log('[Store] addCompletedNewsId:', id);
          set({ completedNewsIds: [...state.completedNewsIds, id] });
        }
      },

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setHasTriggeredInitialPopup: (value) => {
        console.log('[Store] setHasTriggeredInitialPopup:', value);
        set({ hasTriggeredInitialPopup: value });
      },

      // 사용자가 직접 모달을 닫음 (백그라운드 클릭)
      dismissModal: () => {
        console.log('[Store] dismissModal - 사용자가 직접 닫음');
        set({
          showModal: false,
          userDismissed: true, // 사용자가 닫았다고 표시
        });
      },

      // 카드 클릭 시
      onNewsCardClick: (newsId) => {
        console.log('[Store] onNewsCardClick:', newsId);
        const state = get();
        // 완료 목록에 추가
        if (!state.completedNewsIds.includes(newsId)) {
          set({
            pendingReturn: true,
            completedNewsIds: [...state.completedNewsIds, newsId],
            lastViewedNewsId: newsId,
            showModal: false,
            userDismissed: false,
          });
        } else {
          set({
            pendingReturn: true,
            lastViewedNewsId: newsId,
            showModal: false,
            userDismissed: false,
          });
        }
      },

      // 백버튼으로 돌아왔을 때
      checkAndShowOnReturn: () => {
        const state = get();
        console.log('[Store] checkAndShowOnReturn - pendingReturn:', state.pendingReturn);

        if (state.pendingReturn) {
          // 모달 띄우기
          set({
            showModal: true,
            pendingReturn: false,
            userDismissed: false,
          });
          return true;
        }
        return false;
      },

      reset: () => set({ pendingReturn: false, completedNewsIds: [], lastViewedNewsId: null }),
    }),
    {
      name: 'today-news-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasShownInitialModal: state.hasShownInitialModal,
        userDismissed: state.userDismissed,
        // hasTriggeredInitialPopup은 persist 제외 (세션 동안만 유지)
        pendingReturn: state.pendingReturn,
        completedNewsIds: state.completedNewsIds,
        lastViewedNewsId: state.lastViewedNewsId,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('[Store] Hydration 완료:', {
          pendingReturn: state?.pendingReturn,
          completedNewsIds: state?.completedNewsIds,
          lastViewedNewsId: state?.lastViewedNewsId,
          userDismissed: state?.userDismissed,
          hasTriggeredInitialPopup: state?.hasTriggeredInitialPopup,
        });
        state?.setHasHydrated(true);
      },
    }
  )
);
