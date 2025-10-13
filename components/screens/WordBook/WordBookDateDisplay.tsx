import { format } from 'date-fns'
import { memo } from 'react'; // 추가: 불필요한 리렌더링 방지
import { Text, View } from 'react-native'
import { WordBookDateDisplayProps } from '../../../types/screens'

// 개선: memo로 컴포넌트 감싸기
// 이유: date가 같으면 리렌더링 스킵 (React.memo는 props 얕은 비교)
export const WordBookDateDisplay = memo(function WordBookDateDisplay({ 
  date 
}: WordBookDateDisplayProps) {
  return (
    <View className="items-center my-6">
      <Text className="text-sm text-gray-500">{format(date, 'yyyy')}</Text>
      <Text className="text-2xl font-bold">{format(date, 'M월 d일')}</Text>
    </View>
  )
})