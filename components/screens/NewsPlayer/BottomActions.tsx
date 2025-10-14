import { memo } from 'react'; // 추가: 성능 최적화
import { Image, TouchableOpacity, View } from 'react-native';
import { BottomActionsProps } from '../../../types/screens';

// 개선: memo로 컴포넌트 감싸기
// 이유: props가 변하지 않으면 리렌더링 스킵
export const BottomActions = memo(function BottomActions({
  isCarMode,
  onCarModeToggle,
  onDiscussionPress,
  onSavePress,
}: BottomActionsProps) {
  return (
    <View className="flex-row justify-around items-center mt-8 px-8 pb-4">
      {/* 자동차 모드 */}
      <TouchableOpacity 
        onPress={onCarModeToggle}
        className={`items-center p-3 rounded-2xl ${isCarMode ? 'bg-green-100' : ''}`}
        activeOpacity={0.7} 
      >
        <Image source={require('../../../my-expo-app/assets/images/car.png')} className="w-11 h-11" />
      </TouchableOpacity>

      {/* 토론 */}
      <TouchableOpacity 
        onPress={onDiscussionPress}
        className="items-center p-3"
        activeOpacity={0.7}
      >
        <Image source={require('../../../my-expo-app/assets/images/talk.png')} className="w-12 h-12" />
      </TouchableOpacity>

      {/* 저장 */}
      <TouchableOpacity 
        onPress={onSavePress}
        className="items-center p-3"
        activeOpacity={0.7}
      >
        <Image source={require('../../../my-expo-app/assets/images/store.png')} className="w-9 h-9" />
      </TouchableOpacity>
    </View>
  )
})