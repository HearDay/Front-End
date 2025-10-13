import { memo } from 'react'; // 추가: 성능 최적화
import { Text, TouchableOpacity, View } from 'react-native';
import { NewsPlayerHeaderProps } from '../../../types/screens';

// 개선: memo로 컴포넌트 감싸기
// 이유: title, onBack이 변하지 않으면 리렌더링 스킵
export const NewsPlayerHeader = memo(function NewsPlayerHeader({ 
  title, 
  onBack 
}: NewsPlayerHeaderProps) {
  return (
    <>
      {/* 뒤로가기 버튼 */}
      <View className="px-4 pt-2">
        <TouchableOpacity 
          onPress={onBack}
          activeOpacity={0.7} 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // ✅ 추가: 터치 영역 확대
        >
          <Text className="text-3xl">←</Text>
        </TouchableOpacity>
      </View>

      {/* 제목 */}
      <View className="px-6 pt-8 pb-6">
        <Text 
          className="text-2xl font-bold leading-tight text-center"
          numberOfLines={2} // 추가: 제목이 너무 길 때 2줄로 제한
        >
          {title}
        </Text>
      </View>
    </>
  )
})