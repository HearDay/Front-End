import { CategoryChipGroup, Modal } from '@/components/common';
import TopBar from '@/components/common/TopBar';
import { newsService } from '@/services';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SavedNewsItem } from '../../../types/screens';
import { SavedNewsList } from './SavedNewsList';

export function SavedNewsScreen() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>('전체')
  const [savedNews, setSavedNews] = useState<SavedNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 삭제 확인 모달 관련 상태
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);

  const fetchSavedNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await newsService.getSavedNews()
      setSavedNews(response)
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

  const handleNewsPress = useCallback((newsId: string) => {
    router.push(`/newsplayer/${newsId}`)
  }, [router])

  // 삭제 버튼 클릭 시 모달을 띄우는 함수
  const handleDeletePress = useCallback((newsId: string) => {
    setDeletingNewsId(newsId);
    setShowDeleteConfirmModal(true);
  }, []);

  // 모달에서 '확인'을 눌렀을 때 실제 삭제를 실행하는 함수
  const handleConfirmDelete = useCallback(async () => {
    if (!deletingNewsId) return;
    try {
      await newsService.deleteSavedNews(deletingNewsId);
      setSavedNews(prev => prev.filter(news => news.id !== deletingNewsId));
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.'); // 실패 시에는 간단히 alert
    } finally {
      setShowDeleteConfirmModal(false);
      setDeletingNewsId(null);
    }
  }, [deletingNewsId]);

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
    <SafeAreaView className="flex-1 bg-gray-50">
      <View style={{ marginTop: -8 }}>
        <TopBar showBackButton={false} />
      </View>

      <CategoryChipGroup
        categories={['전체', '경제', '기술', '환경', '사회']}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <SavedNewsList
        newsList={filteredNews}
        onNewsPress={handleNewsPress}
        onDelete={handleDeletePress}
      />

      {/* 삭제 확인 모달 */}
      <Modal
      visible={showDeleteConfirmModal}
      title=""
      onConfirm={handleConfirmDelete}
      onClose={() => setShowDeleteConfirmModal(false)}
      >
    <Text className="text-center text-lg font-seminold mb-6 leading-7">
    이 뉴스를 삭제하시겠어요?{'\n'}
    저장된 뉴스 목록에서 사라집니다.
    </Text>
        <View className="flex-row gap-3">
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
    </SafeAreaView>
  )
}