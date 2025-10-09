import { format } from 'date-fns'
import { Text, View } from 'react-native'
import { WordBookDateDisplayProps } from '../../../types/screens'

export const WordBookDateDisplay = ({ date }: WordBookDateDisplayProps) => (
  <View className="items-center my-6">
    <Text className="text-sm text-gray-500">{format(date, 'yyyy')}</Text>
    <Text className="text-2xl font-bold">{format(date, 'M월 d일')}</Text>
  </View>
)