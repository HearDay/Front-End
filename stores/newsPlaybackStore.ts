import { create } from 'zustand';

export interface NewsArticle {
  id: string;
  title: string;
  imageUrl: string;
  summary: string;
  category: string;
}

interface NewsPlaybackStore {
  // 추천 5개 관련
  recommendedArticles: NewsArticle[];
  currentRecommendedIndex: number;
  isPlayingRecommended: boolean;

  // 자동재생 모드 관련
  isAutoPlayMode: boolean;
  autoPlayArticles: NewsArticle[];
  currentAutoPlayIndex: number;
  currentAutoPlayPage: number;

  // 5→100 전환 관련
  isTransitioningToAutoPlay: boolean; // 추천 5개 끝나고 100개 로딩 중

  // Actions
  setRecommendedArticles: (articles: NewsArticle[]) => void;

  // 추천 기사 재생 제어
  startRecommendedPlayback: (startIndex: number) => void;
  moveToNextRecommended: () => void;

  // 자동재생 모드 제어
  enterAutoPlayMode: () => void;
  setAutoPlayArticles: (articles: NewsArticle[], page: number) => void;
  moveToNextAutoPlay: () => void;
  completeTransitionToAutoPlay: () => void; // 전환 완료

  // 뉴스 종료 통합 핸들러
  handleNewsEnd: () => void;

  // 다음 기사 ID 가져오기
  getNextArticleId: () => string | null;

  // 현재 페이지의 마지막 기사인지 확인
  isLastArticleInPage: () => boolean;

  // 초기화
  reset: () => void;
}

export const useNewsPlaybackStore = create<NewsPlaybackStore>((set, get) => ({
  // 초기값
  recommendedArticles: [],
  currentRecommendedIndex: -1,
  isPlayingRecommended: false,

  isAutoPlayMode: false,
  autoPlayArticles: [],
  currentAutoPlayIndex: 0,
  currentAutoPlayPage: 0,

  isTransitioningToAutoPlay: false,

  setRecommendedArticles: (articles) => {
    set({ recommendedArticles: articles });
  },

  startRecommendedPlayback: (startIndex) => {
    set({
      isPlayingRecommended: true,
      currentRecommendedIndex: startIndex,
      isAutoPlayMode: false,
    });
  },

  moveToNextRecommended: () => {
    const state = get();
    const nextIndex = state.currentRecommendedIndex + 1;
    const totalRecommended = state.recommendedArticles.length;

    if (nextIndex >= totalRecommended) {
      get().enterAutoPlayMode();
      return;
    }

    set({ currentRecommendedIndex: nextIndex });
  },

  enterAutoPlayMode: () => {
    set({
      isPlayingRecommended: false,
      isAutoPlayMode: true,
      isTransitioningToAutoPlay: true,
      currentAutoPlayIndex: 0,
      currentAutoPlayPage: 0,
    });
  },

  completeTransitionToAutoPlay: () => {
    set({
      isTransitioningToAutoPlay: false,
    });
  },

  setAutoPlayArticles: (articles, page) => {
    const state = get();

    if (state.currentAutoPlayPage === page && state.autoPlayArticles.length > 0) {
      set({
        autoPlayArticles: articles,
        currentAutoPlayPage: page,
      });
    } else {
      set({
        autoPlayArticles: articles,
        currentAutoPlayPage: page,
        currentAutoPlayIndex: 0,
      });
    }
  },

  moveToNextAutoPlay: () => {
    const state = get();
    const nextIndex = state.currentAutoPlayIndex + 1;
    const totalAutoPlay = state.autoPlayArticles.length;

    if (nextIndex >= totalAutoPlay) {
      return;
    }

    set({ currentAutoPlayIndex: nextIndex });
  },

  handleNewsEnd: () => {
    const state = get();

    if (state.isPlayingRecommended) {
      get().moveToNextRecommended();
      return;
    }

    if (state.isAutoPlayMode) {
      get().moveToNextAutoPlay();
      return;
    }
  },

  isLastArticleInPage: () => {
    const state = get();
    if (!state.isAutoPlayMode) return false;

    if (state.autoPlayArticles.length === 0) {
      return false;
    }

    const isLast = state.currentAutoPlayIndex >= state.autoPlayArticles.length - 1;
    return isLast;
  },

  getNextArticleId: () => {
    const state = get();

    if (state.isPlayingRecommended) {
      const nextIndex = state.currentRecommendedIndex;
      if (nextIndex >= 0 && nextIndex < state.recommendedArticles.length) {
        return state.recommendedArticles[nextIndex].id;
      }
      if (state.isAutoPlayMode && state.autoPlayArticles.length > 0) {
        return state.autoPlayArticles[0].id;
      }
      return null;
    }

    if (state.isAutoPlayMode) {
      const nextIndex = state.currentAutoPlayIndex;
      if (nextIndex >= 0 && nextIndex < state.autoPlayArticles.length) {
        return state.autoPlayArticles[nextIndex].id;
      }
      return null;
    }

    return null;
  },

  reset: () => {
    set({
      recommendedArticles: [],
      currentRecommendedIndex: -1,
      isPlayingRecommended: false,
      isAutoPlayMode: false,
      autoPlayArticles: [],
      currentAutoPlayIndex: 0,
      currentAutoPlayPage: 0,
      isTransitioningToAutoPlay: false,
    });
  },
}));
