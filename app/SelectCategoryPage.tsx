// app/SelectCategoryPage.tsx
import axiosInstance from "@/services/api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  "경제",
  "방송/연예",
  "IT",
  "쇼핑",
  "생활",
  "해외",
  "스포츠",
  "정치",
];

const SelectCategoryPage = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 선택 토글
  const toggleSelect = (category: string) => {
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((p) => p !== category) : [...prev, category]
    );
  };

  // 카테고리 등록 API 호출
  const registerCategories = async (categoriesToRegister: string[]) => {
    // 토큰을 AsyncStorage에서 꺼내서 Authorization 헤더에 넣음
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      throw new Error("로그인 상태가 아닙니다. 다시 로그인해주세요.");
    }

    const res = await axiosInstance.post("/api/users/category", categoriesToRegister, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      return Alert.alert("카테고리를 하나 이상 선택해주세요!");
    }

    try {
      setLoading(true);
      const res = await registerCategories(selected);

      // 서버 응답 구조에 맞게 처리
      if (res?.success) {
        Alert.alert("완료", "관심 카테고리가 등록되었습니다!");
        router.replace("/(tabs)"); 
      } else {
        console.error("카테고리 등록 실패 응답:", res);
        Alert.alert("카테고리 등록 실패", res?.errorCode || res?.message || "오류가 발생했습니다.");
      }
    } catch (err: any) {
      console.error("카테고리 등록 오류:", err.response?.data || err.message);
      Alert.alert("오류", err.response?.data?.errorCode || err.message || "카테고리 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#006716", "#428F48", "#85B77A", "#FBFFD3"]}
        locations={[0, 0.22, 0.54, 0.85]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 40,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center mb-10">
            <Text className="text-[20px] text-white font-semibold mb-2">
              어떤 뉴스를 선호하세요?
            </Text>
            <Text className="text-[14px] text-[#E8F5E9]">
              취향에 맞는 뉴스를 추천해드릴게요!
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-center w-full mt-10 gap-4 px-6">
            {categories.map((category, idx) => {
              const isSelected = selected.includes(category);
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleSelect(category)}
                  activeOpacity={0.8}
                  className={`w-[119px] h-[49px] rounded-full items-center justify-center ${
                    isSelected ? "bg-[#006716]" : "bg-[#D9EBCE]"
                  }`}
                >
                  <Text
                    className={`text-[18px] ${
                      isSelected ? "text-[#FBFFD3]" : "text-black"
                    }`}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleSubmit}
            className="w-[104px] h-[49px] rounded-full bg-[#F5FCE9] items-center justify-center border border-[#006716] mt-20"
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#006716" />
            ) : (
              <Text className="text-black text-[18px]">확인</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default SelectCategoryPage;
