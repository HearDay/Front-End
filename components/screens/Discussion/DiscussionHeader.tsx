import { Image, View } from 'react-native'

export function DiscussionHeader() {
  return (
    <View className="pb-6 items-center">
      <Image
        source={require('../../../my-expo-app/assets/images/Discussion.png')}
        style={{ width: '100%', height: 138 }}
        resizeMode="contain"
      />
    </View>
  )
}