import { getKakaoAuthUrl } from "@/services/api/kakaoAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { WebView } from "react-native-webview";

const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI; // 🌟 env에서 가져오기

const KakaoLoginView = () => {
  const router = useRouter();

  // WebView의 URL 변경 감지
  const handleNavigationStateChange = useCallback(async (navState: any) => {
    const { url } = navState;
    if (!url) return;

    // 카카오 로그인 완료 후 redirect_uri로 돌아왔는지 확인
    if (url.startsWith(REDIRECT_URI) && url.includes("accessToken=")) {
      const token = url.split("accessToken=")[1];
      const accessToken = decodeURIComponent(token);
      console.log("Access Token:", accessToken);

      try {
        await AsyncStorage.setItem("accessToken", accessToken);
        console.log("로그인 성공, 토큰 저장 완료");
        router.push("/(tabs)");
      } catch (err) {
        console.error("토큰 저장 오류:", err);
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  }, []);

  return (
    <WebView
      source={{ uri: getKakaoAuthUrl() }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState
      javaScriptEnabled
      originWhitelist={["*"]}
    />
  );
};

export default KakaoLoginView;
