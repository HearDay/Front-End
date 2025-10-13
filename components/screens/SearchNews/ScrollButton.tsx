// components/common/ScrollButton.tsx

import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ScrollButtonProps {
  categories: string[];
  onSelect: (category: string) => void;
}

const ScrollButton = ({ categories, onSelect }: ScrollButtonProps) => {
  const [selected, setSelected] = useState<string>("전체");

  const handlePress = (category: string) => {
    setSelected(category);
    onSelect(category);
  };

  return (
    <View className="w-full mt-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 8,
        }}
      >
        {categories.map((category, idx) => {
          const isSelected = selected === category;
          return (
            <TouchableOpacity
              key={idx}
              activeOpacity={0.8}
              onPress={() => handlePress(category)}
              className={`px-5 ml-2 h-[38px] rounded-full items-center justify-center ${
                isSelected ? "bg-[#B3D7BB]" : "bg-[#F5FCE9]"
              }`}
            >
              <Text
                className="text-lg text-black"
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
