import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface TopBarProps {
  showBackButton?: boolean; // 백버튼 유무
}

const TopBar = ({ showBackButton = false }: TopBarProps) => {
  const router = useRouter();

  return (
    <View className="w-full pt-5 pb-2 bg-transparent">
      <View className="flex-row items-center justify-center relative px-4">
        {/* 백버튼(조건부 렌더링) */}
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 top-1"
          >
            <Image
              source={require("../../my-expo-app/assets/images/BackButton.png")}
              className="w-[12px] h-[20px]"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        <Image
          source={require("../../my-expo-app/assets/images/HEARDAY.png")}
          className="w-[130px] h-[45px]"
          resizeMode="contain"
        />
      </View>

      <LinearGradient
        colors={["#184B1B", "#89B93F", "#F5E14E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="w-full h-[3px] mt-4"
      />
    </View>
  );
};

export default TopBar;