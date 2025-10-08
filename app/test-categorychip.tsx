import { View, Text } from 'react-native';
import { CategoryChip } from '@/components/common';

export default function TestCategoryChip() {
  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold mb-8">CategoryChip 테스트</Text>
      
      <View className="flex-row gap-2 mb-4">
        <CategoryChip 
          label="경제" 
          isSelected={true} 
          onPress={() => console.log('경제 클릭')} 
        />
        
        <CategoryChip 
          label="IT" 
          isSelected={false} 
          onPress={() => console.log('IT 클릭')} 
        />
      </View>

      <View className="flex-row gap-2">
        <CategoryChip 
          label="방송/연예" 
          isSelected={false} 
          onPress={() => console.log('방송/연예 클릭')} 
        />
        
        <CategoryChip 
          label="스포츠" 
          isSelected={true} 
          onPress={() => console.log('스포츠 클릭')} 
        />
      </View>
    </View>
  );
}