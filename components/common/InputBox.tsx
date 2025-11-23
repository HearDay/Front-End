import { EyeOff } from "lucide-react-native";
import React from "react";
import { StyleProp, TextInput, TouchableOpacity, View, ViewStyle } from "react-native";

type InputVariant = "transparent" | "default" | "password";

interface InputBoxProps {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  variant?: InputVariant;
  editable?: boolean;            
  style?: StyleProp<ViewStyle>; 
}

const InputBox = ({
  placeholder,
  value,
  onChangeText,
  variant = "default",
  editable = true,               
  style,
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
    <View className={`${baseStyle} ${getVariantStyle()}`} style={style}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={
          variant === "transparent" ? "#FFFFFF" : "#8AA989"
        }
        value={value}
        onChangeText={onChangeText}
        editable={editable}        
        style={{
          flex: 1,
          fontSize: 17,
          color: editable
            ? (variant === "transparent" ? "#FFFFFF" : "#1F2D1F")
            : "#8A8A8A",          
          includeFontPadding: false,
          textAlignVertical: "center",
          paddingVertical: 0,
        }}
        keyboardType="default"
      />

      {/* 패스워드 아이콘 */}
      {variant === "password" && (
        <TouchableOpacity disabled={!editable}>
          <EyeOff
            size={22}
            color={editable ? "#8AA989" : "#B5B5B5"} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputBox;
