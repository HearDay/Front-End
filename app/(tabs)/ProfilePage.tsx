import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import AttendanceCalendar from "@/components/screens/Profile/AttendanceCalendar";
import UserInfo from "@/components/screens/Profile/UserInfo";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const Profile = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      {/* 헤더 숨기기 */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* TopBar */}
      <TopBar
        showBackButton={false}
        onBackPress={() => router.replace("/AiPage")}
      />

      {/* 설정 버튼 absolute 배치 */}
      <TouchableOpacity
        onPress={() => router.push("/SettingPage")} 
        className="absolute"
        style={{
          top: 73,
          right: 20, 
        }}
      >
        <Image
          source={require("../../my-expo-app/assets/images/Setting.png")}
          className="w-[24px] h-[24px]"
        />
      </TouchableOpacity>

      <View className="w-full items-center">
        {/* UserInfo */}
        <UserInfo
          nickname="데이"
          email="hearday@naver.com"
          level={5}
          point={75}
        />

        {/* 프로필 편집 버튼 */}
        <View className="w-[350px] h-[40px] justify-center mt-4 mb-6 border border-[#006716] rounded-[10px] overflow-hidden">
          <PrimaryButton
            title="프로필 편집"
            variant="white"
            onPress={() => router.push("/ProfileModificationPage")}
          />
        </View>

        {/* 출석 현황 타이틀 */}
        <Text className="w-full px-6 ml-5 text-[18px] font-bold text-[#002C09] mt-3">
          출석 현황
        </Text>

        <AttendanceCalendar />
      </View>
    </View>
  );
};

export default Profile;
