import { useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { DiscussionNewsCardProps } from '../../../types/screens'

export function DiscussionNewsCard({ news, onPress }: DiscussionNewsCardProps) {
  const [imageError, setImageError] = useState(false)

  const imageSource = imageError
    ? require('../../../my-expo-app/assets/images/DefaultCard.png')
    : { uri: news.imageUrl }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
        borderRadius: 16,
      }}
      className="self-center mb-3"
      activeOpacity={0.7}
    >
      <View
        className="flex-row items-center w-[350px] h-[106px] px-4 py-3 rounded-2xl overflow-hidden bg-white"
      >
        {/* 이미지 */}
        <View
          className="mr-4 rounded-md overflow-hidden"
          style={{
            width: 148,
            aspectRatio: 148 / 83,
          }}
        >
          <Image
            source={imageSource}
            resizeMode="cover"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 8,
            }}
            onError={() => setImageError(true)}
          />
        </View>

        {/* 텍스트 */}
        <View className="flex-1 justify-center">
          <Text
            className="text-[15px] font-extrabold text-black mb-[3px]"
            numberOfLines={2}
          >
            {news.title}
          </Text>
          <Text
            className="text-[13px] text-[#4B5563] leading-snug"
            numberOfLines={2}
          >
            {news.summary}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}