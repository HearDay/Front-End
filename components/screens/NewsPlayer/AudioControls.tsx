import { memo } from 'react'; // 추가: 성능 최적화
import { Image, TouchableOpacity, View } from 'react-native';
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
        <Image source={require('../../../my-expo-app/assets/images/back.png')} className="w-12 h-12" />
      </TouchableOpacity>

      {/* 재생/일시정지 */}
      <TouchableOpacity 
        onPress={isPlaying ? onPause : onPlay}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image source={isPlaying ? require('../../../my-expo-app/assets/images/pause.png') : require('../../../my-expo-app/assets/images/play.png')} className="w-16 h-16" />
      </TouchableOpacity>

      {/* 다음 기사 */}
      <TouchableOpacity 
        onPress={onNext}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Image source={require('../../../my-expo-app/assets/images/go.png')} className="w-12 h-12" />
      </TouchableOpacity>
    </View>
  )
})