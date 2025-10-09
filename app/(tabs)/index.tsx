import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NewsCardList from "../../components/common/NewsCardList";
import TopBar from "../../components/common/TopBar";
import TermsAgreement from "../../components/screens/Login/TermsAgreement";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <TopBar showBackButton={false} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <NewsCardList background="green" />

        <View className="items-center mt-2">
          <TermsAgreement
            value={{ service: false, privacy: false, marketing: false }}
            onChange={(next) => console.log("약관 상태:", next)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
