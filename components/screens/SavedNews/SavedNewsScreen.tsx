import { CategoryChipGroup } from '@/components/common';
import TopBar from '@/components/common/TopBar';
import { newsService } from '@/services';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react'; // 개선: useCallback, useMemo 추가
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'; // 추가: ActivityIndicator
import { SafeAreaView } from 'react-native-safe-area-context';
import { SavedNewsItem } from '../../../types/screens';
import { SavedNewsList } from './SavedNewsList';
import { SavedNewsSearchBar } from './SavedNewsSearchBar';

export function SavedNewsScreen() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedNews, setSavedNews] = useState<SavedNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // 추가: 에러 상태
  const [error, setError] = useState<string | null>(null)

  // 개선: useCallback
  // 이유: useEffect 의존성 배열에 안전하게 사용
  const fetchSavedNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null) // 에러 초기화
      
      const response = await newsService.getSavedNews()
      setSavedNews(response)
      
      console.log('저장된 뉴스 API 호출')
      
    } catch (err) {
      setError('저장된 뉴스를 불러올 수 없습니다.') // 에러 상태 설정
      console.error('저장된 뉴스 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, []) // 의존성 없음 - 한 번만 생성

  // API로 저장된 뉴스 가져오기
  useEffect(() => {
    fetchSavedNews()
  }, [fetchSavedNews]) // fetchSavedNews를 의존성에 추가

  // 개선: useMemo로 필터링 결과 \
  // 이유: savedNews, selectedCategory, searchQuery가 변하지 않으면 재계산 안 함
  const filteredNews = useMemo(() => {
    return savedNews.filter(news => {
      const categoryMatch = selectedCategory === '전체' || news.category === selectedCategory
      const searchMatch = searchQuery === '' || 
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchQuery.toLowerCase())
      
      return categoryMatch && searchMatch
    })
  }, [savedNews, selectedCategory, searchQuery])

  // 개선: useCallback으로 이벤트 핸들러 
  // 이유: SavedNewsList에 props로 전달되므로 불필요한 리렌더링 방지
  const handleNewsPress = useCallback((newsId: string) => {
    router.push(`/newsplayer/${newsId}`)
  }, [router])

  // 개선: useCallback으로 삭제 핸들러 
  // 이유: SavedNewsList에 props로 전달
  const handleDelete = useCallback(async (newsId: string) => {
    try {
      await newsService.deleteSavedNews(newsId)
      
      setSavedNews(prev => prev.filter(news => news.id !== newsId)) // 함수형 업데이트
      // 이유: 최신 state 값 보장
      console.log('삭제 완료:', newsId)
      
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }, [])

  // 추가: 로딩 상태 UI
  // 이유: 사용자에게 데이터를 불러오는 중임을 알림
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-500 mt-4">저장된 뉴스를 불러오는 중...</Text>
      </SafeAreaView>
    )
  }

  // 추가: 에러 상태 UI
  // 이유: 에러 발생 시 사용자에게 재시도 옵션 제공
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
      <View className="mb-[-8px]">
        <TopBar showBackButton={false} />
      </View>

      {/* 검색창 */}
      <SavedNewsSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 카테고리 칩 그룹 */}
      <CategoryChipGroup
        categories={['전체', '경제', '기술', '환경', '사회']}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* 뉴스 리스트 */}
      <SavedNewsList
        newsList={filteredNews}
        onNewsPress={handleNewsPress}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  )
}