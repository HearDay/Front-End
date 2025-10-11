import { LinearGradient } from 'expo-linear-gradient'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { NewsArticleImageProps } from '../../../types/screens'

export function NewsArticleImage ({ imageUrl, onPress }: NewsArticleImageProps) {
    return (
  <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
    <View className="h-64 relative">
      {imageUrl ? (
        <Image 
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={['#A8E6B8', '#E8F5E9', '#81C995']}
          className="w-full h-full items-center justify-center"
        >
          <Text className="text-white text-lg">뉴스 사진</Text>
        </LinearGradient>
      )}
    </View>
  </TouchableOpacity>
)
}