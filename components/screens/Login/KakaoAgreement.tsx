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

  const renderCheckbox = (checked: boolean, onPress: () => void) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Image
        source={
          checked
            ? require("../../../my-expo-app/assets/images/YellowCheckBox.png")
            : require("../../../my-expo-app/assets/images/YellowBox.png")
        }
        className="w-[21px] h-[21px]"
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-center items-center px-6 bg-[rgba(0,0,0,0.45)]"
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="bg-white w-[350px] rounded-[20px] overflow-hidden"
        >
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

          <ScrollView className="px-6 pb-5">
            <View className="flex-row items-center mb-3 mt-3">
              {renderCheckbox(allChecked, handleAllToggle)}
              <Text className="text-lg font-medium text-[#111111] ml-3">전체 동의하기</Text>
            </View>

            <Text className="text-base text-[#B7B7B7] ml-10 leading-6 mb-5">
              전체 동의는 선택 항목에 대한 동의를 포함하고{"\n"}있으며, 선택 항목에 대한
              동의를 거부해도{"\n"}서비스 이용이 가능합니다.
            </Text>

            <View className="h-[1px] bg-[#E5E5E5] -mx-2 mb-5" />

            <View className="flex-row items-center mb-5">
              {renderCheckbox(requiredChecked, () => setRequiredChecked(!requiredChecked))}
              <Text className="text-base text-[#B7B7B7] ml-3">
                [필수] 카카오 개인정보 제3자 제공 동의
              </Text>
            </View>

            <View className="flex-row items-center mb-3">
              {renderCheckbox(optionalChecked, () => setOptionalChecked(!optionalChecked))}
              <Text className="text-base text-[#B7B7B7] ml-3">[선택] 선택 제공 항목</Text>
            </View>

            <View className="pl-[38px] space-y-3 mb-5">
              {["성별", "연령대", "생일"].map((item, index) => (
                <View key={index} className="flex-row items-center space-x-2">
                  <Image
                    source={require("../../../my-expo-app/assets/images/YellowCheck.png")}
                    className="w-[16px] h-[16px]"
                    resizeMode="contain"
                  />
                  <Text className="text-base text-[#B7B7B7]">{item}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={handleConfirm}
            activeOpacity={0.8}
            className="py-5 items-center justify-center bg-[#FFD900]"
          >
            <Text className="text-lg font-semibold text-[#111111]">동의하고 계속하기</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default KakaoAgreement;
