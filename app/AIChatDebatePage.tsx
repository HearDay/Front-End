import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

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

    setChatList((prev) => [
      ...prev,
      {
        contentId: Date.now(),
        role: "USER",
        content: message,
      },
    ]);

    try {
      const res = await sendChatMessage(
        Number(articleId),
        { message, level: (level as any) || "beginner" },
        discussionId
      );

      if (res.success) {
        if (!discussionId) {
          setDiscussionId(res.data.discussionId);
        }

        setChatList((prev) => [
          ...prev,
          {
            contentId: Date.now() + 1,
            role: "AI",
            content: res.data.reply,
          },
        ]);
      }
    } catch (e) {
      console.error("AI 메시지 전송 실패:", e);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#FEFFF5]"
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar showBackButton onBackPress={() => router.replace("/AiPage")} />

      {/* 핵심: ChatList는 flex-1 */}
      <View className="flex-1">
        <ChatList chatList={chatList} />
      </View>

      {/* 입력창은 항상 맨 아래 */}
      <ChatInputBar onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}
