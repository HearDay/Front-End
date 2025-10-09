import NewsCardList from "@/components/common/NewsCardList";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopBar from "../../components/common/TopBar";

export default function HomeScreen() {
  useEffect(() => {
    console.log("HomeScreen rendered");
  }, []);

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar showBackButton={false} />
      <View className="flex-1">
        <NewsCardList background="green" />
      </View>
    </View>
  );
}