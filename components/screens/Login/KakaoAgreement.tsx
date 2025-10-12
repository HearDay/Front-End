import React, { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const KakaoAgreement = ({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [allChecked, setAllChecked] = useState(false);
  const [requiredChecked, setRequiredChecked] = useState(false);
  const [optionalChecked, setOptionalChecked] = useState(false);

  const handleAllToggle = () => {
    const newValue = !allChecked;
    setAllChecked(newValue);
    setRequiredChecked(newValue);
    setOptionalChecked(newValue);
  };

  const handleConfirm = () => {
    if (requiredChecked) onConfirm();
    else alert("필수 항목에 동의해야 계속할 수 있습니다.");
  };

  const renderCheckbox = (checked: boolean, onPress: () => void, size = 24) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      {checked ? (
        <Image
          source={require("../../../my-expo-app/assets/images/YellowCheckBox.png")}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderWidth: 1.5,
            borderColor: "#B7B7B7",
            borderRadius: 4,
          }}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-center items-center px-6"
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white w-[350px] rounded-[20px] overflow-hidden"
        >
          {/* 상단 프로필 */}
          <View className="flex-row items-center px-6 pt-6 pb-3">
            <Image
              source={require("../../../my-expo-app/assets/images/HEARDAYProfile.png")}
              className="w-[55px] h-[55px] mr-3"
              resizeMode="contain"
            />
            <View>
              <Text className="text-xl font-normal text-[#111111] mb-1">HEARDAY</Text>
              <Text className="text-[14px] text-[#B7B7B7]">hearday</Text>
            </View>
          </View>

          <View className="h-[1px] bg-[#E5E5E5] mx-4 mt-2 mb-1" />
          {/* 약관 리스트 */}
          <ScrollView className="px-6 pb-5">
            {/* 전체 동의 */}
            <View className="flex-row items-center mb-3 mt-3">
              {renderCheckbox(allChecked, handleAllToggle, 20)}
              <Text className="text-lg font-medium text-[#111111] ml-3">
                전체 동의하기
              </Text>
            </View>

            {/* 설명문 */}
            <Text className="text-base text-[#B7B7B7] ml-10 leading-6 mb-5">
              전체 동의는 선택 항목에 대한 동의를 포함하고{"\n"}있으며, 선택 항목에 대한
              동의를 거부해도{"\n"}서비스 이용이 가능합니다.
            </Text>
            <View className="h-[1px] bg-[#E5E5E5] -mx-2 mb-5" />

            {/* 필수 */}
            <View className="flex-row items-center mb-5">
              {renderCheckbox(requiredChecked, () => setRequiredChecked(!requiredChecked), 20)}
              <Text className="text-base text-[#B7B7B7] ml-3">
                [필수] 카카오 개인정보 제3자 제공 동의
              </Text>
            </View>

            {/* 선택 */}
            <View className="flex-row items-center mb-3">
              {renderCheckbox(optionalChecked, () => setOptionalChecked(!optionalChecked), 20)}
              <Text className="text-base text-[##B7B7B7] ml-3">[선택] 선택 제공 항목</Text>
            </View>

            {/* 세부항목 */}
            <View className="pl-[38px] gap-4 mb-5">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../../my-expo-app/assets/images/YellowCheck.png")}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
                <Text className="text-base text-[#B7B7B7]">성별</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../../my-expo-app/assets/images/YellowCheck.png")}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
                <Text className="text-base text-[#B7B7B7]">연령대</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../../my-expo-app/assets/images/YellowCheck.png")}
                  style={{ width: 16, height: 16 }}
                  resizeMode="contain"
                />
                <Text className="text-base text-[#B7B7B7]">생일</Text>
              </View>
            </View>
          </ScrollView>

          {/* 하단 버튼 */}
          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.8}
            className="py-5 items-center justify-center bg-[#FFD900]"
          >
            <Text className="text-lg font-semibold text-[#111111]">
              동의하고 계속하기
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default KakaoAgreement;
