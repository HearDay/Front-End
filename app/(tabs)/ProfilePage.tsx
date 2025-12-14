import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import AttendanceCalendar from "@/components/screens/Profile/AttendanceCalendar";
import UserInfo from "@/components/screens/Profile/UserInfo";
import { fetchProfile } from "@/services/api/profile";
import { ProfileData } from "@/types/auth/profile";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Profile = () => {
  const router = useRouter();
  const [user, setUser] = useState<ProfileData | null>(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProfile(year, month);
        setUser(res.data);
      } catch (err) {
        console.error("프로필 조회 실패:", err);
      }
    };

    load();
  }, []);

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* TopBar */}
      <TopBar
        showBackButton={false}
        onBackPress={() => router.replace("/AiPage")}
      />

      {/* 설정 버튼 */}
      <TouchableOpacity
        onPress={() => router.push("/SettingPage")}
        className="absolute top-10 right-5 z-10"
        activeOpacity={0.8}
      >
        <Image
          source={require("../../my-expo-app/assets/images/Setting.png")}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View className="flex-1 items-center px-5">

        {/* 사용자 정보 */}
        <View className="w-full max-w-[380px] mt-2">
          <UserInfo
            nickname={user.nickname}
            email={user.email}
            level={user.level}
            point={user.point}
          />
        </View>

        {/* 프로필 편집 버튼 */}
        <View className="w-full max-w-[380px] justify-center h-[40px] mt-4 border border-[#006716] rounded-[10px] overflow-hidden">
          <PrimaryButton
            title="프로필 편집"
            variant="white"
            onPress={() => router.push("/ProfileModificationPage")}
          />
        </View>

        {/* 출석 현황 타이틀 */}
        <View className="w-full max-w-[380px] mt-7 mb-1">
          <Text className="text-[16px] ml-2 font-bold text-[#002C09]">
            출석 현황
          </Text>
        </View>

        {/* 출석 캘린더 */}
        <View className="w-full max-w-[380px] items-center">
          <AttendanceCalendar attendance={user.attendance} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
