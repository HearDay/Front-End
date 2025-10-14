import { useState } from 'react'; // 추가: 이미지 에러 처리
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SavedNewsCardProps } from '../../../types/screens';

export function SavedNewsCard({
  news,
  onPress,
  onDelete
}: SavedNewsCardProps) {
  // 추가: 이미지 로딩 실패 상태
  // 이유: 이미지 URL이 깨졌을 때 대체 UI 표시
  const [imageError, setImageError] = useState(false)

  return (
    <View className="bg-white rounded-2xl mb-3 shadow-sm overflow-hidden">
      <TouchableOpacity
        className="flex-row p-4"
        onPress={onPress}
        activeOpacity={0.7}
      >
        {/* 개선: 이미지 에러 처리 추가 */}
        {/* 이유: 네트워크 문제나 잘못된 URL로 이미지 로드 실패 시 대체 UI */}
        {imageError ? (
          <View className="w-24 h-24 rounded-lg bg-gray-200" />
        ) : (
          <Image
            source={{ uri: news.imageUrl }}
            className="w-24 h-24 rounded-lg"
            onError={() => setImageError(true)} // 이미지 로드 실패 시 대체 UI 표시
          />
        )}

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

          {/* 하단 정보 (날짜 및 삭제) */}
          <View className="flex-row justify-between items-center mt-2">
            {/* 저장 날짜 */}
            <Text className="text-xs text-gray-400">
              {news.savedAt}
            </Text>

            {/* 삭제 텍스트 버튼 */}
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDelete(news.id);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text className="text-xs text-gray-400 font-semibold">삭제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}