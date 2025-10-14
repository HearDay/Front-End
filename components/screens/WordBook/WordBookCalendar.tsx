import { addDays, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from 'date-fns'
import { useMemo } from 'react'; // 추가: 성능 최적화를 위한 useMemo
import { Text, TouchableOpacity, View } from 'react-native'
import { WordBookCalendarProps } from '../../../types/screens'

// 추가: 요일 배열 상수화
// 이유: 매번 새로운 배열을 만들지 않고 재사용 (메모리 최적화)
const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const

// 추가: 색상 맵 상수화
// 이유: 상수 사용 (유지보수성 향상)
const COLOR_MAP = {
  light: 'bg-green-200',
  medium: 'bg-green-500',
  dark: 'bg-green-900',
} as const

export const WordBookCalendar = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  calendarData,
  selectedDate,
  onDateSelect,
}: WordBookCalendarProps) => {
  // 개선: useMemo로 캘린더 날짜 범위
  // 이유: currentDate가 변경될 때만 재계산 (불필요한 연산 방지)
  const { startDate, endDate } = useMemo(() => ({
    startDate: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    endDate: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  }), [currentDate])

  // 개선: useMemo로 Map
  // 이유: calendarData가 변경될 때만 Map 재생성
  const mapByDate = useMemo(
    () => new Map(calendarData.map(item => [item.date, item])),
    [calendarData]
  )

  // 개선: 색상 함수에서 상수 사용
  // 이유: 가독성 향상, 유지보수 용이
  const getUnderlineColor = (count: number) => {
    if (count === 0) return null
    if (count < 3) return COLOR_MAP.light
    if (count <= 7) return COLOR_MAP.medium
    return COLOR_MAP.dark
  }

  const renderDays = () => {
    const days = []
    let day = startDate

    while (day <= endDate) {
      const d = new Date(day.getTime())
      const key = format(d, 'yyyy-MM-dd')
      const item = mapByDate.get(key)
      const isToday = isSameDay(d, new Date())
      const isSelected = selectedDate && isSameDay(d, selectedDate)
      const underlineColor = item ? getUnderlineColor(item.count) : null
      const isCurrentMonth = d.getMonth() === currentDate.getMonth()

      days.push(
        <View 
          key={key}
          style={{ width: '14.28%' }}
          className="items-center py-3"
        >
          <TouchableOpacity
            onPress={() => item && onDateSelect(d)}
            className="items-center"
            activeOpacity={0.7}
          >
            <View className={`w-8 h-8 items-center justify-center rounded-full ${
              isToday ? 'bg-green-600' : ''
            }`}>
              <Text className={`text-sm ${
                isToday ? 'text-white font-bold' : 
                isCurrentMonth ? 'text-gray-800' : 'text-gray-300'
              }`}>
                {format(d, 'd')}
              </Text>
            </View>

            {/* 밑줄 */}
            {underlineColor && (
              <View className={`w-6 h-0.5 ${underlineColor} rounded-sm mt-1`} />
            )}
          </TouchableOpacity>
        </View>
      )

      day = addDays(day, 1)
    }
    return days
  }

  return (
    <View className="bg-white rounded-2xl p-4 mx-4 mt-4 border border-green-600">
      {/* 월 제목 및 화살표 */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity 
          onPress={onPrevMonth}
          activeOpacity={0.7} // 
        >
          <Text className="text-2xl text-gray-400">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity 
          onPress={onNextMonth}
          activeOpacity={0.7} // 
        >
          <Text className="text-2xl text-gray-400">›</Text>
        </TouchableOpacity>
      </View>

      {/* 구분선 */}
      <View className="h-px bg-green-600 mb-2" />

      {/* 개선: 요일 배열 상수 사용 */}
      {/* 이유: 매번 새 배열 생성하지 않음 */}
      <View className="flex-row justify-around mb-2">
        {WEEKDAYS.map((day) => (
          <Text key={day} className="text-xs text-green-800 w-10 text-center">
            {day}
          </Text>
        ))}
      </View>

      {/* 날짜 그리드 */}
      <View className="w-full">
        <View className="flex-row flex-wrap">
          {renderDays()}
        </View>
      </View>
    </View>
  )
}