import { Modal } from '@/components/common'
import TopBar from '@/components/common/TopBar'
import { addMonths, format, subMonths } from 'date-fns'
import { useCallback, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { SavedWord, WordBookCalendarItem } from '../../../types/screens'
import { WordBookCalendar } from './WordBookCalendar'
import { WordBookChipList } from './WordBookChipList'
import { WordBookDateDisplay } from './WordBookDateDisplay'

const DUMMY_CALENDAR_DATA: WordBookCalendarItem[] = [
  { date: format(new Date(), 'yyyy-MM-dd'), count: 5 },
]

const DUMMY_WORDS: SavedWord[] = [
  { 
    id: '1', 
    word: '흥행',
    definition: '영리를 목적으로 연극, 영화 등을 대중에게 보여 줌',
    savedAt: '2025-01-19'
  },
  { 
    id: '2', 
    word: '박스오피스',
    definition: '영화관의 매표소',
    savedAt: '2025-01-19'
  },
  { 
    id: '3', 
    word: '기록',
    definition: '어떤 사실을 적어서 남김',
    savedAt: '2025-01-19'
  },
]

export function WordBookTest() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [calendarData] = useState<WordBookCalendarItem[]>(DUMMY_CALENDAR_DATA)
  const [todayWords] = useState<SavedWord[]>(DUMMY_WORDS)
  const [selectedWord, setSelectedWord] = useState<SavedWord | null>(null)
  const [showModal, setShowModal] = useState(false)

  const handleWordPress = useCallback((word: SavedWord) => {
    setSelectedWord(word)
    setShowModal(true)
  }, [])

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => subMonths(prev, 1))
  }, [])

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => addMonths(prev, 1))
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar showBackButton={false} />

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <WordBookCalendar
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          calendarData={calendarData}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {selectedDate && <WordBookDateDisplay date={selectedDate} />}

        <WordBookChipList
          words={todayWords}
          selectedWord={selectedWord}
          onWordPress={handleWordPress}
        />
      </ScrollView>

      {selectedWord && (
        <Modal
          visible={showModal}
          title={selectedWord.word}
          onConfirm={() => setShowModal(false)}
          onClose={() => setShowModal(false)}
        >
          <View className="bg-green-50 rounded-2xl p-4">
            <Text className="text-base">
              {selectedWord.definition || '단어 뜻이 없습니다.'}
            </Text>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  )
}