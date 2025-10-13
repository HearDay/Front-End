import { memo } from 'react'; // 추가: 성능 최적화
import { Text, TouchableOpacity, View } from 'react-native';
import { LyricsDisplayProps } from '../../../types/screens';

// 개선: memo로 컴포넌트 감싸기
// 이유: currentLines가 변하지 않으면 리렌더링 스킵
export const LyricsDisplay = memo(function LyricsDisplay({ 
  currentLines,
  onPress
}: LyricsDisplayProps) {
    const handlePress = () => {
       // console.log('가사클릭') 
        if (onPress){
            onPress()
        }
    }
  // 추가: 빈 상태 처리
  // 이유: 로딩 중이거나 데이터 없을 때 대체 UI
  if (currentLines.length === 0) {
    return (
      <View className="px-6 pt-6 items-center">
        <Text className="text-base text-gray-400">
          뉴스 내용을 불러오는 중...
        </Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
    <View className="px-6 pt-6">
      {currentLines.map((line, index) => (
        <Text 
          key={index} 
          className="text-base leading-7 text-gray-800 text-center mb-2"
          // 추가: mb-2로 줄 간격 추가
        >
          {line}
        </Text>
      ))}
    </View>
  </TouchableOpacity>
  )
})