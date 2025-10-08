import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 80,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#CFCFCF",
          elevation: 0,
        },
        tabBarItemStyle: {
          paddingTop: 6, // 🔹 위로 약간 띄워서 정중앙 맞춤
          paddingBottom: 10, // 🔹 하단 여백도 살짝 줘서 안정감 있게
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2, // 🔹 아이콘과 텍스트 간 간격 조정
          color: "#14532D",
        },
        tabBarIcon: ({ focused }) => {
          let iconPath;

          switch (route.name) {
            case "VocaPage":
              iconPath = focused
                ? require("../../my-expo-app/assets/images/VocaOn.png")
                : require("../../my-expo-app/assets/images/VocaOff.png");
              break;
            case "AiPage":
              iconPath = focused
                ? require("../../my-expo-app/assets/images/AiOn.png")
                : require("../../my-expo-app/assets/images/AiOff.png");
              break;
            case "index":
              iconPath = focused
                ? require("../../my-expo-app/assets/images/HomeOn.png")
                : require("../../my-expo-app/assets/images/HomeOff.png");
              break;
            case "StorePage":
              iconPath = focused
                ? require("../../my-expo-app/assets/images/StoreOn.png")
                : require("../../my-expo-app/assets/images/StoreOff.png");
              break;
            case "ProfilePage":
              iconPath = focused
                ? require("../../my-expo-app/assets/images/ProfileOn.png")
                : require("../../my-expo-app/assets/images/ProfileOff.png");
              break;
          }

          return (
            <Image
              source={iconPath}
              style={{
                width: 28,
                height: 28,
                resizeMode: "contain",
              }}
            />
          );
        },
      })}
    >
      <Tabs.Screen name="VocaPage" options={{ title: "단어장" }} />
      <Tabs.Screen name="AiPage" options={{ title: "AI와 토론" }} />
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="StorePage" options={{ title: "저장" }} />
      <Tabs.Screen name="ProfilePage" options={{ title: "프로필" }} />
    </Tabs>
  );
}
