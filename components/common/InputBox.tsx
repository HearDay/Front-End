import { EyeOff } from "lucide-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

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
  const baseStyle =
    "flex-row items-center w-[350px] h-[50px] rounded-[10px] px-6";

  const getVariantStyle = () => {
    switch (variant) {
      case "transparent":
        return "bg-white/20";
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
        style={{
          flex: 1,
          fontSize: 17,
          color: variant === "transparent" ? "#FFFFFF" : "#1F2D1F",
          includeFontPadding: false,
          textAlignVertical: "center",
          paddingVertical: 0,
        }}
        keyboardType="default"
      />

      {variant === "password" && (
        <TouchableOpacity>
          <EyeOff size={22} color="#8AA989" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputBox;
