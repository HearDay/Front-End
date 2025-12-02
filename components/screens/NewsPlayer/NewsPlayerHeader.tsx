import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NewsPlayerHeaderProps } from '../../../types/screens';

export const NewsPlayerHeader = memo(function NewsPlayerHeader({
  title,
  onBack,
  onQuizPress
}: NewsPlayerHeaderProps) {
  return (
    <>
      <View className="px-4 pt-2 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => {
            onBack?.();
          }}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text className="text-3xl">←</Text>
        </TouchableOpacity>

        {onQuizPress && (
          <TouchableOpacity
            onPress={onQuizPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-[20px] font-bold">
              <Text className="text-[#FF9D42]">Q</Text>
              <Text className="text-[#89B93F]">U</Text>
              <Text className="text-[#FF9D42]">I</Text>
              <Text className="text-[#4A90E2]">Z</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="px-6 pt-8 pb-6">
        <Text
          className="text-2xl font-bold leading-tight text-center"
          numberOfLines={2}
        >
          {title}
        </Text>
      </View>
    </>
  )
})