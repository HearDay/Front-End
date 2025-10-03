import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  useEffect(() => {
    console.log("HomeScreen rendered");
  }, []);

  return (
    // give SafeAreaView explicit flex so inner flex-1 can expand even if tailwind/className isn't applied
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View className="flex-1 items-center justify-center bg-white" style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'yellow' }}>
        {/* Tailwind-based text (may be transformed by nativewind) */}
        <Text className="text-5xl font-bold text-indigo-700">Hello World!</Text>

        {/* Inline fallback to confirm rendering independent of nativewind */}
        <Text style={{ color: 'red', fontSize: 18, marginTop: 12 }}>plain inline text — should be visible</Text>
      </View>
    </SafeAreaView>
  );
}
