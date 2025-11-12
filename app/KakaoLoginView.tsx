import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI;

const KakaoLoginView = () => {
  const router = useRouter();

  // 카카오 인가 코드 요청 URL
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  console.log("KAKAO AUTH URL:", kakaoAuthUrl);

  // WebView에서 redirect 시 accessToken, refreshToken 감지
  const handleNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    // accessToken과 refreshToken이 모두 포함된 경우
    if (url.includes("accessToken=") && url.includes("refreshToken=")) {
      try {
        const queryString = url.split("?")[1];
        const params = new URLSearchParams(queryString);

        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");

        if (accessToken && refreshToken) {
          console.log("카카오 로그인 성공!");
          console.log("AccessToken:", accessToken);
          console.log("RefreshToken:", refreshToken);

          await AsyncStorage.setItem("accessToken", accessToken);
          await AsyncStorage.setItem("refreshToken", refreshToken);

          router.replace("/SelectCategoryPage");
        } else {
          console.warn("⚠️ 토큰 추출 실패:", url);
        }
      } catch (err) {
        console.error("❌ 토큰 저장 실패:", err);
      }
    }

    // 로그인 실패 시
    if (url.includes("error")) {
      console.log("카카오 로그인 실패:", url);
      router.replace("/LoginPage");
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }}>
        <WebView
          source={{ uri: kakaoAuthUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          startInLoadingState
          renderLoading={() => (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={["*"]}
        />
      </View>
    </>
  );
};

export default KakaoLoginView;
