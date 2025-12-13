import { useTodayNewsStore } from "@/stores/todayNewsStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
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

const HeroSection = ({ offset, userLevel, onTodayNewsPress }: HeroSectionProps) => {
  const router = useRouter();
  const { setPendingReturn } = useTodayNewsStore();

  // 스크롤에 따른 높이 애니메이션
  const animatedContainerStyle = useAnimatedStyle(() => ({
    height: withTiming(interpolate(offset.value, [0, 1], [440, 104]), {
      duration: 500,
    }),
  }));

  const search1Style = useAnimatedStyle(() => ({
    opacity: withTiming(1 - offset.value, { duration: 400 }),
  }));

  const search2Style = useAnimatedStyle(() => ({
    opacity: withTiming(offset.value, { duration: 400 }),
    position: "absolute",
  }));

  // 나무 애니메이션
  const animatedTreeStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(offset.value * -250) }],
    opacity: withTiming(1 - offset.value),
  }));

  // 나무 이미지
  const treeImage = (() => {
    switch (userLevel) {
      case 1: return require("../../../my-expo-app/assets/images/Lv1.png");
      case 2: return require("../../../my-expo-app/assets/images/Lv2.png");
      case 3: return require("../../../my-expo-app/assets/images/Lv3.png");
      case 4: return require("../../../my-expo-app/assets/images/Lv4.png");
      case 5: return require("../../../my-expo-app/assets/images/Lv5.png");
      case 6: return require("../../../my-expo-app/assets/images/Lv6.png");
      default: return require("../../../my-expo-app/assets/images/Lv1.png");
    }
  })();

  const treeSize = (() => {
    switch (userLevel) {
      case 1: return { width: 100, height: 80 };
      case 2: return { width: 180, height: 148 };
      case 3: return { width: 300, height: 249 };
      case 4: return { width: 359, height: 324 };
      case 5: return { width: 359, height: 327 };
      case 6: return { width: 402, height: 337 };
      default: return { width: 300, height: 249 };
    }
  })();

  const levelText =
    userLevel === 6 ? "나무가 다 자랐어요!" : "뉴스를 시청하면\n나무가 자라요!";

  return (
    <Animated.View style={[animatedContainerStyle, { overflow: 'visible' }]}>
      <LinearGradient
        colors={["#0F7022", "#85B77A", "#FBFFD3"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        className="w-full rounded-b-[24px]"
        style={{ flex: 1, overflow: 'visible' }}
      >
        <View className="flex-row justify-between items-start px-1 pt-12 mt-2">
          <Image
            className="w-[130px] h-[40px] ml-4"
            style={{ resizeMode: "contain" }}
            source={require("../../../my-expo-app/assets/images/HEARDAY.png")}
          />

   
          <View className="flex-col items-end mr-4" style={{ zIndex: 1000 }}>
            <TouchableOpacity
              className="w-[24px] h-[24px] mt-1"
              onPress={() => {
                console.log('[HeroSection] 검색 버튼 클릭 - pendingReturn 초기화');
                setPendingReturn(false);
                router.push("/SearchNewsPage");
              }}
            >
              <Animated.Image
                source={require("../../../my-expo-app/assets/images/Search1.png")}
                style={[
                  { width: 24, height: 24, resizeMode: "contain" },
                  search1Style,
                ]}
              />
              <Animated.Image
                source={require("../../../my-expo-app/assets/images/Search2.png")}
                style={[
                  { width: 24, height: 24, resizeMode: "contain" },
                  search2Style,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 나무 + 텍스트 */}
        <Animated.View
          style={animatedTreeStyle}
          className="flex-1 justify-end items-center pb-1"
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
