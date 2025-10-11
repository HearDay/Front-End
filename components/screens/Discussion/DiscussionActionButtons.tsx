import { CategoryChip } from '@/components/common'
import { View } from 'react-native'
import { DiscussionActionButtonsProps } from '../../../types/screens'

export function DiscussionActionButtons({ 
  onDiscussionPress, 
  onRecordPress 
}: DiscussionActionButtonsProps) {
  return (
    <View className="flex-row gap-3 px-4 pb-4">
      <View style={{ width: '48%' }}>
        <CategoryChip
          label="토론하기"
          isSelected={false}
          onPress={onDiscussionPress}
        />
      </View>
      <View style={{ width: '48%' }}>
        <CategoryChip
          label="기록보기"
          isSelected={false}
          onPress={onRecordPress}
        />
      </View>
    </View>
  )
}