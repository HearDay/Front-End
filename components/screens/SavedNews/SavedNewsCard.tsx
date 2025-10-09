import { Image, Text, TouchableOpacity, View } from 'react-native'
import { SavedNewsCardProps } from '../../../types/screens'

export const SavedNewsCard = ({ 
  news, 
  onPress,
  onDelete 
}: SavedNewsCardProps) => (
  <View className="bg-white rounded-2xl mb-3 shadow-sm overflow-hidden">
    <TouchableOpacity
      className="flex-row p-4"
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* 이미지 */}
      <Image
        source={{ uri: news.imageUrl }}
        className="w-24 h-24 rounded-lg"
      />

      {/* 내용 */}
      <View className="flex-1 ml-4">
        {/* 카테고리 태그 */}
        <View className="bg-green-100 self-start px-3 py-1 rounded-full mb-2">
          <Text className="text-xs text-green-700 font-semibold">
            {news.category}
          </Text>
        </View>

        {/* 제목 */}
        <Text className="text-base font-semibold mb-1" numberOfLines={2}>
          {news.title}
        </Text>

        {/* 요약 */}
        <Text className="text-sm text-gray-600" numberOfLines={2}>
          {news.summary}
        </Text>

        {/* 저장 날짜 */}
        <Text className="text-xs text-gray-400 mt-2">
          {news.savedAt}
        </Text>
      </View>

      {/* 삭제 버튼 */}
      <TouchableOpacity
        className="w-8 h-8 items-center justify-center"
        onPress={() => onDelete(news.id)}
      >
        <Text className="text-xl text-gray-400">🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  </View>
)