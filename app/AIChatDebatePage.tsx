import { router, Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

import TopBar from "@/components/common/TopBar";
import ChatInputBar from "@/components/screens/AIDebate/ChatInputBar";
import ChatList from "@/components/screens/AIDebate/ChatList";

export default function AIChatDebatePage() {
  // mode(화면 모드)와 discussionId(토론 ID) 모두 받기
  const { mode, discussionId } = useLocalSearchParams<{ mode?: string; discussionId?: string }>();
  const showInputBar = mode === "chat"; // chat 모드일 때만 입력창 표시

  return (
    <View className="flex-1 bg-[#FEFFF5]">

      <Stack.Screen options={{ headerShown: false }} />

      <TopBar
        showBackButton
        onBackPress={() => router.replace("/AiPage")}
      />

      {/* ChatList에 discussionId 전달 */}
      <ChatList
        showInputBar={showInputBar}
        discussionId={discussionId ? Number(discussionId) : undefined}
      />

      {/* 입력창 (chat 모드에서만 표시) */}
      {showInputBar && <ChatInputBar />}
    </View>
  );
}
