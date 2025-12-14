import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const genders = ["남성", "여성", "선택안함"];

const SelectGenderPage = () => {
  const router = useRouter();
  const { category, age } = useLocalSearchParams(); // 전달받기

  const parsedCategory = category ? JSON.parse(category as string) : [];

  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const goPrev = () => {
    router.push({
      pathname: "/SelectAgePage",
      params: {
        category: JSON.stringify(parsedCategory),
        age: age,
      },
    });
  };

  const goNext = () => {
    if (!selectedGender) return; 

    router.push({
      pathname: "/SelectTimePage",
      params: {
        category: JSON.stringify(parsedCategory),
        age,
        gender: selectedGender,
      },
    });
  };

  const handleSelect = (gender: string) => {
    setSelectedGender(gender);
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
          <Text className="text-[22px] text-white font-semibold mb-12 mt-[-40px]">
            성별을 알려주세요!
          </Text>

          {/* 성별 버튼 */}
          <View className="flex-row gap-4 mb-40">
            {genders.map((g, idx) => {
              const isSelected = selectedGender === g;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => handleSelect(g)}
                  activeOpacity={0.8}
                  className={`w-[110px] h-[49px] rounded-full items-center justify-center ${
                    isSelected ? "bg-[#006716]" : "bg-[#D9EBCE]"
                  }`}
                >
                  <Text
                    className={`text-[18px] ${
                      isSelected ? "text-[#FBFFD3]" : "text-black"
                    }`}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 뒤/다음 버튼 */}
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
              className="w-[104px] h-[49px] rounded-full bg-[#F5FCE3] items-center justify-center border border-[#006716]"
            >
              <Text className="text-black text-[18px]">이전</Text>
            </TouchableOpacity>

            {/* 확인 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={goNext}
              className="w-[104px] h-[49px] rounded-full bg-[#F5FCE3] items-center justify-center border border-[#006716]"
            >
              <Text className="text-black text-[18px]">확인</Text>
            </TouchableOpacity>
          </View>

        </View>
      </LinearGradient>
    </>
  );
};

export default SelectGenderPage;
