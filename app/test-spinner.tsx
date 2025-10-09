import { View, Text } from 'react-native';
import { Spinner } from '@/components/common';

export default function Index() {
  return (
    <View className="flex-1 bg-white">
      <Text className="text-2xl font-bold text-center mt-8">
        Spinner 테스트
      </Text>
      
      <View className="flex-1">
        <Spinner />
      </View>
    </View>
  );
}