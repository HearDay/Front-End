import axiosInstance from "@/services/api/axiosInstance";
import { signup } from "@/services/api/signup";
import { SignUpRequest } from "@/types/auth/signup";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

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
  const router = useRouter();

  const params = useLocalSearchParams<{
    loginId: string;
    password: string;
    email: string;
    phone: string;
  }>();

  const toggleSelect = (category: string) => {
    setSelected((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) {
      return Alert.alert("카테고리를 하나 이상 선택해주세요!");
    }

    const body: SignUpRequest = {
      loginId: params.loginId!,
      password: params.password!,
      email: params.email!,
      phone: params.phone!,
      userCategory: selected,
    };

    console.log("요청 URL:", axiosInstance.defaults.baseURL + "/api/users");
    console.log("요청 Body:", body);

    try {
      const res = await signup(body);

      if (res.success) {
        Alert.alert("회원가입 완료!", "로그인 페이지로 이동합니다.");
        router.replace("/LoginPage");
      } else {
        Alert.alert("회원가입 실패", res.errorCode || "오류가 발생했습니다.");
      }
    } catch (err: any) {
      console.error("서버 오류:", err.response?.data || err.message);
      Alert.alert("서버 오류", err.response?.data?.errorCode || "요청 실패");
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
          >
            <Text className="text-black text-[18px]">확인</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default SelectCategoryPage;
