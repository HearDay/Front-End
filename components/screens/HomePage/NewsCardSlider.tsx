import NewsCard from "@/components/common/NewsCard";
import { RecommendArticle } from "@/types/auth/recommendNews";
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

const { width } = Dimensions.get("window");

interface NewsCardSliderProps {
  updateTime?: string;
  articles?: RecommendArticle[];
}

const NewsCardSlider = ({ updateTime, articles = [] }: NewsCardSliderProps) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveIndex(index);
  };

  const handleNewsPress = (articleId: number) => {
    router.push(`/newsplayer/${articleId}?from=home`);
  };

  return (
    <View className="items-center mt-4">
      {articles.length > 0 ? (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {articles.map((item) => (
              <View key={item.id} style={{ width }}>
                <TouchableOpacity
                  onPress={() => handleNewsPress(item.id)}
                  activeOpacity={0.8}
                >
                  <NewsCard
                    title={item.title}
                    description={item.originLink}
                    imageUrl={item.imageUrl}
                    background="green"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View className="relative w-full">
            <View className="absolute left-0 mt-1 right-0 items-center">
              <View className="flex-row">
                {articles.map((_, index) => (
                  <View
                    key={index}
                    className={`w-2 h-2 mx-1 rounded-full ${
                      index === activeIndex ? "bg-green-700" : "bg-[#B3D7BB]"
                    }`}
                  />
                ))}
              </View>
            </View>
            {updateTime && (
              <Text className="absolute right-8 text-gray-500 text-xs whitespace-nowrap">
                {updateTime} 업데이트
              </Text>
            )}
            <View style={{ height: 30 }} />
          </View>


        </>
      ) : (
        <Text className="text-gray-500 text-sm mt-10">
          추천 뉴스가 없습니다.
        </Text>
      )}
    </View>
  );
};

export default NewsCardSlider;
