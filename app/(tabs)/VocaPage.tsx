import TopBar from "@/components/common/TopBar";
import { Text, View } from "react-native";

export default function VocaPage() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="absolute top-0 left-0 right-0 z-10">
        <TopBar showBackButton={false} />
      </View>
      <Text className="text-green-800 text-xl font-bold">단어장 화면</Text>
    </View>
  );
}
