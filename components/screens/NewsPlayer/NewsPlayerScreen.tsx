import { Modal } from '@/components/common';
import { DiscussionLevelModal } from "../Discussion/DiscussionLevelModal";
import { DiscussionModal } from "../Discussion/DiscussionModal";

import { useAudio } from "@/contexts/AudioContext";
import { useAutoPlayArticles } from "@/hooks/useAutoPlayArticles";
import { NewsArticle, useNewsPlaybackStore } from "@/stores/newsPlaybackStore";
import { usePlaylistStore } from "@/stores/playlistStore";
import { Audio } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { newsService } from "../../../services";
import { NewsPlayerData } from "../../../types/screens";
import { AudioControls } from "./AudioControls";
import { BottomActions } from "./BottomActions";
import { LyricsDisplay } from "./LyricsDisplay";
import { NewsImagePlaceholder } from "./NewsImagePlaceholder";
import { NewsPlayerHeader } from "./NewsPlayerHeader";

interface NewsPlayerScreenProps {
  articleId: string;
  from?: string;
  isPlaylistMode?: boolean;
}

export const NewsPlayerScreen = ({
  articleId,
  from,
  isPlaylistMode = false,
}: NewsPlayerScreenProps) => {
  const router = useRouter();
  const { category, mode } = useLocalSearchParams<{ category?: string; mode?: string }>();
  const { isPlaying, currentPosition, loadAudio, play, pause, setOnAudioEnd } = useAudio();
  const { goToNext, goToPrev } = usePlaylistStore();

  // 연속 재생 스토어
  const {
    handleNewsEnd,
    getNextArticleId,
    isPlayingRecommended,
    isAutoPlayMode,
    isTransitioningToAutoPlay,
    setAutoPlayArticles,
    completeTransitionToAutoPlay,
    isLastArticleInPage,
    autoPlayArticles,
    currentAutoPlayIndex,
    recommendedArticles,
    currentRecommendedIndex,
  } = useNewsPlaybackStore();

  // TanStack Query: 자동재생 기사 100개씩 로드
  const {
    data: autoPlayData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAutoPlayArticles({
    enabled: isAutoPlayMode,
    pageSize: 100,
  });

  const [newsData, setNewsData] = useState<NewsPlayerData | null>(null);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alignmentData, setAlignmentData] = useState<any[]>([]);

  // 토론 모달 
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [selectedMode, setSelectedMode] =
    useState<"voice" | "chat" | null>(null);

  // 차량 모드 
  const [isCarMode, setIsCarMode] = useState(false);
  const [showCarModeErrorModal, setShowCarModeErrorModal] =
    useState(false);

  // 저장 모달 
  const [showSaveConfirmModal, setShowSaveConfirmModal] =
    useState(false);
  const [showSaveResultModal, setShowSaveResultModal] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState("");

  // 최근 기사 
  const [recentArticles, setRecentArticles] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // 데이터 로딩
  const fetchRecentArticles = useCallback(async () => {
    try {
      const response = await newsService.getRecentArticles("RECENT");
      const ids = response.map((a) => a.id);
      setRecentArticles(ids);

      const idx = ids.findIndex((id) => id === parseInt(articleId));
      setCurrentIndex(idx);
    } catch {}
  }, [articleId]);

  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsService.getNewsDetail(articleId);
      setNewsData(response);
    } catch {
      setError("뉴스를 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchNewsData();

    // 추천 기사 모드(1-5)가 아닐 때는 항상 최근 기사 로드
    // (일반 모드 + 자동재생 모드에서 이전 버튼 사용을 위해 필요)
    if (!isPlayingRecommended) {
      fetchRecentArticles();
    }
  }, [fetchNewsData, fetchRecentArticles, isPlayingRecommended]);

  // ttsAlignment 파싱 및 전체 텍스트를 줄 단위로 분할
  useEffect(() => {
    if (!newsData?.fullText) return;

    try {
      // 전체 텍스트를 공백 기준으로 단어 분할
      const allWords = newsData.fullText.split(/\s+/).filter(w => w.length > 0);

      let wordTimings: { word: string; startTime: number; endTime: number }[] = [];

      if (newsData.ttsAlignment) {
        // ttsAlignment가 있는 경우 파싱 시도
        try {
          const parsed = JSON.parse(newsData.ttsAlignment);

          // 각 세그먼트의 단어를 타임스탬프와 매핑
          parsed.forEach((segment: any) => {
            const segmentText = segment.text || segment.word || '';
            const segmentWords = segmentText.split(/\s+/).filter((w: string) => w.length > 0);
            // camelCase와 snake_case 모두 지원
            const startTime = segment.startTime ?? segment.start_time ?? segment.start ?? 0;
            const endTime = segment.endTime ?? segment.end_time ?? segment.end ?? 0;
            const segmentDuration = endTime - startTime;
            const timePerWord = segmentDuration / Math.max(segmentWords.length, 1);

            segmentWords.forEach((word: string, idx: number) => {
              wordTimings.push({
                word,
                startTime: startTime + (timePerWord * idx),
                endTime: startTime + (timePerWord * (idx + 1)),
              });
            });
          });
        } catch (parseErr) {
          console.error('ttsAlignment 파싱 실패:', parseErr);
        }
      }

      // ttsAlignment가 없거나 파싱 실패 시, 전체 시간을 균등 분배
      if (wordTimings.length === 0) {
        const totalDuration = 60; // 기본 60초로 가정
        const timePerWord = totalDuration / allWords.length;

        wordTimings = allWords.map((word, idx) => ({
          word,
          startTime: timePerWord * idx,
          endTime: timePerWord * (idx + 1),
        }));
      }

      setAlignmentData(wordTimings);

      // 초기 3줄 설정 (한 줄당 6 단어)
      const wordsPerLine = 6;
      const line1 = wordTimings.slice(0, wordsPerLine).map(w => w.word).join(' ');
      const line2 = wordTimings.slice(wordsPerLine, wordsPerLine * 2).map(w => w.word).join(' ');
      const line3 = wordTimings.slice(wordsPerLine * 2, wordsPerLine * 3).map(w => w.word).join(' ');

      setCurrentLines([line1, line2, line3].filter(l => l.length > 0));
    } catch (err) {
      console.error('전체 처리 실패:', err);
      // 최후의 수단: 전체 텍스트를 3등분
      const words = newsData.fullText.split(/\s+/);
      const wordsPerLine = Math.ceil(words.length / 3);
      const lines = [
        words.slice(0, wordsPerLine).join(' '),
        words.slice(wordsPerLine, wordsPerLine * 2).join(' '),
        words.slice(wordsPerLine * 2).join(' '),
      ].filter(l => l.length > 0);
      setCurrentLines(lines);
    }
  }, [newsData]);

  // 현재 재생 위치에 맞는 가사 업데이트 (3줄 표시, 한 줄씩 올라가기)
  useEffect(() => {
    if (!alignmentData || alignmentData.length === 0) return;

    // 현재 재생 중인 단어의 인덱스 찾기
    const currentWordIndex = alignmentData.findIndex((word: any) => {
      return currentPosition >= word.startTime && currentPosition < word.endTime;
    });

    if (currentWordIndex >= 0) {
      // 한 줄당 6 단어씩
      const wordsPerLine = 6;

      // 현재 단어가 속한 줄의 시작 인덱스 (중간 줄로 설정)
      const currentLineStart = Math.floor(currentWordIndex / wordsPerLine) * wordsPerLine;

      // 3줄 표시: 이전 줄, 현재 줄, 다음 줄
      const startIndex = Math.max(0, currentLineStart - wordsPerLine);

      const line1Words = alignmentData.slice(startIndex, startIndex + wordsPerLine);
      const line2Words = alignmentData.slice(startIndex + wordsPerLine, startIndex + wordsPerLine * 2);
      const line3Words = alignmentData.slice(startIndex + wordsPerLine * 2, startIndex + wordsPerLine * 3);

      const line1 = line1Words.map((w: any) => w.word).join(' ');
      const line2 = line2Words.map((w: any) => w.word).join(' ');
      const line3 = line3Words.map((w: any) => w.word).join(' ');

      const lines = [line1, line2, line3].filter(l => l.length > 0);

      setCurrentLines(lines);
    }
  }, [currentPosition, alignmentData]);

  useEffect(() => {
    if (newsData?.audioUrl) {
      loadAudio(newsData.audioUrl, articleId);
    }
  }, [newsData, articleId, loadAudio]);

  // TanStack Query 데이터를 Zustand 스토어에 동기화
  // 주의: 5->100 전환 시에는 handleAudioEnd/handleNext에서 직접 필터링하여 설정하므로
  // 여기서는 전환 중이 아닐 때만 동기화 (100->200 등 페이지 전환 시)
  useEffect(() => {
    // 전환 중이면 동기화하지 않음 (직접 API 호출이 처리함)
    if (isTransitioningToAutoPlay) {
      console.log('[NewsPlayer] 전환 중이므로 TanStack Query 동기화 건너뜀');
      return;
    }

    if (!isAutoPlayMode || !autoPlayData?.pages) {
      if (isAutoPlayMode && !autoPlayData?.pages) {
        console.log('[NewsPlayer] 자동재생 모드지만 아직 데이터 없음 - TanStack Query 로딩 중');
      }
      return;
    }

    const currentPage = autoPlayData.pages[autoPlayData.pages.length - 1];

    if (currentPage?.data && currentPage.data.length > 0) {
      // 이미 Zustand에 데이터가 있고, 같은 페이지면 덮어쓰지 않음
      const currentState = useNewsPlaybackStore.getState();
      const pageNumber = autoPlayData.pages.length;

      // 같은 페이지면 건너뜀 (이미 필터링된 데이터가 있음)
      if (currentState.currentAutoPlayPage === pageNumber && currentState.autoPlayArticles.length > 0) {
        console.log('[NewsPlayer] TanStack Query 동기화 건너뜀 - 이미 필터링된 데이터 존재');
        return;
      }

      const articles: NewsArticle[] = currentPage.data.map((article: any) => ({
        id: String(article.id),
        title: article.title,
        imageUrl: article.imageUrl,
        summary: article.description,
        category: article.category,
      }));

      console.log('[NewsPlayer] ========== TanStack Query -> Zustand 동기화 ==========');
      console.log('[NewsPlayer] TanStack Query 데이터 -> Zustand 스토어 동기화:', {
        pageNumber,
        articlesCount: articles.length,
        firstArticleId: articles[0]?.id,
        isTransitioning: isTransitioningToAutoPlay,
      });

      setAutoPlayArticles(articles, pageNumber);
    }
  }, [autoPlayData, isAutoPlayMode, isTransitioningToAutoPlay, setAutoPlayArticles]);

  // 뉴스 종료 시 자동 재생 (연속 재생 모드일 때만)
  useEffect(() => {
    console.log('[NewsPlayer] useEffect 실행 - 연속 재생 설정:', {
      isPlayingRecommended,
      isAutoPlayMode,
      mode,
      articleId,
    });

    const handleAudioEnd = async () => {
      console.log('[NewsPlayer] ===== 오디오 종료 콜백 호출됨 =====');
      console.log('[NewsPlayer] 오디오 종료 감지:', {
        isPlayingRecommended,
        isAutoPlayMode,
        mode,
        articleId,
      });

      // 연속 재생 모드가 아니면 무시
      if (!isPlayingRecommended && !isAutoPlayMode) {
        console.log('[NewsPlayer] 연속 재생 모드 아님 - 종료');
        return;
      }

      // Zustand에 뉴스 종료 알림 (상태 업데이트)
      handleNewsEnd();

      // 잠시 대기하여 상태 업데이트 반영
      await new Promise(resolve => setTimeout(resolve, 100));

      // 상태가 변경되었을 수 있으므로 다시 읽기
      const updatedState = useNewsPlaybackStore.getState();
      console.log('[NewsPlayer] 업데이트된 상태:', {
        isPlayingRecommended: updatedState.isPlayingRecommended,
        isAutoPlayMode: updatedState.isAutoPlayMode,
        currentRecommendedIndex: updatedState.currentRecommendedIndex,
        currentAutoPlayIndex: updatedState.currentAutoPlayIndex,
      });

      // 자동재생 모드일 때: 현재 페이지의 마지막 기사면 다음 페이지 로드
      // 단, 전환 중이 아닐 때만 (전환 중에는 첫 페이지를 로드하는 중이므로)
      if (updatedState.isAutoPlayMode && !updatedState.isTransitioningToAutoPlay && isLastArticleInPage()) {
        console.log('[NewsPlayer] 현재 페이지(100개) 마지막 기사 - 다음 페이지 로드 시도');

        if (hasNextPage && !isFetchingNextPage) {
          console.log('[NewsPlayer] 다음 페이지 로드 중...');
          await fetchNextPage();
        } else if (!hasNextPage) {
          console.log('[NewsPlayer] 더 이상 페이지 없음 - 재생 종료');
          router.push('/(tabs)');
          return;
        }
      }

      // 다음 기사 ID 가져오기
      let nextArticleId = getNextArticleId();

      // 자동재생 모드로 막 전환되었고 데이터가 없는 경우, 즉시 API 호출
      if (!nextArticleId && updatedState.isAutoPlayMode && updatedState.isTransitioningToAutoPlay) {
        console.log('[NewsPlayer] ========== 5->100 전환 시작 ==========');
        console.log('[NewsPlayer] API 직접 호출하여 100개 기사 로드 시작');

        try {
          // fetchArticlesWithPagination을 직접 import하여 즉시 호출
          const { fetchArticlesWithPagination } = await import('@/services/api/articles');
          const articlesData = await fetchArticlesWithPagination(0, 100);

          console.log('[NewsPlayer] API 응답 받음:', {
            count: articlesData?.length || 0,
          });

          if (articlesData && articlesData.length > 0) {
            // 이미 본 추천 5개 기사 ID 가져오기
            const recommendedIds = updatedState.recommendedArticles.map(article => article.id);
            console.log('[NewsPlayer] 제외할 추천 기사 ID:', recommendedIds);
            console.log('[NewsPlayer] 제외할 ID 타입:', typeof recommendedIds[0]);

            // API 응답 데이터의 ID 타입 확인
            console.log('[NewsPlayer] API 첫 기사 ID:', articlesData[0]?.id, '타입:', typeof articlesData[0]?.id);

            // 추천 5개 기사 제외하고 필터링 (타입 맞춰서)
            const filteredData = articlesData.filter((article: any) => {
              const articleIdStr = String(article.id);
              const isExcluded = recommendedIds.includes(articleIdStr);

              // 제외되는 기사만 로그
              if (isExcluded) {
                console.log('[NewsPlayer] ✓ 제외된 기사:', articleIdStr, article.title);
              }

              return !isExcluded;
            });

            console.log('[NewsPlayer] 필터링 결과:', {
              원본: articlesData.length,
              제외: articlesData.length - filteredData.length,
              최종: filteredData.length,
            });

            // 즉시 Zustand에 동기화
            const articles: NewsArticle[] = filteredData.map((article: any) => ({
              id: String(article.id),
              title: article.title,
              imageUrl: article.imageUrl,
              summary: article.description,
              category: article.category,
            }));

            console.log('[NewsPlayer] 100개 기사 Zustand 동기화 (중복 제거됨):', {
              articlesCount: articles.length,
              firstArticleId: articles[0]?.id,
            });

            setAutoPlayArticles(articles, 1);

            // 동기화 후 즉시 다음 기사 ID 가져오기
            nextArticleId = getNextArticleId();

            if (nextArticleId) {
              console.log('[NewsPlayer] 자동재생 데이터 로드 완료:', nextArticleId);
              // 전환 완료
              completeTransitionToAutoPlay();
              console.log('[NewsPlayer] ========== 5->100 전환 완료 (즉시) ==========');
            } else {
              console.error('[NewsPlayer] 동기화 후에도 nextArticleId가 없음');
              alert('자동 재생 데이터를 불러왔지만 기사를 찾을 수 없습니다.');
              return;
            }
          } else {
            console.error('[NewsPlayer] API 응답이 비어있음');
            alert('자동 재생할 기사가 없습니다.');
            return;
          }
        } catch (error) {
          console.error('[NewsPlayer] ========== 5->100 전환 실패 ==========');
          console.error('[NewsPlayer] API 호출 실패:', error);
          alert('자동 재생 데이터를 불러오지 못했습니다.');
          return;
        }
      }

      // 추천 모드에서 다음 기사가 없으면 (정상적으로는 자동재생으로 전환되어야 함)
      if (!nextArticleId && !updatedState.isAutoPlayMode) {
        // 전환 중이면 홈으로 이동하지 않음
        if (updatedState.isTransitioningToAutoPlay) {
          console.log('[NewsPlayer] 전환 중이므로 홈 이동 차단');
          return;
        }
        console.log('[NewsPlayer] 추천 모드 종료 - 재생 완료');
        router.push('/(tabs)');
        return;
      }

      if (nextArticleId) {
        // 현재 기사를 완료 처리 (팝업 5개 재생 중일 때만)
        // 단, 자동재생 모드가 아닐 때만 (팝업 5개 재생 중일 때만)
        const currentState = useNewsPlaybackStore.getState();
        if (!currentState.isAutoPlayMode && isPlayingRecommended) {
          const { addCompletedNewsId } = await import('@/stores/todayNewsStore').then(m => m.useTodayNewsStore.getState());
          addCompletedNewsId(articleId);
          console.log('[NewsPlayer] 팝업 기사 완료 처리:', articleId);
          // 주의: lastViewedNewsId는 자동 재생 시에는 설정하지 않음
          // Back 버튼으로 돌아갈 때만 설정됨
        }

        // 현재 상태에 따라 올바른 mode 파라미터 설정
        const nextMode = currentState.isAutoPlayMode ? 'auto' : 'recommended';
        const fromParam = from || 'todaynews';

        console.log('[NewsPlayer] 다음 기사로 자동 이동:', nextArticleId, 'mode:', nextMode, 'from:', fromParam);
        router.replace(`/newsplayer/${nextArticleId}?mode=${nextMode}&from=${fromParam}`);
      } else {
        // 예상치 못한 상황이지만 전환 중이면 홈으로 이동하지 않음
        const finalState = useNewsPlaybackStore.getState();
        if (finalState.isTransitioningToAutoPlay) {
          console.error('[NewsPlayer] 예상치 못한 상황이지만 전환 중이므로 홈 이동 차단');
          return;
        }
        console.error('[NewsPlayer] 예상치 못한 상황 - nextArticleId가 없음');
        router.push('/(tabs)');
      }
    };

    // 오디오 종료 콜백 등록
    setOnAudioEnd(handleAudioEnd);

    // 클린업: 컴포넌트 언마운트 시 콜백 해제
    return () => {
      setOnAudioEnd(null);
    };
  }, [
    isPlayingRecommended,
    isAutoPlayMode,
    isTransitioningToAutoPlay,
    mode,
    articleId,
    setOnAudioEnd,
    autoPlayData,
    setAutoPlayArticles,
    completeTransitionToAutoPlay,
    getNextArticleId,
    isLastArticleInPage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    router,
    from
  ]);

  // 뒤로가기
  const handleBack = useCallback(async () => {
    console.log('[NewsPlayer] 백버튼 클릭:', { from, isPlayingRecommended, isAutoPlayMode, mode, articleId });

    // 자동재생 모드 (5번째 이후)에서 온 경우 → 팝업 없이 홈으로만
    if (isAutoPlayMode && from === "todaynews") {
      console.log('[NewsPlayer] 자동재생 모드 - 팝업 없이 홈으로만 이동');
      return router.push("/(tabs)");
    }

    // 추천 기사 재생 모드 (1~5번)에서 온 경우 → 팝업으로 돌아가기
    if (isPlayingRecommended && from === "todaynews") {
      console.log('[NewsPlayer] 추천 기사 모드 - 팝업으로 돌아가기');

      // 현재 기사를 완료 처리하고 lastViewedNewsId로 설정
      const { setPendingReturn, addCompletedNewsId, setLastViewedNewsId } = await import('@/stores/todayNewsStore').then(m => m.useTodayNewsStore.getState());

      console.log('[NewsPlayer] Back - 현재 기사 완료 처리:', articleId);
      addCompletedNewsId(articleId);
      setLastViewedNewsId(articleId);
      setPendingReturn(true);

      console.log('[NewsPlayer] Back - 상태 업데이트 완료, 홈으로 이동 (팝업 표시됨)');

      // 홈으로 라우팅 (팝업이 자동으로 뜸)
      return router.push("/(tabs)");
    }

    // 나머지 경우는 원래 위치로 돌아가기
    if (from === "savednews") {
      console.log('[NewsPlayer] 저장탭으로 돌아가기');
      return router.push("/(tabs)/savednews");
    }

    if (from === "home") {
      console.log('[NewsPlayer] 홈으로 돌아가기');
      return router.push("/(tabs)");
    }

    if (from === "category") {
      console.log('[NewsPlayer] 검색 페이지로 돌아가기');
      return router.push({
        pathname: "/SearchNewsPage",
        params: { category: category || "전체" },
      });
    }

    console.log('[NewsPlayer] 기본 뒤로가기');
    router.back();
  }, [router, from, isPlayingRecommended, isAutoPlayMode, mode, category, articleId]);

  // 오디오 제어
  const handlePlay = useCallback(async () => play(), [play]);
  const handlePause = useCallback(async () => pause(), [pause]);

  const handleNext = useCallback(async () => {
    console.log('[NewsPlayer] ===== handleNext 호출됨 =====');

    // 연속 재생 모드일 때는 newsPlaybackStore 사용
    if (isPlayingRecommended || isAutoPlayMode) {
      console.log('[NewsPlayer] 연속 재생 모드 - 다음 기사로 이동');
      handleNewsEnd();

      // 상태가 변경되었을 수 있으므로 다시 읽기
      await new Promise(resolve => setTimeout(resolve, 100));
      const updatedState = useNewsPlaybackStore.getState();

      let nextId = getNextArticleId();

      // 5번째 추천 기사에서 다음 버튼을 누른 경우 (자동재생 모드 전환)
      if (!nextId && updatedState.isAutoPlayMode && updatedState.isTransitioningToAutoPlay) {
        console.log('[NewsPlayer] ========== handleNext: 5->100 전환 시작 ==========');
        console.log('[NewsPlayer] API 직접 호출하여 100개 기사 로드 시작');

        try {
          const { fetchArticlesWithPagination } = await import('@/services/api/articles');
          const articlesData = await fetchArticlesWithPagination(0, 100);

          console.log('[NewsPlayer] API 응답 받음:', {
            count: articlesData?.length || 0,
          });

          if (articlesData && articlesData.length > 0) {
            // 이미 본 추천 5개 기사 ID 가져오기
            const recommendedIds = updatedState.recommendedArticles.map(article => article.id);
            console.log('[NewsPlayer] 제외할 추천 기사 ID:', recommendedIds);
            console.log('[NewsPlayer] 제외할 ID 타입:', typeof recommendedIds[0]);

            // API 응답 데이터의 ID 타입 확인
            console.log('[NewsPlayer] API 첫 기사 ID:', articlesData[0]?.id, '타입:', typeof articlesData[0]?.id);

            // 추천 5개 기사 제외하고 필터링 (타입 맞춰서)
            const filteredData = articlesData.filter((article: any) => {
              const articleIdStr = String(article.id);
              const isExcluded = recommendedIds.includes(articleIdStr);

              // 제외되는 기사만 로그
              if (isExcluded) {
                console.log('[NewsPlayer] ✓ 제외된 기사:', articleIdStr, article.title);
              }

              return !isExcluded;
            });

            console.log('[NewsPlayer] 필터링 결과:', {
              원본: articlesData.length,
              제외: articlesData.length - filteredData.length,
              최종: filteredData.length,
            });

            const articles: NewsArticle[] = filteredData.map((article: any) => ({
              id: String(article.id),
              title: article.title,
              imageUrl: article.imageUrl,
              summary: article.description,
              category: article.category,
            }));

            console.log('[NewsPlayer] 100개 기사 Zustand 동기화 (중복 제거됨):', {
              articlesCount: articles.length,
              firstArticleId: articles[0]?.id,
            });

            setAutoPlayArticles(articles, 1);
            nextId = getNextArticleId();

            if (nextId) {
              console.log('[NewsPlayer] 자동재생 데이터 로드 완료:', nextId);
              completeTransitionToAutoPlay();
              console.log('[NewsPlayer] ========== handleNext: 5->100 전환 완료 ==========');
            } else {
              console.error('[NewsPlayer] 동기화 후에도 nextArticleId가 없음');
              alert('자동 재생 데이터를 불러왔지만 기사를 찾을 수 없습니다.');
              return;
            }
          } else {
            console.error('[NewsPlayer] API 응답이 비어있음');
            alert('자동 재생할 기사가 없습니다.');
            return;
          }
        } catch (error) {
          console.error('[NewsPlayer] ========== handleNext: 5->100 전환 실패 ==========');
          console.error('[NewsPlayer] API 호출 실패:', error);
          alert('자동 재생 데이터를 불러오지 못했습니다.');
          return;
        }
      }

      if (nextId) {
        const nextMode = useNewsPlaybackStore.getState().isAutoPlayMode ? 'auto' : 'recommended';
        const fromParam = from || 'todaynews';
        console.log('[NewsPlayer] 다음 기사:', nextId, 'mode:', nextMode);
        router.replace(`/newsplayer/${nextId}?mode=${nextMode}&from=${fromParam}`);
      } else {
        console.log('[NewsPlayer] 더 이상 재생할 기사 없음');
      }
      return;
    }

    // 일반 모드
    console.log('[NewsPlayer] 일반 모드 - recentArticles 사용');
    if (isPlaylistMode) {
      const nextId = goToNext();
      if (nextId) {
        router.replace(`/newsplayer/${nextId}?playlist=true`);
      }
    } else {
      if (currentIndex < recentArticles.length - 1) {
        router.replace(`/newsplayer/${recentArticles[currentIndex + 1]}`);
      }
    }
  }, [isPlayingRecommended, isAutoPlayMode, handleNewsEnd, getNextArticleId, setAutoPlayArticles, completeTransitionToAutoPlay, from, router, isPlaylistMode, goToNext, currentIndex, recentArticles]);

  const handlePrev = useCallback(() => {
    console.log('[NewsPlayer] ===== handlePrev 호출됨 =====');
    console.log('[NewsPlayer] from:', from);

    // 추천 기사 모드(1-5)에서 이전 기사로 이동
    if (isPlayingRecommended) {
      console.log('[NewsPlayer] 추천 기사 모드 - 이전 기사로 이동');
      console.log('[NewsPlayer] recommendedArticles:', recommendedArticles.map(a => a.id));
      console.log('[NewsPlayer] currentRecommendedIndex:', currentRecommendedIndex);

      if (currentRecommendedIndex > 0 && recommendedArticles.length > 0) {
        const prevArticle = recommendedArticles[currentRecommendedIndex - 1];
        console.log('[NewsPlayer] 이전 추천 기사로 이동:', prevArticle.id, prevArticle.title);

        // 인덱스를 하나 줄이고 이동
        const { useNewsPlaybackStore: store } = require('@/stores/newsPlaybackStore');
        store.setState({ currentRecommendedIndex: currentRecommendedIndex - 1 });

        // from 파라미터 유지하여 라우팅
        const fromParam = from || 'todaynews';
        router.replace(`/newsplayer/${prevArticle.id}?mode=recommended&from=${fromParam}`);
      } else {
        console.log('[NewsPlayer] 이전 추천 기사 없음 (첫 번째 기사)');
      }
      return;
    }

    // 자동재생 모드에서는 autoPlayArticles 배열의 이전 기사로 이동
    if (isAutoPlayMode) {
      console.log('[NewsPlayer] 자동재생 모드 - 이전 기사로 이동');
      console.log('[NewsPlayer] autoPlayArticles:', autoPlayArticles.map(a => a.id));
      console.log('[NewsPlayer] currentAutoPlayIndex:', currentAutoPlayIndex);

      if (currentAutoPlayIndex > 0 && autoPlayArticles.length > 0) {
        const prevArticle = autoPlayArticles[currentAutoPlayIndex - 1];
        console.log('[NewsPlayer] 이전 기사로 이동:', prevArticle.id, prevArticle.title);

        // 인덱스를 하나 줄이고 이동
        const { useNewsPlaybackStore: store } = require('@/stores/newsPlaybackStore');
        store.setState({ currentAutoPlayIndex: currentAutoPlayIndex - 1 });

        // from 파라미터 유지하여 라우팅
        const fromParam = from || 'todaynews';
        router.replace(`/newsplayer/${prevArticle.id}?mode=auto&from=${fromParam}`);
      } else {
        console.log('[NewsPlayer] 이전 기사 없음 (첫 번째 기사)');
      }
      return;
    }

    // 일반 모드 (검색, 저장된 뉴스 등)
    if (isPlaylistMode) {
      const prevId = goToPrev();
      if (prevId) {
        router.replace(`/newsplayer/${prevId}?playlist=true`);
      }
    } else {
      // recentArticles에서 이전 기사로 이동
      console.log('[NewsPlayer] 일반 모드 - 최근 본 뉴스에서 이전 기사로 이동');
      console.log('[NewsPlayer] recentArticles:', recentArticles);
      console.log('[NewsPlayer] currentIndex:', currentIndex);

      if (currentIndex > 0) {
        const prevArticleId = recentArticles[currentIndex - 1];
        console.log('[NewsPlayer] 이전 기사로 이동:', prevArticleId);

        // from 파라미터 유지하여 라우팅
        const fromParam = from || 'home';
        const categoryParam = category ? `&category=${category}` : '';
        router.replace(`/newsplayer/${prevArticleId}?from=${fromParam}${categoryParam}`);
      } else {
        console.log('[NewsPlayer] 이전 기사 없음 (첫 번째 기사)');
      }
    }
  }, [isPlayingRecommended, isAutoPlayMode, isPlaylistMode, goToPrev, currentIndex, recentArticles, router, autoPlayArticles, currentAutoPlayIndex, recommendedArticles, currentRecommendedIndex, from, category]);

  // -----------------------------
  // 차량 모드
  // -----------------------------
  const handleCarModeToggle = useCallback(async () => {
    const next = !isCarMode;
    setIsCarMode(next);

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: next,
      });
    } catch {
      setShowCarModeErrorModal(true);
    }
  }, [isCarMode]);

  // 토론/저장 클릭
  const handleDiscussion = () => setShowDiscussionModal(true);

  const handleSave = () => setShowSaveConfirmModal(true);

  const handleQuiz = () => router.push(`/quiz/${articleId}`);

  const handleConfirmSave = async () => {
    setShowSaveConfirmModal(false);

    try {
      await newsService.saveNews(articleId);
      setSaveResultMessage("뉴스가 저장되었습니다!");
      setShowSaveResultModal(true);
    } catch {
      setSaveResultMessage("저장 실패!");
      setShowSaveResultModal(true);
    }
  };

  // 로딩/에러 화면
  if (loading) {
    return (
      <LinearGradient colors={["#FFFEF0", "#E8F5E9", "#C8E6C9"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-gray-600 mt-4">데이터 불러오는 중...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={["#FFFEF0", "#E8F5E9", "#C8E6C9"]} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500">{error}</Text>
          <TouchableOpacity
            onPress={fetchNewsData}
            className="bg-green-600 px-6 py-3 rounded-xl mt-4"
          >
            <Text className="text-white font-semibold">다시 시도</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // 정상 UI
  if (!newsData) {
    return null;
  }

  return (
    <LinearGradient colors={["#FFFEF0", "#E8F5E9", "#C8E6C9"]} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">

        <NewsPlayerHeader
          title={newsData.title}
          onBack={handleBack}
          onQuizPress={handleQuiz}
        />

        {/* 본문 클릭 → 뉴스 기사 페이지 */}
        <TouchableOpacity
          className="flex-1"
          activeOpacity={0.9}
          onPress={() => router.push(`/newsarticle/${articleId}`)}
        >
          <NewsImagePlaceholder imageUrl={newsData.imageUrl} />
          <LyricsDisplay currentLines={currentLines} />
        </TouchableOpacity>

        {/* 오디오 컨트롤 */}
        <AudioControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* 차량 모드 / 토론 / 저장 */}
        <BottomActions
          isCarMode={isCarMode}
          onCarModeToggle={handleCarModeToggle}
          onDiscussionPress={handleDiscussion}
          onSavePress={handleSave}
        />

        {/* 토론 방식 선택 모달 */}
        <DiscussionModal
          visible={showDiscussionModal}
          articleId={articleId}
          onClose={() => setShowDiscussionModal(false)}
          onStartDiscussion={(mode) => {
            setSelectedMode(mode);
            setShowDiscussionModal(false);
            setShowLevelModal(true);
          }}
        />

        {/* 난이도 선택 모달 */}
        {selectedMode && newsData && (
          <DiscussionLevelModal
            visible={showLevelModal}
            onClose={() => setShowLevelModal(false)}
            mode={selectedMode}
            articleId={articleId}
            onSelect={(level) => {
              const target =
                selectedMode === "voice"
                  ? "/AIVoiceDebatePage"
                  : "/AIChatDebatePage";

              router.push({
                pathname: target,
                params: {
                  articleId,
                  title: newsData.title,
                  mode: selectedMode,
                  level,
                },
              });

setShowLevelModal(false);

            }}
          />
        )}


        {/* 차량 모드 오류 모달 */}
        <Modal
          visible={showCarModeErrorModal}
          title="오디오 모드 설정에 실패했습니다. iOS 시뮬레이터에서는 지원되지 않을 수 있습니다."
          onConfirm={() => setShowCarModeErrorModal(false)}
          onClose={() => setShowCarModeErrorModal(false)}
        >
          <View className="mt-6 mb-[-16px]">
            <TouchableOpacity
              className="bg-[#006716] py-3 rounded-xl"
              onPress={() => setShowCarModeErrorModal(false)}
            >
              <Text className="text-white text-center font-semibold">확인</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* 저장 확인 모달 */}
        <Modal
          visible={showSaveConfirmModal}
          title="이 뉴스를 저장하시겠습니까?"
          onConfirm={handleConfirmSave}
          onClose={() => setShowSaveConfirmModal(false)}
        >
          <View className="flex-row gap-3 mt-6 mb-[-16px]">
            <TouchableOpacity
              className="flex-1 bg-white border border-[#006716] rounded-xl py-3"
              onPress={() => setShowSaveConfirmModal(false)}
            >
              <Text className="text-center text-[#006716] font-semibold">
                취소
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#006716] rounded-xl py-3"
              onPress={handleConfirmSave}
            >
              <Text className="text-white text-center font-semibold">
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* 저장 결과 모달 */}
        <Modal
          visible={showSaveResultModal}
          title={saveResultMessage}
          onConfirm={() => setShowSaveResultModal(false)}
          onClose={() => setShowSaveResultModal(false)}
        >
          <View className="mt-6 mb-[-16px]">
            <TouchableOpacity
              className="bg-[#006716] py-3 rounded-xl"
              onPress={() => setShowSaveResultModal(false)}
            >
              <Text className="text-white text-center font-semibold">
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};
