import { fetchDiscussionDetail } from "@/services/api/chat";
import { ChatContent } from "@/types/auth/chat";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import ChatBubble from "./ChatBubble";

interface ChatListProps {
  showInputBar?: boolean; // ChatInputBar 유무에 따라 paddingBottom 조정
  discussionId?: number;  // 토론 ID
}

export default function ChatList({ showInputBar = false, discussionId }: ChatListProps) {
  const [chatList, setChatList] = useState<ChatContent[]>([]);

  useEffect(() => {
    // discussionId 없으면 API 호출 안함
    if (!discussionId) return;

    const loadChatData = async () => {
      try {
        const res = await fetchDiscussionDetail(discussionId);
        if (res.success) {
          setChatList(res.data.contentList);
        } else {
          console.error("서버 응답 실패:", res);
        }
      } catch (error) {
        console.error("채팅 데이터 불러오기 실패:", error);
      }
    };

    loadChatData();
  }, [discussionId]);

  return (
    <View className="flex-1 bg-[#FEFFF5]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className={`px-5 ${showInputBar ? "pb-24" : "pb-10"}`}
      >
        {chatList.map((chat) => (
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
