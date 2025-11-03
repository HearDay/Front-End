import { KakaoLoginResponse } from "@/types/auth/kakao";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KakaoOAuthToken, login } from "@react-native-seoul/kakao-login";
import axiosInstance from "./axiosInstance";

// 1️⃣ 카카오 로그인 실행 (AuthSession 안씀)
export const getKakaoAuthCode = async (): Promise<string | null> => {
  try {
    const token: KakaoOAuthToken = await login();
    console.log("카카오 Access Token:", token.accessToken);
    return token.accessToken; // 인가 코드 대신 access token 직접 반환
  } catch (err) {
    console.error("카카오 로그인 실패:", err);
    return null;
  }
};

// 2️⃣ 받은 토큰을 백엔드로 전송
export const kakaoLogin = async (accessToken: string): Promise<KakaoLoginResponse> => {
  try {
    const res = await axiosInstance.post<KakaoLoginResponse>(
      "/api/users/login/kakao",
      { accessToken } // 백엔드에서 이걸로 유저 식별
    );

    if (res.data.success && res.data.data.accessToken) {
      await AsyncStorage.setItem("accessToken", res.data.data.accessToken);
      console.log("백엔드 로그인 성공. 토큰 저장됨.");
    }

    return res.data;
  } catch (err: any) {
    console.error("카카오 로그인 API 오류:", err.response?.data || err.message);
    throw err;
  }
};
