import PrimaryButton from "@/components/common/PrimaryButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const ProfilePage = () => {
  const router = useRouter();

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {

      await AsyncStorage.removeItem("accessToken");

      const afterToken = await AsyncStorage.getItem("accessToken");
      console.log("로그아웃 후 accessToken:", afterToken);
      console.log("로그아웃 성공! 토큰이 정상적으로 삭제되었습니다.");

      router.replace("/LoginPage");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <PrimaryButton
        title="로그아웃"
        variant="primary"
        onPress={handleLogout}
      />
    </View>
  );
};

export default ProfilePage;
