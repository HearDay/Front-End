import { CategoryChipGroup, Modal } from '@/components/common'
import TopBar from '@/components/common/TopBar'
import { newsService } from '@/services'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SavedNewsItem } from '../../../types/screens'
import { SavedNewsList } from './SavedNewsList'

export function SavedNewsScreen() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>('전체')
  const [savedNews, setSavedNews] = useState<SavedNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 삭제 확인 모달 관련 상태
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null)
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false)

  const fetchSavedNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await newsService.getSavedNews()

      // ArticleData를 SavedNewsItem으로 변환
      const savedNewsItems: SavedNewsItem[] = response.map(article => ({
        id: String(article.id),
        title: article.title,
        summary: article.description,
        imageUrl: article.imageUrl,
        category: article.category,
        savedAt: article.updatedAt,
      }))

      setSavedNews(savedNewsItems)
    } catch (err) {
      setError('저장된 뉴스를 불러올 수 없습니다.')
      console.error('저장된 뉴스 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSavedNews()
  }, [fetchSavedNews])

  const filteredNews = useMemo(() => {
    return savedNews.filter(news => {
      const categoryMatch = selectedCategory === '전체' || news.category === selectedCategory
      return categoryMatch
    })
  }, [savedNews, selectedCategory])

  const handleNewsPress = useCallback((articleId: string) => {
    router.push(`/newsplayer/${articleId}?from=savednews`)
  }, [router])

  // 삭제 버튼 클릭 시 모달을 띄우는 함수
  const handleDeletePress = useCallback((articleId: string) => {
    setDeletingNewsId(articleId)
    setShowDeleteConfirmModal(true)
  }, [])

  // 모달에서 '확인'을 눌렀을 때 실제 삭제를 실행하는 함수
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingNewsId) return
    try {
      await newsService.deleteSavedNews(deletingNewsId)
      setSavedNews(prev => prev.filter(news => news.id !== deletingNewsId))
    } catch (error) {
      console.error('삭제 실패:', error)
      setShowDeleteErrorModal(true)
    } finally {
      setShowDeleteConfirmModal(false)
      setDeletingNewsId(null)
    }
  }, [deletingNewsId])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-500 mt-4">저장된 뉴스를 불러오는 중...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchSavedNews}
          className="bg-green-600 px-6 py-3 rounded-xl"
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold">다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom', 'left', 'right']}>
      <TopBar showBackButton={false} />

      <View className="-mt-8 -mb-2">
      <CategoryChipGroup
        categories={['전체', '경제', '방송/연예', 'IT', '쇼핑', '생활', '해외', '스포츠', '정치']}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      </View>

      <SavedNewsList
        newsList={filteredNews}
        onNewsPress={handleNewsPress}
        onDelete={handleDeletePress}
      />

      {/* 삭제 확인 모달 */}
      <Modal
        visible={showDeleteConfirmModal}
       title={`이 뉴스를 삭제하시겠어요?
저장된 뉴스 목록에서 사라집니다.`}
        onConfirm={handleConfirmDelete}
        onClose={() => setShowDeleteConfirmModal(false)}
      >
          <View className="flex-row gap-3 mt-6 mb-[-16px]">
            <TouchableOpacity
              className="flex-1 bg-white border border-[#006716] rounded-xl py-3"
              onPress={() => setShowDeleteConfirmModal(false)}
            >
              <Text className="text-center text-[#006716] font-semibold">취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#006716] rounded-xl py-3"
              onPress={handleConfirmDelete}
            >
              <Text className="text-white text-center font-semibold">확인</Text>
            </TouchableOpacity>
          </View>
        </Modal>

      {/* 삭제 실패 모달 */}
      <Modal
        visible={showDeleteErrorModal}
        title="삭제에 실패했습니다."
        onConfirm={() => setShowDeleteErrorModal(false)}
        onClose={() => setShowDeleteErrorModal(false)}
      >
        <View className="mt-6 mb-[-16px]">
          <TouchableOpacity
            className="bg-[#006716] py-3 rounded-xl"
            onPress={() => setShowDeleteErrorModal(false)}
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold">확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}