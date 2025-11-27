import { Modal } from "@/components/common";
import { registerUserInfo } from "@/services/api/registerInfo";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const fadedStyle = { color: "#F5FCE9", fontWeight: "500", fontSize: 20 };
const selectedStyle = { color: "#002C09", fontWeight: "700", fontSize: 28 };

const days = ["평일", "매일", "주말"];
const hours = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

const ITEM_HEIGHT = 55;

const SelectTimePage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const rawCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;

  const categories = JSON.parse(rawCategory || "[]");

  const age = Number(params.age);
  const gender = params.gender as string;

  const [selectedDay, setSelectedDay] = useState("매일");
  const [selectedHourIndex, setSelectedHourIndex] = useState(8);
  const [selectedMinuteIndex, setSelectedMinuteIndex] = useState(20);

  const [modalVisible, setModalVisible] = useState(false);

  // gender 변환
  const genderMap: Record<string, "M" | "F" | "UNKNOWN"> = {
    "남성": "M",
    "여성": "F",
    "선택안함": "UNKNOWN",
  };

  const apiGender = genderMap[gender]; // ← 변환 완료

  const handleScroll = (e: any, list: string[], setter: (i: number) => void) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    if (index >= 0 && index < list.length) setter(index);
  };

  const convertDayType = (d: string) => {
    switch (d) {
      case "평일":
        return "WEEKDAY";
      case "매일":
        return "EVERYDAY";
      case "주말":
        return "WEEKEND";
      default:
        return "EVERYDAY";
    }
  };

  // API 요청
  const handleSubmit = async () => {
    const body = {
      category: categories,
      gender: apiGender, // 변환된 gender 전달
      age,
      hour: selectedHourIndex,
      minute: selectedMinuteIndex,
      dayType: convertDayType(selectedDay),
    };

    try {
      const res = await registerUserInfo(body);

      if (res.success) {
        setModalVisible(true);
      } else {
        alert(res.errorCode || "등록 중 오류가 발생했습니다.");
      }
    } catch (err) {
      alert("API 오류가 발생했습니다.");
      console.log(err);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 모달 */}
      <Modal
        visible={modalVisible}
        title="정보 등록이 완료되었습니다!"
        confirmText="확인"
        onConfirm={() => {
          setModalVisible(false);
          router.replace("/(tabs)");
        }}
        onClose={() => setModalVisible(false)}
      />

      <LinearGradient
        colors={["#006716", "#428F48", "#85B77A", "#FBFFD3"]}
        locations={[0, 0.22, 0.54, 0.85]}
        style={{ flex: 1 }}
      >
        <View className="flex-1 items-center justify-center px-6">

          {/* 타이틀 */}
          <View className="items-center mb-12 mt-[-40px]">
            <Text className="text-[22px] text-white font-semibold mb-3">
              알림을 받을 시간을 설정해주세요!
            </Text>
            <Text className="text-[14px] text-[#E8F5E9]">
              원하는 시간대에 리마인드 알림을 보내드릴게요!
            </Text>
          </View>

          {/* Picker 영역 */}
          <View className="flex-row items-center mb-20">
            {/* 요일 */}
            <ScrollView
              snapToInterval={ITEM_HEIGHT}
              onScroll={(e) => handleScroll(e, days, (i) => setSelectedDay(days[i]))}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{ height: ITEM_HEIGHT * 3 }}
            >
              <View style={{ height: ITEM_HEIGHT }} />
              {days.map((d, i) => (
                <View key={i} style={{ height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" }}>
                  <Text style={selectedDay === d ? selectedStyle : fadedStyle}>
                    {d}
                  </Text>
                </View>
              ))}
              <View style={{ height: ITEM_HEIGHT }} />
            </ScrollView>

            {/* 시간 */}
            <ScrollView
              snapToInterval={ITEM_HEIGHT}
              onScroll={(e) => handleScroll(e, hours, setSelectedHourIndex)}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{ height: ITEM_HEIGHT * 3, marginHorizontal: 35 }}
            >
              <View style={{ height: ITEM_HEIGHT }} />
              {hours.map((h, i) => (
                <View key={i} style={{ height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" }}>
                  <Text style={selectedHourIndex === i ? selectedStyle : fadedStyle}>
                    {h}시
                  </Text>
                </View>
              ))}
              <View style={{ height: ITEM_HEIGHT }} />
            </ScrollView>

            {/* 분 */}
            <ScrollView
              snapToInterval={ITEM_HEIGHT}
              onScroll={(e) => handleScroll(e, minutes, setSelectedMinuteIndex)}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              style={{ height: ITEM_HEIGHT * 3 }}
            >
              <View style={{ height: ITEM_HEIGHT }} />
              {minutes.map((m, i) => (
                <View key={i} style={{ height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" }}>
                  <Text style={selectedMinuteIndex === i ? selectedStyle : fadedStyle}>
                    {m}분
                  </Text>
                </View>
              ))}
              <View style={{ height: ITEM_HEIGHT }} />
            </ScrollView>
          </View>

          {/* 버튼 */}
          <View
            style={{ position: "absolute", bottom: 180, left: 0, right: 0 }}
            className="flex-row gap-6 justify-center"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-[104px] h-[49px] rounded-full bg-[#F5FCE3] border border-[#006716] items-center justify-center"
            >
              <Text className="text-[18px] text-black">이전</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              className="w-[104px] h-[49px] rounded-full bg-[#F5FCE3] border border-[#006716] items-center justify-center"
            >
              <Text className="text-[18px] text-black">확인</Text>
            </TouchableOpacity>
          </View>

        </View>
      </LinearGradient>
    </>
  );
};

export default SelectTimePage;
