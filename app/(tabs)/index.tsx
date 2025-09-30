// app/(tabs)/index.tsx

import { Text, View } from 'react-native';

export default function TabOneScreen() {
  return (
    // 뷰(View)에 플렉스, 배경색, 정렬 클래스 적용
    <View className="flex-1 items-center justify-center bg-[#FEFFF5] p-6">
      
      {/* 텍스트 색상, 볼드체, 폰트 크기 테스트 */}
      <Text className="text-3xl font-extrabold text-indigo-700 mb-4">
        NativeWind Success!
      </Text>

      {/* 배경색, 패딩, 그림자, 모서리 둥글게 테스트 */}
      <View className="bg-lime-300 p-4 rounded-xl shadow-lg shadow-lime-500/50">
        <Text className="text-lg text-black font-semibold">
          Hello, Tailwind is working perfectly!
        </Text>
      </View>

      {/* 너비, 높이, 마진, 테두리 테스트 */}
      <View className="w-4/5 h-1.5 bg-gray-300 mt-8 mb-4 rounded-full" />

      {/* 조건부 및 상태 스타일링 테스트 (Hover나 Focus 같은 상태는 RN에서 지원 안함) */}
      <Text className="text-sm text-gray-500 underline">
        (Styles: Background, Text Color, Shadow, Flex)
      </Text>
      
    </View>
  );
}