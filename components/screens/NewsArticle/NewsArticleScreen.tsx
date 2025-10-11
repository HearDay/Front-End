import TopBar from '@/components/common/TopBar'
import { DictionaryModal, DictionarySearchBar } from '@/components/screens/Dictionary'
import { useEffect, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NewsArticleData } from '../../../types/screens'
import { NewsArticleContent } from './NewsArticleContent'
import { NewsArticleImage } from './NewsArticleImage'

interface NewsArticleScreenProps {
  newsId: string;
}

export function NewsArticleScreen ({ newsId }: NewsArticleScreenProps) {
  const [newsData, setNewsData] = useState<NewsArticleData | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [searchWord, setSearchWord] = useState('')
  const [highlightWord, setHighlightWord] = useState<string | undefined>()
  const [showDictionaryModal, setShowDictionaryModal] = useState(false)
  const [selectedWord, setSelectedWord] = useState('')
  const [wordSaved, setWordSaved] = useState(false)

  const scrollRef = useRef<ScrollView>(null)

  // 뉴스 데이터 로드
  useEffect(() => {
    fetchNewsData()
  }, [newsId])

  const fetchNewsData = async () => {
    try {
      // TODO: API 호출
      console.log('기사 로드:', newsId)
    } catch (error) {
      console.error('기사 로드 실패:', error)
    }
  };

  // 이미지 클릭 → 본문으로 스크롤
  const handleImagePress = () => {
    scrollRef.current?.scrollTo({ y: 300, animated: true })
  };

  // 검색 실행
  const handleSearch = (word: string) => {
    setSearchWord(word)
    setHighlightWord(word)
  };

  // 단어 클릭 → 뜻 모달
  const handleWordPress = (word: string) => {
    setSelectedWord(word)
    setShowDictionaryModal(true)
    setWordSaved(false)
  };

  // 단어장에 저장
  const handleSaveWord = async () => {
    try {
      // TODO: API 호출
      console.log('단어 저장:', selectedWord)
      setWordSaved(true)
    } catch (error) {
      console.error('단어 저장 실패:', error)
    }
  }

  if (!newsData) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-lg">로딩 중...</Text>
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

      {/* 검색창 */}
      <DictionarySearchBar
        visible={showSearchBar}
        onClose={() => setShowSearchBar(false)}
        onSearch={handleSearch}
      />

      {/* 돋보기 버튼 */}
      {!showSearchBar && (
        <TouchableOpacity
          onPress={() => setShowSearchBar(true)}
          className="absolute bottom-8 right-6 bg-green-600 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Text className="text-2xl">🔍</Text>
        </TouchableOpacity>
      )}

      {/* 단어 뜻 모달 */}
      <DictionaryModal
        visible={showDictionaryModal}
        word={selectedWord}
        isSaved={wordSaved}
        onClose={() => setShowDictionaryModal(false)}
        onSave={handleSaveWord}
      />
    </SafeAreaView>
  );
};