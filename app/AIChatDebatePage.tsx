import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { View } from "react-native";

import TopBar from "@/components/common/TopBar";
import ChatInputBar from "@/components/screens/AIDebate/ChatInputBar";
import ChatList from "@/components/screens/AIDebate/ChatList";

export default function AIChatDebatePage() {
  // URL 쿼리 파라미터(mode) 받아오기
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const showInputBar = mode === "chat"; // chat 모드일 때만 입력창 표시

  return (
    <View className="flex-1 bg-[#FEFFF5]">
      {/* 헤더 숨기고 커스텀 TopBar 표시 */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 상단 TopBar */}
      <TopBar showBackButton />

      {/* 채팅 목록 (InputBar 유무에 따라 padding 자동 조정) */}
      <ChatList showInputBar={showInputBar} />

      {/* 입력창 (채팅 모드에서만 표시) */}
      {showInputBar && <ChatInputBar />}
    </View>
  );
}
