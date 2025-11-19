import { Modal } from '@/components/common'
import TopBar from '@/components/common/TopBar'
import { wordbookService } from '@/services'
import { useFocusEffect } from '@react-navigation/native'
import { addMonths, subMonths } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SavedWord, WordBookCalendarItem } from '../../../types/screens'
import { WordBookCalendar } from './WordBookCalendar'
import { WordBookChipList } from './WordBookChipList'
import { WordBookDateDisplay } from './WordBookDateDisplay'

export const WordBookScreen = () => {
  // 타임존 문제 방지: 초기 날짜를 정오(12:00)로 설정
  const getDateAtNoon = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0)
  }

  const [currentDate, setCurrentDate] = useState(getDateAtNoon())
  const [selectedDate, setSelectedDate] = useState<Date | null>(getDateAtNoon())
  const [calendarData, setCalendarData] = useState<WordBookCalendarItem[]>([])
  const [todayWords, setTodayWords] = useState<SavedWord[]>([])
  const [selectedWord, setSelectedWord] = useState<SavedWord | null>(null)
  const [showModal, setShowModal] = useState(false)

  // 추가: 로딩/에러 상태
  // 이유: API 호출 중 사용자에게 피드백 제공
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [definitionLoading, setDefinitionLoading] = useState(false)

  // 에러 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // 개선: useCallback
  // 이유: useEffect 의존성 배열에 안전하게 사용, 불필요한 함수 재생성 방지
  const fetchCalendarData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await wordbookService.getCalendar(currentDate)
      setCalendarData(response)
    } catch (err) {
      setError('캘린더를 불러올 수 없습니다.')
    } finally {
      setLoading(false)
    }
  }, [currentDate]) // currentDate가 변경될 때만 함수 재생성

  // 개선: useCallback
  // 이유: 의존성이 없으므로 컴포넌트 생명주기 동안 같은 함수 재사용
  const fetchWordsByDate = useCallback(async (date: Date) => {
    try {
      const response = await wordbookService.getWordsByDate(date)
      setTodayWords(response)
    } catch (error) {
      // 에러 발생 시 빈 배열 유지
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

  // 화면이 포커스될 때마다 초기 상태로 리셋
  useFocusEffect(
    useCallback(() => {
      const todayAtNoon = getDateAtNoon()
      setCurrentDate(todayAtNoon)
      setSelectedDate(todayAtNoon)
    }, [])
  )

  // 개선: useCallback으로 이벤트 핸들러
  // 이유: WordBookChipList에 props로 전달되므로 불필요한 리렌더링 방지
  const handleWordPress = useCallback(async (word: SavedWord) => {
    setSelectedWord(word)
    setShowModal(true)

    // 단어 뜻이 없으면 API로 조회
    if (!word.definition) {
      try {
        setDefinitionLoading(true)
        const wordId = parseInt(word.id)
        const result = await wordbookService.getWordDefinition(wordId)

        // selectedWord 업데이트
        setSelectedWord(prev => prev ? { ...prev, definition: result.definition } : null)

        // todayWords 목록도 업데이트
        setTodayWords(prev => prev.map(w =>
          w.id === word.id ? { ...w, definition: result.definition } : w
        ))
      } catch (err) {
        setSelectedWord(prev => prev ? { ...prev, definition: '단어 뜻을 불러올 수 없습니다.' } : null)
      } finally {
        setDefinitionLoading(false)
      }
    }
  }, [])

  // 개선: useCallback으로 이벤트 핸들러
  // 이유: WordBookCalendar에 props로 전달
  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = subMonths(prev, 1)

      // 현재 달인지 확인 후 날짜 선택
      const today = new Date()
      if (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() === today.getMonth()) {
        // 현재 달이면 오늘 날짜로 설정
        setSelectedDate(getDateAtNoon())
      } else {
        // 다른 달이면 1일로 설정
        setSelectedDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1, 12, 0, 0, 0))
      }

      return newDate
    })
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => {
      const newDate = addMonths(prev, 1)

      // 현재 달인지 확인 후 날짜 선택
      const today = new Date()
      if (newDate.getFullYear() === today.getFullYear() && newDate.getMonth() === today.getMonth()) {
        // 현재 달이면 오늘 날짜로 설정
        setSelectedDate(getDateAtNoon())
      } else {
        // 다른 달이면 1일로 설정
        setSelectedDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1, 12, 0, 0, 0))
      }

      return newDate
    })
  }, [])

  const handleDeleteWord = useCallback(async () => {
    if (!selectedWord) return

    try {
      await wordbookService.deleteWord(selectedWord.id)
      
      setTodayWords(prev => prev.filter(w => w.id !== selectedWord.id))
      setShowModal(false)
      setSelectedWord(null)
      
      // 캘린더 데이터도 새로고침
      fetchCalendarData()

    } catch (error) {
      setErrorMessage('단어 삭제에 실패했습니다.')
      setShowErrorModal(true)
    }
  }, [selectedWord, fetchCalendarData])

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
    <SafeAreaView 
    className="flex-1 bg-white"
    edges={['bottom', 'left', 'right']}
  >
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
          onConfirm={() => {
            setShowModal(false);
            setSelectedWord(null);
          }}
          onClose={() => {
            setShowModal(false);
            setSelectedWord(null);
          }}
        >
          <View className="bg-green-50 rounded-2xl p-4 mb-6 mt-4 min-h-24 justify-center">
            {definitionLoading ? (
              <ActivityIndicator size="large" color="#16a34a" />
            ) : (
              <Text className="text-base">{selectedWord.definition || '단어 뜻이 없습니다.'}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              setShowModal(false);
              setSelectedWord(null);
            }}
            className="bg-[#006716] py-3 rounded-xl mb-[-16px]"
            activeOpacity={0.7}
          >
            <Text className="text-white text-center font-semibold">닫기</Text>
          </TouchableOpacity>
        </Modal>
      )}

      {/* 에러 모달 */}
      <Modal
        visible={showErrorModal}
        title={errorMessage}
        onConfirm={() => setShowErrorModal(false)}
        onClose={() => setShowErrorModal(false)}
        confirmText="확인"
      />
    </SafeAreaView>
  )
}