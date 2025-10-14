import TopBar from '@/components/common/TopBar'
import { discussionService, newsService } from '@/services'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DiscussionNewsItem, DiscussionRecordItem } from '../../../types/screens'
import { DiscussionActionButtons } from './DiscussionActionButtons'
import { DiscussionHeader } from './DiscussionHeader'
import { DiscussionModal } from './DiscussionModal'
import { DiscussionNewsList } from './DiscussionNewsList'
import { DiscussionRecordCard } from './DiscussionRecordCard'
import { DiscussionRecordList } from './DiscussionRecordList'

export function DiscussionScreen() {
  const router = useRouter()
  const [activeButton, setActiveButton] = useState<'discussion' | 'record'>('discussion')
  
  // '토론하기' 탭 상태
  const [viewedNews, setViewedNews] = useState<DiscussionNewsItem[]>([])
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'views'>('latest')
  
  // '기록보기' 탭 상태
  const [discussionRecords, setDiscussionRecords] = useState<DiscussionRecordItem[]>([])

  // 공통 상태
  const [showModal, setShowModal] = useState(false)
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 내가 본 뉴스 데이터 로드
  const fetchViewedNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await newsService.getViewedNews(sortBy)
      setViewedNews(response)
    } catch (err) {
      setError('뉴스 목록을 불러올 수 없습니다.')
      console.error('뉴스 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  // 토론 기록 데이터 로드
  const fetchDiscussionRecords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await discussionService.getDiscussionRecords()
      setDiscussionRecords(response)
    } catch (err) {
      setError('토론 기록을 불러올 수 없습니다.')
      console.error('토론 기록 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // '토론하기' 탭 데이터 로드
  useEffect(() => {
    if (activeButton === 'discussion') {
      fetchViewedNews();
    }
  }, [activeButton, sortBy, fetchViewedNews]);

  // '기록보기' 탭 데이터 로드
  useEffect(() => {
    if (activeButton === 'record') {
      fetchDiscussionRecords();
    }
  }, [activeButton, fetchDiscussionRecords]);


  const handleDiscussionPress = () => {
    setActiveButton('discussion')
  }

  const handleRecordPress = () => {
    setActiveButton('record')
  }

  const handleNewsPress = useCallback((newsId: string) => {
    setSelectedNewsId(newsId)
    setShowModal(true)
  }, [])

  const handleStartDiscussion = useCallback(async (type: 'voice' | 'chat', newsId: string) => {
    try {
      setShowModal(false)
      const discussion = await discussionService.createDiscussion(newsId, type)
      console.log('토론 시작:', discussion)
      router.push('/(tabs)/AiPage')
    } catch (error) {
      console.error('토론 생성 실패:', error)
      alert('토론을 시작할 수 없습니다.')
    }
  }, [router])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5FCE9] justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-500 mt-4">데이터를 불러오는 중...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5FCE9] justify-center items-center px-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={activeButton === 'discussion' ? fetchViewedNews : fetchDiscussionRecords}
          className="bg-green-600 px-6 py-3 rounded-xl"
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold">다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F5FCE9]">
      <View style={{ marginTop: -8 }}>
        <TopBar showBackButton={false} />
      </View>

      <DiscussionHeader />

      <View className="my-2">
        <DiscussionActionButtons
          activeButton={activeButton}
          onDiscussionPress={handleDiscussionPress}
          onRecordPress={handleRecordPress}
        />
      </View>

      {activeButton === 'discussion' ? (
        <DiscussionNewsList
          news={viewedNews}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onNewsPress={handleNewsPress}
        />
      ) : (
        <DiscussionRecordList records={discussionRecords} />
      )}

      <DiscussionModal
        visible={showModal}
        newsId={selectedNewsId}
        onClose={() => setShowModal(false)}
        onStartDiscussion={handleStartDiscussion}
      />
    </SafeAreaView>
  )
}