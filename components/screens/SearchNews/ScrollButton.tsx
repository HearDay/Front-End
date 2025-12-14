import React, { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ScrollButtonProps {
  categories: string[];
  onSelect: (category: string) => void;
  selectedCategory: string;

  // 스크롤 복원
  initialX: number;
  onScrollX: (x: number) => void;
}

export default function ScrollButton({
  categories,
  onSelect,
  selectedCategory,
  initialX,
  onScrollX,
}: ScrollButtonProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: initialX, animated: false });
    }
  }, [initialX]);

  return (
    <View className="w-full mt-2">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, gap: 4 }}
        onScroll={(e) => onScrollX(e.nativeEvent.contentOffset.x)}
        scrollEventThrottle={16}
      >
        {categories.map((category, idx) => {
          const isSelected = category === selectedCategory;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => onSelect(category)}
              className={`px-5 ml-2 h-[35px] rounded-full items-center justify-center ${
                isSelected ? "bg-[#B3D7BB]" : "bg-[#F5FCE9]"
              }`}
            >
              <Text
                className={`text-md ${
                  isSelected ? "text-[#006716] font-semibold" : "text-black"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
