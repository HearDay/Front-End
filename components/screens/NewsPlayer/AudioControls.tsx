import { memo } from 'react'; // 추가: 성능 최적화
import { Text, TouchableOpacity, View } from 'react-native';
import { AudioControlsProps } from '../../../types/screens';

// 개선: memo로 컴포넌트 감싸기
// 이유: props가 변하지 않으면 리렌더링 스킵
export const AudioControls = memo(function AudioControls({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
}: AudioControlsProps) {
  return (
    <View className="flex-row justify-center items-center mt-8 gap-8">
      {/* 이전 기사 */}
      <TouchableOpacity 
        onPress={onPrev}
        activeOpacity={0.7} 
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // 추가: 터치 영역 확대
      >
        <Text className="text-5xl">⏮️</Text>
      </TouchableOpacity>

      {/* 재생/일시정지 */}
      <TouchableOpacity 
        onPress={isPlaying ? onPause : onPlay}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text className="text-6xl">{isPlaying ? '⏸️' : '▶️'}</Text>
      </TouchableOpacity>

      {/* 다음 기사 */}
      <TouchableOpacity 
        onPress={onNext}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text className="text-5xl">⏭️</Text>
      </TouchableOpacity>
    </View>
  )
})