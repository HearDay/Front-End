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
          paddingTop: 8, 
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4, 
          color: "#14532D",
        },
        tabBarIcon: ({ focused }) => {
          let iconPath;

          switch (route.name) {
            case "wordbook":
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
            case "savednews":
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
      <Tabs.Screen name="wordbook" options={{ title: "단어장" }} />
      <Tabs.Screen name="AiPage" options={{ title: "AI와 토론" }} />
      <Tabs.Screen name="index" options={{ title: "홈" }} />
      <Tabs.Screen name="savednews" options={{ title: "저장" }} />
      <Tabs.Screen name="ProfilePage" options={{ title: "프로필" }} />
    </Tabs>
  );
}