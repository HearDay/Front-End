import { Modal } from '@/components/common';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
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
  newsId: string;
}

export const NewsPlayerScreen = ({ newsId }: NewsPlayerScreenProps) => {
  const router = useRouter();
  const [newsData, setNewsData] = useState<NewsPlayerData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCarMode, setIsCarMode] = useState(false);
  const [showDiscussionModal, setShowDiscussionModal] = useState(false);
  const [currentLines, setCurrentLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  // 모달 상태 추가
  const [showCarModeErrorModal, setShowCarModeErrorModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [showSaveResultModal, setShowSaveResultModal] = useState(false);
  const [saveResultMessage, setSaveResultMessage] = useState('');

  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await newsService.getNewsDetail(newsId);
      setNewsData(response);
    } catch (err) {
      setError('뉴스를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  useEffect(() => {
    if (!newsData) return;
    const allLines = newsData.fullText.split('\n');
    const displayLines = allLines.slice(currentLineIndex, currentLineIndex + 3);
    setCurrentLines(displayLines);
  }, [newsData, currentLineIndex]);

  const loadAudio = useCallback(async () => {
    if (!newsData?.audioUrl) return;
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: newsData.audioUrl },
        { shouldPlay: true }
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.durationMillis) {
          setIsPlaying(status.isPlaying);
          const totalLines = newsData.fullText.split('\n').length;
          const progress = status.positionMillis / status.durationMillis;
          const lineIndex = Math.floor(progress * totalLines);
          if (lineIndex !== currentLineIndex) {
            setCurrentLineIndex(lineIndex);
          }
        }
      });
    } catch (err) {
      console.error('오디오 로드 실패:', err);
    }
  }, [newsData, currentLineIndex]);

  useEffect(() => {
    if (newsData) {
      loadAudio();
    }
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [newsData, loadAudio]);

  const handleBack = useCallback(() => router.back(), [router]);

  const handlePlay = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    } catch (err) {
      console.error('재생 실패:', err);
    }
  }, []);

  const handlePause = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } catch (err) {
      console.error('일시정지 실패:', err);
    }
  }, []);

  const handleNext = useCallback(() => console.log('다음 기사'), []);
  const handlePrev = useCallback(() => console.log('이전 기사'), []);

  const handleCarModeToggle = useCallback(async () => {
    const newCarMode = !isCarMode;
    setIsCarMode(newCarMode);
    try {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        interruptionModeIOS: newCarMode ? 1 : 0,
        shouldDuckAndroid: newCarMode,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      setShowCarModeErrorModal(true);
    }
  }, [isCarMode]);

  const handleDiscussion = useCallback(() => setShowDiscussionModal(true), []);

  const handleDiscussionStart = useCallback((type: 'voice' | 'chat') => {
    setShowDiscussionModal(false);
    router.push('/(tabs)/AiPage');
  }, [router]);

  const handleSave = useCallback(() => {
    setShowSaveConfirmModal(true);
  }, []);

  const handleConfirmSave = useCallback(async () => {
    setShowSaveConfirmModal(false);
    try {
      await newsService.saveNews(newsId);
      setSaveResultMessage('뉴스가 저장되었습니다!');
      setShowSaveResultModal(true);
    } catch (error) {
      setSaveResultMessage('저장에 실패했습니다.');
      setShowSaveResultModal(true);
    }
  }, [newsId]);

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
        <NewsPlayerHeader title={newsData.title} onBack={handleBack} />
        <TouchableOpacity onPress={() => router.push(`/newsarticle/${newsId}`)}>
          <NewsImagePlaceholder imageUrl={newsData.imageUrl} />
          <LyricsDisplay currentLines={currentLines} />
        </TouchableOpacity>
        <View className="flex-1" />
        <AudioControls isPlaying={isPlaying} onPlay={handlePlay} onPause={handlePause} onNext={handleNext} onPrev={handlePrev} />
        <BottomActions isCarMode={isCarMode} onCarModeToggle={handleCarModeToggle} onDiscussionPress={handleDiscussion} onSavePress={handleSave} />
        
        {/* 토론 모달 */}
        <Modal visible={showDiscussionModal} title="방금 들은 뉴스로 AI와 토론하시겠어요?" onConfirm={() => {}} onClose={() => setShowDiscussionModal(false)}>
          <View className="gap-3">
            <TouchableOpacity className="bg-[#DBFDE0] py-4 rounded-2xl" onPress={() => handleDiscussionStart('voice')} activeOpacity={0.7}>
              <Text className="text-center font-medium">음성으로 토론하러 가기</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#DBFDE0] py-4 rounded-2xl" onPress={() => handleDiscussionStart('chat')} activeOpacity={0.7}>
              <Text className="text-center font-medium">채팅으로 토론하러 가기</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-[#DBFDE0] py-4 rounded-2xl" onPress={() => setShowDiscussionModal(false)} activeOpacity={0.7}>
              <Text className="text-center font-medium">다음에 하기</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* 차량 모드 에러 모달 */}
        <Modal visible={showCarModeErrorModal} title="오디오 모드 설정에 실패했습니다. iOS 시뮬레이터에서는 지원되지 않을 수 있습니다." onConfirm={() => setShowCarModeErrorModal(false)} onClose={() => setShowCarModeErrorModal(false)}>
          <TouchableOpacity className="bg-[#006716] py-3 rounded-xl" onPress={() => setShowCarModeErrorModal(false)}>
            <Text className="text-white text-center font-semibold">확인</Text>
          </TouchableOpacity>
        </Modal>

        {/* 저장 확인 모달 */}
        <Modal visible={showSaveConfirmModal} title="이 뉴스를 저장하시겠습니까?" onConfirm={handleConfirmSave} onClose={() => setShowSaveConfirmModal(false)}>
          <View className="flex-row gap-3 mt-6">
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
           <TouchableOpacity className="bg-[#006716] py-3 rounded-xl" onPress={() => setShowSaveResultModal(false)}>
            <Text className="text-white text-center font-semibold">확인</Text>
          </TouchableOpacity>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};