import { CategoryChip } from '@/components/common'
import { useMemo } from 'react'; // 추가: 성능 최적화
import { Text, View } from 'react-native'
import { WordBookChipListProps } from '../../../types/screens'

export const WordBookChipList = ({
  words,
  selectedWord,
  onWordPress,
}: WordBookChipListProps) => {
  // 개선: useMemo로 grouping
  // 이유: words가 변경될 때만 재계산 (배열 slice 연산 비용 절감)
  const wordGroups = useMemo(() => {
    const result = []
    for (let i = 0; i < words.length; i += 3) {
      result.push(words.slice(i, i + 3))
    }
    return result
  }, [words])

  // 추가: 빈 상태 처리
  // 이유: 사용자에게 피드백 제공
  if (words.length === 0) {
    return (
      <View className="px-4 py-20 items-center">
        <Text className="text-gray-400 text-base">저장된 단어가 없습니다</Text>
      </View>
    )
  }

  return (
    <View className="px-4">
      {wordGroups.map((group, rowIndex) => (
        <View key={rowIndex} className="flex-row justify-start gap-2 mb-2">
          {group.map((word) => (
            <View key={word.id} style={{ width: '31%' }}>
              <CategoryChip
                label={word.word}
                isSelected={selectedWord?.id === word.id}
                onPress={() => onWordPress(word)}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}