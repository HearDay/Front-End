import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const categories = [
  { label: "경제", value: "경제" },
  { label: "방송 / 연예", value: "방송_연예" },
  { label: "IT", value: "IT" },
  { label: "쇼핑", value: "쇼핑" },
  { label: "생활", value: "생활" },
  { label: "해외", value: "해외" },
  { label: "스포츠", value: "스포츠" },
  { label: "정치", value: "정치" },
];

const SelectCategoryPage = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelect = (value: string) => {
    setSelected((prev) => {
      if (prev.includes(value)) {
        return prev.filter((p) => p !== value);
      }

      if (prev.length >= 3) return prev;

      return [...prev, value];
    });
  };

  const goNext = () => {
    if (selected.length === 0) return;

    router.push({
      pathname: "/SelectAgePage",
      params: { category: JSON.stringify(selected) },
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
            <Text className="text-[22px] text-white font-semibold mb-2">
              어떤 뉴스를 선호하세요?
            </Text>
            <Text className="text-[14px] text-[#E8F5E9]">
              취향에 맞는 뉴스를 추천해드릴게요!
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-center w-full mt-10 gap-8 px-4">
            {categories.map(({ label, value }, idx) => {
              const isSelected = selected.includes(value);
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleSelect(value)}
                  activeOpacity={0.8}
                  className={`w-[119px] h-[49px] rounded-full items-center justify-center ${
                    isSelected ? "bg-[#006716]" : "bg-[#D9EBCE]"
                  }`}
                >
                  <Text
                    className={`text-[18px] ${
                      isSelected ? "text-[#FBFFD3] font-semibold" : "text-black"
                    }`}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={goNext}
            className="w-[104px] h-[49px] rounded-full bg-[#F5FCE3]
                       items-center justify-center border border-[#006716] mt-20"
          >
            <Text className="text-black text-[18px]">확인</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </>
  );
};

export default SelectCategoryPage;
