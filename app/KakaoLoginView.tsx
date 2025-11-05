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

  // WebView에서 redirect 시 accessToken 감지
  const handleNavigationStateChange = async (navState: any) => {
    const { url } = navState;

    // accessToken이 포함된 URL이면 저장
    if (url.includes("accessToken=")) {
      try {
        const token = url.split("accessToken=")[1];
        console.log("카카오 로그인 성공, 토큰:", token);

        await AsyncStorage.setItem("accessToken", token);
        router.replace("/(tabs)"); // 홈 화면 이동
      } catch (err) {
        console.error("토큰 저장 실패:", err);
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
