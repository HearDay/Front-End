import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

// primary(초록색), secondary(연두색), kakao(노란색), white(흰색)
type ButtonVariant = "primary" | "secondary" | "kakao" | "white";

interface PrimaryButtonProps {
  title: string;
  variant?: ButtonVariant;
  onPress?: () => void;
}

const PrimaryButton = ({ title, variant = "primary", onPress }: PrimaryButtonProps) => {
  // 타입에 따른 스타일 매핑
  const getButtonStyle = (type: ButtonVariant) => {
    switch (type) {
      case "primary":
        return { bg: "bg-[#006716]", text: "text-white" };
      case "secondary":
        return { bg: "bg-[#B3D7BB]", text: "text-white" };
      case "kakao":
        return { bg: "bg-[#FFE500]", text: "text-black" };
      case "white":
        return { bg: "bg-white", text: "text-[#006716]" };
      default:
        return { bg: "bg-[#006716]", text: "text-white" };
    }
  };

  const { bg, text } = getButtonStyle(variant);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`w-[350px] h-[50px] ${bg} rounded-[10px] flex-row justify-center items-center`}
    >
      {variant === "kakao" && (
        <Image
          source={require("../../my-expo-app/assets/images/kakao.png")}
          className="w-5 h-5 mr-2"
          resizeMode="contain"
        />
      )}
      <Text className={`${text} text-[16px] font-semibold`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
