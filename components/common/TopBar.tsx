import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TopBarProps {
  showBackButton?: boolean;
}

const { width } = Dimensions.get("window"); // 전체 화면 너비

const TopBar = ({ showBackButton = false }: TopBarProps) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View className="w-full items-center justify-center pb-2 relative bg-transparent">

        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 top-1"
          >
            <Image
              source={require("../../my-expo-app/assets/images/BackButton.png")}
              className="w-[12px] h-[18px] mt-3"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}

        <Image
          source={require("../../my-expo-app/assets/images/HEARDAY.png")}
          className="w-[130px] h-[45px]"
          resizeMode="contain"
        />

        <LinearGradient
          colors={["#184B1B", "#89B93F", "#F5E14E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradientLine, { width }]}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "transparent", 
  },
  gradientLine: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3, 
    zIndex: 0,
  },
});

export default TopBar;