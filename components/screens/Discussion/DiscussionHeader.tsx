import { Image, View } from 'react-native'

export function DiscussionHeader() {
  return (
    <View className="px-4 pt-4 pb-2">
      <Image
        source={require('../../../my-expo-app/assets/images/Discussion.png')}
        className="w-full h-32"
        resizeMode="contain"
      />
    </View>
  )
}