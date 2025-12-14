import {
  getAccessToken,
  removeAccessToken,
} from "@/services/utils/tokenStorage";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

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

// 인증 필요한 요청에만 토큰 자동 추가
axiosInstance.interceptors.request.use(
  async (config) => {
    if (isAuthFreeRequest(config.url)) {
      return config;
    }

    try {
      const token = await getAccessToken();
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
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status;
    const requestUrl = err.config?.url;

    console.error("API Error:", err.response?.data || err.message);

    // 로그인 / 회원가입 / 카카오 로그인 중에는 개입하지 않음
    if (isAuthFreeRequest(requestUrl)) {
      return Promise.reject(err);
    }

    if (status === 403) {
      console.log("🔒 토큰 만료 → 로그아웃 처리");

      try {
        await removeAccessToken();
        await SecureStore.deleteItemAsync("refreshToken");
      } catch (e) {
        console.error("❌ 토큰 삭제 실패:", e);
      }

      router.replace("/LoginPage");
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
