//AI 도움 여기 조금 손 봐야할

import { Modal } from '@/components/common'
import { Audio } from 'expo-av'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NewsPlayerData } from '../../../types/screens'
import { AudioControls } from './AudioControls'
import { BottomActions } from './BottomActions'
import { LyricsDisplay } from './LyricsDisplay'
import { NewsImagePlaceholder } from './NewsImagePlaceholder'
import { NewsPlayerHeader } from './NewsPlayerHeader'

interface NewsPlayerScreenProps {
  newsId: string  // 외부에서 뉴스 ID 받기
}

export const NewsPlayerScreen = ({ newsId }: NewsPlayerScreenProps) => {
  // 상태 관리
  const [newsData, setNewsData] = useState<NewsPlayerData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCarMode, setIsCarMode] = useState(false)
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)
  const [currentLines, setCurrentLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)

  // 뉴스 데이터 로드
  useEffect(() => {
    fetchNewsData()
  }, [newsId])

  const fetchNewsData = async () => {
    try {
      // TODO: API 호출
      // const response = await newsService.getNewsDetail(newsId);
      // setNewsData(response);
      
      console.log('뉴스 데이터 로드:', newsId)
    } catch (error) {
      console.error('뉴스 로드 실패:', error)
    }
  };

  // 3줄씩 표시 (오디오 진행에 따라)
  useEffect(() => {
    if (!newsData) return

    // TODO: 오디오 재생 위치에 따라 currentLines 업데이트
    // 전체 텍스트를 3줄씩 나눠서 표시
    const allLines = newsData.fullText.split('\n')
    const displayLines = allLines.slice(currentLineIndex, currentLineIndex + 3)
    setCurrentLines(displayLines)
  }, [newsData, currentLineIndex])

  const handleBack = () => {
    console.log('뒤로가기')
    // TODO: 이전 화면으로 navigation.goBack()
  };

  const handlePlay = () => {
    setIsPlaying(true)
    // TODO: 오디오 재생 시작
    console.log('재생 시작:', newsData?.audioUrl)
  }

  const handlePause = () => {
    setIsPlaying(false)
    // TODO: 오디오 일시정지
    console.log('일시정지')
  }

  const handleNext = () => {
    console.log('다음 기사')
    // TODO: 다음 뉴스로 이동
  }

  const handlePrev = () => {
    console.log('이전 기사')
    // TODO: 이전 뉴스로 이동
  }

  const handleCarModeToggle = async () => {
  const newCarMode = !isCarMode
  setIsCarMode(newCarMode)
  
  try {
    if (newCarMode) {
      // 차량 모드 ON: 다른 오디오(네비 등) 나오면 볼륨 작게
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        interruptionModeIOS: 1 , // 0은 중단, 1은 작게, 2는 유지  DUCK_OTHERS
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      })
      console.log('차량 모드 ON: 네비 소리 나오면 자동으로 작아짐')
    } else {
      // 차량 모드 OFF: 일반 모드
      await Audio.setAudioModeAsync({
        staysActiveInBackground: true,
        interruptionModeIOS: 0, //DO_NOT_MIX
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      })
      console.log('차량 모드 OFF')
    }
  } catch (error) {
    console.error('오디오 모드 설정 실패:', error)
  }
}

  const handleDiscussion = () => {
    setShowDiscussionModal(true)
  }

  const handleDiscussionStart = (type: 'voice' | 'chat') => {
    setShowDiscussionModal(false)
    console.log('토론 시작:', type)
    // TODO: 토론 화면으로 이동
  }

  const handleSave = async () => {
    try {
      // TODO: 저장 API 호출
      // await newsService.saveNews(newsId);
      console.log('저장 완료:', newsId)
      // TODO: 저장 탭으로 이동
    } catch (error) {
      console.error('저장 실패:', error)
    }
  }

  // 로딩 중
  if (!newsData) {
    return (
      <SafeAreaView className="flex-1 bg-yellow-50 justify-center items-center">
        <Text className="text-lg">로딩 중...</Text>
      </SafeAreaView>
    )
  }

  return (
    <LinearGradient
       colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']}
       className='flex-1'>
        <SafeAreaView className='flex-1'>
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
      <View className='flex-1' />

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
        onConfirm={() => {}} // 빈 함수 (사용 안 함)
        onClose={() => setShowDiscussionModal(false)}
      >
        <View className="gap-3">
          <TouchableOpacity 
            className="bg-[#DBFDE0] py-4 rounded-2xl"
            onPress={() => handleDiscussionStart('voice')}
          >
            <Text className="text-center font-medium">음성으로 토론하러 가기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-[#DBFDE0] py-4 rounded-2xl"
            onPress={() => handleDiscussionStart('chat')}
          >
            <Text className="text-center font-medium">채팅으로 토론하러 가기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-[#DBFDE0] py-4 rounded-2xl"
            onPress={() => setShowDiscussionModal(false)}
          >
            <Text className="text-center font-medium">다음에 하기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};