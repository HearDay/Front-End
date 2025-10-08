import { View, Text } from 'react-native';
import { useState } from 'react';
import { CategoryChipGroup } from '@/components/common';

export default function TestCategoryChipGroup() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View className="flex-1 justify-center bg-white p-4">
      <Text className="text-2xl font-bold mb-4">CategoryChipGroup 테스트</Text>
      
      <CategoryChipGroup
        categories={['경제', '방송/연예', 'IT', '쇼핑', '생활', '해외', '스포츠', '정치']}
        selectedCategory={selected}
        onSelectCategory={(category) => {
          setSelected(category);
          console.log('선택됨:', category);
        }}
      />
      
      <Text className="mt-4 text-lg">
        현재 선택: {selected || '없음'}
      </Text>
    </View>
  );
}