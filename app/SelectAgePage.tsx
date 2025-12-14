import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const SelectAgePage = () => {
  const router = useRouter();
  const { category } = useLocalSearchParams(); // 카테고리 받기
  const parsedCategory = category ? JSON.parse(category as string) : [];

  const [age, setAge] = useState("");

  const goPrev = () => {
    router.push({
      pathname: "/SelectCategoryPage",
      params: { category: JSON.stringify(parsedCategory) }, 
    });
  };

  const goNext = () => {
    if (!age) return; 

    router.push({
      pathname: "/SelectGenderPage",
      params: {
        category: JSON.stringify(parsedCategory),
        age: age,
      },
    });
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
        <View className="flex-1 justify-center items-center px-6">

          {/* 타이틀 */}
          <Text className="text-[22px] text-[#FFFFFF] font-semibold mb-14 mt-[-40px]">
            나이를 알려주세요!
          </Text>

          {/* 나이 입력 */}
          <View
            className="w-[300px] h-[50px] rounded-[10px] flex-row items-center px-4 mb-40"
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
            }}
          >
            <TextInput
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder=""
              placeholderTextColor="rgba(255,255,255,0.6)"
              className="flex-1 text-white text-[20px]"
              style={{ textAlign: "center" }}
            />

            <Text className="text-white text-[18px]">세</Text>
          </View>

          {/* 버튼 영역 */}
          <View
            style={{
              position: "absolute",
              bottom: 350,
              left: 0,
              right: 0,
            }}
            className="flex-row gap-6 justify-center"
          >
            {/* 이전 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={goPrev}
              className="w-[104px] h-[49px] rounded-full bg-[#F5FCE3]
              items-center justify-center border border-[#006716]"
            >
              <Text className="text-black text-[18px]">이전</Text>
            </TouchableOpacity>

            {/* 확인 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={goNext}
              className="w-[104px] h-[49px] rounded-full bg-[#F5FCE3]
              items-center justify-center border border-[#006716]"
            >
              <Text className="text-black text-[18px]">확인</Text>
            </TouchableOpacity>
          </View>

        </View>
      </LinearGradient>
    </>
  );
};

export default SelectAgePage;
