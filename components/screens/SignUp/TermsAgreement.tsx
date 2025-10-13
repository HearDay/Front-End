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
    const nextValue = {
      service: !allChecked,
      privacy: !allChecked,
      marketing: !allChecked,
    };
    onChange(nextValue);
  };

  const handleItemChange = (key: keyof TermsState) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <View className="w-[350px] mx-auto bg-white border border-[#9CB59F] rounded-2xl p-5 mb-6">
      {/* 전체 동의하기 */}
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
          className="w-[21px] h-[21px] mr-3 mt-1"
          resizeMode="contain"
        />
        <View>
          <Text className="text-lg font-medium text-[#111111]">전체 동의하기</Text>
          <Text className="text-[#B7B7B7] text-sm font-normal mt-1 leading-5">
            전체 동의는 필수 약관에 대한 동의를 포함하고 있으며,
            {"\n"}필수 약관에 대한 동의를 거부할 경우 서비스를 이용할 수{"\n"}없습니다.
          </Text>
        </View>
      </TouchableOpacity>

      <View className="h-[1px] bg-[#9CB59F] mb-4" />

      {/* 개별 동의 항목 */}
      <View className="flex-col gap-4">
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
                {checked ? (
                  <Image
                    source={require("../../../my-expo-app/assets/images/GreenCheck.png")}
                    className="w-[21px] h-[21px] mr-2"
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require("../../../my-expo-app/assets/images/GreenBox.png")}
                    className="w-[21px] h-[21px] mr-2"
                    resizeMode="contain"
                  />
                )}
                <Text
                  className="text-sm font-medium text-[#B7B7B7]"
                >
                  {item.label}
                </Text>
              </View>
              {item.key !== "marketing" && (
                <Text className="text-[#A9A9A9] text-sm underline">보기</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default TermsAgreement;
