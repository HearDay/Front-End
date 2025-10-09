import { Text, TouchableOpacity, View } from 'react-native'
import { AudioControlsProps } from '../../../types/screens'

export const AudioControls = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
}: AudioControlsProps) => (
  <View className="flex-row justify-center items-center mt-8 gap-8">
    {/* 이전 기사 */}
    <TouchableOpacity onPress={onPrev}>
      <Text className="text-5xl">⏮️</Text>
    </TouchableOpacity>

    {/* 재생/일시정지 */}
    <TouchableOpacity onPress={isPlaying ? onPause : onPlay}>
      <Text className="text-6xl">{isPlaying ? '⏸️' : '▶️'}</Text>
    </TouchableOpacity>

    {/* 다음 기사 */}
    <TouchableOpacity onPress={onNext}>
      <Text className="text-5xl">⏭️</Text>
    </TouchableOpacity>
  </View>
)