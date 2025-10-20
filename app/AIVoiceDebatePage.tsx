import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Speaker = "AI" | "User" | "Pending";

export default function AIVoiceDebatePage() {
  const router = useRouter();
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker>("Pending");

  const getImageSource = () => {
    switch (currentSpeaker) {
      case "AI":
        return require("../my-expo-app/assets/images/VoiceOn_AI.png");
      case "User":
        return require("../my-expo-app/assets/images/VoiceOn_User.png");
      default:
        return require("../my-expo-app/assets/images/VoiceOff.png");
    }
  };

  const getStatusText = () => {
    switch (currentSpeaker) {
      case "AI":
        return (
          <Text className="text-[#002C09] text-3xl font-normal mt-2">
            <Text className="font-black">AI</Text>가 말하고 있어요!
          </Text>
        );
      case "User":
        return (
          <Text className="text-[#002C09] text-2xl font-normal mt-2">
            <Text className="font-black">지홍님</Text> 차례예요!
          </Text>
        );
      default:
        return (
          <Text className="text-[#002C09] text-3xl font-normal mt-2">
            <Text className="font-black">AI</Text>가 답변을 생각하고 있어요!
          </Text>
        );
    }
  };

  return (
    <>
      {/* 상단 탭 숨기기 */}
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 items-center justify-center bg-[#FEFFF5] px-6">
        {/* 토론 주제 */}
        <View className="items-center px-6">
          <Text className="text-left text-2xl font-semibold text-black mb-10">
            <Text className="font-black">
              오픈AI "내년 ‘개인정보 필터’ 오픈소스로 공개"
            </Text>
            <Text className="font-light"> 로 토론 중이에요!</Text>
          </Text>
        </View>

        {/* 상태 문구 */}
        {getStatusText()}

        {/* 마이크 아이콘 */}
        <Image
          source={getImageSource()}
          className="w-[310px] h-[310px] my-8"
          resizeMode="contain"
        />

        {/* 이전 대화 보기 */}
        <TouchableOpacity
          onPress={() => router.push("/AIChatDebatePage?mode=view")}
        >
          <Text className="text-[#2E7D32] text-[15px] mt-5 mb-5 underline decoration-transparent">
            이전 대화 보러가기
          </Text>
        </TouchableOpacity>

        {/* 끝내기 버튼 */}
        <TouchableOpacity
          className="w-[101px] h-[43px] rounded-full border border-[#2E7D32] bg-white flex items-center justify-center"
          onPress={() => router.back()}
        >
          <Text className="text-[#2E7D32] font-medium text-[15px]">
            끝내기
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
