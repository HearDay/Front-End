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

 // 인증이 필요 없는 API인지 판단
const isAuthFreeRequest = (url?: string) => {
  if (!url) return false;

  return (
    url.includes("/login") ||
    url.includes("/signup") ||
    url.includes("/kakao")
  );
};

//인증 필요한 요청에만 토큰 자동 추가
axiosInstance.interceptors.request.use(
  async (config) => {
    // 로그인, 회원가입, 카카오 로그인은 토큰 안 붙임
    if (isAuthFreeRequest(config.url)) {
      return config;
    }

    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("❌ 토큰 가져오기 실패:", error);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 인증 API에서 403 발생 시 자동 로그아웃
// 로그인 중 / 로그인 API에서는 개입하지 않음
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    const requestUrl = err.config?.url;

    console.error("API Error:", err.response?.data || err.message);

    // 로그인, 회원가입 요청 중 오류 → interceptor 개입 금지
    if (isAuthFreeRequest(requestUrl)) {
      return Promise.reject(err);
    }

    // 인증 만료 처리
    if (status === 403) {
      console.log("🔒 토큰 만료 → 로그아웃 처리");

      try {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
      } catch (e) {
        console.error("❌ 토큰 삭제 실패:", e);
      }

      // 로그인 화면으로 이동 (히스토리 초기화)
      router.replace("/LoginPage");
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
