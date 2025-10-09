import { CategoryChipGroup } from '@/components/common'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SavedNewsItem } from '../../../types/screens'
import { SavedNewsList } from './SavedNewsList'
import { SavedNewsSearchBar } from './SavedNewsSearchBar'

export const SavedNewsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('전체')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedNews, setSavedNews] = useState<SavedNewsItem[]>([])

  // 카테고리 + 검색어 필터링
  const filteredNews = savedNews.filter(news => {
    // 카테고리 필터
    const categoryMatch = selectedCategory === '전체' || news.category === selectedCategory
    
    // 검색어 필터
    const searchMatch = searchQuery === '' || 
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && searchMatch
  })

  const handleNewsPress = (newsId: string) => {
    console.log('뉴스 클릭:', newsId)
    // TODO: 뉴스 상세 화면으로 이동
  };

  const handleDelete = (newsId: string) => {
    // TODO: API 호출해서 삭제
    setSavedNews(savedNews.filter(news => news.id !== newsId));
    console.log('삭제:', newsId)
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* ========== 헤더 영역 (나중에 공용 컴포넌트로 교체) ========== */}
      <View className="bg-white pb-4">
        <Text className="text-center text-2xl font-bold mt-4">HEARDAY</Text>
        <View className="h-1 bg-gradient-to-r from-green-400 to-yellow-400 mt-2" />
      </View>

      {/* 검색창 */}
      <SavedNewsSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 카테고리 칩 그룹 */}
      <View className="mb-4">
        <CategoryChipGroup
          categories={['전체', '경제', '기술', '환경', '사회']}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </View>

      {/* 뉴스 리스트 */}
      <SavedNewsList
        newsList={filteredNews}
        onNewsPress={handleNewsPress}
        onDelete={handleDelete}
      />

      {/* ========== 하단 네비게이션 (나중에 공용 컴포넌트로 교체) ========== */}
      {/* 
        <BottomNavigation currentTab="saved" />
      */}
    </SafeAreaView>
  )
}