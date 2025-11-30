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
    setAutoPlayArticles,
    isLastArticleInPage,
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
    fetchRecentArticles();
  }, [fetchNewsData, fetchRecentArticles]);

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
  useEffect(() => {
    if (!isAutoPlayMode || !autoPlayData?.pages) return;

    const currentPage = autoPlayData.pages[autoPlayData.pages.length - 1];

    if (currentPage?.data && currentPage.data.length > 0) {
      const articles: NewsArticle[] = currentPage.data.map((article: any) => ({
        id: String(article.id),
        title: article.title,
        imageUrl: article.imageUrl,
        summary: article.description,
        category: article.category,
      }));

      const pageNumber = autoPlayData.pages.length;

      console.log('[NewsPlayer] TanStack Query 데이터 -> Zustand 스토어 동기화:', {
        pageNumber,
        articlesCount: articles.length,
      });

      setAutoPlayArticles(articles, pageNumber);
    }
  }, [autoPlayData, isAutoPlayMode, setAutoPlayArticles]);

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

      // 먼저 다음 기사 ID를 미리 계산 (handleNewsEnd 전에!)
      const currentState = useNewsPlaybackStore.getState();
      let preCalculatedNextId: string | null = null;

      if (currentState.isPlayingRecommended) {
        const nextIdx = currentState.currentRecommendedIndex + 1;
        if (nextIdx < currentState.recommendedArticles.length) {
          preCalculatedNextId = currentState.recommendedArticles[nextIdx].id;
          console.log('[NewsPlayer] 다음 추천 기사 미리 계산:', preCalculatedNextId);
        }
      }

      // Zustand에 뉴스 종료 알림 (상태 업데이트)
      handleNewsEnd();

      // 잠시 대기하여 상태 업데이트 반영
      await new Promise(resolve => setTimeout(resolve, 100));

      // 자동재생 모드일 때: 현재 페이지의 마지막 기사면 다음 페이지 로드
      if (isAutoPlayMode && isLastArticleInPage()) {
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

      // 다음 기사 ID 가져오기 (미리 계산한 값이 있으면 사용)
      let nextArticleId = preCalculatedNextId || getNextArticleId();

      // 자동재생 모드로 막 전환되었고 데이터가 없는 경우, 재시도
      if (!nextArticleId && isAutoPlayMode) {
        console.log('[NewsPlayer] 자동재생 데이터 로딩 대기 중... (최대 3초)');

        for (let i = 0; i < 6; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          nextArticleId = getNextArticleId();

          if (nextArticleId) {
            console.log('[NewsPlayer] 자동재생 데이터 로드 완료');
            break;
          }
        }
      }

      if (nextArticleId) {
        // 현재 기사를 완료 처리하고 마지막 본 기사로 설정 (팝업에서 표시하기 위해)
        if (isPlayingRecommended) {
          const { addCompletedNewsId, setLastViewedNewsId } = await import('@/stores/todayNewsStore').then(m => m.useTodayNewsStore.getState());
          addCompletedNewsId(articleId);
          setLastViewedNewsId(nextArticleId); // 다음 기사를 마지막 본 기사로 설정
          console.log('[NewsPlayer] 현재 기사 완료 처리:', articleId);
          console.log('[NewsPlayer] 다음 기사를 마지막 본 기사로 설정:', nextArticleId);
        }

        console.log('[NewsPlayer] 다음 기사로 자동 이동:', nextArticleId);
        router.replace(`/newsplayer/${nextArticleId}?mode=auto`);
      } else {
        console.log('[NewsPlayer] 더 이상 재생할 기사 없음 - 홈으로 이동');
        router.push('/(tabs)');
      }
    };

    // 오디오 종료 콜백 등록
    setOnAudioEnd(handleAudioEnd);

    // 클린업: 컴포넌트 언마운트 시 콜백 해제
    return () => {
      setOnAudioEnd(null);
    };
  }, [isPlayingRecommended, isAutoPlayMode, mode, handleNewsEnd, getNextArticleId, isLastArticleInPage, hasNextPage, isFetchingNextPage, fetchNextPage, router, setOnAudioEnd]);

  // 뒤로가기
  const handleBack = useCallback(async () => {
    console.log('[NewsPlayer] 백버튼 클릭:', { from, isPlayingRecommended, mode });

    // 연속 재생 모드이면서 "오늘의 뉴스 팝업"에서 온 경우에만 팝업으로 돌아가기
    if ((isPlayingRecommended || mode === "recommended") && from === "todaynews") {
      console.log('[NewsPlayer] 오늘의 뉴스 팝업에서 왔음 - 팝업으로 돌아가기');

      // pendingReturn 설정하여 팝업이 다시 뜨도록
      const { setPendingReturn } = await import('@/stores/todayNewsStore').then(m => m.useTodayNewsStore.getState());
      setPendingReturn(true);

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
  }, [router, from, isPlayingRecommended, mode, category]);

  // 오디오 제어
  const handlePlay = useCallback(async () => play(), [play]);
  const handlePause = useCallback(async () => pause(), [pause]);

  const handleNext = useCallback(() => {
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
  }, [isPlaylistMode, goToNext, currentIndex, recentArticles, router]);

  const handlePrev = useCallback(() => {
    if (isPlaylistMode) {
      const prevId = goToPrev();
      if (prevId) {
        router.replace(`/newsplayer/${prevId}?playlist=true`);
      }
    } else {
      if (currentIndex > 0) {
        router.replace(`/newsplayer/${recentArticles[currentIndex - 1]}`);
      }
    }
  }, [isPlaylistMode, goToPrev, currentIndex, recentArticles, router]);

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
