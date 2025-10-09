import { CategoryChip } from '@/components/common';
import { View } from 'react-native';
import { SavedWord, WordBookChipListProps } from '../../../types/screens';

export const WordBookChipList = ({
  words,
  selectedWord,
  onWordPress,
}: WordBookChipListProps) => {
  // 3개씩 묶기
  const groupByThree = (arr: SavedWord[]) => {
    const result = [];
    for (let i = 0; i < arr.length; i += 3) {
      result.push(arr.slice(i, i + 3));
    }
    return result;
  };

  const wordGroups = groupByThree(words);

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
  );
};