// services/api/signup.ts
import { SignUpRequest, SignUpResponse } from "@/types/auth/signup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axiosInstance";

export const signup = async (body: SignUpRequest): Promise<SignUpResponse> => {
  try {
    // 회원가입 요청 (카테고리는 포함하지 않음)
    const res = await axiosInstance.post<SignUpResponse>("/api/users", body);

    // 서버가 accessToken을 반환하면 저장 (로그인 상태 유지 용도)
    const token = res.data?.data?.accessToken;
    if (res.data?.success && token) {
      await AsyncStorage.setItem("accessToken", token);
      // axiosInstance에 인터셉터/설정으로 자동 헤더 추가해놨으면 별도 처리 불필요
    }

    return res.data;
  } catch (error: any) {
    console.error("signup API error:", error.response?.data || error.message);
    // 에러를 호출자에게 던져서 UI에서 처리하게 함
    throw error;
  }
};
