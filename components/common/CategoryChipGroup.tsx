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
  const hasRestored = useRef(false);

  // 진입 시 1번만 위치 복원
  useEffect(() => {
    if (!hasRestored.current && scrollRef.current) {
      scrollRef.current.scrollTo({ x: scrollX, animated: false });
      hasRestored.current = true;
    }
  }, []);

  return (
    <View className="h-16 items-center">
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        // ❌ onScroll 제거
        onMomentumScrollEnd={(e) => {
          onScrollXChange?.(e.nativeEvent.contentOffset.x);
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
