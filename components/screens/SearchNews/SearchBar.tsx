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
    <View
      className="
        flex-row items-center
        bg-white
        w-full max-w-[360px]
        h-[40px] sm:h-[43px]
        rounded-full
        px-4
        shadow-sm
      "
    >
      <TextInput
        className="
          flex-1
          text-md sm:text-base
          text-black
          font-medium
        "
        placeholder="검색어를 입력해주세요"
        placeholderTextColor="#9E9E9E"
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
        onSubmitEditing={onPressSearch}
      />

      <TouchableOpacity onPress={onPressSearch} activeOpacity={0.8}>
        <Image
          source={require("@/my-expo-app/assets/images/Search2.png")}
          className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
