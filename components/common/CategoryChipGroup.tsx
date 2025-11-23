import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { CategoryChip } from "./CategoryChip";

interface ChipGroupProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (c: string) => void;
  scrollX?: number;
  onScrollXChange?: (x: number) => void;
}

export const CategoryChipGroup = ({
  categories,
  selectedCategory,
  onSelectCategory,
  scrollX = 0,
  onScrollXChange,
}: ChipGroupProps) => {
  const scrollRef = useRef<ScrollView>(null);

  // 진입 시 또는 scrollX 변경 시 위치 복원
  useEffect(() => {
    if (scrollRef.current && scrollX >= 0) {
      scrollRef.current.scrollTo({ x: scrollX, animated: false });
    }
  }, [scrollX]);

  return (
    <View className="h-16 items-center">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          if (onScrollXChange) {
            onScrollXChange(e.nativeEvent.contentOffset.x);
          }
        }}
        contentContainerStyle={{
          alignItems: "center",
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        {categories.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            isSelected={selectedCategory === category}
            onPress={() => onSelectCategory(category)}
          />
        ))}
      </ScrollView>
    </View>
  );
};
