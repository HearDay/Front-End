import { CategoryChipGroup } from '@/components/common'
import TopBar from '@/components/common/TopBar'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SavedNewsItem } from '../../../types/screens'
import { SavedNewsList } from './SavedNewsList'
import { SavedNewsSearchBar } from './SavedNewsSearchBar'

const DUMMY_SAVED_NEWS: SavedNewsItem[] = [
  {
    id: 'saved-1',
    title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
    summary: '오픈AI가 개인정보 보호 강화를 위해 차세대 개발한 개인정보 필터를 내년 오픈소스로 공개하겠다고 밝혔습니다.',
    imageUrl: 'https://via.placeholder.com/150',
    category: '기술',
    savedAt: '2025-01-19',
  },
  {
    id: 'saved-2',
    title: '글로벌 경제 불확실성 속 국내 증시 영향',
    summary: '글로벌 경제 불확실성이 커지면서 국내 증시에도 영향을 미치고 있습니다.',
    imageUrl: 'https://via.placeholder.com/150',
    category: '경제',
    savedAt: '2025-01-18',
  },
  {
    id: 'saved-3',
    title: '환경부, 2030년까지 탄소중립 로드맵 발표',
    summary: '환경부가 2030년까지 탄소중립을 달성하기 위한 구체적인 로드맵을 발표했습니다.',
    imageUrl: 'https://via.placeholder.com/150',
    category: '환경',
    savedAt: '2025-01-17',
  },
]

export function SavedNewsTest() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedNews, setSavedNews] = useState<SavedNewsItem[]>(DUMMY_SAVED_NEWS)

  const filteredNews = useMemo(() => {
    return savedNews.filter(news => {
      const categoryMatch = selectedCategory === '전체' || news.category === selectedCategory
      const searchMatch = searchQuery === '' || 
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchQuery.toLowerCase())
      
      return categoryMatch && searchMatch
    })
  }, [savedNews, selectedCategory, searchQuery])

  const handleNewsPress = useCallback((newsId: string) => {
    router.push(`/newsarticle/${newsId}`)
  }, [router])

  const handleDelete = useCallback((newsId: string) => {
    setSavedNews(prev => prev.filter(news => news.id !== newsId))
    console.log('삭제:', newsId)
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <TopBar showBackButton={false} />

      <SavedNewsSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <CategoryChipGroup
        categories={['전체', '경제', '기술', '환경', '사회']}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <SavedNewsList
        newsList={filteredNews}
        onNewsPress={handleNewsPress}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  )
}