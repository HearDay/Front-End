import { Modal } from '@/components/common';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router'; // ✅ 확인
import { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsPlayerData } from '../../../types/screens';
import { AudioControls } from './AudioControls';
import { BottomActions } from './BottomActions';
import { LyricsDisplay } from './LyricsDisplay';
import { NewsImagePlaceholder } from './NewsImagePlaceholder';
import { NewsPlayerHeader } from './NewsPlayerHeader';

interface NewsTestProps {
  newsId: string
}

export function NewsTest({ newsId }: NewsTestProps) {
  const router = useRouter() // ✅ 확인
  
  console.log('=== NewsTest 렌더링 ===')
  console.log('newsId:', newsId)
  console.log('router:', router)
  console.log('router 타입:', typeof router)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isCarMode, setIsCarMode] = useState(false)
  const [showDiscussionModal, setShowDiscussionModal] = useState(false)

  const newsData: NewsPlayerData = {
    id: newsId,
    title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
    imageUrl: 'https://via.placeholder.com/400x300',
    audioUrl: 'dummy-audio-url',
    fullText: '오픈AI가 개인정보 보호 강화를 위해\n차세대 개발한 개인정보 필터를\n내년 오픈소스로 공개하겠다고 밝혔습니다.',
  }

  const currentLines = newsData.fullText.split('\n')

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
    console.log('재생 시작')
  }, [])

  const handlePause = useCallback(() => {
    setIsPlaying(false)
    console.log('일시정지')
  }, [])

  const handleNext = useCallback(() => {
    console.log('다음 기사')
  }, [])

  const handlePrev = useCallback(() => {
    console.log('이전 기사')
  }, [])

  const handleCarModeToggle = useCallback(() => {
    setIsCarMode(prev => !prev)
    console.log('차량 모드:', !isCarMode ? 'ON' : 'OFF')
  }, [isCarMode])

  const handleDiscussion = useCallback(() => {
    setShowDiscussionModal(true)
  }, [])

  const handleDiscussionStart = useCallback((type: 'voice' | 'chat') => {
    setShowDiscussionModal(false)
    console.log('토론 시작:', type)
    router.push('/(tabs)/AiPage')
  }, [router])

  const handleSave = useCallback(() => {
    console.log('저장 완료:', newsId)
    Alert.alert('저장 완료', '뉴스가 저장되었습니다!')
  }, [newsId])

  const handleGoToArticle = useCallback(() => {
    console.log('=== handleGoToArticle 호출 ===')
    console.log('router 존재:', !!router)
    
    if (!router) {
      console.error('router가 없습니다!')
      Alert.alert('오류', 'router가 초기화되지 않았습니다.')
      return
    }
    
    try {
      const route = `/newsarticle/${newsId}` as const
      console.log('이동할 라우트:', route)
      router.push(route)
      console.log('router.push 완료')
    } catch (error) {
      console.error('라우팅 에러:', error)
      Alert.alert('오류', '기사로 이동할 수 없습니다.')
    }
  }, [router, newsId])

  return (
    <LinearGradient
      colors={['#FFFEF0', '#E8F5E9', '#C8E6C9']}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <NewsPlayerHeader
          title={newsData.title}
          onBack={handleBack}
        />

        <NewsImagePlaceholder 
          imageUrl={newsData.imageUrl}
          onPress={handleGoToArticle}
        />

        <LyricsDisplay 
          currentLines={currentLines}
          onPress={handleGoToArticle}
        />

        <View className="flex-1" />

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
              className="bg-gray-100 py-4 rounded-2xl"
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