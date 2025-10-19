import React from "react";
import { Text, View } from "react-native";

interface ChatBubbleProps {
  text: string;
  isUser?: boolean; // true면 사용자(오른쪽), false면 AI(왼쪽)
}

export default function ChatBubble({ text, isUser = false }: ChatBubbleProps) {
  return (
    <View
      className={`max-w-[250px] p-3 rounded-2xl mb-3 ${
        isUser ? "self-end bg-white" : "self-start bg-white"
      } shadow-sm`}
      style={{
        borderRadius: 12,
        borderWidth: 0.3,
        borderColor: "#DADADA",
      }}
    >
      {/* 꼬리 부분 */}
      <View
        className={`absolute w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ${
          isUser
            ? "border-l-[10px] border-l-white right-[-8px] top-3"
            : "border-r-[10px] border-r-white left-[-8px] top-3"
        }`}
        style={{
          borderColor: "transparent",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          ...(isUser
            ? { borderLeftColor: "#FFFFFF" }
            : { borderRightColor: "#FFFFFF" }),
        }}
      />
      <Text className="text-[13px] leading-[18px] text-[#222222]">
        {text}
      </Text>
    </View>
  );
}
