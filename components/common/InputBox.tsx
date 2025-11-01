import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";

type InputVariant = "transparent" | "default" | "password";

interface InputBoxProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: InputVariant;
}

const InputBox = ({
  placeholder,
  value,
  onChangeText,
  variant = "default",
}: InputBoxProps) => {
  const [isSecure, setIsSecure] = useState(true);

  const baseStyle =
    "flex-row items-center w-[350px] rounded-[10px] px-6"; // ✅ h-[50px] 제거

  const getVariantStyle = () => {
    switch (variant) {
      case "transparent":
        return "bg-white/20";
      case "password":
        return "bg-[#FEFFF5]";
      default:
        return "bg-[#FEFFF5]";
    }
  };

  return (
    <View
      className={`${baseStyle} ${getVariantStyle()}`}
      style={{
        minHeight: 50,              // 고정 height 대신 minHeight로 유연하게
        paddingVertical: Platform.OS === "ios" ? 10 : 6, // 플랫폼별 세로 패딩 조정
        alignItems: "center",      
      }}
    >
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={variant === "transparent" ? "#FFFFFF" : "#8AA989"}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={variant === "password" && isSecure}
        style={{
          flex: 1,
          fontSize: 17,
          color: variant === "transparent" ? "#FFFFFF" : "#1F2D1F",
          includeFontPadding: false, // 안드로이드에서 하단 여백 없애기
          textAlignVertical: "center", // iOS/Android 공통 세로 중앙
          paddingVertical: 0,
        }}
      />

      {variant === "password" && (
        <TouchableOpacity onPress={() => setIsSecure(!isSecure)}>
          {isSecure ? (
            <EyeOff size={22} color="#8AA989" />
          ) : (
            <Eye size={22} color="#8AA989" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputBox;
