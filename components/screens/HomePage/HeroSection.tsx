import { useTodayNewsStore } from "@/stores/todayNewsStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface HeroSectionProps {
  offset: any;
  userLevel: number;
  onTodayNewsPress?: () => void;
}

const HeroSection = ({ offset, userLevel }: HeroSectionProps) => {
  const router = useRouter();
  const { setPendingReturn } = useTodayNewsStore();
  const { height, width } = useWindowDimensions();

  const MAX_HEIGHT = height * 0.48;
  const MIN_HEIGHT = height * 0.13;

  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: withTiming(
      interpolate(offset.value, [0, 1], [MAX_HEIGHT, MIN_HEIGHT]),
      { duration: 500 }
    ),
  }));

  const search1Style = useAnimatedStyle(() => ({
    opacity: withTiming(1 - offset.value, { duration: 400 }),
  }));

  const search2Style = useAnimatedStyle(() => ({
    opacity: withTiming(offset.value, { duration: 400 }),
    position: "absolute",
  }));

  const animatedTreeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(offset.value * -height * 0.35) }],
    opacity: withTiming(1 - offset.value),
  }));

  const treeImage = [
    require("../../../my-expo-app/assets/images/Lv1.png"),
    require("../../../my-expo-app/assets/images/Lv2.png"),
    require("../../../my-expo-app/assets/images/Lv3.png"),
    require("../../../my-expo-app/assets/images/Lv4.png"),
    require("../../../my-expo-app/assets/images/Lv5.png"),
    require("../../../my-expo-app/assets/images/Lv6.png"),
  ][userLevel - 1];

  const treeWidth = width * (userLevel >= 5 ? 0.9 : userLevel >= 4 ? 0.8 : userLevel >=2 ? 0.5 : 0.3);

  return (
    <Animated.View style={[animatedContainerStyle, { overflow: "visible" }]}>
      <LinearGradient
        colors={["#0F7022", "#85B77A", "#FBFFD3"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        <View className="flex-row justify-between items-start px-7 pt-12">
          <Image
            source={require("../../../my-expo-app/assets/images/HEARDAY.png")}
            style={{ width: width * 0.35, height: 40, resizeMode: "contain" }}
          />

          <TouchableOpacity
            onPress={() => {
              setPendingReturn(false);
              router.push("/SearchNewsPage");
            }}
          >
            <Animated.Image
              source={require("../../../my-expo-app/assets/images/Search1.png")}
              style={[{ width: 24, height: 24, top:9 }, search1Style]}
            />
            <Animated.Image
              source={require("../../../my-expo-app/assets/images/Search2.png")}
              style={[{ width: 24, height: 24, top: 9}, search2Style]}
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
              width: treeWidth,
              height: treeWidth * 0.85,
              resizeMode: "contain",
            }}
          />

          <View className="absolute bottom-3 left-4">
            <Text className="text-[15px] text-[#006716] font-semibold">
              Lv.{userLevel}
            </Text>
            <Text className="text-[12px] text-[#006716]">
              {userLevel === 6 ? "나무가 다 자랐어요!" : "뉴스를 시청하면\n나무가 자라요!"}
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

export default HeroSection;
