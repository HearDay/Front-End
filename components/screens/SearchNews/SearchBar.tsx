// components/common/SearchBar.tsx

import React from "react";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onPressSearch: () => void;
}

const SearchBar = ({ value, onChangeText, onPressSearch }: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-white w-[360px] h-[43px] rounded-full px-4 shadow-sm">
      <TextInput
        className="flex-1 text-[16px] text-black"
        placeholder="검색어를 입력해주세요"
        placeholderTextColor="#9E9E9E"
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity onPress={onPressSearch} activeOpacity={0.8}>
        <Image
          source={require("@/my-expo-app/assets/images/Search2.png")}
          className="w-[22px] h-[22px]"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
