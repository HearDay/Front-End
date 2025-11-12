import React, { useEffect, useRef } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ScrollButtonProps {
  categories: string[];
  onSelect: (category: string) => void;
  selectedCategory: string;
}

const ScrollButton = ({
  categories,
  onSelect,
  selectedCategory,
}: ScrollButtonProps) => {
  const scrollRef = useRef<ScrollView>(null);

  // 뒤로 돌아왔을 때도 유지되도록 선택된 버튼으로 자동 스크롤 
  useEffect(() => {
    const selectedIndex = categories.indexOf(selectedCategory);
    if (selectedIndex !== -1 && scrollRef.current) {
      const scrollX = selectedIndex * 80;
      scrollRef.current.scrollTo({ x: scrollX, animated: false });
    }
  }, [selectedCategory]);

  return (
    <View className="w-full mt-2">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        {categories.map((category, idx) => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => onSelect(category)}
              className={`px-5 ml-2 h-[38px] rounded-full items-center justify-center ${
                isSelected ? "bg-[#B3D7BB]" : "bg-[#F5FCE9]"
              }`}
            >
              <Text
                className={`text-lg ${
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
};

export default ScrollButton;
