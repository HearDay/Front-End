import { ChatContent } from "@/types/auth/chat";
import React from "react";
import { ScrollView, View } from "react-native";
import ChatBubble from "./ChatBubble";

interface ChatListProps {
  chatList: ChatContent[];
  showInputBar?: boolean;
}

export default function ChatList({
  chatList,
  showInputBar = false,
}: ChatListProps) {
  return (
    <View className="flex-1 bg-[#FEFFF5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={`px-5 ${showInputBar ? "pb-24" : "pb-10"}`}
      >
        {chatList.map(chat => (
          <ChatBubble
            key={chat.contentId}
            text={chat.content}
            isUser={chat.role === "USER"}
          />
        ))}
      </ScrollView>
    </View>
  );
}
