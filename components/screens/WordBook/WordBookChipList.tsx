import { CategoryChip } from '@/components/common'
import { Platform, Text, View } from 'react-native'
import { WordBookChipListProps } from '../../../types/screens'

export const WordBookChipList = ({
  words,
  selectedWord,
  onWordPress,
}: WordBookChipListProps) => {

  if (words.length === 0) {
    return (
      <View className="px-4 py-20 items-center">
        <Text className="text-gray-400 text-base">저장된 단어가 없습니다</Text>
      </View>
    )
  }

  const chipMargin = Platform.OS === 'android' ? 12 : 4;

  return (
    <View className="flex-row flex-wrap justify-center px-4 py-2">
      {words.map((word) => (
        <View
          key={word.id}
          style={{
            marginRight: chipMargin,
            marginBottom: chipMargin,
          }}
        >
          <CategoryChip
            label={word.word}
            isSelected={selectedWord?.id === word.id}
            onPress={() => onWordPress(word)}
          />
        </View>
      ))}
    </View>
  )
}