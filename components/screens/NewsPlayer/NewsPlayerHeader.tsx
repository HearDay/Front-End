import { Text, TouchableOpacity, View } from 'react-native'
import { NewsPlayerHeaderProps } from '../../../types/screens'

export const NewsPlayerHeader = ({ 
  title, 
  onBack 
}: NewsPlayerHeaderProps) => (
  <>
    {/* 뒤로가기 버튼 */}
    <View className="px-4 pt-2">
      <TouchableOpacity onPress={onBack}>
        <Text className="text-3xl">←</Text>
      </TouchableOpacity>
    </View>

    {/* 제목 */}
    <View className="px-6 pt-8 pb-6">
      <Text className="text-2xl font-bold leading-tight text-center">
        {title}
      </Text>
    </View>
  </>
)