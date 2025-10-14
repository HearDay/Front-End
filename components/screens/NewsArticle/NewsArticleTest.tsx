import TopBar from '@/components/common/TopBar'
import { DictionaryModalTest, DictionarySearchBar } from '@/components/screens/Dictionary'
import { useCallback, useRef, useState } from 'react'
import { Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NewsArticleContent } from './NewsArticleContent'
import { NewsArticleImage } from './NewsArticleImage'

interface NewsArticleTestProps {
  newsId: string
}

export function NewsArticleTest({ newsId }: NewsArticleTestProps) {
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [highlightWord, setHighlightWord] = useState<string | undefined>()
  const [showDictionaryModal, setShowDictionaryModal] = useState(false)
  const [selectedWord, setSelectedWord] = useState('')
  const [wordSaved, setWordSaved] = useState(false)
  
  // ✅ 추가: 같은 단어 위치 저장
  const [wordPositions, setWordPositions] = useState<number[]>([])
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0)

  const scrollRef = useRef<ScrollView>(null)

  const dummyNews = {
    id: newsId,
    title: '오픈AI "내년 개인정보 필터" 오픈소스로 공개',
    imageUrl: 'https://via.placeholder.com/400x300',
    content: `일본 애니메이션 〈귀멸의 칼날〉이 북미 박스오피스에서 역대급 성적을 거뒀습니다.
극장판(無限列車)는 박스오피스 집계 사이트 박스오피스 모조에 따르면, 
북미에서 개봉 첫 주말 3300만 달러(약 460억 원)를 벌어들이며 박스오피스 1위에 올랐습니다.
같은 주말에 북미에서 개봉한 외화 중 가장 높은 흥행 성적을 기록했다고 밝혔습니다.`,
  }

  const handleImagePress = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 300, animated: true })
  }, [])

  // ✅ 수정: 검색 시 같은 단어의 모든 위치 찾기
  const handleSearch = useCallback((word: string) => {
    setHighlightWord(word)
    
    // 같은 단어의 모든 위치 찾기
    const content = dummyNews.content
    const positions: number[] = []
    let index = 0
    
    while ((index = content.toLowerCase().indexOf(word.toLowerCase(), index)) !== -1) {
      positions.push(index)
      index += word.length
    }
    
    setWordPositions(positions)
    setCurrentPositionIndex(0)
    
    // ✅ 추가: 키보드 닫기
    Keyboard.dismiss()
  }, [dummyNews.content])

  const handleWordPress = useCallback((word: string) => {
    setSelectedWord(word)
    setShowDictionaryModal(true)
    setWordSaved(false)
  }, [])

  const handleSaveWord = useCallback(() => {
    console.log('단어 저장:', selectedWord)
    setWordSaved(true)
    // ✅ 수정: 저장만 하고 화면 이동 없음
  }, [selectedWord])

  // ✅ 추가: 이전/다음 단어로 이동
  const handlePrevWord = useCallback(() => {
    if (wordPositions.length === 0) return
    
    const newIndex = currentPositionIndex === 0 
      ? wordPositions.length - 1 
      : currentPositionIndex - 1
    
    setCurrentPositionIndex(newIndex)
    // TODO: 해당 위치로 스크롤
  }, [wordPositions, currentPositionIndex])

  const handleNextWord = useCallback(() => {
    if (wordPositions.length === 0) return
    
    const newIndex = currentPositionIndex === wordPositions.length - 1 
      ? 0 
      : currentPositionIndex + 1
    
    setCurrentPositionIndex(newIndex)
    // TODO: 해당 위치로 스크롤
  }, [wordPositions, currentPositionIndex])

  // ✅ 수정: 돋보기 클릭 시 키보드 자동 표시
  const handleOpenSearch = useCallback(() => {
    setShowSearchBar(true)
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar showBackButton={true} />

      <ScrollView 
        ref={scrollRef} 
        className="flex-1"
        keyboardShouldPersistTaps="handled" // ✅ 추가: 키보드 열린 상태에서 스크롤 가능
      >
        <NewsArticleImage 
          imageUrl={dummyNews.imageUrl}
          onPress={handleImagePress}
        />

        <NewsArticleContent
          content={dummyNews.content}
          highlightWord={highlightWord}
          onWordPress={handleWordPress}
        />
      </ScrollView>

      {/* ✅ 수정: 검색창에 onOpen 추가 */}
      <DictionarySearchBar
        visible={showSearchBar}
        onClose={() => setShowSearchBar(false)}
        onSearch={handleSearch}
        onOpen={handleOpenSearch}
      />

      {/* ✅ 추가: 단어 네비게이션 (검색 결과가 있을 때만) */}
      {showSearchBar && wordPositions.length > 1 && (
        <View className="absolute bottom-32 right-6 flex-row gap-2">
          <TouchableOpacity
            onPress={handlePrevWord}
            className="bg-green-600 w-10 h-10 rounded-full items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-white text-xl">↑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextWord}
            className="bg-green-600 w-10 h-10 rounded-full items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-white text-xl">↓</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ✅ 추가: 검색 결과 카운터 */}
      {showSearchBar && highlightWord && wordPositions.length > 0 && (
        <View className="absolute bottom-24 left-1/2 -ml-12 bg-gray-800 px-3 py-1 rounded-full">
          <Text className="text-white text-sm">
            {currentPositionIndex + 1} / {wordPositions.length}
          </Text>
        </View>
      )}

      <DictionaryModalTest
        visible={showDictionaryModal}
        word={selectedWord}
        isSaved={wordSaved}
        onClose={() => setShowDictionaryModal(false)}
        onSave={handleSaveWord}
      />
    </SafeAreaView>
  )
}