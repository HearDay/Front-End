import InputBox from "@/components/common/InputBox";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface InputBoxWithButtonProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  buttonText: string;
  onPressButton: () => void;
  disabled?: boolean;
}

const InputBoxWithButton = ({
  placeholder,
  value,
  onChangeText,
  buttonText,
  onPressButton,
  disabled = false,
}: InputBoxWithButtonProps) => {
  return (
    <View className="flex-row items-center w-[350px] h-[50px] gap-3 mb-3">
      {/* 입력창 */}
      <View className="flex-1 w-[260px] h-[50px]">
        <InputBox
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          variant="default"
        />
      </View>

      {/* 버튼 */}
      <TouchableOpacity
        onPress={onPressButton}
        activeOpacity={0.8}
        disabled={disabled}
        className={`w-[80px] h-[50px] bg-white rounded-[10px] border border-[#1B8131] items-center justify-center ${
          disabled ? "opacity-50" : ""
        }`}
      >
        <Text className="text-lg font-semibold text-[#1B8131]">{buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputBoxWithButton;
