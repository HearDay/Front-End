import { EyeOff } from "lucide-react-native";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type InputVariant = "transparent" | "default" | "password";

interface InputBoxProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: InputVariant;
  editable?: boolean;
}

const InputBox = ({
  placeholder,
  value,
  onChangeText,
  variant = "default",
  editable = true,
}: InputBoxProps) => {
  const baseStyle =
    "flex-row items-center w-full max-w-[380px] h-[48px] rounded-[10px] px-5";

  const getVariantStyle = () => {
    switch (variant) {
      case "transparent":
        return "bg-white/20";
      default:
        return "bg-[#FEFFF5]";
    }
  };

  const getTextColor = () => {
    if (!editable) return "#8A8A8A";
    return variant === "transparent" ? "#FFFFFF" : "#1F2D1F";
  };

  return (
    <View className={`${baseStyle} ${getVariantStyle()}`}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={
          variant === "transparent" ? "#FFFFFFB3" : "#8AA989"
        }
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        className="flex-1 text-[16px]"
        style={{
          color: getTextColor(),
          includeFontPadding: false,
          textAlignVertical: "center",
          paddingVertical: 0,
        }}
        keyboardType="default"
      />

      {variant === "password" && (
        <TouchableOpacity disabled={!editable}>
          <EyeOff
            size={20}
            color={editable ? "#8AA989" : "#B5B5B5"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputBox;
