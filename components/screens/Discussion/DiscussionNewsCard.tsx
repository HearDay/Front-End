import { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { DiscussionNewsCardProps } from '../../../types/screens'

export function DiscussionNewsCard({ news, onPress }: DiscussionNewsCardProps) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl mx-4 mb-3 shadow-lg"
      activeOpacity={0.7}
    >
      <View className="p-4 rounded-xl overflow-hidden">
        <View className="flex-row gap-3">
          {/* 이미지 */}
          {imageError ? (
            <View className="w-24 h-24 bg-gray-200 items-center justify-center">
              <Text className="text-gray-400"></Text>
            </View>
          ) : (
            <Image
              source={{ uri: news.imageUrl }}
              className="w-40 h-24 rounded-xl"
              resizeMode="cover"
              onError={() => setImageError(true)}
            />
          )}

          {/* 텍스트 */}
          <View className="flex-1 p-3 justify-center">
            <Text className="text-base font-bold text-gray-800 mb-1" numberOfLines={2}>
              {news.title}
            </Text>
            <Text className="text-sm text-gray-600" numberOfLines={2}>
              {news.summary}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}