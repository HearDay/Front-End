import InputBox from "@/components/common/InputBox";
import TopBar from "@/components/common/TopBar";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

export default function ProfilePage() {
  return (
    <LinearGradient
      colors={["#1B772B", "#428F48", "#85B77A", "#FBFFD3"]}
      locations={[0, 0.22, 0.54, 0.85]} 
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      className="flex-1 items-center justify-center"
    >
      <View className="absolute top-0 left-0 right-0 z-10">
        <TopBar showBackButton={false} />
      </View>

      {/* InputBox 테스트!! 지우셔도 됩니당 */}
      <View className="gap-3 mt-24">
        <InputBox variant="transparent" placeholder="아이디를 입력해 주세요" />
        <InputBox variant="password" placeholder="비밀번호를 입력해 주세요" />
        <InputBox variant="default" placeholder="전화번호 (-없이 번호 입력)" />
      </View>
    </LinearGradient>
  );
}
