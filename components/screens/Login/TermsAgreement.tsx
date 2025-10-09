import clsx from "clsx";
import { Check } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
    <View className="w-[350px] mx-auto bg-[#FFFFFF] border border-[#9CB59F] rounded-2xl p-4 mb-6">
      {/* 전체 동의하기 */}
      <TouchableOpacity
        onPress={handleAllChange}
        className="flex-row items-start mb-3"
        activeOpacity={0.8}
      >
        <View
          className={clsx(
            "w-5 h-5 mr-3 rounded-[4px] border border-[#9CB59F] items-center justify-center",
            allChecked && "bg-[#1B8131] border-[#1B8131]"
          )}
        >
          {allChecked && <Check size={12} color="#fff" strokeWidth={3} />}
        </View>

        <View>
          <Text className="text-base font-medium text-black">전체 동의하기</Text>
          <Text className="text-[#B7B7B7] font-medium text-sm mt-1 leading-4">
            전체 동의는 필수 약관에 대한 동의를 포함하고{"\n"}
            있으며, 약관에 대한 동의를 거부할 경우 서비스를{"\n"}
            이용할 수 없습니다.
          </Text>
        </View>
      </TouchableOpacity>

      <View className="h-[1px] bg-[#9CB59F] my-3" />

      <View className="flex-col gap-3">
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
                <View
                  className={clsx(
                    "w-4 h-4 mr-2 rounded-[3px] border border-[#9CB59F] items-center justify-center",
                    checked && "bg-[#1B8131] border-[#1B8131]"
                  )}
                >
                  {checked && <Check size={12} color="#fff" strokeWidth={3} />}
                </View>
                <Text
                  className={clsx(
                    "text-sm",
                    checked ? "text-[#1B8131]" : "text-[#7E8B7F]"
                  )}
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
