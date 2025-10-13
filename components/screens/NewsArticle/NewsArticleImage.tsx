import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { NewsArticleImageProps } from '../../../types/screens'

export function NewsArticleImage({ imageUrl, onPress }: NewsArticleImageProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View className="h-64 relative">
        {!imageUrl || imageError ? (
          // 텍스트 제거, gradient만 표시
          <LinearGradient
            colors={['#A8E6B8', '#E8F5E9', '#81C995']}
            className="w-full h-full"
          />
        ) : (
          <Image 
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        )}
      </View>
    </TouchableOpacity>
  )
}