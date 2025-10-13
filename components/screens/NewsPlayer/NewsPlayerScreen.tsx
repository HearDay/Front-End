import { Modal } from '@/components/common';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react'; // 개선: useCallback 추가
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'; // 추가: ActivityIndicator
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsPlayerData } from '../../../types/screens';
import { AudioControls } from './AudioControls';
import { BottomActions } from './BottomActions';
import { LyricsDisplay } from './LyricsDisplay';
import { NewsImagePlaceholder } from './NewsImagePlaceholder';
import { NewsPlayerHeader } from './NewsPlayerHeader';


interface NewsPlayerScreenProps {
  newsId: string
}

export const NewsPlayerScreen = ({ newsId }: NewsPlayerScreenProps) => {
  // 상태 관리
  const router = useRouter() // 추가: 라우터
  const [newsData, setNewsData] = useState<NewsPlayerData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCarMode, setIsCarMode] = useState(false)
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)
  const [currentLines, setCurrentLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  
  // 추가: 로딩/에러 상태
  // 이유: API 호출 중 사용자 피드백 제공
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 개선: useCallback
  // 이유: useEffect 의존성 배열에 안전하게 사용
  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: 실제 API 호출
      // const response = await newsService.getNewsDetail(newsId)
      // setNewsData(response)
      
      console.log('뉴스 데이터 로드:', newsId)
      
    } catch (err) {
      setError('뉴스를 불러올 수 없습니다.')
      console.error('뉴스 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [newsId])

  // 뉴스 데이터 로드
  useEffect(() => {
    fetchNewsData()
  }, [fetchNewsData])

  // 3줄씩 표시 (오디오 진행에 따라)
  useEffect(() => {
    if (!newsData) return

    // TODO: 오디오 재생 위치에 따라 currentLines 업데이트
    const allLines = newsData.fullText.split('\n')
    const displayLines = allLines.slice(currentLineIndex, currentLineIndex + 3)
    setCurrentLines(displayLines)
  }, [newsData, currentLineIndex])

  // 개선: useCallback으로 이벤트 핸들러 
  // 이유: 자식 컴포넌트에 props로 전달되므로 불필요한 리렌더링 방지
  const handleBack = useCallback(() => {
    router.back() // 개선: router.back() 사용
  }, [router])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    // TODO: 오디오 재생 시작
    console.log('재생 시작:', newsData?.audioUrl)
  }, [newsData?.audioUrl])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    // TODO: 오디오 일시정지
    console.log('일시정지')
  }, [])

  const handleNext = useCallback(() => {
    console.log('다음 기사')
    // TODO: 다음 뉴스로 이동
  }, [])

  const handlePrev = useCallback(() => {
    console.log('이전 기사')
    // TODO: 이전 뉴스로 이동
  }, [])

  // 개선: useCallback 적용
  const handleCarModeToggle = useCallback(async () => {
    const newCarMode = !isCarMode
    setIsCarMode(newCarMode)
    
    try {
      if (newCarMode) {
        // 차량 모드 ON: 다른 오디오(네비 등) 나오면 볼륨 작게
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          interruptionModeIOS: 1, // DUCK_OTHERS
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        })
        console.log('차량 모드 ON')
      } else {
        // 차량 모드 OFF: 일반 모드
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          interruptionModeIOS: 0, // DO_NOT_MIX
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        })
        console.log('차량 모드 OFF')
      }
    } catch (error) {
      console.error('오디오 모드 설정 실패:', error)
    }
  }, [isCarMode])

  const handleDiscussion = useCallback(() => {
    setShowDiscussionModal(true)
  }, [])

  const handleDiscussionStart = useCallback((type: 'voice' | 'chat') => {
    setShowDiscussionModal(false)
    console.log('토론 시작:', type)
    // 개선: AI와 토론 탭으로 이동
    router.push('/(tabs)/AiPage')
  }, [router])

  const handleSave = useCallback(async () => {
    try {
      // TODO: 실제 API 호출
      // await newsService.saveNews(newsId)
      
      console.log('저장 완료:', newsId)
      alert('뉴스가 저장되었습니다!') 
            
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장에 실패했습니다.') // 추가: 에러 피드백
    }
  }, [newsId])

  // 추가: 로딩 상태 UI
  if (loading) {
    return (
      <LinearGradient
        colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#16a34a" />
          <Text className="text-gray-600 mt-4">뉴스를 불러오는 중...</Text>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  // 추가: 에러 상태 UI
  if (error) {
    return (
      <LinearGradient
        colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 justify-center items-center px-4">
          <Text className="text-red-500 text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={fetchNewsData}
            className="bg-green-600 px-6 py-3 rounded-xl"
            activeOpacity={0.7}
          >
            <Text className="text-white font-semibold">다시 시도</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  // 개선: 데이터 없음 상태 처리
  if (!newsData) {
    return (
      <LinearGradient
        colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 justify-center items-center">
          <Text className="text-gray-500 text-lg">뉴스를 찾을 수 없습니다.</Text>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient
      colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        {/* 헤더 */}
        <NewsPlayerHeader
          title={newsData.title}
          onBack={handleBack}
        />

        {/* 기사 이미지 */}
        <NewsImagePlaceholder imageUrl={newsData.imageUrl} />

        {/* 가사 (3줄) */}
        <LyricsDisplay currentLines={currentLines} />

        {/* Spacer */}
        <View className="flex-1" />

        {/* 재생 컨트롤 */}
        <AudioControls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onNext={handleNext}
          onPrev={handlePrev}
        />

        {/* 하단 액션 버튼 */}
        <BottomActions
          isCarMode={isCarMode}
          onCarModeToggle={handleCarModeToggle}
          onDiscussionPress={handleDiscussion}
          onSavePress={handleSave}
        />

        {/* 토론 모달 */}
        <Modal
          visible={showDiscussionModal}
          title="방금 들은 뉴스로 AI와 토론하시겠어요?"
          onConfirm={() => {}}
          onClose={() => setShowDiscussionModal(false)}
        >
          <View className="gap-3">
            <TouchableOpacity 
              className="bg-[#DBFDE0] py-4 rounded-2xl"
              onPress={() => handleDiscussionStart('voice')}
              activeOpacity={0.7}
            >
              <Text className="text-center font-medium">음성으로 토론하러 가기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-[#DBFDE0] py-4 rounded-2xl"
              onPress={() => handleDiscussionStart('chat')}
              activeOpacity={0.7}
            >
              <Text className="text-center font-medium">채팅으로 토론하러 가기</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="bg-gray-100 py-4 rounded-2xl" // 개선: 다른 버튼과 구분
              onPress={() => setShowDiscussionModal(false)}
              activeOpacity={0.7}
            >
              <Text className="text-center font-medium text-gray-600">다음에 하기</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  )
}