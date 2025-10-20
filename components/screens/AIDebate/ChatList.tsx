import React from "react";
import { ScrollView, View } from "react-native";
import ChatBubble from "./ChatBubble";
import { chatListDummy } from "./ChatListDummy";

interface ChatListProps {
  showInputBar?: boolean; // ChatInputBar 유무에 따라 paddingBottom 조정
}

export default function ChatList({ showInputBar = false }: ChatListProps) {
  return (
    <View className="flex-1 bg-[#FEFFF5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={`px-5 ${showInputBar ? "pb-24" : "pb-10"}`}
      >
        {chatListDummy.map((chat) => (
          <ChatBubble
            key={chat.id}
            text={chat.text}
            isUser={chat.isUser}
          />
        ))}
      </ScrollView>
    </View>
  );
}
