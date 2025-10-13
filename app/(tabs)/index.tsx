import { CategoryChipGroup } from "@/components/common";
import HeroSection from "@/components/screens/HomePage/HeroSection";
import NewsCardList from "@/components/screens/HomePage/NewsCardList";
import NewsCardSlider from "@/components/screens/HomePage/NewsCardSlider";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function Index() {  // ← function Index로 변경
  const userName = "지니";
  const categories = [
    "경제",
    "방송 / 연예",
    "IT",
    "쇼핑",
    "생활",
    "해외",
    "스포츠",
    "정치",
  ];

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const offset = useSharedValue(0);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    offset.value = withTiming(1, { duration: 600 });
  };

  const handleBackToHome = () => {
    setSelectedCategory(null);
    offset.value = withTiming(0, { duration: 600 });
  };

  const listStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming((1 - offset.value) * 50) }],
    opacity: withTiming(offset.value),
  }));

  return (
    <View className="flex-1 bg-white">
      <HeroSection offset={offset} />

      {selectedCategory ? (
        <Animated.View style={listStyle}>
          <View className="flex-row justify-between items-center px-6 mt-7 mb-2">
            <Text className="text-[17px] font-extrabold text-[#002C14]">
              {selectedCategory} 관련 뉴스
            </Text>
            <Text
              className="text-[14px] text-gray-600 pr-2"
              onPress={handleBackToHome}
            >
              돌아가기
            </Text>
          </View>

          <View className="mb-4 mt-3">
            <CategoryChipGroup
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleSelectCategory}
            />
          </View>

          <NewsCardList background="green" />
        </Animated.View>
      ) : (
        <>
          <View className="px-6 mt-4">
            <Text className="text-[16px] text-right font-extrabold text-[#002C14] mt-2 mr-2">
              {userName}님이 좋아할 만한 오늘의 뉴스
            </Text>
          </View>

          <NewsCardSlider />

          <View className="px-6 mt-4">
            <Text className="text-[16px] text-right font-extrabold text-[#002C14] mt-2 mb-4 mr-2">
              카테고리별로 골라보기
            </Text>
          </View>

          <CategoryChipGroup
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </>
      )}
    </View>
  );
}