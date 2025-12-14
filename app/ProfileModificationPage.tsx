import TopBar from "@/components/common/TopBar";
import { getProfileInfo } from "@/services/api/profileInfo";
import { ProfileInfo } from "@/types/auth/profileInfo";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const ProfileModificationPage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileInfo | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileInfo();
        if (res.success) {
          setProfile(res.data);
        }
      } catch (e) {
        console.error("프로필 조회 실패", e);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar showBackButton onBackPress={() => router.push("/ProfilePage")} />

      {/* 제목 */}
      <Text className="text-[18px] sm:text-[20px] lg:text-[22px] font-bold text-[#002C09] ml-8 sm:ml-10 mt-2">
        프로필 편집
      </Text>

      {/* 계정 정보 카드 */}
      <View
        className="bg-white rounded-[20px] mt-4 self-center px-5 sm:px-6 pt-6 pb-4 w-[90%] max-w-[350px]"
        style={{
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
            className="w-[70px] h-[70px] sm:w-[80px] sm:h-[80px] lg:w-[85px] lg:h-[85px] rounded-full"
          />

          <View className="flex-1 ml-5 sm:ml-7">
            <View className="flex-row items-center justify-between">
              <Text className="text-[18px] sm:text-[20px] lg:text-[24px] font-semibold text-[#1F1F1F]">
                {profile.nickname}
              </Text>

              <TouchableOpacity>
                <Image
                  source={require("../my-expo-app/assets/images/Pencil.png")}
                  className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] lg:w-[24px] lg:h-[24px]"
                />
              </TouchableOpacity>
            </View>

            <View className="w-full h-[1px] bg-[#D9D9D9] mt-2" />
          </View>
        </View>

        {/* 계정 정보 */}
        <Text className="text-[16px] sm:text-[18px] lg:text-[19px] font-bold text-[#1F1F1F] mt-7 mb-2">
          계정 정보
        </Text>

        {/* 성별 */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-gray-400">
            성별
          </Text>
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#1F1F1F]">
            {profile.gender === "F" ? "여" : "남"}
          </Text>
        </View>
        <View className="w-full h-[1px] bg-[#EFEFEF] mt-2" />

        {/* 나이 */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-gray-400">
            나이
          </Text>
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#1F1F1F]">
            {profile.age}세
          </Text>
        </View>
        <View className="w-full h-[1px] bg-[#EFEFEF] mt-2" />

        {/* 전화번호 */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-gray-400">
            전화번호
          </Text>
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#1F1F1F]">
            {profile.phone}
          </Text>
        </View>
        <View className="w-full h-[1px] bg-[#EFEFEF] mt-2" />

        {/* 이메일 */}
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-gray-400">
            이메일
          </Text>
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#1F1F1F]">
            {profile.email}
          </Text>
        </View>
        <View className="w-full h-[1px] bg-[#EFEFEF] mt-2" />

        {/* 비밀번호 */}
        <View className="flex-row justify-between items-center mt-4 mb-3">
          <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-gray-400">
            비밀번호
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/CertificationPage")}
          >
            <Text className="text-[15px] sm:text-[17px] lg:text-[18px] text-[#E35B5B]">
              변경
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileModificationPage;
