import { Modal } from '@/components/common';
import { DiscussionLevelModal } from "../Discussion/DiscussionLevelModal";
import { DiscussionModal } from "../Discussion/DiscussionModal";

import { useAudio } from "@/contexts/AudioContext";
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
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { isPlaying, currentPosition, loadAudio, play, pause } = useAudio();
  const { goToNext, goToPrev } = usePlaylistStore();

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

  // 뒤로가기
  const handleBack = useCallback(() => {
    if (from === "savednews") return router.push("/(tabs)/savednews");
    if (from === "home" || from === "todaynews") return router.push("/(tabs)");
    if (from === "category") {
      return router.push({
        pathname: "/SearchNewsPage",
        params: { category: category || "전체" },
      });
    }
    router.back();
  }, [router, from]);

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
