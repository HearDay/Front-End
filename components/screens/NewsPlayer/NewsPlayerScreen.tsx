import { Modal } from '@/components/common';
import { DiscussionLevelModal } from "../Discussion/DiscussionLevelModal";
import { DiscussionModal } from "../Discussion/DiscussionModal";

import { useAudio } from "@/contexts/AudioContext";
import { usePlaylistStore } from "@/stores/playlistStore";
import { useNewsPlaybackStore, NewsArticle } from "@/stores/newsPlaybackStore";
import { useAutoPlayArticles } from "@/hooks/useAutoPlayArticles";
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

      let wordTimings: Array<{ word: string; startTime: number; endTime: number }> = [];

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

  useEffect(() => {
    if (isTransitioningToAutoPlay) {
      return;
    }

    if (!isAutoPlayMode || !autoPlayData?.pages) {
      return;
    }

    const currentPage = autoPlayData.pages[autoPlayData.pages.length - 1];

    if (currentPage?.data && currentPage.data.length > 0) {
      const currentState = useNewsPlaybackStore.getState();
      const pageNumber = autoPlayData.pages.length;

      if (currentState.currentAutoPlayPage === pageNumber && currentState.autoPlayArticles.length > 0) {
        return;
      }

      const articles: NewsArticle[] = currentPage.data.map((article: any) => ({
        id: String(article.id),
        title: article.title,
        imageUrl: article.imageUrl,
        summary: article.description,
        category: article.category,
      }));

      setAutoPlayArticles(articles, pageNumber);
    }
  }, [autoPlayData, isAutoPlayMode, isTransitioningToAutoPlay, setAutoPlayArticles]);

  useEffect(() => {
    const handleAudioEnd = async () => {
      if (!isPlayingRecommended && !isAutoPlayMode) {
        return;
      }

      handleNewsEnd();

      await new Promise(resolve => setTimeout(resolve, 100));

      const updatedState = useNewsPlaybackStore.getState();

      if (updatedState.isAutoPlayMode && !updatedState.isTransitioningToAutoPlay && isLastArticleInPage()) {
        if (hasNextPage && !isFetchingNextPage) {
          await fetchNextPage();
        } else if (!hasNextPage) {
          router.push('/(tabs)');
          return;
        }
      }

      let nextArticleId = getNextArticleId();

      if (!nextArticleId && updatedState.isAutoPlayMode && updatedState.isTransitioningToAutoPlay) {
        try {
          const { fetchArticlesWithPagination } = await import('@/services/api/articles');
          const articlesData = await fetchArticlesWithPagination(0, 100);

          if (articlesData && articlesData.length > 0) {
            const recommendedIds = updatedState.recommendedArticles.map(article => article.id);

            const filteredData = articlesData.filter((article: any) => {
              const articleIdStr = String(article.id);
              const isExcluded = recommendedIds.includes(articleIdStr);
              return !isExcluded;
            });

            const articles: NewsArticle[] = filteredData.map((article: any) => ({
              id: String(article.id),
              title: article.title,
              imageUrl: article.imageUrl,
              summary: article.description,
              category: article.category,
            }));

            setAutoPlayArticles(articles, 1);

            nextArticleId = getNextArticleId();

            if (nextArticleId) {
              completeTransitionToAutoPlay();
            } else {
              alert('자동 재생 데이터를 불러왔지만 기사를 찾을 수 없습니다.');
              return;
            }
          } else {
            alert('자동 재생할 기사가 없습니다.');
            return;
          }
        } catch (error) {
          alert('자동 재생 데이터를 불러오지 못했습니다.');
          return;
        }
      }

      if (!nextArticleId && !updatedState.isAutoPlayMode) {
        if (updatedState.isTransitioningToAutoPlay) {
          return;
        }
        router.push('/(tabs)');
        return;
      }

      if (nextArticleId) {
        const currentState = useNewsPlaybackStore.getState();
        if (!currentState.isAutoPlayMode && isPlayingRecommended) {
          const { addCompletedNewsId } = await import('@/stores/todayNewsStore').then(m => m.useTodayNewsStore.getState());
          addCompletedNewsId(articleId);
        }

        const nextMode = currentState.isAutoPlayMode ? 'auto' : 'recommended';
        const fromParam = from || 'todaynews';

        router.replace(`/newsplayer/${nextArticleId}?mode=${nextMode}&from=${fromParam}`);
      } else {
        const finalState = useNewsPlaybackStore.getState();
        if (finalState.isTransitioningToAutoPlay) {
          return;
        }
        router.push('/(tabs)');
      }
    };

    setOnAudioEnd(handleAudioEnd);

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

  const handleBack = useCallback(async () => {
    if (isAutoPlayMode && from === "todaynews") {
      return router.push("/(tabs)");
    }

    if (isPlayingRecommended && from === "todaynews") {
      const { setPendingReturn, addCompletedNewsId, setLastViewedNewsId } = await import('@/stores/todayNewsStore').then(m => m.useTodayNewsStore.getState());

      addCompletedNewsId(articleId);
      setLastViewedNewsId(articleId);
      setPendingReturn(true);

      return router.push("/(tabs)");
    }

    if (from === "savednews") {
      return router.push("/(tabs)/savednews");
    }

    if (from === "home") {
      return router.push("/(tabs)");
    }

    if (from === "category") {
      return router.push({
        pathname: "/SearchNewsPage",
        params: { category: category || "전체" },
      });
    }

    router.back();
  }, [router, from, isPlayingRecommended, isAutoPlayMode, mode, category, articleId]);

  const handlePlay = useCallback(async () => play(), [play]);
  const handlePause = useCallback(async () => pause(), [pause]);

  const handleNext = useCallback(async () => {
    if (isPlayingRecommended || isAutoPlayMode) {
      handleNewsEnd();

      await new Promise(resolve => setTimeout(resolve, 100));
      const updatedState = useNewsPlaybackStore.getState();

      let nextId = getNextArticleId();

      if (!nextId && updatedState.isAutoPlayMode && updatedState.isTransitioningToAutoPlay) {
        try {
          const { fetchArticlesWithPagination } = await import('@/services/api/articles');
          const articlesData = await fetchArticlesWithPagination(0, 100);

          if (articlesData && articlesData.length > 0) {
            const recommendedIds = updatedState.recommendedArticles.map(article => article.id);

            const filteredData = articlesData.filter((article: any) => {
              const articleIdStr = String(article.id);
              const isExcluded = recommendedIds.includes(articleIdStr);
              return !isExcluded;
            });

            const articles: NewsArticle[] = filteredData.map((article: any) => ({
              id: String(article.id),
              title: article.title,
              imageUrl: article.imageUrl,
              summary: article.description,
              category: article.category,
            }));

            setAutoPlayArticles(articles, 1);
            nextId = getNextArticleId();

            if (nextId) {
              completeTransitionToAutoPlay();
            } else {
              alert('자동 재생 데이터를 불러왔지만 기사를 찾을 수 없습니다.');
              return;
            }
          } else {
            alert('자동 재생할 기사가 없습니다.');
            return;
          }
        } catch (error) {
          alert('자동 재생 데이터를 불러오지 못했습니다.');
          return;
        }
      }

      if (nextId) {
        const nextMode = useNewsPlaybackStore.getState().isAutoPlayMode ? 'auto' : 'recommended';
        const fromParam = from || 'todaynews';
        router.replace(`/newsplayer/${nextId}?mode=${nextMode}&from=${fromParam}`);
      }
      return;
    }

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
    if (isPlayingRecommended) {
      if (currentRecommendedIndex > 0 && recommendedArticles.length > 0) {
        const prevArticle = recommendedArticles[currentRecommendedIndex - 1];

        const { useNewsPlaybackStore: store } = require('@/stores/newsPlaybackStore');
        store.setState({ currentRecommendedIndex: currentRecommendedIndex - 1 });

        const fromParam = from || 'todaynews';
        router.replace(`/newsplayer/${prevArticle.id}?mode=recommended&from=${fromParam}`);
      }
      return;
    }

    if (isAutoPlayMode) {
      if (currentAutoPlayIndex > 0 && autoPlayArticles.length > 0) {
        const prevArticle = autoPlayArticles[currentAutoPlayIndex - 1];

        const { useNewsPlaybackStore: store } = require('@/stores/newsPlaybackStore');
        store.setState({ currentAutoPlayIndex: currentAutoPlayIndex - 1 });

        const fromParam = from || 'todaynews';
        router.replace(`/newsplayer/${prevArticle.id}?mode=auto&from=${fromParam}`);
      }
      return;
    }

    if (isPlaylistMode) {
      const prevId = goToPrev();
      if (prevId) {
        router.replace(`/newsplayer/${prevId}?playlist=true`);
      }
    } else {
      if (currentIndex > 0) {
        const prevArticleId = recentArticles[currentIndex - 1];

        const fromParam = from || 'home';
        const categoryParam = category ? `&category=${category}` : '';
        router.replace(`/newsplayer/${prevArticleId}?from=${fromParam}${categoryParam}`);
      }
    }
  }, [isPlayingRecommended, isAutoPlayMode, isPlaylistMode, goToPrev, currentIndex, recentArticles, router, autoPlayArticles, currentAutoPlayIndex, recommendedArticles, currentRecommendedIndex, from, category]);

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

        <TouchableOpacity
          className="flex-1"
          activeOpacity={0.9}
          onPress={() => router.push(`/newsarticle/${articleId}`)}
        >
          <NewsImagePlaceholder imageUrl={newsData.imageUrl} />
          <LyricsDisplay currentLines={currentLines} />
        </TouchableOpacity>

        <AudioControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        <BottomActions
          isCarMode={isCarMode}
          onCarModeToggle={handleCarModeToggle}
          onDiscussionPress={handleDiscussion}
          onSavePress={handleSave}
        />

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

        {selectedMode && (
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

              router.push(
                `${target}?articleId=${articleId}&mode=${selectedMode}&level=${level}`
              );
              setShowLevelModal(false);
            }}
          />
        )}

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
