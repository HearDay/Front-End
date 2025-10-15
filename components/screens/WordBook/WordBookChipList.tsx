import { CategoryChip } from '@/components/common'
import { Text, View } from 'react-native'
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

  return (
    <View className="flex-row flex-wrap justify-start gap-2 px-4 py-2">
      {words.map((word) => (
        <CategoryChip
          key={word.id}
          label={word.word}
          isSelected={selectedWord?.id === word.id}
          onPress={() => onWordPress(word)}
        />
      ))}
    </View>
  )
}