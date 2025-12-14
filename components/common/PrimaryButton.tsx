import React from "react";
import { Image, Text, TouchableOpacity } from "react-native";

type ButtonVariant = "primary" | "secondary" | "kakao" | "white";

interface PrimaryButtonProps {
  title: string;
  variant?: ButtonVariant;
  onPress?: () => void;
}

const PrimaryButton = ({
  title,
  variant = "primary",
  onPress,
}: PrimaryButtonProps) => {
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
      className={`w-full max-w-[380px] h-[48px] ${bg} rounded-[10px] flex-row justify-center items-center`}
    >
      {variant === "kakao" && (
        <Image
          source={require("../../my-expo-app/assets/images/kakao.png")}
          className="w-4 h-4 mr-2"
          resizeMode="contain"
        />
      )}
      <Text className={`${text} text-[16px] font-medium`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;
