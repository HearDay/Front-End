import { useAuthStore } from "@/services/api/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI;

const KakaoLoginView = () => {
  const router = useRouter();
  const setAuthReady = useAuthStore((s) => s.setAuthReady);
  const [loading, setLoading] = useState(true);

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

  const handleNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    if (
      url.includes("accessToken=") &&
      url.includes("refreshToken=") &&
      url.includes("isNewUser=")
    ) {
      try {
        const queryString = url.split("?")[1];
        const params = new URLSearchParams(queryString);

        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");
        const isNewUser = params.get("isNewUser");

        if (accessToken && refreshToken) {
          await AsyncStorage.setItem("accessToken", accessToken);
          await AsyncStorage.setItem("refreshToken", refreshToken);

          // 🔥 로그인 완료 신호
          setAuthReady(true);

          if (isNewUser === "true") {
            router.replace("/SelectCategoryPage");
          } else {
            router.replace("/(tabs)");
          }
        }
      } catch (err) {
        console.error("❌ 토큰 저장 실패:", err);
      }
    }

    if (url.includes("error")) {
      router.replace("/LoginPage");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: kakaoAuthUrl }}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={["*"]}
          />

          {loading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#006716" />
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default KakaoLoginView;
