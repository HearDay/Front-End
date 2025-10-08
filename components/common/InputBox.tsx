import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
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
  const [isSecure, setIsSecure] = useState(true);

  const baseStyle =
    "flex-row items-center w-[350px] h-[50px] rounded-[10px] px-6";

  const getVariantStyle = () => {
    switch (variant) {
      case "transparent":
        return "bg-white/20"; 
      case "default":
      case "password":
        return "bg-[#FEFFF5]"; 
      default:
        return "bg-[#FEFFF5]";
    }
  };

  return (
    <View className={`${baseStyle} ${getVariantStyle()}`}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={variant === "transparent" ? "#FFFFFF" : "#8AA989"}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={variant === "password" && isSecure}
        className={`flex-1 text-[16.5px] font-normal ${
          variant === "transparent" ? "text-white" : "text-[#1F2D1F]"
        }`}
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
