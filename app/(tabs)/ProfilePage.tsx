import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import InputBox from "@/components/common/InputBox";
import TopBar from "@/components/common/TopBar";

export default function ProfilePage() {
  return (
    <LinearGradient
      colors={["#1B772B", "#428F48", "#85B77A", "#FBFFD3"]}
      locations={[0, 0.22, 0.54, 0.85]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      // RN에서는 className만으로는 레이아웃 적용이 불안정하므로 style로 flex 지정
      style={{ flex: 1 }}
      className="items-center justify-center"
    >
      <SafeAreaView className="flex-1 w-full items-center">

        <TopBar showBackButton={false} />


        <View className="gap-3 mt-16 w-[85%]">

          <InputBox
            variant="transparent"
            placeholder="아이디를 입력해 주세요"
          />


          <InputBox
            variant="password"
            placeholder="비밀번호를 입력해 주세요"
          />


          <InputBox
            variant="default"
            placeholder="전화번호 (-없이 번호 입력)"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
