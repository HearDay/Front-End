import TopBar from "@/components/common/TopBar";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ProfileModificationPage = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar showBackButton onBackPress={() => router.push("/ProfilePage")} />

      {/* 제목 */}
      <Text className="text-[21px] font-bold text-[#002C09] ml-10">
        프로필 편집
      </Text>

      {/* 계정 정보 카드 */}
      <View
        className="bg-white rounded-[20px] mt-4 self-center px-6 pt-6 pb-4 "
        style={{
            width: 350,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 12,
            elevation: 6,
        }}
      >
        {/* 프로필 사진 + 닉네임 */}
        <View className="flex-row items-center">
          <Image
            source={require("../my-expo-app/assets/images/DefaultProfile.png")}
            className="w-[85px] h-[85px] rounded-full"
          />

          <View className="flex-1 ml-7">
            <View className="flex-row items-center justify-between">
              <Text className="text-[24px] font-semibold text-[#1F1F1F]">
                지호
              </Text>

              <TouchableOpacity>
                <Image
                  source={require("../my-expo-app/assets/images/Pencil.png")}
                  className="w-[24px] h-[24px]"
                />
              </TouchableOpacity>
            </View>

            <View className="w-full h-[1px] bg-[#D9D9D9] mt-2" />
          </View>
        </View>

        {/* 계정 정보 */}
        <Text className="text-[19px] font-bold text-[#1F1F1F] mt-8 mb-2">
          계정 정보
        </Text>

        {/* 항목 1 - 성별 */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-[18px] text-gray-400">성별</Text>
          <Text className="text-[18px] text-[#1F1F1F]">여</Text>
        </View>
        <View className="w-full h-[1px] bg-[#EFEFEF] mt-2" />

        {/* 항목 2 - 나이 */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-[18px] text-gray-400">나이</Text>
          <Text className="text-[18px] text-[#1F1F1F]">22세</Text>
        </View>
        <View className="w-full h-[1px] bg-[#EFEFEF] mt-2" />

        {/* 항목 3 - 전화번호 */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-[18px] text-gray-400">전화번호</Text>
          <Text className="text-[18px] text-[#1F1F1F]">010-1111-2222</Text>
        </View>
        <View className="w-full h-[1px] bg-[#EFEFEF] mt-2" />

        {/* 항목 4 - 이메일 */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-[18px] text-gray-400">이메일</Text>
          <Text className="text-[18px] text-[#1F1F1F]">
            hearday@naver.com
          </Text>
        </View>
        <View className="w-full h-[1px] bg-[#EFEFEF] mt-2" />

        {/* 항목 5 - 비밀번호 */}
        <View className="flex-row justify-between items-center mt-4 mb-3">
          <Text className="text-[18px] text-gray-400">비밀번호</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/CertificationPage")}
          >
            <Text className="text-[18px] text-[#E35B5B]">변경</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default ProfileModificationPage;
