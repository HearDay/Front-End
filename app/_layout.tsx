// app/_layout.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import LoginPage from "./LoginPage"; // 로그인 페이지 직접 import

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true); // 로딩 여부
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부

  // 1. 앱 실행 시 토큰 검사
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

  // 2. 로딩 중이면 스피너 표시
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#006716" />
      </View>
    );
  }

  // 3. 로그인 안 되어 있으면 LoginPage 렌더링
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // 4. 로그인 되어 있으면 나머지 라우트 보여주기
  return <Slot />;
}
