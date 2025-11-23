import { Modal } from '@/components/common';
import { useAudio } from '@/contexts/AudioContext';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { newsService } from '../../../services';
import { NewsPlayerData } from '../../../types/screens';
import { AudioControls } from './AudioControls';
import { BottomActions } from './BottomActions';
import { LyricsDisplay } from './LyricsDisplay';
import { NewsImagePlaceholder } from './NewsImagePlaceholder';
import { NewsPlayerHeader } from './NewsPlayerHeader';

interface NewsPlayerScreenProps {
  articleId: string;
  from?: string;
}

export const NewsPlayerScreen = ({ articleId, from }: NewsPlayerScreenProps) => {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { isPlaying, loadAudio, play, pause } = useAudio();
  const [newsData, setNewsData] = useState<NewsPlayerData | null>(null);
  const [isCarMode, setIsCarMode] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 최근 본 기사 목록
  const [recentArticles, setRecentArticles] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // 모달 상태 추가
  const [showCarModeErrorModal, setShowCarModeErrorModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showSaveResultModal, setShowSaveResultModal] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState('');

  // 최근 본 기사 목록 가져오기
  const fetchRecentArticles = useCallback(async () => {
    try {
      const response = await newsService.getRecentArticles('RECENT');
      const articleIds = response.map(article => article.id);
      setRecentArticles(articleIds);

      // 현재 기사의 인덱스 찾기
      const index = articleIds.findIndex(id => id === parseInt(articleId));
      setCurrentIndex(index);
    } catch (err) {
      // 에러 발생 시 빈 배열 유지
    }
  }, [articleId]);

  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsService.getNewsDetail(articleId);
      setNewsData(response);
    } catch {
      setError('뉴스를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    fetchNewsData();
    fetchRecentArticles();
  }, [fetchNewsData, fetchRecentArticles]);

  useEffect(() => {
    if (!newsData) return;
    // 전체 텍스트를 currentLines에 배열로 설정 (LyricsDisplay에서 join으로 합침)
    setCurrentLines([newsData.fullText]);
  }, [newsData]);

  // 뉴스 데이터가 로드되면 오디오 로드
  useEffect(() => {
    if (newsData?.audioUrl) {
      loadAudio(newsData.audioUrl, articleId);
    }
  }, [newsData, articleId, loadAudio]);

  const handleBack = useCallback(() => {
    if (from === 'savednews') {
      router.push('/(tabs)/savednews');
    } else if (from === 'home') {
      router.push('/(tabs)');
    } else if (from === 'todaynews') {
      router.push(`/(tabs)?showTodayNews=true&newsId=${articleId}&from=todaynews`);
    } else if (from === 'category') {
      router.push({
        pathname: '/SearchNewsPage',
        params: { category: category || '전체' },
      });
    } else {
      router.back();
    }
  }, [router, from, articleId]);

  const handlePlay = useCallback(async () => {
    await play();
  }, [play]);

  const handlePause = useCallback(async () => {
    await pause();
  }, [pause]);

  const handleNext = useCallback(async () => {
    if (currentIndex === -1 || currentIndex >= recentArticles.length - 1) {
      return;
    }

    // 다음 기사로 이동 (오디오는 Context에서 자동으로 관리)
    const nextArticleId = recentArticles[currentIndex + 1];
    router.replace(`/newsplayer/${nextArticleId}`);
  }, [currentIndex, recentArticles, router]);

  const handlePrev = useCallback(async () => {
    if (currentIndex <= 0) {
      return;
    }

    // 이전 기사로 이동 (오디오는 Context에서 자동으로 관리)
    const prevArticleId = recentArticles[currentIndex - 1];
    router.replace(`/newsplayer/${prevArticleId}`);
  }, [currentIndex, recentArticles, router]);

  const handleCarModeToggle = useCallback(async () => {
    const newCarMode = !isCarMode;
    setIsCarMode(newCarMode);
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: newCarMode, // ON: 백그라운드 허용, OFF: 백그라운드 안됨
        interruptionModeIOS: newCarMode ? 1 : 0,
        shouldDuckAndroid: false, // 다른 앱 오디오와 겹치면 이 앱 오디오 끔
        playThroughEarpieceAndroid: false,
      });
    } catch {
      setShowCarModeErrorModal(true);
    }
  }, [isCarMode]);

  const handleDiscussion = useCallback(() => setShowDiscussionModal(true), []);

  const handleVoiceDiscussion = useCallback(() => {
    setShowDiscussionModal(false);
    router.push('/AIVoiceDebatePage');
  }, [router]);

  const handleChatDiscussion = useCallback(() => {
    setShowDiscussionModal(false);
    router.push('/AIChatDebatePage?mode=chat');
  }, [router]);

  const handleSave = useCallback(() => {
    setShowSaveConfirmModal(true);
  }, []);

  const handleQuiz = useCallback(() => {
    router.push(`/quiz/${articleId}`);
  }, [router, articleId]);

  const handleConfirmSave = useCallback(async () => {
    setShowSaveConfirmModal(false);
    try {
      await newsService.saveNews(articleId);
      setSaveResultMessage('뉴스가 저장되었습니다!');
      setShowSaveResultModal(true);
    } catch (error) {
      setSaveResultMessage('저장에 실패했습니다.');
      setShowSaveResultModal(true);
    }
  }, [articleId]);

  if (loading) {
    return (
      <LinearGradient colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-gray-600 mt-4">데이터를 불러오는 중...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity onPress={fetchNewsData} className="bg-green-600 px-6 py-3 rounded-xl" activeOpacity={0.7}>
            <Text className="text-white font-semibold">다시 시도</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!newsData) {
    return (
      <LinearGradient colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']} style={{ flex: 1 }}>
        <SafeAreaView className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">뉴스를 찾을 수 없습니다.</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1">
        <NewsPlayerHeader title={newsData.title} onBack={handleBack} onQuizPress={handleQuiz} />
        
        {/* 이미지와 가사를 포함하는 클릭 가능한 컨테이너 */}
        <TouchableOpacity
          className="flex-1"
          activeOpacity={0.9}
          onPress={() => router.push(`/newsarticle/${articleId}`)}
        >
          <NewsImagePlaceholder imageUrl={newsData.imageUrl} />
          
          {/* 가사를 중앙에 위치시키기 위한 View */}
          <View className="flex-1 justify-center">
            <LyricsDisplay currentLines={currentLines} />
          </View>
        </TouchableOpacity>

        <AudioControls isPlaying={isPlaying} onPlay={handlePlay} onPause={handlePause} onNext={handleNext} onPrev={handlePrev} />
        <BottomActions isCarMode={isCarMode} onCarModeToggle={handleCarModeToggle} onDiscussionPress={handleDiscussion} onSavePress={handleSave} />
        
        {/* 토론 모달 */}
        <Modal visible={showDiscussionModal} title="방금 들은 뉴스로 AI와 토론하시겠어요?" onConfirm={() => {}} onClose={() => setShowDiscussionModal(false)}>
          <View className="gap-3 mt-6 mb-[-16px]">
            <TouchableOpacity className="bg-[#DBFDE0] py-4 rounded-2xl" onPress={handleVoiceDiscussion} activeOpacity={0.7}>
              <Text className="text-center font-medium">음성으로 토론하러 가기</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#DBFDE0] py-4 rounded-2xl" onPress={handleChatDiscussion} activeOpacity={0.7}>
              <Text className="text-center font-medium">채팅으로 토론하러 가기</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#DBFDE0] py-4 rounded-2xl" onPress={() => setShowDiscussionModal(false)} activeOpacity={0.7}>
              <Text className="text-center font-medium">다음에 하기</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* 차량 모드 에러 모달 */}
        <Modal visible={showCarModeErrorModal} title="오디오 모드 설정에 실패했습니다. iOS 시뮬레이터에서는 지원되지 않을 수 있습니다." onConfirm={() => setShowCarModeErrorModal(false)} onClose={() => setShowCarModeErrorModal(false)}>
          <View className="mt-6 mb-[-16px]">
            <TouchableOpacity className="bg-[#006716] py-3 rounded-xl" onPress={() => setShowCarModeErrorModal(false)}>
              <Text className="text-white text-center font-semibold">확인</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* 저장 확인 모달 */}
        <Modal visible={showSaveConfirmModal} title="이 뉴스를 저장하시겠습니까?" onConfirm={handleConfirmSave} onClose={() => setShowSaveConfirmModal(false)}>
          <View className="flex-row gap-3 mt-6 mb-[-16px]">
            <TouchableOpacity className="flex-1 bg-white border border-[#006716] rounded-xl py-3" onPress={() => setShowSaveConfirmModal(false)}>
              <Text className="text-center text-[#006716] font-semibold">취소</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-[#006716] rounded-xl py-3" onPress={handleConfirmSave}>
              <Text className="text-white text-center font-semibold">확인</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* 저장 결과 모달 */}
        <Modal visible={showSaveResultModal} title={saveResultMessage} onConfirm={() => setShowSaveResultModal(false)} onClose={() => setShowSaveResultModal(false)}>
          <View className="mt-6 mb-[-16px]">
            <TouchableOpacity className="bg-[#006716] py-3 rounded-xl" onPress={() => setShowSaveResultModal(false)}>
              <Text className="text-white text-center font-semibold">확인</Text>
            </TouchableOpacity>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};