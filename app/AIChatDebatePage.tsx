import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

import TopBar from "@/components/common/TopBar";
import ChatInputBar from "@/components/screens/AIDebate/ChatInputBar";
import ChatList from "@/components/screens/AIDebate/ChatList";
import { sendChatMessage } from "@/services/api/aiChat";
import { ChatContent } from "@/types/auth/chat";

export default function AIChatDebatePage() {
  const { articleId, level } =
    useLocalSearchParams<{ articleId?: string; level?: string }>();

  const [discussionId, setDiscussionId] = useState<number | undefined>(undefined);
  const [chatList, setChatList] = useState<ChatContent[]>([]);

  const handleSend = async (message: string) => {
    if (!articleId) return;

    // 사용자 메시지 표시
    setChatList(prev => [
      ...prev,
      { contentId: Date.now(), role: "USER", content: message }
    ]);

    try {
      const res = await sendChatMessage(
        Number(articleId),
        { message, level: (level as any) || "beginner" },
        discussionId
      );

      if (res.success) {
        // 최초 discussionId 세팅
        if (!discussionId) setDiscussionId(res.data.discussionId);

        // AI 답변 추가
        setChatList(prev => [
          ...prev,
          {
            contentId: Date.now() + 1,
            role: "AI",
            content: res.data.reply,
          },
        ]);
      }
    } catch (e) {
    }
  };

  return (
    <View className="flex-1 bg-[#FEFFF5]">
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar showBackButton onBackPress={() => router.replace("/AiPage")} />

      <ChatList chatList={chatList}/>
      <ChatInputBar onSend={handleSend} />
    </View>
  );
}
