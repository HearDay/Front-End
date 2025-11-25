import { Modal } from '@/components/common';
import { DiscussionLevelModal } from "../Discussion/DiscussionLevelModal";
import { DiscussionModal } from "../Discussion/DiscussionModal";

import { useAudio } from "@/contexts/AudioContext";
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
}

export const NewsPlayerScreen = ({
  articleId,
  from,
}: NewsPlayerScreenProps) => {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { isPlaying, loadAudio, play, pause } = useAudio();

  const [newsData, setNewsData] = useState<NewsPlayerData | null>(null);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    if (newsData?.fullText) {
      setCurrentLines([newsData.fullText]);
    }
  }, [newsData]);

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
    if (currentIndex < recentArticles.length - 1) {
      router.replace(`/newsplayer/${recentArticles[currentIndex + 1]}`);
    }
  }, [currentIndex, recentArticles]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      router.replace(`/newsplayer/${recentArticles[currentIndex - 1]}`);
    }
  }, [currentIndex, recentArticles]);

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
