import { Image, View } from 'react-native'

export function DiscussionHeader() {
  return (
    // 수정: 양옆 마진 줄이기 (px-4 → px-2)
    <View className="px-1 pt-4 pb-2">
      <Image
        source={require('../../../my-expo-app/assets/images/Discussion.png')}
        style={{ width: '100%', height: 128 }}
        resizeMode="contain"
      />
    </View>
  )
}