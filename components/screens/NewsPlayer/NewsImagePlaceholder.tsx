import { memo, useState } from 'react'; // 추가: 성능 최적화, 에러 처리
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { NewsImagePlaceholderProps } from '../../../types/screens';


// 개선: memo로 컴포넌트 감싸기
// 이유: imageUrl이 변하지 않으면 리렌더링 스킵
export const NewsImagePlaceholder = memo(function NewsImagePlaceholder({ 
  imageUrl,
  onPress
}: NewsImagePlaceholderProps) {
  // 추가: 이미지 로딩 실패 상태
  // 이유: 네트워크 문제로 이미지 로드 실패 시 대체 UI
  const [imageError, setImageError] = useState(false)

const handlePress = () => {
    // console.log('클릭')
    if (onPress){
        onPress()
    }
}

  return (
    <TouchableOpacity 
      onPress={handlePress}
      activeOpacity={0.9}
      disabled={!onPress} // onPress 없으면 비활성화
    >
    <View className="mx-6 rounded-2xl overflow-hidden h-64">
      {imageUrl && !imageError ? (
        <Image 
          source={{ uri: imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
          onError={() => setImageError(true)} // 이미지 로드 실패 처리
        />
      ) : (
        <View className="w-full h-full bg-green-100 items-center justify-center">
          <Text className="text-6xl">🎧</Text>
          <Text className="text-sm text-gray-600 mt-2">뉴스 이미지</Text>
          {/* 추가: 설명 텍스트 */}
        </View>
      )}
    </View>
    </TouchableOpacity>
  )
})