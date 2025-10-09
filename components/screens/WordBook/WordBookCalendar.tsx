import { addDays, endOfMonth, endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from 'date-fns'
import { Text, TouchableOpacity, View } from 'react-native'
import { WordBookCalendarProps } from '../../../types/screens'

export const WordBookCalendar = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  calendarData,
  selectedDate,
  onDateSelect,
}: WordBookCalendarProps) => {
  const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
  const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })

  // 빠른 조회용 맵
  const mapByDate = new Map(calendarData.map(item => [item.date, item]))

  // 단어 개수에 따른 색상 (0: 없음, 1-3: 연함, 4-7: 중간, 8+: 진함)
  const getUnderlineColor = (count: number) => {
    if (count === 0) return null
    if (count <= 3) return 'bg-green-200'
    if (count <= 7) return 'bg-green-400'
    return 'bg-green-600'
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
        style={{ width: '14.28%' }}  // 7일이니까 100/7 = 14.28%
        className="items-center py-3"
      >
        <TouchableOpacity
          onPress={() => item && onDateSelect(d)}
          className="items-center"
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
    <View className="bg-white rounded-2xl p-4 mx-4 mt-4 border border-green-200">
      {/* 월 제목 및 화살표 */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={onPrevMonth}>
          <Text className="text-2xl text-gray-400">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={onNextMonth}>
          <Text className="text-2xl text-gray-400">›</Text>
        </TouchableOpacity>
      </View>

      {/* 구분선 */}
      <View className="h-px bg-green-200 mb-2" />

      {/* 요일 */}
      <View className="flex-row justify-around mb-2">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((d) => (
          <Text key={d} className="text-xs text-green-300 w-10 text-center">{d}</Text>
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