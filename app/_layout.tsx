import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { AudioProvider } from "../contexts/AudioContext";
import { SavedNewsScrollProvider } from "../contexts/SavedNewsScrollContext";
import "../global.css";
import LoginPage from "./LoginPage";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  const publicRoutes = [
    "/LoginPage",
    "/SignUpPage",
    "/CertificationPage",
    "/ResetPasswordPage",
    "/SelectCategoryPage",
    "/KakaoLoginView",
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        setIsAuthenticated(!!token);
      } catch (err) {
        console.error("토큰 확인 중 오류:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // 로딩 중일 땐 어떤 페이지도 렌더하지 않음
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#006716" />
      </View>
    );
  }

  // 로그인 안 된 상태 + publicRoutes 외 페이지 접근 차단
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return <LoginPage />;
  }

  // 인증 여부 확인 후 Slot 렌더링
  return (
    <AudioProvider>
      <SavedNewsScrollProvider>
        <Slot />
      </SavedNewsScrollProvider>
    </AudioProvider>
  );
}
