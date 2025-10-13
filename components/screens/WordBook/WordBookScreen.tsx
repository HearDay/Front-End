import { Modal } from '@/components/common'
import TopBar from '@/components/common/TopBar'; // 추가: 공통 TopBar 사용
import { addMonths, subMonths } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'; // 개선: useCallback 추가
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'; // 추가: ActivityIndicator, ScrollView
import { SafeAreaView } from 'react-native-safe-area-context'
import { SavedWord, WordBookCalendarItem } from '../../../types/screens'
import { WordBookCalendar } from './WordBookCalendar'
import { WordBookChipList } from './WordBookChipList'
import { WordBookDateDisplay } from './WordBookDateDisplay'

export const WordBookScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [calendarData, setCalendarData] = useState<WordBookCalendarItem[]>([])
  const [todayWords, setTodayWords] = useState<SavedWord[]>([])
  const [selectedWord, setSelectedWord] = useState<SavedWord | null>(null)
  const [showModal, setShowModal] = useState(false)
  
  // 추가: 로딩/에러 상태
  // 이유: API 호출 중 사용자에게 피드백 제공
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 개선: useCallback
  // 이유: useEffect 의존성 배열에 안전하게 사용, 불필요한 함수 재생성 방지
  const fetchCalendarData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: 실제 API 호출
      // const response = await wordBookService.getCalendar(currentDate)
      // setCalendarData(response)
      
      console.log('캘린더 데이터 로드:', currentDate)
      
    } catch (err) {
      setError('캘린더를 불러올 수 없습니다.')
      console.error('캘린더 로드 실패:', err)
    } finally {
      setLoading(false)
    }
  }, [currentDate]) // currentDate가 변경될 때만 함수 재생성

  // 개선: useCallback
  // 이유: 의존성이 없으므로 컴포넌트 생명주기 동안 같은 함수 재사용
  const fetchWordsByDate = useCallback(async (date: Date) => {
    try {
      // TODO: 실제 API 호출
      // const response = await wordBookService.getWordsByDate(date)
      // setTodayWords(response)
      
      console.log('단어 로드:', date)
      
    } catch (error) {
      console.error('단어 로드 실패:', error)
    }
  }, []) // 의존성 없음 - 한 번만 생성

  // 캘린더 데이터 로드 (월별)
  useEffect(() => {
    fetchCalendarData()
  }, [fetchCalendarData]) // fetchCalendarData를 의존성에 추가 (useCallback으로 안전)

  // 선택한 날짜의 단어 로드
  useEffect(() => {
    if (selectedDate) {
      fetchWordsByDate(selectedDate)
    }
  }, [selectedDate, fetchWordsByDate]) // fetchWordsByDate 의존성 추가

  // 개선: useCallback으로 이벤트 핸들러
  // 이유: WordBookChipList에 props로 전달되므로 불필요한 리렌더링 방지
  const handleWordPress = useCallback((word: SavedWord) => {
    setSelectedWord(word)
    setShowModal(true)
  }, [])

  // 개선: useCallback으로 이벤트 핸들러
  // 이유: WordBookCalendar에 props로 전달
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => subMonths(prev, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1))
  }, [])

  // 추가: 로딩 상태 UI
  // 이유: 사용자에게 데이터를 불러오는 중임을 알림
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-500 mt-4">캘린더를 불러오는 중...</Text>
      </SafeAreaView>
    )
  }

  // 추가: 에러 상태 UI
  // 이유: 에러 발생 시 사용자에게 재시도 옵션 제공
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center px-4">
        <Text className="text-red-500 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchCalendarData}
          className="bg-green-600 px-6 py-3 rounded-xl"
          activeOpacity={0.7}
        >
          <Text className="text-white font-semibold">다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 추가: TopBar 컴포넌트 */}
      {/* 이유: 일관된 상단바 UI 제공 */}
      <TopBar showBackButton={false} />

      {/* 추가: ScrollView로 감싸기 */}
      {/* 이유: 화면이 작을 때 스크롤 가능하도록 */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {/* 캘린더 */}
        <WordBookCalendar
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          calendarData={calendarData}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* 날짜 표시 */}
        {selectedDate && <WordBookDateDisplay date={selectedDate} />}

        {/* 단어 칩 리스트 */}
        <WordBookChipList
          words={todayWords}
          selectedWord={selectedWord}
          onWordPress={handleWordPress}
        />
      </ScrollView>

      {/* 단어 뜻 모달 */}
      {selectedWord && (
        <Modal
          visible={showModal}
          title={selectedWord.word}
          onConfirm={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        >
          <View className="bg-green-50 rounded-2xl p-4">
            {/* TODO: API에서 단어 뜻 가져오기 */}
            <Text className="text-base">단어 뜻이 여기 표시됩니다.</Text>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  )
}