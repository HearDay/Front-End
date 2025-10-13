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

const NewsCardSlider = () => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveIndex(index);
  };


  const handleNewsPress = (newsId: string) => {
    router.push(`/newsplayer/${newsId}`);
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
              image={item.image}
              background="green"
            />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

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

      <Text className="text-gray-500 text-xs self-end pr-8">
        9월 17일 16:00 업데이트
      </Text>
    </View>
  );
};

export default NewsCardSlider;
