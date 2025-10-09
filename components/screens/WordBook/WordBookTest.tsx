import { Modal } from '@/components/common';
import { addMonths, format, subMonths } from 'date-fns';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SavedWord, WordBookCalendarItem } from '../../../types/screens';
import { WordBookCalendar } from './WordBookCalendar';
import { WordBookChipList } from './WordBookChipList';
import { WordBookDateDisplay } from './WordBookDateDisplay';

export const WordBookTest = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 0, 19));
  const [selectedWord, setSelectedWord] = useState<SavedWord | null>(null);
  const [showModal, setShowModal] = useState(false);

  // 더미 캘린더 데이터
  const calendarData: WordBookCalendarItem[] = [
    { date: '2025-01-10', count: 2 },
    { date: '2025-01-15', count: 5 },
    { date: '2025-01-19', count: 8 },
    { date: '2025-01-23', count: 3 },
    { date: '2025-01-25', count: 12 },
  ];

  // 날짜별 더미 단어 데이터
  const wordsByDate: Record<string, SavedWord[]> = {
    '2025-01-10': [
      { id: '1', word: '개발', savedDate: '2025-01-10' },
      { id: '2', word: '기술', savedDate: '2025-01-10' },
    ],
    '2025-01-15': [
      { id: '3', word: '경제', savedDate: '2025-01-15' },
      { id: '4', word: '투자', savedDate: '2025-01-15' },
      { id: '5', word: '시장', savedDate: '2025-01-15' },
      { id: '6', word: '성장', savedDate: '2025-01-15' },
      { id: '7', word: '분석', savedDate: '2025-01-15' },
    ],
    '2025-01-19': [
      { id: '8', word: '흥행', savedDate: '2025-01-19' },
      { id: '9', word: '입증하다', savedDate: '2025-01-19' },
      { id: '10', word: '연결', savedDate: '2025-01-19' },
      { id: '11', word: '복미', savedDate: '2025-01-19' },
      { id: '12', word: '투자하다', savedDate: '2025-01-19' },
      { id: '13', word: '배급하다', savedDate: '2025-01-19' },
      { id: '14', word: '수입', savedDate: '2025-01-19' },
      { id: '15', word: '집계', savedDate: '2025-01-19' },
    ],
    '2025-01-23': [
      { id: '16', word: '환경', savedDate: '2025-01-23' },
      { id: '17', word: '보호', savedDate: '2025-01-23' },
      { id: '18', word: '지속', savedDate: '2025-01-23' },
    ],
    '2025-01-25': [
      { id: '19', word: '정치', savedDate: '2025-01-25' },
      { id: '20', word: '선거', savedDate: '2025-01-25' },
      { id: '21', word: '정책', savedDate: '2025-01-25' },
      { id: '22', word: '국회', savedDate: '2025-01-25' },
      { id: '23', word: '법안', savedDate: '2025-01-25' },
      { id: '24', word: '표결', savedDate: '2025-01-25' },
      { id: '25', word: '의원', savedDate: '2025-01-25' },
      { id: '26', word: '여론', savedDate: '2025-01-25' },
      { id: '27', word: '공약', savedDate: '2025-01-25' },
      { id: '28', word: '개혁', savedDate: '2025-01-25' },
      { id: '29', word: '예산', savedDate: '2025-01-25' },
      { id: '30', word: '심의', savedDate: '2025-01-25' },
    ],
  };

  // 선택한 날짜의 단어 가져오기
  const getTodayWords = (): SavedWord[] => {
    if (!selectedDate) return [];
    const key = format(selectedDate, 'yyyy-MM-dd');
    return wordsByDate[key] || [];
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('날짜 선택:', format(date, 'yyyy-MM-dd'));
  };

  const handleWordPress = (word: SavedWord) => {
    setSelectedWord(word);
    setShowModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* 캘린더 */}
      <WordBookCalendar
        currentDate={currentDate}
        onPrevMonth={() => setCurrentDate(subMonths(currentDate, 1))}
        onNextMonth={() => setCurrentDate(addMonths(currentDate, 1))}
        calendarData={calendarData}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      {/* 날짜 표시 */}
      {selectedDate && <WordBookDateDisplay date={selectedDate} />}

      {/* 단어 칩 리스트 */}
      <WordBookChipList
        words={getTodayWords()}
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
          <View className="bg-blue-50 rounded-2xl p-4">
            <Text className="text-base leading-6">
              (테스트) {selectedWord.word}의 뜻이 여기 표시됩니다.
            </Text>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};