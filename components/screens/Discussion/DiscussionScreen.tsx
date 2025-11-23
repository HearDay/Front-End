import { Modal } from '@/components/common'
import TopBar from '@/components/common/TopBar'
import { discussionService, newsService } from '@/services'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { DiscussionNewsItem, DiscussionRecordItem } from '../../../types/screens'
import { DiscussionActionButtons } from './DiscussionActionButtons'
import { DiscussionHeader } from './DiscussionHeader'
import { DiscussionModal } from './DiscussionModal'
import { DiscussionNewsList } from './DiscussionNewsList'
import { DiscussionRecordList } from './DiscussionRecordList'

export function DiscussionScreen() {
  const router = useRouter()

  const [activeButton, setActiveButton] =
    useState<'discussion' | 'record'>('discussion')

  // 토론하기 탭
  const [viewedNews, setViewedNews] = useState<DiscussionNewsItem[]>([])
  const [sortBy, setSortBy] = useState<'latest' | 'oldest'>('latest')

  // 기록보기 탭
  const [discussionRecords, setDiscussionRecords] = useState<
    DiscussionRecordItem[]
  >([])
  const [recordSortBy, setRecordSortBy] =
    useState<'latest' | 'oldest'>('latest')

  // 공통
  const [showModal, setShowModal] = useState(false)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 내가 본 뉴스 가져오기
  const fetchViewedNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const apiSortBy =
        sortBy === 'latest' ? 'RECENT' : 'PUBLISH_DATE'
      const response = await newsService.getRecentArticles(apiSortBy)

      const transformed: DiscussionNewsItem[] = response.map(article => ({
        id: String(article.id),
        title: article.title,
        imageUrl: article.imageUrl,
        summary: article.description,
        viewedAt: article.updatedAt,
      }))

      setViewedNews(transformed)
    } catch {
      setError('뉴스 목록을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }, [sortBy])

  // 토론 기록 가져오기
  const fetchDiscussionRecords = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await discussionService.getDiscussionRecords(recordSortBy)
      setDiscussionRecords(response)
    } catch {
      setError('토론 기록을 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }, [recordSortBy])

  // 탭 전환 시 로드
  useEffect(() => {
    if (activeButton === 'discussion') fetchViewedNews()
  }, [activeButton, sortBy, fetchViewedNews])

  useEffect(() => {
    if (activeButton === 'record') fetchDiscussionRecords()
  }, [activeButton, recordSortBy, fetchDiscussionRecords])

  // 뉴스 → 토론 시작 모달
  const handleNewsPress = (articleId: string) => {
    setSelectedArticleId(articleId)
    setShowModal(true)
  }

  const handleStartDiscussion = async (
    type: 'voice' | 'chat',
    articleId: string
  ) => {
    try {
      setShowModal(false)
      router.push(
        `/AIVoiceDebatePage?articleId=${articleId}&mode=${type}`
      )
    } catch {
      setErrorMessage('토론을 시작할 수 없습니다.')
      setShowErrorModal(true)
    }
  }

  // 기록 클릭 → 기록 페이지로 이동 (수정 완료)
  const handleRecordItemPress = (discussionId: string | number) => {
    router.push(`/AIChatRecordPage?discussionId=${discussionId}`)
  }

  // 로딩 화면
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5FCE9] justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-500 mt-4">
          데이터를 불러오는 중...
        </Text>
      </SafeAreaView>
    )
  }

  // 에러 화면
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-[#F5FCE9] justify-center items-center px-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={
            activeButton === 'discussion'
              ? fetchViewedNews
              : fetchDiscussionRecords
          }
          className="bg-green-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  // 최종 렌더링
  return (
    <SafeAreaView
      className="flex-1 bg-[#F5FCE9]"
      edges={['left', 'right']}
    >
      <TopBar showBackButton={false} />

      <DiscussionHeader />

      <View className="my-2">
        <DiscussionActionButtons
          activeButton={activeButton}
          onDiscussionPress={() => setActiveButton('discussion')}
          onRecordPress={() => setActiveButton('record')}
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
        <DiscussionRecordList
          records={discussionRecords}
          sortBy={recordSortBy}
          onSortChange={setRecordSortBy}
          onRecordPress={handleRecordItemPress}
        />
      )}

      {/* 토론 모달 */}
      <DiscussionModal
        visible={showModal}
        articleId={selectedArticleId}
        onClose={() => setShowModal(false)}
        onStartDiscussion={handleStartDiscussion}
      />

      {/* 에러 모달 */}
      <Modal
        visible={showErrorModal}
        title={errorMessage}
        onConfirm={() => setShowErrorModal(false)}
        onClose={() => setShowErrorModal(false)}
        confirmText="확인"
      />
    </SafeAreaView>
  )
}
