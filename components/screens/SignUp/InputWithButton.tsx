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
    <View className="w-full max-w-[380px] flex-row items-center gap-2">
      {/* 입력창 */}
      <View className="flex-1">
        <InputBox
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          variant="default"
          editable={!disabled}
          style={{
            backgroundColor: disabled ? "#E5E5E5" : "#FEFFF5",
          }}
        />
      </View>

      {/* 버튼 */}
      <TouchableOpacity
        onPress={onPressButton}
        activeOpacity={0.8}
        disabled={disabled}
        className={`h-[48px] px-4 rounded-[10px] border border-[#1B8131] bg-white items-center justify-center ${
          disabled ? "opacity-50" : "opacity-100"
        }`}
      >
        <Text className="text-[15px] font-semibold text-[#1B8131]">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputBoxWithButton;
