import { Image, Text, TouchableOpacity, View } from 'react-native'
import { DiscussionNewsCardProps } from '../../../types/screens'

export function DiscussionNewsCard({ news, onPress }: DiscussionNewsCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl mx-4 mb-3 overflow-hidden shadow-sm"
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {/* 이미지 */}
        <Image
          source={{ uri: news.imageUrl }}
          className="w-24 h-24"
          resizeMode="cover"
        />

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
    </TouchableOpacity>
  )
}