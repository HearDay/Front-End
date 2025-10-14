import { Text, TouchableOpacity, View } from 'react-native'
import { DiscussionActionButtonsProps } from '../../../types/screens'

export function DiscussionActionButtons({ 
  activeButton,
  onDiscussionPress, 
  onRecordPress 
}: DiscussionActionButtonsProps) {
  return (
    <View className="flex-row justify-start gap-3 px-4 pb-4">
      <TouchableOpacity
        className={`border border-[#00801A] rounded-full py-1.5 px-6 ${
          activeButton === 'discussion' ? 'bg-[#B3D7BB]' : 'bg-white'
        }`}
        onPress={onDiscussionPress}
        activeOpacity={0.7}
      >
        <Text className="text-center text-black font-semibold text-sm">
          토론하기
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className={`border border-[#00801A] rounded-full py-1.5 px-6 ${
          activeButton === 'record' ? 'bg-[#B3D7BB]' : 'bg-white'
        }`}
        onPress={onRecordPress}
        activeOpacity={0.7}
      >
        <Text className="text-center text-black font-semibold text-sm">
          기록보기
        </Text>
      </TouchableOpacity>
    </View>
  )
}