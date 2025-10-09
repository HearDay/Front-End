import { Text, TouchableOpacity, View } from 'react-native'
import { BottomActionsProps } from '../../../types/screens'

export const BottomActions = ({
  isCarMode,
  onCarModeToggle,
  onDiscussionPress,
  onSavePress,
}: BottomActionsProps) => (
  <View className="flex-row justify-around items-center mt-8 px-8">
    {/* 자동차 모드 */}
    <TouchableOpacity 
      onPress={onCarModeToggle}
      className={`items-center p-3 rounded-2xl ${isCarMode ? 'bg-green-100' : ''}`}
    >
      <Text className="text-4xl">🚗</Text>
      <Text className="text-xs mt-1">{isCarMode ? 'ON' : 'OFF'}</Text>
    </TouchableOpacity>

    {/* 토론 */}
    <TouchableOpacity 
      onPress={onDiscussionPress}
      className="items-center p-3"
    >
      <Text className="text-4xl">💬</Text>
    </TouchableOpacity>

    {/* 저장 */}
    <TouchableOpacity 
      onPress={onSavePress}
      className="items-center p-3"
    >
      <Text className="text-4xl">📥</Text>
    </TouchableOpacity>
  </View>
)