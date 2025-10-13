import TopBar from '@/components/common/TopBar';
import { DictionaryModal, DictionarySearchBar } from '@/components/screens/Dictionary';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity } from 'react-native'; // ✅ 개선: ActivityIndicator 추가
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsArticleData } from '../../../types/screens';
import { NewsArticleContent } from './NewsArticleContent';
import { NewsArticleImage } from './NewsArticleImage';

interface NewsArticleScreenProps {
  newsId: string
}

export function NewsArticleScreen({ newsId }: NewsArticleScreenProps) {
  const [newsData, setNewsData] = useState<NewsArticleData | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [searchWord, setSearchWord] = useState('')
  const [highlightWord, setHighlightWord] = useState<string | undefined>()
  const [showDictionaryModal, setShowDictionaryModal] = useState(false)
  const [selectedWord, setSelectedWord] = useState('')
  const [wordSaved, setWordSaved] = useState(false)
  
  // 개선: 로딩/에러 상태 추가
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const scrollRef = useRef<ScrollView>(null)

  // 개선: useCallback
  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true) // 개선: 로딩 시작
      setError(null)   // 개선: 에러 초기화
      
      // TODO: 실제 API 호출
      // const response = await newsService.getArticle(newsId)
      // setNewsData(response)
      
      console.log('기사 로드:', newsId)
      
    } catch (err) {
      setError('기사를 불러올 수 없습니다.') // 개선: 에러 상태 설정
      console.error('기사 로드 실패:', err)
    } finally {
      setLoading(false) // 개선: 로딩 종료
    }
  }, [newsId]) // newsId가 변경될 때만 함수 재생성

  // 뉴스 데이터 로드
  useEffect(() => {
    fetchNewsData()
  }, [fetchNewsData]) // 개선: fetchNewsData를 의존성에 추가 (useCallback으로 감쌌으므로 안전)

  // 개선: useCallback 사용
  const handleImagePress = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 300, animated: true })
  }, [])

  // 개선: useCallback 사용
  const handleSearch = useCallback((word: string) => {
    setSearchWord(word)
    setHighlightWord(word)
  }, [])

  // 개선: useCallback 사용
  const handleWordPress = useCallback((word: string) => {
    setSelectedWord(word)
    setShowDictionaryModal(true)
    setWordSaved(false)
  }, [])

  // 개선: useCallback 사용
  const handleSaveWord = useCallback(async () => {
    try {
      // TODO: 실제 API 호출
      // await wordService.saveWord(selectedWord)
      
      console.log('단어 저장:', selectedWord)
      setWordSaved(true)
    } catch (error) {
      console.error('단어 저장 실패:', error)
    }
  }, [selectedWord])

  // 개선: 로딩 상태 UI
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-500 mt-4">기사를 불러오는 중...</Text>
      </SafeAreaView>
    )
  }

  // 개선: 에러 상태 UI
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchNewsData}
          className="bg-green-600 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  // 개선: 데이터 없음 상태 UI
  if (!newsData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500 text-lg">기사를 찾을 수 없습니다.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar showBackButton={true} />

      <ScrollView ref={scrollRef} className="flex-1">
        {/* 기사 이미지 */}
        <NewsArticleImage 
          imageUrl={newsData.imageUrl}
          onPress={handleImagePress}
        />

        {/* 본문 */}
        <NewsArticleContent
          content={newsData.content}
          highlightWord={highlightWord}
          onWordPress={handleWordPress}
        />
      </ScrollView>

      {/* 개선: DictionarySearchBar에 onOpen 추가 */}
      <DictionarySearchBar
        visible={showSearchBar}
        onClose={() => setShowSearchBar(false)}
        onSearch={handleSearch}
        onOpen={() => setShowSearchBar(true)} // 개선: onOpen 추가
      />

      {/* 제거: 별도 돋보기 버튼 (DictionarySearchBar에 통합) */}
      {/* {!showSearchBar && (
        <TouchableOpacity
          onPress={() => setShowSearchBar(true)}
          className="absolute bottom-8 right-6 bg-green-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-2xl">🔍</Text>
        </TouchableOpacity>
      )} */}

      {/* 단어 뜻 모달 */}
      <DictionaryModal
        visible={showDictionaryModal}
        word={selectedWord}
        isSaved={wordSaved}
        onClose={() => setShowDictionaryModal(false)}
        onSave={handleSaveWord}
      />
    </SafeAreaView>
  )
}