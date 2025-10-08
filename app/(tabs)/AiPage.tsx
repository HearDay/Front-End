import PrimaryButton from "@/components/common/PrimaryButton";
import TopBar from "@/components/common/TopBar";
import { View } from "react-native";

export default function AiPage() {
  return (
    // 버튼 테스트라 지우셔도 됩니당!
    <View className="flex-1 items-center justify-center gap-4 bg-[#FEFFF5]">
      <View className="absolute top-0 left-0 right-0 z-10">
        <TopBar showBackButton={false} />
      </View>
      <PrimaryButton title="버튼" variant="primary" />
      <PrimaryButton title="버튼" variant="secondary" />
      <PrimaryButton title="카카오로 시작하기" variant="kakao" />
      <PrimaryButton title="버튼" variant="white" />
    </View>
  );
}
