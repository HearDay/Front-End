import { CategoryChipGroup } from '@/components/common'
import TopBar from '@/components/common/TopBar'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SavedNewsItem } from '../../../types/screens'
import { SavedNewsList } from './SavedNewsList'
import { SavedNewsSearchBar } from './SavedNewsSearchBar'

export function SavedNewsScreen() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedNews, setSavedNews] = useState<SavedNewsItem[]>([])
  const [loading, setLoading] = useState(true)

  // API로 저장된 뉴스 가져오기
  useEffect(() => {
    fetchSavedNews()
  }, [])

  const fetchSavedNews = async () => {
    try {
      setLoading(true)
      // TODO: 실제 API 호출
      // const response = await newsService.getSavedNews();
      // setSavedNews(response);
      
      console.log('저장된 뉴스 API 호출')
      
    } catch (error) {
      console.error('저장된 뉴스 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 카테고리 + 검색어 필터링
  const filteredNews = savedNews.filter(news => {
    const categoryMatch = selectedCategory === '전체' || news.category === selectedCategory
    const searchMatch = searchQuery === '' || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && searchMatch
  })

  // 뉴스 클릭 → NewsArticle로 이동
  const handleNewsPress = (newsId: string) => {
    router.push(`/newsarticle/${newsId}`)
  }

  // 삭제
  const handleDelete = async (newsId: string) => {
    try {
      // TODO: 실제 API 호출
      // await newsService.deleteSavedNews(newsId)
      
      setSavedNews(savedNews.filter(news => news.id !== newsId));
      console.log('삭제 완료:', newsId)
      
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* TopBar 사용 */}
      <TopBar showBackButton={false} />

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