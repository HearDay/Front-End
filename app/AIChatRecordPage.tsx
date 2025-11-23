import { router, Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import TopBar from "@/components/common/TopBar";
import ChatList from "@/components/screens/AIDebate/ChatList";
import { fetchDiscussionDetail } from "@/services/api/chat";
import { ChatContent } from "@/types/auth/chat";

export default function AIChatRecordPage() {
  const { discussionId } =
    useLocalSearchParams<{ discussionId?: string }>();

  const [chatList, setChatList] = useState<ChatContent[]>([]);

  useEffect(() => {
    if (!discussionId) return;

    (async () => {
      try {
        const res = await fetchDiscussionDetail(Number(discussionId));
        setChatList(res.data.contentList);
      } catch (error) {
        console.error("기록 조회 실패:", error);
      }
    })();
  }, [discussionId]);

  return (
    <View className="flex-1 bg-[#FEFFF5]">
      <Stack.Screen options={{ headerShown: false }} />
      <TopBar showBackButton onBackPress={() => router.replace("/AiPage")} />
      <ChatList chatList={chatList} />
    </View>
  );
}
