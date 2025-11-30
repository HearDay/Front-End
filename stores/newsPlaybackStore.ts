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

  // Actions
  setRecommendedArticles: (articles: NewsArticle[]) => void;

  // 추천 기사 재생 제어
  startRecommendedPlayback: (startIndex: number) => void;
  moveToNextRecommended: () => void;

  // 자동재생 모드 제어
  enterAutoPlayMode: () => void;
  setAutoPlayArticles: (articles: NewsArticle[], page: number) => void;
  moveToNextAutoPlay: () => void;

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

  // 추천 기사 설정
  setRecommendedArticles: (articles) => {
    console.log('[NewsPlayback] 추천 기사 5개 설정:', articles.length);
    set({ recommendedArticles: articles });
  },

  // 추천 기사 재생 시작
  startRecommendedPlayback: (startIndex) => {
    console.log('[NewsPlayback] 추천 기사 재생 시작 - 인덱스:', startIndex);
    set({
      isPlayingRecommended: true,
      currentRecommendedIndex: startIndex,
      isAutoPlayMode: false,
    });
  },

  // 다음 추천 기사로 이동
  moveToNextRecommended: () => {
    const state = get();
    const nextIndex = state.currentRecommendedIndex + 1;
    const totalRecommended = state.recommendedArticles.length;

    console.log('[NewsPlayback] 다음 추천 기사로 이동:', {
      current: state.currentRecommendedIndex,
      next: nextIndex,
      total: totalRecommended,
    });

    // 추천 5개를 모두 본 경우
    if (nextIndex >= totalRecommended) {
      console.log('[NewsPlayback] 추천 5개 완료, 자동재생 모드 진입');
      get().enterAutoPlayMode();
      return;
    }

    // 아직 추천 기사가 남은 경우
    set({ currentRecommendedIndex: nextIndex });
  },

  // 자동재생 모드 진입
  enterAutoPlayMode: () => {
    console.log('[NewsPlayback] 자동재생 모드 진입 (TanStack Query 활성화)');
    set({
      isPlayingRecommended: false,
      isAutoPlayMode: true,
      currentAutoPlayIndex: 0,
      currentAutoPlayPage: 0,
    });
  },

  // 자동재생 기사 설정 (TanStack Query에서 호출)
  setAutoPlayArticles: (articles, page) => {
    console.log('[NewsPlayback] 자동재생 기사 설정:', {
      count: articles.length,
      page,
    });
    set({
      autoPlayArticles: articles,
      currentAutoPlayPage: page,
      currentAutoPlayIndex: 0,
    });
  },

  // 다음 자동재생 기사로 이동
  moveToNextAutoPlay: () => {
    const state = get();
    const nextIndex = state.currentAutoPlayIndex + 1;
    const totalAutoPlay = state.autoPlayArticles.length;

    console.log('[NewsPlayback] 다음 자동재생 기사로 이동:', {
      current: state.currentAutoPlayIndex,
      next: nextIndex,
      total: totalAutoPlay,
    });

    // 현재 페이지의 100개를 모두 본 경우
    if (nextIndex >= totalAutoPlay) {
      console.log('[NewsPlayback] 현재 페이지(100개) 완료 - 컴포넌트에서 다음 페이지 로드 필요');
      return;
    }

    // 아직 현재 페이지에 기사가 남은 경우
    set({ currentAutoPlayIndex: nextIndex });
  },

  // 뉴스 종료 핸들러 (통합)
  handleNewsEnd: () => {
    const state = get();

    console.log('[NewsPlayback] 뉴스 종료 이벤트 발생:', {
      isPlayingRecommended: state.isPlayingRecommended,
      isAutoPlayMode: state.isAutoPlayMode,
    });

    // 추천 기사 재생 중인 경우
    if (state.isPlayingRecommended) {
      get().moveToNextRecommended();
      return;
    }

    // 자동재생 모드인 경우
    if (state.isAutoPlayMode) {
      get().moveToNextAutoPlay();
      return;
    }

    console.log('[NewsPlayback] 재생 모드가 아님 - 종료 무시');
  },

  // 현재 페이지의 마지막 기사인지 확인
  isLastArticleInPage: () => {
    const state = get();
    if (!state.isAutoPlayMode) return false;

    return state.currentAutoPlayIndex >= state.autoPlayArticles.length - 1;
  },

  // 다음 기사 ID 가져오기
  getNextArticleId: () => {
    const state = get();

    // 추천 기사 재생 중
    if (state.isPlayingRecommended) {
      const nextIndex = state.currentRecommendedIndex;
      if (nextIndex >= 0 && nextIndex < state.recommendedArticles.length) {
        return state.recommendedArticles[nextIndex].id;
      }
      // 추천 5개 끝났는데 자동재생이 로드되었으면
      if (state.isAutoPlayMode && state.autoPlayArticles.length > 0) {
        return state.autoPlayArticles[0].id;
      }
      return null;
    }

    // 자동재생 모드
    if (state.isAutoPlayMode) {
      const nextIndex = state.currentAutoPlayIndex;
      if (nextIndex >= 0 && nextIndex < state.autoPlayArticles.length) {
        return state.autoPlayArticles[nextIndex].id;
      }
      return null;
    }

    return null;
  },

  // 초기화
  reset: () => {
    console.log('[NewsPlayback] 스토어 초기화');
    set({
      recommendedArticles: [],
      currentRecommendedIndex: -1,
      isPlayingRecommended: false,
      isAutoPlayMode: false,
      autoPlayArticles: [],
      currentAutoPlayIndex: 0,
      currentAutoPlayPage: 0,
    });
  },
}));
