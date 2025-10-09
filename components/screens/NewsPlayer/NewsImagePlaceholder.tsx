import { Image, Text, View } from 'react-native'
import { NewsImagePlaceholderProps } from '../../../types/screens'

export const NewsImagePlaceholder = ({ 
  imageUrl 
}: NewsImagePlaceholderProps) => (
  <View className="mx-6 rounded-2xl overflow-hidden h-64">
    {imageUrl ? (
      <Image 
        source={{ uri: imageUrl }}
        className="w-full h-full"
        resizeMode="cover"
      />
    ) : (
      <View className="w-full h-full bg-green-100 items-center justify-center">
        <Text className="text-6xl">🎧</Text>
      </View>
    )}
  </View>
)