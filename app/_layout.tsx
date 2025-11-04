import AsyncStorage from "@react-native-async-storage/async-storage";
import { Slot, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";
import LoginPage from "./LoginPage";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();

  // 로그인 없이 접근 가능한 페이지 목록
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

  // 로딩 중이면 스피너
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#006716" />
      </View>
    );
  }

  // 비로그인 시, publicRoutes 외 페이지는 LoginPage로 이동
  if (!isAuthenticated && !publicRoutes.includes(pathname)) {
    return <LoginPage />;
  }

  return <Slot />;
}
