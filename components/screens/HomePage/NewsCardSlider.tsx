import NewsCard from "@/components/common/NewsCard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { newsDummy } from "./NewsCardDummy";

const { width } = Dimensions.get("window");

interface NewsCardSliderProps {
  updateTime?: string; // 홈 API에서 받아온 업데이트 시간 표시용
}

const NewsCardSlider = ({ updateTime }: NewsCardSliderProps) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveIndex(index);
  };

  const handleNewsPress = (articleId: string) => {
    router.push(`/newsplayer/${articleId}`);
  };

  return (
    <View className="items-center mt-4">
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {newsDummy.map((item, index) => (
          <View key={index} style={{ width }}>
            <TouchableOpacity
              onPress={() => handleNewsPress(item.id)}
              activeOpacity={0.8}
            >
              <NewsCard
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                background="green"
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* 슬라이드 인디케이터 */}
      <View className="flex-row justify-center mt-2">
        {newsDummy.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${
              index === activeIndex ? "bg-green-700" : "bg-[#B3D7BB]"
            }`}
          />
        ))}
      </View>

      {/* 업데이트 시간 표시 */}
      <Text className="text-gray-500 text-xs self-end pr-8 mt-1">
        {updateTime ? `${updateTime} 업데이트` : "업데이트 정보 없음"}
      </Text>
    </View>
  );
};

export default NewsCardSlider;
