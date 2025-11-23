import PrimaryButton from "@/components/common/PrimaryButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

// Zustand stores
import { useCategoryStore } from "@/services/utils/categoryStore";
import { useSavedCategoryScrollStore } from "@/services/utils/savedCategoryStore";

// scrollStore AsyncStorage reset 함수
import { resetScrollStorage } from "@/services/utils/scrollStore";

const ProfilePage = () => {
  const router = useRouter();

  // Zustand reset 함수 불러오기
  const clearCategory = useCategoryStore((state) => state.clearCategory);
  const resetSavedCategory = useSavedCategoryScrollStore(
    (state) => state.resetSavedCategory
  );

  const handleLogout = async () => {
    try {
      // 1) 토큰 삭제
      await AsyncStorage.removeItem("accessToken");

      // 2) Zustand 스토어 초기화
      clearCategory();
      resetSavedCategory();

      // 3) AsyncStorage 스크롤 기록 삭제
      await resetScrollStorage();

      // 4) 오늘의 뉴스 모달 표시 기록 삭제
      await AsyncStorage.removeItem("hasShownTodayNewsModal");

      console.log("로그아웃 완료 — 모든 저장 상태 리셋됨!");

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
