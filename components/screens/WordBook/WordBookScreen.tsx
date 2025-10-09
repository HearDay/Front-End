// 단어장쪽 캘린더 색, 단어 액티브 색 , 배열 정렬 수정

import { Modal } from '@/components/common'
import { addMonths, subMonths } from 'date-fns'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
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

  // 캘린더 데이터 로드 (월별)
  useEffect(() => {
    fetchCalendarData()
  }, [currentDate])

  // 선택한 날짜의 단어 로드
  useEffect(() => {
    if (selectedDate) {
      fetchWordsByDate(selectedDate)
    }
  }, [selectedDate])

  const fetchCalendarData = async () => {
    try {
      // TODO: API 호출
      // const response = await wordBookService.getCalendar(currentDate)
      // setCalendarData(response)
      console.log('캘린더 데이터 로드')
    } catch (error) {
      console.error('캘린더 로드 실패:', error)
    }
  }

  const fetchWordsByDate = async (date: Date) => {
    try {
      // TODO: API 호출
      // const response = await wordBookService.getWordsByDate(date)
      // setTodayWords(response)
      console.log('단어 로드:', date)
    } catch (error) {
      console.error('단어 로드 실패:', error)
    }
  }

  const handleWordPress = (word: SavedWord) => {
    setSelectedWord(word)
    setShowModal(true)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 상단바는 _layout.tsx에서 처리 */}

      {/* 캘린더 */}
      <WordBookCalendar
        currentDate={currentDate}
        onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
        onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
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

      {/* 하단 네비게이션은 _layout.tsx에서 처리 */}
    </SafeAreaView>
  )
}
