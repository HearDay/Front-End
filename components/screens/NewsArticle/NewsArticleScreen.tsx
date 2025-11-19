import { Modal } from '@/components/common';
import TopBar from '@/components/common/TopBar';
import { DictionaryModal, DictionarySearchBar } from '@/components/screens/Dictionary';
import { articleService, wordbookService } from '@/services';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'; // 개선: ActivityIndicator 추가
import { SafeAreaView } from 'react-native-safe-area-context';
import { NewsArticleData } from '../../../types/screens';
import { NewsArticleContent } from './NewsArticleContent';
import { NewsArticleImage } from './NewsArticleImage';

interface NewsArticleScreenProps {
  articleId: string
}

export function NewsArticleScreen({ articleId }: NewsArticleScreenProps) {
  const [newsData, setNewsData] = useState<NewsArticleData | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [highlightWord, setHighlightWord] = useState<string | undefined>()
  const [showDictionaryModal, setShowDictionaryModal] = useState(false)
  const [selectedWord, setSelectedWord] = useState('')
  
  // 단어 저장 관련 상태 변경
  const [savedWords, setSavedWords] = useState<string[]>([])
  const [saveState, setSaveState] = useState<'IDLE' | 'SAVING' | 'SAVED' | 'ALREADY_EXISTS'>('IDLE')

  // 하이라이트 관련 상태 추가
  const [highlightMatches, setHighlightMatches] = useState<{start: number, end: number}[]>([])

  // 개선: 로딩/에러 상태 추가
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 모달 상태 추가
  const [showSearchErrorModal, setShowSearchErrorModal] = useState(false)
  const [showSaveErrorModal, setShowSaveErrorModal] = useState(false)

  const scrollRef = useRef<ScrollView>(null)

  // 개선: useCallback
  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true) // 개선: 로딩 시작
      setError(null)   // 개선: 에러 초기화

      const response = await articleService.getArticleDetail(articleId)
      setNewsData(response)
    } catch (err) {
      setError('기사를 불러올 수 없습니다.')
    } finally {
      setLoading(false) // 개선: 로딩 종료
    }
  }, [articleId]) // articleId가 변경될 때만 함수 재생성

  // 뉴스 데이터 로드
  useEffect(() => {
    fetchNewsData()
  }, [fetchNewsData]) // 개선: fetchNewsData를 의존성에 추가 (useCallback으로 감쌌으므로 안전)

  // 개선: useCallback 사용
  const handleImagePress = useCallback(() => {
    scrollRef.current?.scrollTo({ y: 300, animated: true })
  }, [])

  // 개선: 검색 핸들러 로직 수정
  const handleSearch = useCallback((word: string) => {
    setHighlightWord(word)
    if (!word || !newsData?.content) {
      setHighlightMatches([])
      return
    }

    const regex = new RegExp(word, 'gi');
    const matches = []
    let match;
    while ((match = regex.exec(newsData.content)) !== null) {
      matches.push({ start: match.index, end: regex.lastIndex })
    }

    if (matches.length === 0) {
      setShowSearchErrorModal(true)
    }

    setHighlightMatches(matches)
  }, [newsData?.content])

  // 단어 클릭 핸들러 수정
  const handleWordPress = useCallback((word: string) => {
    setSelectedWord(word)
    // 이미 저장된 단어인지 확인
    if (savedWords.includes(word)) {
      setSaveState('ALREADY_EXISTS')
    } else {
      setSaveState('IDLE')
    }
    setShowDictionaryModal(true)
  }, [savedWords])

  // 단어 저장 핸들러 로직 수정
  const handleSaveWord = useCallback(async (definition: string) => {
    if (saveState !== 'IDLE') return;

    try {
      setSaveState('SAVING');
      await wordbookService.saveWord(selectedWord, definition)

      setSaveState('SAVED');
      setSavedWords(prev => [...prev, selectedWord]); // 저장된 단어 목록에 추가

      // 1.5초 후 모달 닫기
      setTimeout(() => {
        setShowDictionaryModal(false);
        setSaveState('IDLE'); // 상태 초기화
      }, 1500);

    } catch (error) {
      console.error('단어 저장 실패:', error)
      setSaveState('IDLE'); // 에러 발생 시 상태 초기화
      setShowDictionaryModal(false);
      setShowSaveErrorModal(true);
    }
  }, [selectedWord, saveState])

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
    <SafeAreaView className="flex-1 bg-white" edges={['bottom', 'left', 'right']}>
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
          highlightMatches={highlightMatches}
        />
      </ScrollView>

      {/* 개선: DictionarySearchBar에 onOpen 추가 */}
      <DictionarySearchBar
        visible={showSearchBar}
        onClose={() => {
          setShowSearchBar(false)
          setHighlightWord(undefined) // 검색바 닫을 때 하이라이트 제거
        }}
        onSearch={handleSearch}
        onOpen={() => setShowSearchBar(true)} // 개선: onOpen 추가
      />

      {/* 단어 뜻 모달 */}
      <DictionaryModal
        visible={showDictionaryModal}
        word={selectedWord}
        saveState={saveState}
        onClose={() => setShowDictionaryModal(false)}
        onSave={handleSaveWord}
      />

      {/* 검색 결과 없음 모달 */}
      <Modal
        visible={showSearchErrorModal}
        title="해당 단어를 찾을 수 없습니다."
        onConfirm={() => setShowSearchErrorModal(false)}
        onClose={() => setShowSearchErrorModal(false)}
      >
        <View className="mt-4 mb-[-16px]">
          <TouchableOpacity
            className="bg-[#006716] py-3 rounded-xl"
            onPress={() => setShowSearchErrorModal(false)}
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold">확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 단어 저장 실패 모달 */}
      <Modal
        visible={showSaveErrorModal}
        title="단어 저장에 실패했습니다."
        onConfirm={() => setShowSaveErrorModal(false)}
        onClose={() => setShowSaveErrorModal(false)}
      >
        <View className="mt-6 mb-[-16px]">
          <TouchableOpacity
            className="bg-[#006716] py-3 rounded-xl"
            onPress={() => setShowSaveErrorModal(false)}
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold">확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  )
}