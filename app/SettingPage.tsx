import TopBar from "@/components/common/TopBar";
import { useCategoryStore } from "@/services/utils/categoryStore";
import { useSavedCategoryScrollStore } from "@/services/utils/savedCategoryStore";
import { resetScrollStorage } from "@/services/utils/scrollStore";
import { clearTokens } from "@/services/utils/tokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SettingPage = () => {
  const router = useRouter();

  // 모달 관리
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [withdrawVisible, setWithdrawVisible] = useState(false);

  // Zustand reset
  const clearCategory = useCategoryStore((state) => state.clearCategory);
  const resetSavedCategory = useSavedCategoryScrollStore(
    (state) => state.resetSavedCategory
  );

  // 로그아웃
  const handleLogout = async () => {
    try {
      await clearTokens();
      clearCategory();
      resetSavedCategory();
      await resetScrollStorage();
      await AsyncStorage.removeItem("hasShownTodayNewsModal");
      router.replace("/LoginPage");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  // 회원탈퇴
  const handleWithdraw = async () => {
    try {
      await clearTokens();
      clearCategory();
      resetSavedCategory();
      await resetScrollStorage();
      await AsyncStorage.removeItem("hasShownTodayNewsModal");
      router.replace("/LoginPage");
    } catch (error) {
      console.error("탈퇴 오류:", error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      <TopBar showBackButton onBackPress={() => router.push("/ProfilePage")} />

      <Text className="text-[20px] font-bold text-[#002C09] px-6 mt-6">
        설정
      </Text>

      {/* 설정 리스트 */}
      <View className="w-full max-w-[350px] self-center mt-4 px-5">
        {[
          { label: "알림", onPress: () => {} },
          { label: "Premium", onPress: () => {} },
          { label: "포인트 가이드", onPress: () => {} },
          { label: "로그아웃", onPress: () => setLogoutVisible(true) },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.7}
            onPress={item.onPress}
            className="flex-row justify-between items-center h-[54px] border-b border-[#E5E5E5]"
          >
            <Text className="text-[17px] text-[#1F1F1F]">
              {item.label}
            </Text>
            <Image
              source={require("../my-expo-app/assets/images/ArrowRight.png")}
              className="w-[18px] h-[18px]"
            />
          </TouchableOpacity>
        ))}

        {/* 탈퇴하기 */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setWithdrawVisible(true)}
          className="flex-row justify-between items-center h-[54px]"
        >
          <Text className="text-[16px] text-[#C9C9C9]">탈퇴하기</Text>
          <Image
            source={require("../my-expo-app/assets/images/ArrowRight.png")}
            className="w-[18px] h-[18px] opacity-30"
          />
        </TouchableOpacity>
      </View>

      {/* 로그아웃 모달 */}
      <Modal visible={logoutVisible} transparent animationType="fade">
        <Pressable
          onPress={() => setLogoutVisible(false)}
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-full max-w-[340px]" 
          >
            <Text className="text-center text-lg font-medium text-[#1F1F1F] mt-2 mb-6">
              로그아웃 하시겠습니까?
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setLogoutVisible(false);
                  handleLogout();
                }}
                className="flex-1 h-[38px] rounded-xl justify-center items-center bg-[#006716]"
              >
                <Text className="text-white text-lg font-semibold">
                  확인
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setLogoutVisible(false)}
                className="flex-1 h-[38px] rounded-xl justify-center items-center border border-[#006716]"
              >
                <Text className="text-[#006716] text-lg font-semibold">
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* 회원탈퇴 모달 */}
      <Modal visible={withdrawVisible} transparent animationType="fade">
        <Pressable
          onPress={() => setWithdrawVisible(false)}
          className="flex-1 justify-center items-center px-6"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-6 w-full max-w-[340px]"
          >
            <Text className="text-center text-lg font-bold text-[#1F1F1F] mb-3">
              회원 탈퇴하시겠습니까?
            </Text>

            <Text className="text-center text-sm text-[#6B6B6B] leading-5 mb-5">
              회원 탈퇴 시, 계정 정보가 모두 삭제되며{"\n"}
              복구가 불가능합니다. 정말 탈퇴하시겠습니까?
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setWithdrawVisible(false);
                  handleWithdraw();
                }}
                className="flex-1 h-[38px] rounded-xl justify-center items-center bg-[#006716]"
              >
                <Text className="text-white text-lg font-semibold">
                  확인
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setWithdrawVisible(false)}
                className="flex-1 h-[38px] rounded-xl justify-center items-center border border-[#006716]"
              >
                <Text className="text-[#006716] text-lg font-semibold">
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default SettingPage;
