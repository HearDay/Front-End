import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor: 모든 요청에 토큰 자동 추가
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("토큰 가져오기 실패:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 403 → 토큰 삭제 + 로그인 페이지 이동
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;

    console.error("API Error:", err.response?.data || err.message);

    if (status === 403) {
      console.log("🔒 토큰 만료됨 → 자동 로그아웃 처리");

      try {
        await AsyncStorage.removeItem("accessToken");
      } catch (e) {
        console.error("토큰 삭제 실패:", e);
      }

      // 로그인 화면으로 이동 (히스토리 초기화)
      router.replace("/LoginPage");
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
