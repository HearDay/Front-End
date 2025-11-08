import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
  const [delayedSecure, setDelayedSecure] = useState(isSecure);

  // iOS에서 secureTextEntry 깜빡임 방지
  useEffect(() => {
    if (Platform.OS === "ios") {
      const timer = setTimeout(() => setDelayedSecure(isSecure), 50);
      return () => clearTimeout(timer);
    } else {
      setDelayedSecure(isSecure);
    }
  }, [isSecure]);

  const baseStyle =
    "flex-row items-center w-[350px] h-[50px] rounded-[10px] px-6";
  const getVariantStyle = () => {
    switch (variant) {
      case "transparent":
        return "bg-white/20";
      case "password":
      default:
        return "bg-[#FEFFF5]";
    }
  };

  return (
    <View className={`${baseStyle} ${getVariantStyle()}`}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={
          variant === "transparent" ? "#FFFFFF" : "#8AA989"
        }
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={variant === "password" && delayedSecure}
        style={{
          flex: 1,
          fontSize: 17,
          color: variant === "transparent" ? "#FFFFFF" : "#1F2D1F",
          includeFontPadding: false,
          textAlignVertical: "center",
          paddingVertical: 0,
        }}
        // 자동완성 및 비밀번호 제안 완전 차단
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="off"
        textContentType="none"
        importantForAutofill="no"
        keyboardType={variant === "password" ? "default" : "default"}
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
