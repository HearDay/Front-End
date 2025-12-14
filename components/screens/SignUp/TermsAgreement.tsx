import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface TermsState {
  service: boolean;
  privacy: boolean;
  marketing: boolean;
}

interface TermsAgreementProps {
  value: TermsState;
  onChange: (next: TermsState) => void;
}

const TermsAgreement = ({ value, onChange }: TermsAgreementProps) => {
  const allChecked = value.service && value.privacy && value.marketing;

  const handleAllChange = () => {
    onChange({
      service: !allChecked,
      privacy: !allChecked,
      marketing: !allChecked,
    });
  };

  const handleItemChange = (key: keyof TermsState) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <View className="w-full max-w-[380px] bg-white border border-[#9CB59F] rounded-2xl p-5">
      {/* 전체 동의 */}
      <TouchableOpacity
        onPress={handleAllChange}
        className="flex-row items-start mb-4"
        activeOpacity={0.8}
      >
        <Image
          source={
            allChecked
              ? require("../../../my-expo-app/assets/images/GreenCheckBox.png")
              : require("../../../my-expo-app/assets/images/GreenBox.png")
          }
          className="w-5 h-5 mr-3 mt-1"
          resizeMode="contain"
        />
        <View className="flex-1">
          <Text className="text-[14px] font-medium text-[#111111]">
            전체 동의하기
          </Text>
          <Text className="text-[#B7B7B7] text-[10px] mt-1 leading-5">
            전체 동의는 필수 약관에 대한 동의를 포함하고 있으며, 필수
            {"\n"}약관에 대한 동의를 거부할 경우 서비스를 이용할 수 없습니다.
          </Text>
        </View>
      </TouchableOpacity>

      <View className="h-[1px] bg-[#9CB59F] mb-4" />

      {/* 개별 약관 */}
      <View className="gap-3">
        {[
          { key: "service", label: "[필수] 이용약관" },
          { key: "privacy", label: "[필수] 개인정보 보호 정책" },
          { key: "marketing", label: "[선택] 마케팅 수신 동의" },
        ].map((item) => {
          const checked = value[item.key as keyof TermsState];
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => handleItemChange(item.key as keyof TermsState)}
              className="flex-row justify-between items-center"
              activeOpacity={0.8}
            >
              <View className="flex-row items-center">
                <Image
                  source={
                    checked
                      ? require("../../../my-expo-app/assets/images/GreenCheck.png")
                      : require("../../../my-expo-app/assets/images/GreenBox.png")
                  }
                  className="w-5 h-5 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-[12px] font-medium text-[#6F6F6F]">
                  {item.label}
                </Text>
              </View>

              {item.key !== "marketing" && (
                <Text className="text-[#A9A9A9] text-[11px] underline">
                  보기
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TermsAgreement;
