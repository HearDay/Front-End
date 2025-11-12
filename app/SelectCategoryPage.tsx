import { Modal } from "@/components/common";
import { registerUserCategories } from "@/services/api/category";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const categories = [
  "경제",
  "방송 / 연예",
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState<() => void>(() => () => {});
  const router = useRouter();

  // 카테고리 선택 (최대 3개 제한)
  const toggleSelect = (category: string) => {
    setSelected((prev) => {
      if (prev.includes(category)) {
        return prev.filter((p) => p !== category);
      }

      if (prev.length >= 3) {
        showModal("최대 3개까지만 선택할 수 있습니다!");
        return prev;
      }

      return [...prev, category];
    });
  };

  // 모달 호출 함수
  const showModal = (message: string, onConfirm?: () => void) => {
    setModalMessage(message);
    setIsModalVisible(true);
    setOnConfirmAction(() => onConfirm || (() => setIsModalVisible(false)));
  };

  // 확인 버튼 클릭 시 동작
  const handleModalConfirm = () => {
    setIsModalVisible(false);
    onConfirmAction();
  };

  // 제출 처리
  const handleSubmit = async () => {
    if (selected.length === 0) {
      return showModal("카테고리를 하나 이상 선택해주세요.");
    }

    try {
      setLoading(true);
      const res = await registerUserCategories(selected);

      if (res?.success) {
        showModal("관심 카테고리가 등록되었습니다!", () => {
          router.replace("/(tabs)");
        });
      } else {
        console.error("카테고리 등록 실패 응답:", res);
        showModal(
          res?.errorCode || res?.message || "카테고리 등록 중 오류가 발생했습니다."
        );
      }
    } catch (err: any) {
      console.error("카테고리 등록 오류:", err.response?.data || err.message);
      showModal(err.response?.data?.errorCode || err.message || "카테고리 등록 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 모달 컴포넌트 */}
      <Modal
        visible={isModalVisible}
        title={modalMessage}
        confirmText="확인"
        onConfirm={handleModalConfirm}
        onClose={() => setIsModalVisible(false)}
      />

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
