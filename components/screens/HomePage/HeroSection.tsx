import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

const HeroSection = ({ offset }: { offset: any }) => {
  const userLevel: number = 6; // 더미 데이터

  // 레벨별 이미지 선택
  const treeImage = (() => {
    switch (userLevel) {
      case 1:
        return require("../../../my-expo-app/assets/images/Lv1.png");
      case 2:
        return require("../../../my-expo-app/assets/images/Lv2.png");
      case 3:
        return require("../../../my-expo-app/assets/images/Lv3.png");
      case 4:
        return require("../../../my-expo-app/assets/images/Lv4.png");
      case 5:
        return require("../../../my-expo-app/assets/images/Lv5.png");
      case 6:
        return require("../../../my-expo-app/assets/images/Lv6.png");
      default:
        return require("../../../my-expo-app/assets/images/Lv1.png");
    }
  })();

  // 레벨별 크기
  const treeSize = (() => {
    switch (userLevel) {
      case 1:
        return { width: 100, height: 80 };
      case 2:
        return { width: 180, height: 148 };
      case 3:
        return { width: 300, height: 249 };
      case 4:
        return { width: 359, height: 324 };
      case 5:
        return { width: 359, height: 327 };
      case 6:
        return { width: 402, height: 337 };
      default:
        return { width: 300, height: 249 };
    }
  })();

  const levelText =
    userLevel === 6 ? "나무가 다 자랐어요!" : "뉴스를 시청하면\n나무가 자라요!";

  // 전체 HeroSection 높이 애니메이션
  const animatedContainerStyle = useAnimatedStyle(() => {
    const height = interpolate(offset.value, [0, 1], [440, 104]);
    return {
      height: withTiming(height, { duration: 600 }),
    };
  });

  // 나무 + Lv 문구 애니메이션 (위로 슬라이드 + 사라짐)
  const animatedTreeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(offset.value * -250) }],
    opacity: withTiming(1 - offset.value),
  }));

  // 돋보기 아이콘 전환 애니메이션
  const search1Style = useAnimatedStyle(() => ({
    opacity: withTiming(1 - offset.value, { duration: 400 }),
  }));

  const search2Style = useAnimatedStyle(() => ({
    opacity: withTiming(offset.value, { duration: 400 }),
    position: "absolute",
  }));

  return (
    <Animated.View style={[animatedContainerStyle]}>
      <LinearGradient
        colors={["#0F7022", "#85B77A", "#FBFFD3"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="w-full rounded-b-[24px] overflow-hidden"
        style={{ flex: 1 }}
      >
        <View className="flex-row justify-between items-center px-6 pt-12 relative">
          <Image
            className="w-[130px] h-[40px] mt-4"
            style={{ resizeMode: "contain" }}
            source={require("../../../my-expo-app/assets/images/HEARDAY.png")}
          />

          {/* 돋보기 아이콘 전환! yellow -> green */}
          <TouchableOpacity className="w-[24px] h-[24px] mt-4 relative">
            <Animated.Image
              source={require("../../../my-expo-app/assets/images/Search1.png")}
              style={[{ width: 24, height: 24, resizeMode: "contain" }, search1Style]}
            />
            <Animated.Image
              source={require("../../../my-expo-app/assets/images/Search2.png")}
              style={[{ width: 24, height: 24, resizeMode: "contain" }, search2Style]}
            />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={animatedTreeStyle}
          className="flex-1 justify-end items-center"
        >
          <Image
            source={treeImage}
            style={{
              width: treeSize.width,
              height: treeSize.height,
              resizeMode: "contain",
            }}
          />

          <View className="absolute bottom-3 left-4">
            <Text className="text-[15px] text-[#006716] font-semibold">
              Lv.{userLevel}
            </Text>
            <Text className="text-[13px] text-left text-[#006716] mt-[2px]">
              {levelText}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

export default HeroSection;
